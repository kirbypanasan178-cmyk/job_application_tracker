using backend.Data;
using backend.DTOs;
using backend.Enums;
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
                UserId = 2,
                CompanyName = dto.CompanyName,
                JobTitle = dto.JobTitle,
                Location = dto.Location,
                CreatedAt = DateTime.UtcNow,
                ApplicationStatus = dto.ApplicationStatus,
                ApplicationDate = dto.ApplicationDate ?? DateTime.UtcNow,
                SalaryMin = dto.SalaryMin,
                SalaryMax = dto.SalaryMax,
                JobUrl = dto.JobUrl,
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

        public async Task<JobApplication> CreateFromExtractedAsync(ExtractedJobDto extracted, string sourceUrl)
        {
            var jobApplication = new JobApplication
            {
                UserId = 2,
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
                JobUrl = sourceUrl,
                CreatedAt = DateTime.UtcNow,
                ApplicationDate = DateTime.UtcNow,
                ApplicationStatus = ApplicationStatus.Saved
            };

            _context.JobApplications.Add(jobApplication);
            await _context.SaveChangesAsync();

            return jobApplication;
        }

        private static TEnum? TryParseEnum<TEnum>(string? value) where TEnum : struct, Enum
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;
            return Enum.TryParse<TEnum>(value, ignoreCase: true, out var result) ? result : null;
        }
        // GET BY ID
        public async Task<PagedResultDto<JobApplication>> GetByUserIdAsync(int userId, JobApplicationQueryDto query)
        {
            if (query.Page < 1)
                query.Page = 1;
            if (query.PageSize < 1)
                query.PageSize = 10;
            if (query.PageSize > 100)
                query.PageSize = 100;

            // a query that will eventually retrieve JobApplication objects from the database
            IQueryable<JobApplication> applications =
                _context.JobApplications
                    .Where(x => x.UserId == userId);
            
            // Search filter
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim();

                applications = applications.Where(x =>
                    x.CompanyName.Contains(search) ||
                    x.JobTitle.Contains(search) ||
                    x.Location.Contains(search));
            }
            // Status Filter
            if (query.Status.HasValue)
            {
                applications = applications.Where(x =>
                    x.ApplicationStatus == query.Status.Value);
            }
            // Sort
            applications = query.SortBy.ToLower() switch
            {
                "companyname" =>
                    query.Descending
                        ? applications.OrderByDescending(x => x.CompanyName)
                        : applications.OrderBy(x => x.CompanyName),
                "jobtitle" =>
                        query.Descending
                            ? applications.OrderByDescending(x => x.JobTitle)
                            : applications.OrderBy(x => x.JobTitle),

                "applicationdate" =>
                    query.Descending
                        ? applications.OrderByDescending(x => x.ApplicationDate)
                        : applications.OrderBy(x => x.ApplicationDate),

                "createdat" =>
                    query.Descending
                        ? applications.OrderByDescending(x => x.CreatedAt)
                        : applications.OrderBy(x => x.CreatedAt),

                _ =>
                    applications.OrderByDescending(x => x.CreatedAt)
            };

            // Total Count
            var totalCount = await applications.CountAsync();

            // Pagination
            var items = await applications
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            // Result
            return new PagedResultDto<JobApplication>
            {
                Items = items,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(
                    totalCount / (double)query.PageSize)
            };
         
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

            if (dto.SalaryMin.HasValue)
                jobApplication.SalaryMin = dto.SalaryMin;

            if (dto.SalaryMax.HasValue)
                jobApplication.SalaryMax = dto.SalaryMax;

            if (dto.JobUrl != null)
                jobApplication.JobUrl = dto.JobUrl;

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
