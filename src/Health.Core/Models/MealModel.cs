using System;
using System.Collections.Generic;
using Health.Core.Entities;

namespace Health.Core.Models
{
    public class MealModel
    {
        public DateTime Date { get; set; }
        public int MealNumber { get; set; }
        public ICollection<MealEntry> MealEntries { get; set; }
    }
}
