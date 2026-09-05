using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IJobApplicationService
    {
        // List<JobApplication> GetAll();
        Task<JobApplication> CreateAsync(CreateJobApplicationDto dto);
        Task<JobApplication> CreateFromExtractedAsync(ExtractedJobDto extracted, string sourceUrl);
        Task<PagedResultDto<JobApplication>> GetByUserIdAsync(int userId, JobApplicationQueryDto query);

        Task<JobApplication?> UpdateAsync(int id, UpdateJobApplicationDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
