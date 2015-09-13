using System;
using System.Net;
using Health.Core.Models;
using Health.Web.Api.Extensions;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;

namespace Health.Web.Api
{
    public class NutritionController : Controller
    {
        private readonly IBusinessService _businessLayer;

        public NutritionController(IBusinessService businessLayer)
        {
            _businessLayer = businessLayer;
        }

        [HttpPost]
        public ActionResult AddFood([FromBody]FoodModel meal)
        {
            try
            {
                _businessLayer.AddFood(meal);
                return Ok("got it");
            }
            catch (Exception ex)
            {
                return this.Error(ex.Message);
            }
        }

        public ActionResult AddMealEntry(MealEntryModel meal)
        {
            _businessLayer.AddMealEntry(meal.Calories);
            return Ok();
        }
    }
}
