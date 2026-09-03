namespace backend.Dtos
{
    public class JobExtractionResultDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
        public string? EmploymentType { get; set; } // "FullTime" | "PartTime" | "Contract" | "Internship" | "Freelance" | null
        public string? WorkSetupType { get; set; }   // "Onsite" | "Remote" | "Hybrid" | null
    }
}