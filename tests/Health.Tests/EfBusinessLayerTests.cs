using System;
using System.Collections.Generic;
using System.Linq;
using Health.Core;
using Health.Core.Entities;
using Health.Core.Models;
using Xunit;

namespace Health.Tests
{
    // This project can output the Class library as a NuGet Package.
    // To enable this option, right-click on the project and select the Properties menu item. In the Build tab select "Produce outputs on build".
    public class EfBusinessLayerTests
    {
        [Fact]
        public void GetMostRecentDayTest()
        {
            IBusinessService businessService = new EfBusinessLayer();
            var recentDay = businessService.GetMostRecentDay();
            Assert.NotNull(recentDay);
        }

        [Fact]
        private void AddDayTest()
        {
            IBusinessService businessService = new EfBusinessLayer();
            businessService.AddDay();
        }

        [Fact]
        public void SeedDatabaseTest()
        {
            IBusinessService businessService = new EfBusinessLayer();
            //SeedFood(businessService);
            SeedMeal(businessService);
        }

        private void SeedFood(IBusinessService businessService)
        {
            var chicken = new Food
            {
                Name = "Chicken",
                Calories = 120,
                ServingSize = 4
            };
            var eggs = new Food
            {
                Name = "Eggs",
                Calories = 70,
                ServingSize = 1
            };
            businessService.AddFood(chicken);
            businessService.AddFood(eggs);
        }

        private void SeedMeal(IBusinessService businessService)
        {
            var currentDate = businessService.GetMostRecentDay();
            var meal = new MealModel
            {
                Date = currentDate.Date,
                MealNumber = 1,
                MealEntries = new List<MealEntry> {
                    new MealEntry
                    {
                        MealEntryNumber = 0,
                        Calories = 120,
                        Food= businessService.GetFoodByName("chicken")
                    },
                    new MealEntry
                    {
                        MealEntryNumber = 1,
                        Calories = 184,
                        Food= businessService.GetFoodByName("eggs")
                    }}
            };
            businessService.AddMeal(meal);
            meal.MealNumber = 2;
            meal.MealEntries.FirstOrDefault().Id = 0;
            meal.MealEntries.LastOrDefault().Id = 0;
            businessService.AddMeal(meal);
        }
    }
}
