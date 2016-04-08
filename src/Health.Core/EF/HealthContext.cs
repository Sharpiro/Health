using Health.Core.Entities;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Extensions.Logging;

namespace Health.Core.EF
{
    public class HealthContext : DbContext
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
            //modelBuilder.Entity<MealDay>().HasKey(md => new { md.DayId, md.MealId });
            //modelBuilder.Entity<Day>().Property(e => e.Id).UseSqlServerIdentityColumn();
            //modelBuilder.Entity<Day>().HasKey(d => new {d.Created });
            //modelBuilder.Entity<Day>().Index(d => d.Created).Unique();
            //modelBuilder.Entity<Meal>().Index(m => new { m.MealNumber, m.DayId }).Unique();
            modelBuilder.Entity<Food>().ToTable("Foods");
            modelBuilder.Entity<Day>().ToTable("Days");
        }

        public void AddLogging()
        {
            var loggerFactory = this.GetService<ILoggerFactory>();
            loggerFactory.AddConsole(LogLevel.Information);
            loggerFactory.AddProvider(new CustomLoggerFactory());
        }
    }
}
