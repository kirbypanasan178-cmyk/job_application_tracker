using backend.Enums;

namespace backend.DTOs
{
    public class JobApplicationQueryDto
    {
        public string? Search {  get; set; }
        public ApplicationStatus? Status { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "CreatedAt";
        public bool Descending { get; set; } = true;
    }
}
