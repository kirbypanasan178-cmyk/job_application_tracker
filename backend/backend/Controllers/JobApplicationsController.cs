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
        // creates an empty object called _context with type AppDbContext
        private readonly IJobApplicationService _service;
        // The context here is the object given to the controller by ASP.Net
        public JobApplicationsController(IJobApplicationService service)
        {
            // store that context objet to the empty _context object
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var job = _service.GetById(id);

            if (job == null)
            {
                return NotFound();
            }

            return Ok(job);
        }

        [HttpPost]
        public IActionResult Create(CreateJobApplicationDto dto)
        {
            var job = new JobApplication
            {
                CompanyName = dto.CompanyName,
                JobTitle = dto.JobTitle,
                Location = dto.Location,
                Status = dto.Status,
                ApplicationDate = dto.ApplicationDate,
                Salary = dto.Salary,
                Description = dto.Description,
                Requirements = dto.Requirements,
                Skills = dto.Skills,
                EmploymentType = dto.EmploymentType
            };

            var createdJob = _service.Create(job);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdJob.Id },
                createdJob
            );
        }

        

        [HttpPut("{id}")]
        public IActionResult Update(int id, UpdateJobApplicationDto dto)
        {
            var job = new JobApplication
            {
                CompanyName = dto.CompanyName,
                JobTitle = dto.JobTitle,
                Location = dto.Location,
                Status = dto.Status,
                ApplicationDate = dto.ApplicationDate,
                Salary = dto.Salary,
                Description = dto.Description,
                Requirements = dto.Requirements,
                Skills = dto.Skills,
                EmploymentType = dto.EmploymentType
            };

            var updatedJob = _service.Update(id, job);

            if (updatedJob == null)
            {
                return NotFound();
            }

            return Ok(updatedJob);

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deletedJob = _service.Delete(id);

            if (!deletedJob)
            {
                return NotFound();
            }

            return Ok($"Job application {id} deleted successfully.");
        }
    }
}
