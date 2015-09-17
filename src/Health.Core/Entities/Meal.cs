using System;
using System.Collections.Generic;

namespace Health.Core.Entities
{
    //public class Meal
    //{
    //    public int Id { get; set; }
    //    public int MealNumber { get; set; }
    //    public DateTime DayId { get; set; }
    //    public virtual Day Day { get; set; }
    //}
    public class Meal
    {
        public int Id { get; set; }
        public int MealNumber { get; set; }
        public DateTime DayId { get; set; }
        public virtual ICollection<MealEntry> MealEntries { get; set; }
    }
}
