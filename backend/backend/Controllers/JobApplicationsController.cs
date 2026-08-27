using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationService _jobApplicationService;

        // Dependency injection for the job application service
        public JobApplicationsController(IJobApplicationService jobApplicationService)
        {
            _jobApplicationService = jobApplicationService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateJobApplicationDto dto)
        {
            var jobApplication = await _jobApplicationService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = jobApplication.Id },
                new
                {
                    status = true,
                    data = jobApplication,
                }
            );
        }

        [HttpGet]
        public async Task<IActionResult> GetById(
            [FromQuery] int userId,
            [FromQuery] JobApplicationQueryDto query
            )
        {
            var jobApplication = await _jobApplicationService.GetByUserIdAsync(
                    userId = 2,
                    query
                );

            if (jobApplication == null)
            {
                return NotFound(new
                {
                    status = false,
                    message = "Job application not found."
                });
            }

            return Ok(jobApplication);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateJobApplicationDto dto)
        {
            var jobApplication = await _jobApplicationService.UpdateAsync(id, dto);

            if (jobApplication == null)
            {
                return NotFound(new
                {
                    status = false,
                    message = "Job application not found."
                });
            }

            return Ok(new
            {
                status = true,
                data = jobApplication,
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _jobApplicationService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    status = false,
                    message = "Job application not found."
                });
            }

            return NoContent();
        }
    }
}