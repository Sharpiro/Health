using Health.Core.Next.DataAccess;
using Health.Core.Next.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using AutoMapper;
using Health.Core.Next.DataAccess.Entities;

namespace Health.Core.Next.Services
{
    public class HealthService
    {
        private readonly HealthContext _healthContext;
        private readonly IMapper _mapper;

        public HealthService(HealthContext healthContext, IMapper mapper)
        {
            _healthContext = healthContext ?? throw new ArgumentNullException(nameof(healthContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
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

        public DayDto AddDay(DateTime clientDateTime)
        {
            var day = new Day { Created = new DateTime(clientDateTime.Year, clientDateTime.Month, clientDateTime.Day) };
            _healthContext.Days.Add(day);
            _healthContext.SaveChanges();
            var dayDto = _mapper.Map<DayDto>(day);
            return dayDto;
        }
    }
}