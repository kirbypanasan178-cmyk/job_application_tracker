using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ExtractJobTextRequestDto
    {
        [Required]
        [MinLength(20, ErrorMessage = "Pasted text is too short to be a real job posting.")]
        public string RawText { get; set; } = string.Empty;

        public int? UserId { get; set; }
    }
}