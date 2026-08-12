using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly AppDbContext _context;

        public JobApplicationService(AppDbContext context)
        {
            _context = context;
        }

        public List<JobApplication> GetAll()
        {
            return _context.JobApplications.ToList();
        }

        public JobApplication? GetById(int id)
        {
            return _context.JobApplications.Find(id);
        }

        public JobApplication Create(JobApplication job)
        {
            _context.JobApplications.Add(job);
            _context.SaveChanges();
            return job;
        }

        public JobApplication? Update(int id, JobApplication job)
        {
            var existingJob = _context.JobApplications.Find(id);

            if (existingJob == null)
            {
                return null;
            }

            existingJob.CompanyName = job.CompanyName;
            existingJob.JobTitle = job.JobTitle;
            existingJob.Location = job.Location;
            existingJob.Status = job.Status;
            existingJob.ApplicationDate = job.ApplicationDate;
            existingJob.Salary = job.Salary;
            existingJob.Description = job.Description;
            existingJob.Requirements = job.Requirements;
            existingJob.Skills = job.Skills;
            existingJob.EmploymentType = job.EmploymentType;

            _context.SaveChanges();

            return existingJob;
        }

        public bool Delete(int id)
        {
            var job = _context.JobApplications.Find(id);

            if (job == null)
            {
                return false;
            }

            _context.JobApplications.Remove(job);
            _context.SaveChanges();

            return true;

        }

    }
}
