using Health.Core.Next.Models;
using Health.Core.Next.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace Health.Next.API
{
    public class FoodController
    {
        private readonly FoodService _foodService;
        private readonly ILogger _logger;

        public FoodController(FoodService foodService, ILogger<NutritionMetricsController> logger)
        {
            _foodService = foodService ?? throw new ArgumentNullException(nameof(HealthService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public FoodDto Get(int id)
        {
            return _foodService.Get(id);
        }

        [HttpGet]
        public IEnumerable<FoodDto> GetAll()
        {
            return _foodService.GetAll();
        }

        [HttpGet]
        public IEnumerable<FoodDto> GetAllActive()
        {
            return _foodService.GetAllActive();
        }

        [HttpPut]
        public void Update([FromBody]FoodDto foodDto)
        {
            _foodService.UpdateFood(foodDto);
        }
    }
}