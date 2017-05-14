using AutoMapper;
using Health.Core.Next.DataAccess;
using Health.Core.Next.Dtos;
using Health.Core.Next.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

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
    }
}