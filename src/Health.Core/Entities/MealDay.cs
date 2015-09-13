using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Health.Core.Entities
{
    public class MealDay
    {
        public int MealId { get; set; }
        public int DayId { get; set; }
    }
}
