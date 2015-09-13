using System.Collections.Generic;
using Health.Core.Entities;

namespace Health.Core.Models
{
    public interface IBusinessService
    {
        List<MealEntry> GetData();
        void AddDefaultData();
        void AddFood(FoodModel food);
        void AddMealEntry(int calories);
    }
}
