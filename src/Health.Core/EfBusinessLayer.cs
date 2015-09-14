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
            AddDefaultData();
        }

        public void AddDefaultData()
        {
            using (var context = new HealthContext())
            {
                //context.SaveChanges();
            }
        }

        public List<MealEntry> GetData()
        {
            using (var context = new HealthContext())
            {
                return null;
            }
        }

        public object GetMostRecentDay()
        {
            using (var context = new HealthContext())
            {
                //var gg = from meals in context.Meals
                //           join mealEntries in context.MealEntries
                //           on meals.MealNumber equals mealEntries.MealId
                //           select new {
                //               meals.Id,
                //               meals.MealNumber,
                //               meals.MealEntries
                //           };
                var day = context.Days.OrderByDescending(d => d.Created).FirstOrDefault();
                //var yyy = context.Meals.Include(m => m.MealEntries).Where(m => m.DayId == day.Created).Select(m => new MealViewModel
                //{
                //    Id= m.Id,
                //    MealNumber = m.MealNumber,
                //}).ToList();
                var xxx = context.Meals.Join(context.MealEntries, meal => meal.MealNumber, mealEntry => mealEntry.MealId, (meal, mealEntry) => mealEntry).ToList();
                //.Select(m => new {
                //    m.Id,
                //    m.MealNumber,
                //    m.MealEntries
                //}).ToList();
                return null;
            }
        }

        //public RecentDayModel GetMostRecentDay()
        //{
        //    using (var context = new HealthContext())
        //    {
        //        var day = context.Days.OrderByDescending(d => d.Created)
        //        .Include(d => d.Meals)
        //        .ThenInclude(m => m.MealEntries)
        //        .ThenInclude(me => me.Food)
        //        .FirstOrDefault();
        //return day;
        //    }
        //}

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
