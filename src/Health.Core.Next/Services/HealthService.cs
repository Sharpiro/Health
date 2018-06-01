using Health.Core.Next.DataAccess;
using Health.Core.Next.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using AutoMapper;
using Health.Core.Next.DataAccess.Entities;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

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

        public (int Protein, int Carbs, int Fat) GetMacros()
        {
            var day = _healthContext.Days.OrderByDescending(d => d.Date).FirstOrDefault();
            if (day == null) throw new NullReferenceException("There is no day information in the database");

            (int Protein, int Carbs, int Fat) seed = (0, 0, 0);
            var dailyMacros = _healthContext.Meals
            .Where(m => m.DayId == day.Id)
            .OrderBy(m => m.MealNumber).Include(m => m.MealEntries)
            .ThenInclude(me => me.Food).ToList()
            .SelectMany(m => m.MealEntries.OrderBy(me => me.MealEntryNumber))
                .GroupBy(me => me.Food)
                .Select(g => GetFoodMacros(g))
                .Aggregate(seed, (a, b) => (
                 a.Protein + b.Protein,
                 a.Carbs + b.Carbs,
                 a.Fat + b.Fat
             ));

            (int Protein, int Carbs, int Fat) GetFoodMacros(IGrouping<Food, MealEntry> g)
            {
                var food = g.Key;
                var dailyFoodTotal = g.Sum(me => me.Calories);
                return (
                    (int)Math.Round((double)dailyFoodTotal / food.Calories * food.Protein),
                    (int)Math.Round((double)dailyFoodTotal / food.Calories * food.Carbs),
                    (int)Math.Round((double)dailyFoodTotal / food.Calories * food.Fat)
                );
            }

            return dailyMacros;
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

        public IEnumerable<DayDto> GetDayList(int numberOfDays)
        {
            var days = _healthContext.Days.OrderByDescending(d => d.Date).Take(numberOfDays);
            var dayDtos = _mapper.Map<IEnumerable<DayDto>>(days);
            var actualType = dayDtos.GetType();
            return dayDtos;
        }

        public NutritionHistoryDto GetNutritionHistory(DateTime currentDate, int daysBack = 7)
        {
            var currentDateNoTime = new DateTime(currentDate.Year, currentDate.Month, currentDate.Day);
            var sevenDaysAgo = currentDateNoTime.Subtract(TimeSpan.FromDays(daysBack));

            var calorieDictionary = _healthContext.Days.OrderByDescending(day => day.Date)
            .Where(d => d.Date < currentDateNoTime && d.Date >= sevenDaysAgo)
            .Take(daysBack)
            .Include(d => d.Meals).ThenInclude(m => m.MealEntries)
            .ToDictionary(d => d.Date, d =>
            {
                return d.Meals.SelectMany(meal => meal.MealEntries)
                .Sum(mealEntry => mealEntry.Calories);
            });

            var history = new NutritionHistoryDto
            {
                Days = GetDateList().Select(d =>
                {
                    var parseSuccess = calorieDictionary.TryGetValue(d, out int calories);
                    calories = parseSuccess ? calories : 3000;
                    return new DayOverviewDto
                    {
                        Date = d,
                        Calories = calories
                    };
                })
            };

            return history;

            IEnumerable<DateTime> GetDateList()
            {
                var startDate = currentDateNoTime.Subtract(TimeSpan.FromDays(1));
                for (DateTime date = startDate; date >= sevenDaysAgo; date = date.Subtract(TimeSpan.FromDays(1)))
                    yield return date;
            }
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

        public MacroTimingDto GetMacroTiming(DateTime? dayTimeStamp = null)
        {
            const int carbCost = 4;
            const int fatCost = 9;
            const int proteinCost = 4;

            dayTimeStamp = dayTimeStamp.HasValue ? (DateTime?)new DateTime(dayTimeStamp.Value.Year, dayTimeStamp.Value.Month, dayTimeStamp.Value.Day) : null;
            var day = dayTimeStamp.HasValue ? _healthContext.Days.SingleOrDefault(d => d.Date == dayTimeStamp)
                : _healthContext.Days.OrderByDescending(d => d.Date).FirstOrDefault();
            if (day == null) throw new NullReferenceException("Could not find relevant day information in the database");

            var mealEntries = _healthContext.MealEntries.Include(me => me.Food)
                .Where(me => me.Meal.DayId == day.Id).ToList()
                .Select(me =>
                {
                    var servings = (double)me.Calories / me.Food.Calories;
                    var roundError = me.TimeStamp.Minute >= 30 && me.TimeStamp.Hour < 23 ? 1 : 0;
                    return new
                    {
                        Carbs = (int)Math.Round(me.Food.Carbs * servings),
                        Fat = (int)Math.Round(me.Food.Fat * servings),
                        Protein = (int)Math.Round(me.Food.Protein * servings),
                        TimeStamp = new DateTime(me.TimeStamp.Year, me.TimeStamp.Month, me.TimeStamp.Day, me.TimeStamp.Hour + roundError, 0, 0)
                    };
                })
                .GroupBy(me => me.TimeStamp)
                .Select(g => new
                {
                    Carbs = g.Sum(me => me.Carbs),
                    Fat = g.Sum(me => me.Fat),
                    Protein = g.Sum(me => me.Protein),
                    TimeStamp = g.Key,
                }).ToList();

            var macroSeriesLists = new MacroTimingDto
            {
                CarbsList = mealEntries.Select(t => (t.Carbs, t.TimeStamp, t.Carbs * carbCost)),
                FatList = mealEntries.Select(t => (t.Fat, t.TimeStamp, t.Fat * fatCost)),
                ProteinList = mealEntries.Select(t => (t.Protein, t.TimeStamp, t.Protein * proteinCost)),
            };

            return macroSeriesLists;
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