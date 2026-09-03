using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.Models
{
    public class JobApplication
    {
        public int Id { get; set; }

        // User
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Required basic information
        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        // Application information
        public ApplicationStatus ApplicationStatus { get; set; }
            = ApplicationStatus.Saved;

        public DateTime CreatedAt { get; set; }
        public DateTime? ApplicationDate { get; set; }

        // Optional job details
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }

        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;

        public EmploymentType? EmploymentType { get; set; }
        public WorkSetupType? WorkSetupType { get; set; }

        // Optional source
        public string? JobUrl { get; set; }
    }
}