using System;
using System.Collections.Generic;
using System.Linq;

namespace Health.Core.Next.Models
{
    public class DayDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<MealDto> Meals { get; set; } = new List<MealDto>();
        public int TotalCalories => Meals.SelectMany(m => m.MealEntries.Select(me => me.Calories)).Sum();
    }
}