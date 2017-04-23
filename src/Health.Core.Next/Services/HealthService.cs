using Health.Core.Next.DataAccess;
using Health.Core.Next.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Health.Core.Next.Services
{
    public class HealthService
    {
        private readonly HealthContext _healthContext;

        public HealthService(HealthContext healthContext)
        {
            _healthContext = healthContext ?? throw new ArgumentNullException(nameof(healthContext));
        }

        public NutritionHistoryModel GetNutritionHistory(int days)
        {
            var history = new NutritionHistoryModel
            {
                Days = _healthContext.Days.OrderByDescending(day => day.Created).Skip(1).Take(days)
                .Include(d => d.Meals).ThenInclude(m => m.MealEntries)
                .Select(day => new DayOverviewModel
                {
                    Calories = day.Meals.SelectMany(meal => meal.MealEntries)
                        .Sum(mealEntry => mealEntry.Calories),
                    Date = day.Created
                }).ToList()
            };
            return history;
        }
    }
}