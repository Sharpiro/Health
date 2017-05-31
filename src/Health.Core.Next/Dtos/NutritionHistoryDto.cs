using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace Health.Core.Next.Dtos
{
    public class NutritionHistoryDto
    {
        public IEnumerable<DayOverviewDto> Days { get; set; } = ImmutableList.Create<DayOverviewDto>();
        public int Average
        {
            get
            {
                if (!Days.Any()) return 0;
                return (int)Math.Round(Days.Average(day => day.Calories));
            }
        }
        public int Min
        {
            get
            {
                if (!Days.Any()) return 0;
                return Days.Min(day => day.Calories);
            }
        }
        public int Max
        {
            get
            {
                if (!Days.Any()) return 0;
                return Days.Max(day => day.Calories);
            }
        }
    }
}