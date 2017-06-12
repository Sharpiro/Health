﻿using Health.Core.Next.DataAccess.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Health.Core.Next.DataAccess
{
    public class HealthContext : IdentityDbContext<IdentityUser<int>, IdentityRole<int>, int>
    {
        public DbSet<Day> Days { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<MealEntry> MealEntries { get; set; }
        public DbSet<Food> Foods { get; set; }

        public HealthContext() { }
        public HealthContext(DbContextOptions<HealthContext> options) : base(options) { }
    }
}