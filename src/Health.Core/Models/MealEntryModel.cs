using System.ComponentModel.DataAnnotations;

namespace Health.Core.Models
{
    public class MealEntryModel
    {
        public string FoodName { get; set; }
        [Range(0, 2000)]
        public int Calories { get; set; }
        public int MealId { get; set; }
    }
}
