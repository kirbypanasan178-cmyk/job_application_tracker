using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateJobApplicationDto
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = string.Empty;

        [Required]
        public DateTime ApplicationDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }

        public string Description { get; set; } = string.Empty;

        public string Requirements { get; set; } = string.Empty;

        public string Skills { get; set; } = string.Empty;

        [Required]
        public string EmploymentType { get; set; } = string.Empty;
    }
}