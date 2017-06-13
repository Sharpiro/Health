using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Health.Core.Next.DataAccess;
using Health.Core.Next.DataAccess.Entities;
using Health.Core.Next.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Health.Core.Next.Tests
{
    [TestClass]
    public class MacrosTests
    {
        [TestMethod]
        public void GetMacrosTimingBreakdownTest()
        {
            var mapperMock = new Mock<IMapper>();
            var healthContextMock = new Mock<HealthContext>();
            var healthService = new HealthService(healthContextMock.Object, mapperMock.Object);
            var baseDate = new DateTime(2017, 06, 11);
            var fakeDays = new List<Day> { new Day { Id = 1, Date = baseDate } };
            var fakeMeal = new Meal { Id = 1, DayId = 1 };
            var foods = new List<Food>
            {
                new Food { Id = 1, Name = "oatmeal", Calories = 210, Carbs = 32,Fat = 4, Protein = 8, ServingSize = 2 },
                new Food { Id = 2, Name = "yogurt", Calories = 120, Carbs = 9, Fat = 0, Protein = 22, ServingSize = 225 },
                new Food { Id = 3, Name = "almonds", Calories = 100, Carbs = 1, Fat = 9, Protein = 4, ServingSize = 18 }
            };
            var list = new List<MealEntry>
            {
                new MealEntry { Id = 1, Calories = 200, Food = foods[2], FoodId = 3, TimeStamp = GetTimeStamp(10, 25), Meal = fakeMeal },
                new MealEntry { Id = 2, Calories = 100, Food = foods[0], FoodId = 1, TimeStamp = GetTimeStamp(10, 28), Meal = fakeMeal },
                new MealEntry { Id = 3, Calories = 400, Food = foods[1], FoodId = 2, TimeStamp = GetTimeStamp(14, 45), Meal = fakeMeal },
                new MealEntry { Id = 4, Calories = 300, Food = foods[2], FoodId = 3, TimeStamp = GetTimeStamp(15, 28), Meal = fakeMeal }
            };
            var mealEntiresDbsetMock = GetQueryableDbSetMock(list);
            var daysDbsetMock = GetQueryableDbSetMock(fakeDays);
            healthContextMock.Setup(c => c.MealEntries).Returns(mealEntiresDbsetMock.Object);
            healthContextMock.Setup(c => c.Days).Returns(daysDbsetMock.Object);

            var mealEntires = healthService.GetMacroTiming(baseDate);

            DateTime GetTimeStamp(int hours, int minutes)
            {
                return new DateTime(baseDate.Year, baseDate.Month, baseDate.Day, hours, minutes, 0);
            }
        }


        private static Mock<DbSet<T>> GetQueryableDbSetMock<T>(ICollection<T> sourceList) where T : class
        {
            var queryable = sourceList.AsQueryable();
            var dbSet = new Mock<DbSet<T>>();
            dbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
            dbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            dbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            dbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => queryable.GetEnumerator());
            dbSet.Setup(d => d.Add(It.IsAny<T>())).Callback<T>(sourceList.Add);
            return dbSet;
        }
    }
}