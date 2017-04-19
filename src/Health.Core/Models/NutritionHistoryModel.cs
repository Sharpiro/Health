using System;
using System.Collections.Generic;

namespace Health.Core.Models
{
    public class NutritionHistoryModel
    {
        public IEnumerable<DayOverviewModel> Days { get; set; }
        public int Average { get; set; }
        public int Min { get; set; }
        public int Max { get; set; }
    }

    public class DayOverviewModel
    {
        public int Calories { get; set; }
        public DateTime Date { get; set; }
    }
}
