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

        public object GetMostRecentDay()
        {
            using (var context = new HealthContext())
            {
                var day = context.Days.OrderByDescending(d => d.Created).FirstOrDefault();
                var meals = context.Meals
                    .Where(m => m.DayId == day.Created)
                    .OrderBy(m => m.MealNumber).Include(m => m.MealEntries).ToList()
                    .Select(m => m.MealEntries.Select(me => me.Calories));
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

        public void AddMeal(DateTime date, int mealNumber)
        {
            if (mealNumber < 1) throw new ArgumentException("mealNumber value is invalid");
            using (var context = new HealthContext())
            {
                var meal = new Meal
                {
                    MealNumber = mealNumber,
                    DayId = date
                };
                context.Meals.Add(meal);
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
