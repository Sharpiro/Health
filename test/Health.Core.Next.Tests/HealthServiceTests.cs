using AutoMapper;
using Health.Core.Next.DataAccess;
using Health.Core.Next.Dtos;
using Health.Core.Next.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Collections.Generic;
using System.Collections.Immutable;
using System;

namespace Health.Core.Next.Tests
{
    [TestClass]
    public class HealthServiceTests
    {
        [TestMethod]
        public void GetMaintenanceCaloriesTest()
        {
            const int age = 27;
            const Gender gender = Gender.Male;
            const double weight = 207.1;
            const int height = 73;
            var mapperMock = new Mock<IMapper>();
            var healthContext = new HealthContext(new DbContextOptions<HealthContext>());
            var healthService = new HealthService(healthContext, mapperMock.Object);
            const int expectedBasalMaintenance = 1968;
            const int expectedSedentaryMaintenance = 2362;
            const int expectedLightMaintenance = 2706;
            const int expectedModerateMaintenance = 3051;
            const int expectedVeryActiveMaintenance = 3395;
            const int expectedExtraActiveMaintenance = 3740;

            var basalMaintenance = healthService.GetMaintenanceCalories(age, gender, height, weight, ActivityLevel.BasalMetabolicRate);
            var sedentaryMaintenance = healthService.GetMaintenanceCalories(age, gender, height, weight, ActivityLevel.Sedentary);
            var lightMaintenance = healthService.GetMaintenanceCalories(age, gender, height, weight, ActivityLevel.LightlyActive);
            var moderateMaintenance = healthService.GetMaintenanceCalories(age, gender, height, weight, ActivityLevel.ModeratelyActive);
            var veryActiveMaintenance = healthService.GetMaintenanceCalories(age, gender, height, weight, ActivityLevel.VeryActive);
            var extraActiveMaintenance = healthService.GetMaintenanceCalories(age, gender, height, weight, ActivityLevel.ExtraActive);

            Assert.AreEqual(expectedBasalMaintenance, basalMaintenance);
            Assert.AreEqual(expectedSedentaryMaintenance, sedentaryMaintenance);
            Assert.AreEqual(expectedLightMaintenance, lightMaintenance);
            Assert.AreEqual(expectedModerateMaintenance, moderateMaintenance);
            Assert.AreEqual(expectedVeryActiveMaintenance, veryActiveMaintenance);
            Assert.AreEqual(expectedExtraActiveMaintenance, extraActiveMaintenance);
        }

        [TestMethod]
        public void MacroAggregateTest()
        {
            var data = GetTestData();
            var agg = data.Aggregate((a, b) =>
            (
                a.Protein + b.Protein,
                a.Carbs + b.Carbs,
                a.Fat + b.Fat
            ));

            Assert.AreEqual(87, agg.Protein);
            Assert.AreEqual(231, agg.Carbs);
            Assert.AreEqual(84, agg.Fat);
        }

        [TestMethod]
        public void EmptyAggregateTest()
        {
            var data = Enumerable.Empty<(int Protein, int Carbs, int Fat)>();

            Assert.ThrowsException<InvalidOperationException>(() =>
            {
                var agg = data.Aggregate((a, b) =>
                (
                    a.Protein + b.Protein,
                    a.Carbs + b.Carbs,
                    a.Fat + b.Fat
                ));
            });
        }

        [TestMethod]
        public void EmptyAggregateTest2()
        {
            var data = GetTestData().Take(0).ToList();
            (int Protein, int Carbs, int Fat) seed = (0, 0, 0);
            var agg = data.Aggregate(seed, (a, b) =>
            (
                a.Protein + b.Protein,
                a.Carbs + b.Carbs,
                a.Fat + b.Fat
            ));
        }

        private IReadOnlyList<(int Protein, int Carbs, int Fat)> GetTestData()
        {
            const string testJson = @"[ 
                {'Calories':100,'Protein':4,'Carbs':1,'Fat':9},
                {'Calories':540,'Protein':20,'Carbs':17,'Fat':51},
                {'Calories':120,'Protein':16,'Carbs':0,'Fat':5},
                {'Calories':180,'Protein':20,'Carbs':4,'Fat':8},
                {'Calories':40,'Protein':0,'Carbs':17,'Fat':0},
                {'Calories':300,'Protein':4,'Carbs':101,'Fat':0},
                {'Calories':600,'Protein':23,'Carbs':91,'Fat':11}
            ]";

            return JArray.Parse(testJson)
                .Select(j => (
                    (int)j["Protein"],
                    (int)j["Carbs"],
                    (int)j["Fat"]
                )).ToImmutableList();
        }

        [TestMethod]
        public void GetMacrosTimingBreakdownTest()
        {
            var mapperMock = new Mock<IMapper>();
            //var healthContextMock = new Mock<IHealthContext>();
            var healthContextMock = new Mock<HealthContext>();
            var healthService = new HealthService(healthContextMock.Object, mapperMock.Object);
            var mealEntires = healthService.GetLatestMealEntries();
        }
    }
}