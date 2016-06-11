using Health.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Logging;

namespace Health.Core.EF
{
    public class HealthContext : IdentityDbContext
    {
        public static string ConnectionString;
        public DbSet<Day> Days { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<MealEntry> MealEntries { get; set; }
        public DbSet<Food> Foods { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
#if DEBUG
            ConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=Health;Trusted_Connection=True;";
#endif
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Food>().ToTable("Foods");
            modelBuilder.Entity<Day>().ToTable("Days");
            base.OnModelCreating(modelBuilder);
        }

        public void AddLogging()
        {
            var loggerFactory = this.GetService<ILoggerFactory>();
            loggerFactory.AddConsole(LogLevel.Information);
            loggerFactory.AddProvider(new CustomLoggerFactory());
        }
    }
}
