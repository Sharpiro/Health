using AutoMapper;
using Health.Core.Next.Dtos;
using Health.Core.Next.Tools;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using Health.Core.Next.DataAccess.Entities;
using System.Linq;
using System;

namespace Health.Core.Next.Tests
{
    [TestClass]
    public class MappingProfileTests
    {
        private readonly IMapper _mapper;

        public MappingProfileTests()
        {
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>()).CreateMapper();
        }

        [TestMethod]
        public void MealDtoCollectionTest()
        {
            var meals = new List<Meal>
            {
                new Meal{Id= 1, DayId= 1, MealNumber=1, MealEntries= new List<MealEntry>
                {
                    new MealEntry{Id = 1, Calories=10, FoodId=1, MealEntryNumber = 1, MealId=1 }
                } },
                new Meal{Id= 2, DayId= 1, MealNumber=2, MealEntries= new List<MealEntry>
                {
                    new MealEntry{Id = 1, Calories=10, FoodId=1, MealEntryNumber = 1, MealId=2 },
                    new MealEntry{Id = 2, Calories=20, FoodId=1, MealEntryNumber = 2, MealId=2 }
                } }
            };
            var mealDtos = _mapper.Map<List<MealDto>>(meals);

            Assert.IsNotNull(mealDtos);
            Assert.AreEqual(meals.Count, mealDtos.Count);
            Assert.AreEqual(meals.First().MealEntries.Count, mealDtos.First().MealEntries.Count);
            Assert.AreEqual(meals.Last().MealEntries.Count, mealDtos.Last().MealEntries.Count);
            Assert.AreEqual(meals.Last().MealEntries.First().Calories, mealDtos.Last().MealEntries.First().Calories);
        }

        [TestMethod]
        public void DayDtoTest()
        {
            var currentDate = DateTime.Now;
            var day = new Day { Date = new DateTime(currentDate.Year, currentDate.Month, currentDate.Day) };
            var dayDto = _mapper.Map<DayDto>(day);

            Assert.IsNotNull(dayDto);
            Assert.AreEqual(day.Date, dayDto.Date);
        }
    }
}