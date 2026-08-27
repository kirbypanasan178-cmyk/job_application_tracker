namespace backend.DTOs
{
    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new(); // start as an empty list
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }

    }
}
