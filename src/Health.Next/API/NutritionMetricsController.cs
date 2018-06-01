using Health.Core.Next.Services;
using Health.Next.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace Health.Next.API
{
    public class NutritionMetricsController : Controller
    {
        private readonly HealthService _healthService;
        private readonly ILogger _logger;

        public NutritionMetricsController(HealthService healthService, ILogger<NutritionMetricsController> logger)
        {
            _healthService = healthService ?? throw new ArgumentNullException(nameof(HealthService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("/api/NutritionMetrics/GetNutritionHistory/{date?}")]
        public IActionResult GetNutritionHistory(DateTime date)
        {
            if (date == DateTime.MinValue) throw new ArgumentOutOfRangeException(nameof(date), "Invalid date");

            return Execute(() => _healthService.GetNutritionHistory(date));
        }

        private IActionResult Execute<TOut>(Func<TOut> func)
        {
            try
            {
                if (func == null) throw new ArgumentNullException(nameof(func));
                return new JsonResult(func());
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggingEvents.GetMetrics, ex, ex.Message);
                throw;
            }
        }
    }
}