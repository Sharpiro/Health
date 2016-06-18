using System;
using System.Collections.Generic;
using System.Linq;
using Health.Core.EF.Extensions;
using Health.Core.Entities;
using Health.Core.Models;
using Health.Core.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using DotnetCoreTools.Core.Extensions;

namespace Health.Core.EF
{
    public class EfBusinessLayer : IBusinessService
    {
        public void AddDefaultData()
        {
            throw new NotImplementedException();
        }

        public List<MealEntry> GetData()
        {
            throw new NotImplementedException();
        }

        public object GetNutritionTable()
        {
            using (var context = new HealthContext())
            {
                var foods = context.Foods.ToList();
                return foods;
            }
        }

        public ICollection<Day> GetAllData()
        {
            using (var context = new HealthContext())
            {
                var days = context.Days.Include(d => d.Meals).ThenInclude(m => m.MealEntries).ThenInclude(me => me.Food).ToList();
                return days;
            }
        }

        public RecentDayModel GetMostRecentDay()
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.OrderByDescending(d => d.Created).FirstOrDefault();
                if (day == null)
                    throw new NullReferenceException("There is no day information in the database");
                var meals = context.Meals
                    .Where(m => m.DayId == day.Id)
                    .OrderBy(m => m.MealNumber).Include(m => m.MealEntries).ToList()
                    .Select(m => m.MealEntries.OrderBy(me => me.MealEntryNumber)
                    .Select(me => new
                    {
                        me.FoodId,
                        me.Calories
                    }).ToList()).ToList();
                var calorieTotal = meals.SelectMany(m => m.Select(me => me.Calories)).Sum();
                var recentDay = new RecentDayModel
                {
                    DayId = day.Id,
                    Date = day.Created,
                    Total = calorieTotal,
                    Meals = meals
                };
                return recentDay;
            }
        }

        public DayTotalsModel GetDayTotals()
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.OrderByDescending(d => d.Created).FirstOrDefault();
                if (day == null)
                    throw new NullReferenceException("There is no day information in the database");
                var dayTotals = context.Meals
                    .Where(m => m.DayId == day.Id)
                    .OrderBy(m => m.MealNumber).Include(m => m.MealEntries)
                    .ThenInclude(me => me.Food).ToList()
                    .SelectMany(m => m.MealEntries.OrderBy(me => me.MealEntryNumber))
                    .GroupBy(me => me.Food)
                    .Select(g => new
                    {
                        Food = g.Key,
                        CalorieTotal = g.Sum(me => me.Calories),
                        Count = g.Count()
                    })
                    .Select(nn => new DayTotalsModel
                    {
                        Calories = nn.CalorieTotal,
                        Protein = (nn.CalorieTotal / nn.Food.Calories) * nn.Food.Protein,
                        Carbs = (nn.CalorieTotal / nn.Food.Calories) * nn.Food.Carbs,
                        Fat = (nn.CalorieTotal / nn.Food.Calories) * nn.Food.Fat,
                    }).Addition();
                return dayTotals;
            }
        }

        public Food GetFoodByName(string foodName)
        {
            using (var context = new HealthContext())
            {
                context.AddLogging();
                var foods = context.Foods.FirstOrDefault(f => f.Name == foodName);
                return foods;
            }
        }

        public void AddFood(params Food[] food)
        {
            if (food.Length < 1) return;
            using (var context = new HealthContext())
            {
                context.Foods.AddOrUpdateCustom(f => f.Name, food);
                context.SaveChanges();
            }
        }

        public void AddMealEntry(string foodName, int calories, int mealId)
        {
            if (calories < 1) throw new Exception("calories value is invalid");
            using (var context = new HealthContext())
            {
                var food = context.Foods.FirstOrDefault(f => f.Name == foodName);
                var mealEntry = new MealEntry
                {
                    Calories = calories,
                    Food = food,
                    MealId = mealId
                };
                context.MealEntries.Add(mealEntry);
                context.SaveChanges();
            }
        }

        public void AddMeal(MealModel mealModel)
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.FirstOrDefault(d => d.Created == mealModel.Date);
                var meal = new Meal
                {
                    DayId = day.Id,
                    MealNumber = mealModel.MealNumber,
                    MealEntries = mealModel.MealEntries
                };
                context.Add(meal);
                context.MealEntries.AddRange(meal.MealEntries);
                context.SaveChanges();
            }
        }

        public void AddDay()
        {
            using (var context = new HealthContext())
            {
                var eastCoastDiff = TimeSpan.FromHours(4);
                var now = DateTime.Now == DateTime.UtcNow ? DateTime.UtcNow.Subtract(eastCoastDiff) : DateTime.Now;
                var day = new Day { Created = new DateTime(now.Year, now.Month, now.Day) };
                context.Days.Add(day);
                context.SaveChanges();
            }
        }

        public void ClearDay()
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.OrderByDescending(d => d.Created).FirstOrDefault();
                if (day == null) throw new NullReferenceException("The day provided does not exist in the database");
                var meals = context.Meals.Include(m => m.MealEntries).Where(m => m.DayId == day.Id).ToList();
                meals.ForEach(m => context.MealEntries.RemoveRange(m.MealEntries));
                context.Meals.RemoveRange(meals);
                context.SaveChanges();
            }
        }

        public List<TotalCaloriesPerDayModel> GetCalorieCountAllDays()
        {
            using (var context = new HealthContext())
            {
                var dayCalories = context.Days.OrderByDescending(d => d.Created).Include(d => d.Meals).ThenInclude(m => m.MealEntries).ToList().Skip(1)
                    .Select(d => new TotalCaloriesPerDayModel
                    {
                        Id = d.Id,
                        TotalCalories = d.Meals.SelectMany(m => m.MealEntries).ToList().Select(me => me.Calories).ToList().Sum()
                    }).ToList();


                return dayCalories;
            }
        }

        public void DeleteInvalidDays()
        {
            var invalidDays = GetCalorieCountAllDays().Where(d => d.TotalCalories < 1500).ToList();
            if (!invalidDays.Any())
                throw new NullReferenceException("No invalid days were found");
            invalidDays.ForEach(d => DeleteDay(d.Id));
        }

        public void DeleteDay(int id)
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.Include(d => d.Meals).ThenInclude(m => m.MealEntries).FirstOrDefault(d => d.Id == id);
                if (day == null) throw new NullReferenceException("The day provided does not exist in the database");
                day.Meals.ToList().ForEach(m => context.MealEntries.RemoveRange(m.MealEntries));
                context.Meals.RemoveRange(day.Meals);
                context.Days.Remove(day);
                context.SaveChanges();
            }
        }
    }
}
