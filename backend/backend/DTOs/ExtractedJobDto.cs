namespace backend.Models
{
    public class ExtractedJobDto
    {
        public string? CompanyName { get; set; }
        public string? JobTitle { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public string? Requirements { get; set; }
        public string? Skills { get; set; }
        public DateTime? ApplicationDate { get; set; }
        public string? EmploymentType { get; set; }   // raw text, parsed to enum later
        public string? WorkSetupType { get; set; }     // raw text, parsed to enum later
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
    }
}