using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly AppDbContext _context;

        public JobApplicationService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<JobApplication> CreateAsync(CreateJobApplicationDto dto)
        {
            var jobApplication = new JobApplication
            {
                CompanyName = dto.CompanyName,
                JobTitle = dto.JobTitle,
                Location = dto.Location,

                CreatedAt = DateTime.UtcNow,
                ApplicationStatus = dto.ApplicationStatus,
                ApplicationDate = dto.ApplicationDate,

                Salary = dto.Salary,

                Description = dto.Description,
                Requirements = dto.Requirements,
                Skills = dto.Skills,

                EmploymentType = dto.EmploymentType,
                WorkSetupType = dto.WorkSetupType,
            };

            _context.JobApplications.Add(jobApplication);
            await _context.SaveChangesAsync();

            return jobApplication;
        }
        // GET BY ID
        public async Task<JobApplication?> GetByIdAsync(int id)
        {
            return await _context.JobApplications
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<JobApplication?> UpdateAsync(
     int id,
     UpdateJobApplicationDto dto)
        {
            var jobApplication = await _context.JobApplications.FindAsync(id);

            if (jobApplication == null)
            {
                return null;
            }

            if (dto.CompanyName != null)
                jobApplication.CompanyName = dto.CompanyName;

            if (dto.JobTitle != null)
                jobApplication.JobTitle = dto.JobTitle;

            if (dto.Location != null)
                jobApplication.Location = dto.Location;

            if (dto.ApplicationStatus.HasValue)
                jobApplication.ApplicationStatus = dto.ApplicationStatus.Value;

            if (dto.ApplicationDate.HasValue)
                jobApplication.ApplicationDate = dto.ApplicationDate;

            if (dto.Salary.HasValue)
                jobApplication.Salary = dto.Salary;

            if (dto.Description != null)
                jobApplication.Description = dto.Description;

            if (dto.Requirements != null)
                jobApplication.Requirements = dto.Requirements;

            if (dto.Skills != null)
                jobApplication.Skills = dto.Skills;

            if (dto.EmploymentType.HasValue)
                jobApplication.EmploymentType = dto.EmploymentType.Value;
            

            if (dto.WorkSetupType.HasValue)
                jobApplication.WorkSetupType = dto.WorkSetupType.Value;

            await _context.SaveChangesAsync();

            return jobApplication;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var job = await _context.JobApplications
                .FirstOrDefaultAsync(x => x.Id == id);

            if (job == null)
            {
                return false;
            }

            _context.JobApplications.Remove(job);
            await _context.SaveChangesAsync();

            return true;

        }

    }
}
