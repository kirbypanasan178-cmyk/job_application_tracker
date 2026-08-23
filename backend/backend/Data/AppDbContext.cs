

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
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<JobApplication>()
                .Property(x => x.Salary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<JobApplication>()
                .Property(x => x.Status)
                .HasConversion<string>();

            modelBuilder.Entity<JobApplication>()
                .Property(x => x.WorkSetup)
                .HasConversion<string>();
        }
    }
}
