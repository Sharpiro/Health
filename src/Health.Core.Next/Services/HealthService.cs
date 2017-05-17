using Health.Core.Next.DataAccess;
using Health.Core.Next.Dtos;
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
                Days = _healthContext.Days.OrderByDescending(day => day.Date).Skip(1).Take(days)
                .Include(d => d.Meals).ThenInclude(m => m.MealEntries)
                .Select(day => new DayOverviewDto
                {
                    Calories = day.Meals.SelectMany(meal => meal.MealEntries)
                        .Sum(mealEntry => mealEntry.Calories),
                    Date = day.Date
                }).ToList()
            };
            return history;
        }

        public void PruneInvalidDays()
        {
            var invalidDays = _healthContext.Days
                .OrderByDescending(d => d.Date)
                .Where(d => !d.Meals.Any() || d.Meals.SelectMany(m => m.MealEntries).Select(me => me.Calories).Sum() < 1500)
                .Skip(1)
                .ToList();

            if (invalidDays.Count == 0) throw new InvalidOperationException("No invalid days were found");
            _healthContext.RemoveRange(invalidDays);
            _healthContext.SaveChanges();
        }

        public DayDto GetLatestDay()
        {
            var day = _healthContext.Days.OrderByDescending(d => d.Date).FirstOrDefault();
            if (day == null) throw new NullReferenceException("There is no day information in the database");
            var meals = _healthContext.Meals
                .Where(m => m.DayId == day.Id)
                .OrderBy(m => m.MealNumber).Include(m => m.MealEntries)
                .Select(m => new Meal
                {
                    Id = m.Id,
                    MealNumber = m.MealNumber,
                    DayId = m.DayId,
                    MealEntries = m.MealEntries.OrderBy(me => me.MealEntryNumber).ToList()
                });
            var mealDtos = _mapper.Map<List<MealDto>>(meals);
            return new DayDto
            {
                Id = day.Id,
                Date = day.Date,
                Meals = mealDtos
            };
        }

        public DayDto AddDay(DateTime clientDateTime)
        {
            var day = new Day { Date = new DateTime(clientDateTime.Year, clientDateTime.Month, clientDateTime.Day) };
            _healthContext.Days.Add(day);
            _healthContext.SaveChanges();
            var dayDto = _mapper.Map<DayDto>(day);
            return dayDto;
        }

        public DayDto UpdateDay(DayDto dayDto)
        {
            var dayEntity = _mapper.Map<Day>(dayDto);
            _healthContext.Update(dayEntity);
            _healthContext.SaveChanges();
            dayDto = _mapper.Map<DayDto>(dayEntity);
            return dayDto;
        }

        public DayDto ClearDay()
        {
            var day = _healthContext.Days.OrderByDescending(d => d.Date)
                .Include(d => d.Meals).FirstOrDefault();
            if (day == null) throw new NullReferenceException("No days found in the database");
            _healthContext.RemoveRange(day.Meals);
            _healthContext.SaveChanges();
            var dayDto = _mapper.Map<DayDto>(day);
            return dayDto;
        }

        public int GetMaintenanceCalories(int age, Gender gender, int heightInInches, double weightInPounds, ActivityLevel activityLevel)
        {
            const double kiloConversion = 0.45359237;
            const double centiMeterConversion = 2.54;
            var genderError = gender == Gender.Female ? 161 : 5;
            var kilograms = weightInPounds * kiloConversion;
            var centimeters = heightInInches * centiMeterConversion;
            double activityBoost;

            switch (activityLevel)
            {
                case ActivityLevel.BasalMetabolicRate:
                    activityBoost = 1;
                    break;
                case ActivityLevel.Sedentary:
                    activityBoost = 1.2;
                    break;
                case ActivityLevel.LightlyActive:
                    activityBoost = 1.375;
                    break;
                case ActivityLevel.ModeratelyActive:
                    activityBoost = 1.55;
                    break;
                case ActivityLevel.VeryActive:
                    activityBoost = 1.725;
                    break;
                case ActivityLevel.ExtraActive:
                    activityBoost = 1.9;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(activityLevel));
            }
            var bmr = (10 * kilograms) + (6.25 * centimeters) - (5 * age) + genderError;
            var maintenance = (int)Math.Round(bmr * activityBoost);
            return maintenance;
        }
    }
}