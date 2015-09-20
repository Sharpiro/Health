using System.Collections.Generic;
using System.Linq;
using Health.Core.EF;
using Health.Core.Entities;
using Health.Core.Models;
using Xunit;

namespace Health.Tests
{
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
        private void ClearDayTest()
        {
            IBusinessService businessService = new EfBusinessLayer();
            businessService.ClearDay();
        }

        [Fact]
        private void DeleteDayTest()
        {
            IBusinessService businessService = new EfBusinessLayer();
            var day = businessService.GetMostRecentDay();
            businessService.DeleteDay(day.Date);
        }

        [Fact]
        public void SeedDatabaseTest()
        {
            IBusinessService businessService = new EfBusinessLayer();
            SeedFood(businessService);
            //SeedMeal(businessService);
        }

        private void SeedFood(IBusinessService businessService)
        {
            var chicken = new Food
            {
                Name = "Chicken1",
                Calories = 120,
                ServingSize = 4
            };
            var eggs = new Food
            {
                Name = "Eggs1",
                Calories = 70,
                ServingSize = 1
            };
            var apple = new Food
            {
                Name = "Apple1",
                Calories = 40,
                ServingSize = 1
            };
            var almonds = new Food
            {
                Name = "Almonds1",
                Calories = 100,
                ServingSize = 1
            };
            businessService.AddFood(chicken, eggs, apple, almonds);
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
