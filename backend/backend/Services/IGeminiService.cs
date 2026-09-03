using backend.Models;

namespace backend.Services
{
    public interface IGeminiService
    {
        Task<ExtractedJobDto> ExtractJobDataAsync(string cleanedText, string sourceUrl);
    }
}