using System;
using System.Collections.Generic;

namespace Health.Core.Next.Models
{
    public class RecentDayDto
    {
        public int DayId { get; set; }
        public DateTime Date { get; set; }
        public int Total { get; set; }
        public IEnumerable<IEnumerable<(int FoodId, int Calories)>> Meals { get; set; }
    }
}