using backend.DTOs;
using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationController : ControllerBase
    {
        private readonly IScraperService _scraperService;
        private readonly IGeminiService _geminiService;
        private readonly IJobApplicationService _jobApplicationService;
        private readonly ILogger<JobApplicationController> _logger;

        public JobApplicationController(
            IScraperService scraperService,
            IGeminiService geminiService,
            IJobApplicationService jobApplicationService,
            ILogger<JobApplicationController> logger)
        {
            _scraperService = scraperService;
            _geminiService = geminiService;
            _jobApplicationService = jobApplicationService;
            _logger = logger;
        }

        [HttpPost("extract")]
        public async Task<IActionResult> Extract([FromBody] JobUrlRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Url) || !Uri.TryCreate(request.Url, UriKind.Absolute, out _))
                return BadRequest(new { error = "A valid absolute 'url' is required." });
            try
            {
                var cleanedText = await _scraperService.GetCleanVisibleTextAsync(request.Url);
                if (string.IsNullOrWhiteSpace(cleanedText))
                    return UnprocessableEntity(new { error = "Could not extract any visible text from that page." });

                var extracted = await _geminiService.ExtractJobDataAsync(cleanedText, request.Url);
                var saved = await _jobApplicationService.CreateFromExtractedAsync(extracted, request.Url);

                return Ok(saved);
            }
            catch (TimeoutException ex)
            {
                _logger.LogError(ex, "Timed out loading {Url}", request.Url);
                return StatusCode(504, new { error = "Timed out loading the job page." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process {Url}", request.Url);
                return StatusCode(500, new { error = ex.Message, type = ex.GetType().Name });
            }
        }

        [HttpGet("scrape-preview")]
        public async Task<IActionResult> ScrapePreview([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url) || !Uri.TryCreate(url, UriKind.Absolute, out _))
                return BadRequest(new { error = "A valid absolute 'url' query param is required." });
            var cleanedText = await _scraperService.GetCleanVisibleTextAsync(url);
            return Ok(new { length = cleanedText.Length, text = cleanedText });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateJobApplicationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _jobApplicationService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByUserId), new { userId = created.UserId }, created);
        }

        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetByUserId(
            int userId,
            [FromQuery] JobApplicationQueryDto query)
        {
            var result = await _jobApplicationService.GetByUserIdAsync(userId, query);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateJobApplicationDto dto)
        {
            var updated = await _jobApplicationService.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound(new { error = $"JobApplication with id {id} was not found." });

            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _jobApplicationService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { error = $"JobApplication with id {id} was not found." });

            return NoContent();
        }

        private static TEnum? TryParseEnum<TEnum>(string? value) where TEnum : struct, Enum
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;
            return Enum.TryParse<TEnum>(value, ignoreCase: true, out var result) ? result : null;
        }
    }
}