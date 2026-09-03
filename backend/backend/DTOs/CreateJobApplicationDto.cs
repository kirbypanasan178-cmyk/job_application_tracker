using backend.Enums;
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
        public int UserId { get; set; }
        public ApplicationStatus ApplicationStatus { get; set; }
            = ApplicationStatus.Saved;

        public DateTime? ApplicationDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? SalaryMin { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? SalaryMax { get; set; }

        [Url]
        public string JobUrl { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Requirements { get; set; } = string.Empty;

        public string Skills { get; set; } = string.Empty;

        public EmploymentType? EmploymentType { get; set; }

        public WorkSetupType? WorkSetupType { get; set; }
    }
}