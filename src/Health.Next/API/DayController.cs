using System;
using Health.Core.Next.Services;
using Microsoft.AspNetCore.Mvc;

namespace Health.Next.API
{
    public class Temp
    {
        public DateTime CurrentTime { get; set; }
        public string CurrentTimeString { get; set; }
    }
    public class DayController
    {
        private readonly HealthService _healthService;

        public DayController(HealthService healthService)
        {
            _healthService = healthService ?? throw new ArgumentNullException(nameof(healthService));
        }

        [HttpPost]
        public void Add([FromBody] Temp obj)
        {
            var x = obj.CurrentTime;
            //_healthService.AddDay();
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

        //public ActionResult GetMostRecentDay()
        //{
        //    return ExecuteQuery(e => e.GetMostRecentDay());
        //}
    }
}