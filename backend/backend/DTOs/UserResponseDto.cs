namespace backend.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;

        public bool IsBlocked { get; set; }
    }
}
