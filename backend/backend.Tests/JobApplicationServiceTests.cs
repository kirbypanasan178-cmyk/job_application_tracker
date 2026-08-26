using backend.Data;
using backend.DTOs;
using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace backend.Tests.Services
{
    public class JobApplicationServiceTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly JobApplicationService _service;

        public JobApplicationServiceTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // isolated DB per test
                .Options;

            _context = new AppDbContext(options);
            _service = new JobApplicationService(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        // ---------- CreateAsync ----------

        [Fact]
        public async Task CreateAsync_ValidDto_AddsAndReturnsJobApplication()
        {
            var dto = new CreateJobApplicationDto
            {
                CompanyName = "Acme Corp",
                JobTitle = "Backend Developer",
                Location = "Davao City",
                ApplicationStatus = ApplicationStatus.Applied,
                ApplicationDate = DateTime.UtcNow,
                Salary = 50000,
                Description = "Build APIs",
                Requirements = "3+ years C#",
                Skills = "C#, EF Core, SQL Server",
                EmploymentType = EmploymentType.FullTime,
                WorkSetupType = WorkSetupType.Remote
            };

            var result = await _service.CreateAsync(dto);

            Assert.NotNull(result);
            Assert.NotEqual(0, result.Id);
            Assert.Equal(dto.CompanyName, result.CompanyName);
            Assert.Equal(dto.JobTitle, result.JobTitle);
            Assert.True((DateTime.UtcNow - result.CreatedAt).TotalSeconds < 5);

            var persisted = await _context.JobApplications.FindAsync(result.Id);
            Assert.NotNull(persisted);
        }

        // ---------- GetByIdAsync ----------

        [Fact]
        public async Task GetByIdAsync_ExistingId_ReturnsJobApplication()
        {
            var entity = new JobApplication
            {
                CompanyName = "Acme Corp",
                JobTitle = "Backend Developer",
                CreatedAt = DateTime.UtcNow,
                ApplicationStatus = ApplicationStatus.Applied,
                EmploymentType = EmploymentType.FullTime,
                WorkSetupType = WorkSetupType.Remote
            };
            _context.JobApplications.Add(entity);
            await _context.SaveChangesAsync();

            var result = await _service.GetByIdAsync(entity.Id);

            Assert.NotNull(result);
            Assert.Equal(entity.Id, result!.Id);
        }

        [Fact]
        public async Task GetByIdAsync_NonExistingId_ReturnsNull()
        {
            var result = await _service.GetByIdAsync(999);

            Assert.Null(result);
        }

        // ---------- UpdateAsync ----------

        [Fact]
        public async Task UpdateAsync_ExistingId_UpdatesOnlyProvidedFields()
        {
            var entity = new JobApplication
            {
                CompanyName = "Old Company",
                JobTitle = "Old Title",
                Location = "Old Location",
                CreatedAt = DateTime.UtcNow,
                ApplicationStatus = ApplicationStatus.Applied,
                EmploymentType = EmploymentType.FullTime,
                WorkSetupType = WorkSetupType.Remote,
                Salary = 30000
            };
            _context.JobApplications.Add(entity);
            await _context.SaveChangesAsync();

            var dto = new UpdateJobApplicationDto
            {
                CompanyName = "New Company",
                ApplicationStatus = ApplicationStatus.Interview
                // other fields left null/unset on purpose
            };

            var result = await _service.UpdateAsync(entity.Id, dto);

            Assert.NotNull(result);
            Assert.Equal("New Company", result!.CompanyName);
            Assert.Equal(ApplicationStatus.Interview, result.ApplicationStatus);
            // untouched fields should remain unchanged
            Assert.Equal("Old Title", result.JobTitle);
            Assert.Equal("Old Location", result.Location);
            Assert.Equal(30000, result.Salary);
        }

        [Fact]
        public async Task UpdateAsync_NonExistingId_ReturnsNull()
        {
            var dto = new UpdateJobApplicationDto { CompanyName = "Doesn't matter" };

            var result = await _service.UpdateAsync(999, dto);

            Assert.Null(result);
        }

        // ---------- DeleteAsync ----------

        [Fact]
        public async Task DeleteAsync_ExistingId_RemovesAndReturnsTrue()
        {
            var entity = new JobApplication
            {
                CompanyName = "To Delete",
                JobTitle = "Title",
                CreatedAt = DateTime.UtcNow,
                ApplicationStatus = ApplicationStatus.Applied,
                EmploymentType = EmploymentType.FullTime,
                WorkSetupType = WorkSetupType.Remote
            };
            _context.JobApplications.Add(entity);
            await _context.SaveChangesAsync();

            var result = await _service.DeleteAsync(entity.Id);

            Assert.True(result);
            var deleted = await _context.JobApplications.FindAsync(entity.Id);
            Assert.Null(deleted);
        }

        [Fact]
        public async Task DeleteAsync_NonExistingId_ReturnsFalse()
        {
            var result = await _service.DeleteAsync(999);

            Assert.False(result);
        }
    }
}