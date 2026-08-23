using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var users = await _userService.GetAllAsync();

            return Ok(new
            {
                success = true,
                data = users,
            });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found"
                });
            }

            return Ok(new
            {
                success = true,
                data = user,
            });
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var user = await _userService.GetByEmailAsync(email);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = user,
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _userService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    message = "User deleted successfully."
                }
            });
        }

        [HttpPatch("{id}/toggle-block")]
        public async Task<IActionResult> ToggleBlock(int id)
        {
            var user = await _userService.ToggleBlockAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    message = "User blocked successfully."
                }
            });
        }
    }
}
