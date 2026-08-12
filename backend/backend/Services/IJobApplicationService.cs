using backend.Models;

namespace backend.Services
{
    public interface IJobApplicationService
    {
        List<JobApplication> GetAll();
        JobApplication? GetById(int id);
        JobApplication Create(JobApplication job);
        JobApplication? Update(int id, JobApplication job);
        bool Delete(int id);
    }
}
