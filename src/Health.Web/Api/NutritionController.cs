﻿using System;
using Health.Core.Entities;
using Health.Core.Models;
using Health.Web.Api.Extensions;
using Microsoft.AspNetCore.Mvc;

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

        public ActionResult GetDayTotals()
        {
            return ExecuteQuery(e => e.GetDayTotals());
        }

        public ActionResult AddFood([FromBody]Food meal)
        {
            return ExecuteNonQuery(e => e.AddFood(meal));
        }

        public ActionResult AddMealEntry([FromBody]MealEntryModel mealEntry)
        {
            return ExecuteNonQuery(e => e.AddMealEntry(mealEntry.FoodName, mealEntry.Calories, mealEntry.MealId));
        }

        public ActionResult AddMeal([FromBody]MealModel meal)
        {
            if (ModelState.IsValid)
                return ExecuteNonQuery(e => e.AddMeal(meal));

            return BadRequest(ModelState);
        }

        public ActionResult AddDay()
        {
            return ExecuteNonQuery(e => e.AddDay());
        }

        public ActionResult ClearDay()
        {
            return ExecuteNonQuery(e => e.ClearDay());
        }

        [HttpDelete("/api/Nutrition/DeleteDay/{id}")]
        public ActionResult DeleteDay(int id)
        {
            return ExecuteNonQuery(e => e.DeleteDay(id));
        }

        public ActionResult DeleteInvalidDays()
        {
            return ExecuteNonQuery(e => e.DeleteInvalidDays());
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
                var exceptionMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                return this.Error(exceptionMessage);
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
                var exceptionMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                return this.Error(exceptionMessage);
            }
        }
    }
}
