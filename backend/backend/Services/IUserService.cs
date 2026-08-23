using backend.DTOs;

namespace backend.Services
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllAsync();
        Task<UserResponseDto?> GetByIdAsync(int id);
        Task<UserResponseDto?> GetByEmailAsync(string email);
        Task<bool> DeleteAsync(int id);
        Task<UserResponseDto?> ToggleBlockAsync(int id);
    }
}
