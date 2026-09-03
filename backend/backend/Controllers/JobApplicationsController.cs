using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IScraperService _scraperService;
        private readonly IGeminiService _geminiService;
        private readonly ILogger<JobController> _logger;

        public JobController(IScraperService scraperService, IGeminiService geminiService, ILogger<JobController> logger)
        {
            _scraperService = scraperService;
            _geminiService = geminiService;
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

                // NOTE: not saved to DB here — UserId/User aren't set since there's no
                // authenticated user in this test flow yet. This just returns the mapped
                // entity so you can inspect it in Postman before deciding how to persist it.
                var jobApplication = new JobApplication
                {
                    CompanyName = extracted.CompanyName ?? string.Empty,
                    JobTitle = extracted.JobTitle ?? string.Empty,
                    Location = extracted.Location ?? string.Empty,
                    Description = extracted.Description ?? string.Empty,
                    Requirements = extracted.Requirements ?? string.Empty,
                    Skills = extracted.Skills ?? string.Empty,
                    SalaryMin = extracted.SalaryMin,
                    SalaryMax = extracted.SalaryMax,
                    EmploymentType = TryParseEnum<EmploymentType>(extracted.EmploymentType),
                    WorkSetupType = TryParseEnum<WorkSetupType>(extracted.WorkSetupType),
                    JobUrl = request.Url,
                    CreatedAt = DateTime.UtcNow,
                    ApplicationStatus = ApplicationStatus.Saved
                };

                return Ok(jobApplication);
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

        private static TEnum? TryParseEnum<TEnum>(string? value) where TEnum : struct, Enum
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            return Enum.TryParse<TEnum>(value, ignoreCase: true, out var result) ? result : null;
        }
    }
}