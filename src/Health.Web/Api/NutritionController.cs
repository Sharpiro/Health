using System;
using System.Collections.Generic;
using System.Net;
using Health.Core.Entities;
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

        public ActionResult GetAllData()
        {
            return ExecuteQuery(e => e.GetAllData());
        } 

        public ActionResult GetNutritionTable()
        {
            return ExecuteQuery(e => e.GetNutritionTable());
        }

        public ActionResult GetMostRecentDay()
        {
            return ExecuteQuery(e => e.GetMostRecentDay());
        }

        public ActionResult AddFood([FromBody]FoodModel meal)
        {
            return ExecuteNonQuery(e => e.AddFood(meal));
        }

        public ActionResult AddMealEntry([FromBody]MealEntryModel mealEntry)
        {
            return ExecuteNonQuery(e => e.AddMealEntry(mealEntry.FoodName, mealEntry.Calories, mealEntry.MealId));
        }

        public ActionResult AddMeal([FromBody]MealModel meal)
        {
            return ExecuteNonQuery(e => e.AddMeal(meal));
        }

        public ActionResult AddDay()
        {
            return ExecuteNonQuery(e => e.AddDay());
        }

        private ObjectResult ExecuteNonQuery(Action<IBusinessService> blMethod)
        {
            try
            {
                blMethod(_businessLayer);
                return Ok("");
            }
            catch (Exception ex)
            {
                return this.Error(ex.Message);
            }
        }

        private ObjectResult ExecuteQuery<T>(Func<IBusinessService, T> blMethod)
        {
            try
            {
                var result = blMethod(_businessLayer);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return this.Error(ex.Message);
            }
        }
    }
}
