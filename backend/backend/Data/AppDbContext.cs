

using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    // DbContext is the object use to work with database, its the database managher
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        // DbSet represents the Table/Collection of JobApplication records that EF Core can query and modify
        public DbSet<JobApplication> JobApplications { get; set; }
    }
}
