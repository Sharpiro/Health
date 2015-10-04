using Health.Core.Entities;
using Microsoft.Data.Entity;

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
            ConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=HealthContext;Trusted_Connection=True;";
#endif
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<MealDay>().Key(md => new { md.DayId, md.MealId });
            //modelBuilder.Entity<Day>().Property(e => e.Id).UseSqlServerIdentityColumn();
            modelBuilder.Entity<Meal>().Index(m => new { m.MealNumber, m.DayId }).Unique();
            modelBuilder.Entity<Day>().Index(d => d.Created).Unique();

        }
    }
}
