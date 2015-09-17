using System;
using System.Collections.Generic;
using System.Linq;
using Health.Core.Entities;
using Health.Core.Models;
using Health.Core.Models.ViewModels;
using Microsoft.Data.Entity;

namespace Health.Core
{
    public class EfBusinessLayer : IBusinessService
    {
        public EfBusinessLayer()
        {

        }

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
                var foods = context.Foods.Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Calories
                }).ToList();
                return foods;
            }
        }

        public ICollection<Day> GetAllData()
        {
            using (var context = new HealthContext())
            {
                var days = context.Days.Include(d => d.Meals).ThenInclude(m => m.MealEntries).ThenInclude(me =>me.Food).ToList();
                return days;
            }
        }

        public RecentDayModel GetMostRecentDay()
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.OrderByDescending(d => d.Created).FirstOrDefault();
                var meals = context.Meals
                    .Where(m => m.DayId == day.Created)
                    .OrderBy(m => m.MealNumber).Include(m => m.MealEntries).ToList()
                    .Select(m => m.MealEntries.OrderBy(me => me.MealEntryNumber)
                    .Select(me => me.Calories));
                var recentDay = new RecentDayModel
                {
                    Date = day.Created,
                    Meals = meals
                };
                return recentDay;
            }
        }

        public void AddFood(FoodModel food)
        {
            if (string.IsNullOrEmpty(food.Name)) return;
            using (var context = new HealthContext())
            {
                var newFood = new Food
                {
                    Calories = food.Calories,
                    Name = food.Name,
                    ServingSize = food.ServingSize
                };
                context.Foods.Add(newFood);
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
                var meal = new Meal
                {
                    DayId = mealModel.Date,
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
                var now = DateTime.UtcNow;
                var day = new Day
                {
                    Created = new DateTime(now.Year, now.Month, now.Day)
                };
                context.Days.Add(day);
                context.SaveChanges();
            }
        }
    }
}
