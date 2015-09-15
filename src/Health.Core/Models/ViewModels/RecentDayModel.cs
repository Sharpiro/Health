using System;
using System.Collections.Generic;

namespace Health.Core.Models.ViewModels
{
    public class RecentDayModel
    {
        public DateTime Date { get; set; }
        public IEnumerable<IEnumerable<int>> Meals { get; set; }
    }
}
