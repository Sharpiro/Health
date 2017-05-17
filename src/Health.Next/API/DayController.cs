using System;
using Health.Core.Next.Services;
using Microsoft.AspNetCore.Mvc;
using Health.Core.Next.Dtos;

namespace Health.Next.API
{
    public class DayController : Controller
    {
        private readonly HealthService _healthService;

        public DayController(HealthService healthService)
        {
            _healthService = healthService ?? throw new ArgumentNullException(nameof(healthService));
        }

        [HttpGet]
        public void Get()
        {
            throw new Exception("bad");
        }

        [HttpPost]
        public DayDto Add(DateTime currentTime)
        {
            return _healthService.AddDay(currentTime);
        }

        [HttpGet]
        public DayDto GetLatest()
        {
            return _healthService.GetLatestDay();
        }

        [HttpPut]
        public DayDto Update([FromBody]DayDto day)
        {
            return _healthService.UpdateDay(day);
        }

        [HttpPut]
        public DayDto Clear()
        {
            return _healthService.ClearDay();
        }

        [HttpPut]
        public void PruneInvalidDays()
        {
            _healthService.PruneInvalidDays();
        }
    }
}