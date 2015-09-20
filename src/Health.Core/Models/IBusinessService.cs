using System;
using System.Collections.Generic;
using Health.Core.Entities;
using Health.Core.Models.ViewModels;

namespace Health.Core.Models
{
    public interface IBusinessService
    {
        List<MealEntry> GetData();
        void AddDefaultData();
        Food GetFoodByName(string foodName);
        object GetNutritionTable();
        RecentDayModel GetMostRecentDay();
        ICollection<Day> GetAllData();
        void AddFood(params Food[] food);
        void AddMealEntry(string foodName, int calories, int mealId);
        void AddMeal(MealModel mealModel);
        void AddDay();
        void ClearDay();
        void DeleteDay(DateTime date);
    }
}
