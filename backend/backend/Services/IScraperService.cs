namespace backend.Services;

public interface IScraperService
{
    Task<string> GetCleanVisibleTextAsync(string url);
}