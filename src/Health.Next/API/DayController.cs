using System;
using Health.Core.Next.Services;
using Microsoft.AspNetCore.Mvc;

namespace Health.Next.API
{
    public class DayController
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
        public void Add(DateTime currentTime)
        {
            _healthService.AddDay(currentTime);
        }

        [HttpGet]
        public object GetLatest()
        {
            return _healthService.GetLatest();
        }

        //[Authorize]
        //public ActionResult ClearDay()
        //{
        //    return ExecuteNonQuery(e => e.ClearDay());
        //}

        //[HttpDelete("/api/Nutrition/DeleteDay/{id}"), Authorize]
        //public ActionResult DeleteDay(int id)
        //{
        //    return ExecuteNonQuery(e => e.DeleteDay(id));
        //}

        //[Authorize]
        //public ActionResult DeleteInvalidDays()
        //{
        //    return ExecuteNonQuery(e => e.DeleteInvalidDays());
        //}

        //public ActionResult GetDayTotals()
        //{
        //    return ExecuteQuery(e => e.GetDayTotals());
        //}
    }
}