using System.ComponentModel.DataAnnotations;

namespace Health.Core.Next.Models
{
    public class MealEntryDto
    {
        public int Id { get; set; }
        public int MealEntryNumber { get; set; }
        public int MealId { get; set; }
        public int FoodId { get; set; }
        public virtual FoodDto Food { get; set; }
        [Range(0, 2000, ErrorMessage = "Value must be between 0 and 2000")]
        public int Calories { get; set; }
    }
}
