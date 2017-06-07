using System;
using Health.Core.Next.Services;
using Microsoft.AspNetCore.Mvc;
using Health.Core.Next.Dtos;
using System.Collections.Generic;
using Newtonsoft.Json;

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

        [HttpGet]
        public object GetMacros()
        {
            var macros = _healthService.GetMacros();
            return new
            {
                Protein = macros.Protein,
                Carbs = macros.Carbs,
                Fat = macros.Fat
            };
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

        [HttpGet]
        public IEnumerable<DayDto> GetDayList(int numberOfDays)
        {
            return _healthService.GetDayList(numberOfDays);
        }

        [HttpGet]
        public IEnumerable<MealEntryDto> GetLatestMealEntries(DateTime? dayTimeStamp = null)
        {
            return _healthService.GetLatestMealEntries(dayTimeStamp);
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