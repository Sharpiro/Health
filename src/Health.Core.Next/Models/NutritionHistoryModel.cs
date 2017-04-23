using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace Health.Core.Next.Models
{
    public class NutritionHistoryModel
    {
        public IList<DayOverviewModel> Days { get; set; } = ImmutableList.Create<DayOverviewModel>();
        public int Average => (int)Math.Round(Days.Average(day => day.Calories));
        public int Min => Days.Min(day => day.Calories);
        public int Max => Days.Max(day => day.Calories);
    }
}