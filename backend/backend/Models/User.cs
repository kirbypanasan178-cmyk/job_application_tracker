namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsBlocked { get; set; }
        public ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
    }   
}
