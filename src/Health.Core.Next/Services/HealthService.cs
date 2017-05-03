using Health.Core.Next.DataAccess;
using Health.Core.Next.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using AutoMapper;
using Health.Core.Next.DataAccess.Entities;
using System.Collections.Generic;

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

        public NutritionHistoryDto GetNutritionHistory(int days)
        {
            var history = new NutritionHistoryDto
            {
                Days = _healthContext.Days.OrderByDescending(day => day.Created).Skip(1).Take(days)
                .Include(d => d.Meals).ThenInclude(m => m.MealEntries)
                .Select(day => new DayOverviewDto
                {
                    Calories = day.Meals.SelectMany(meal => meal.MealEntries)
                        .Sum(mealEntry => mealEntry.Calories),
                    Date = day.Created
                }).ToList()
            };
            return history;
        }

        public object GetLatest()
        {
            var day = _healthContext.Days.OrderByDescending(d => d.Created).FirstOrDefault();
            if (day == null)
                throw new NullReferenceException("There is no day information in the database");
            var meals =
            //List<List<(int FoodId, int Calories)>> meals =
            _healthContext.Meals
                .Where(m => m.DayId == day.Id)
                .OrderBy(m => m.MealNumber).Include(m => m.MealEntries)
                .ToList();
            //_healthContext.Meals
            //.Where(m => m.DayId == day.Id)
            //.OrderBy(m => m.MealNumber).Include(m => m.MealEntries).ToList()
            //.Select(m => m.MealEntries.OrderBy(me => me.MealEntryNumber)
            //.Select(me => (
            //    me.FoodId,
            //    me.Calories
            //)).ToList()).ToList();
            var mealDtos = _mapper.Map<List<MealDto>>(meals);
            var recentDay = new DayDto
            {
                Id = day.Id,
                Date = day.Created,
                Meals = mealDtos
            };
            return recentDay;
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