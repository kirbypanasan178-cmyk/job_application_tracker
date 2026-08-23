using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserResponseDto>> GetAllAsync()
        {
            return await _context.Users
                .Select(user => new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    IsBlocked = user.IsBlocked,
                })
                .ToListAsync();
        }

        public async Task<UserResponseDto?> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return null;
            }

            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                IsBlocked = user.IsBlocked
            };
        }

        public async Task<UserResponseDto?> GetByEmailAsync(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                return null;
            }

            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                IsBlocked = user.IsBlocked
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<UserResponseDto?> ToggleBlockAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return null;
            }

            user.IsBlocked = !user.IsBlocked;

            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                IsBlocked = user.IsBlocked
            };
        }
    }
}
