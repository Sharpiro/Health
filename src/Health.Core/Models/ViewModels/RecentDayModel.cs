using System;
using System.Collections.Generic;

namespace Health.Core.Models.ViewModels
{
    public class RecentDayModel
    {
        public int DayId { get; set; }
        public DateTime Date { get; set; }
        public int Total { get; set; }
        public IEnumerable<IEnumerable<dynamic>> Meals { get; set; }
    }
}
