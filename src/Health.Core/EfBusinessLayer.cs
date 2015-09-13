using System.Collections.Generic;
using System.Linq;
using Health.Core.Entities;
using Health.Core.Models;

namespace Health.Core
{
    public class EfBusinessLayer: IBusinessService
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

        public void AddFood(FoodModel food)
        {
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

        public void AddMealEntry(int calories)
        {
            using (var context = new HealthContext())
            {
                var food = context.Foods.FirstOrDefault(f => f.Name == "chicken");
                var mealEntry = new MealEntry
                {
                    Calories = calories,
                    Food = food
                };
                context.MealEntries.Add(mealEntry);
                context.SaveChanges();
            }
        }
    }
}
