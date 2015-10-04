using System;
using System.Collections.Generic;

namespace Health.Core.Entities
{
    public class Meal
    {
        public int Id { get; set; }
        public int MealNumber { get; set; }
        public int DayId { get; set; }
        public virtual ICollection<MealEntry> MealEntries { get; set; }
    }
}
