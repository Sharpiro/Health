using Health.Core.Next.DataAccess.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Health.Core.Next.DataAccess
{
    public class HealthContext : IdentityDbContext
    {
        internal DbSet<Day> Days { get; set; }
        internal DbSet<Meal> Meals { get; set; }
        internal DbSet<MealEntry> MealEntries { get; set; }
        internal DbSet<Food> Foods { get; set; }

        public HealthContext(DbContextOptions<HealthContext> options) : base(options) { }
    }
}