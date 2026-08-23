using backend.Enums;

namespace backend.DTOs
{
    public class UpdateJobApplicationDto
    {
        public string? CompanyName { get; set; }

        public string? JobTitle { get; set; }

        public string? Location { get; set; }

        public ApplicationStatus? Status { get; set; }

        public DateTime? ApplicationDate { get; set; }

        public decimal? Salary { get; set; }

        public string? Description { get; set; }

        public string? Requirements { get; set; }

        public string? Skills { get; set; }

        public string? EmploymentType { get; set; }

        public WorkSetup? WorkSetup { get; set; }
    }
}