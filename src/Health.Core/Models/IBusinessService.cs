using System;
using System.Collections.Generic;
using Health.Core.Entities;

namespace Health.Core.Models
{
    public interface IBusinessService
    {
        List<MealEntry> GetData();
        void AddDefaultData();
        object GetMostRecentDay();
        void AddFood(FoodModel food);
        void AddMealEntry(string foodName, int calories, int mealId);
        void AddMeal(DateTime date, int mealNumber);
        void AddDay();
    }
}
