﻿using System;
using System.Collections.Generic;

namespace Health.Core.Models.ViewModels
{
    public class RecentDayModel
    {
        public DateTime Date { get; set; }
        public int Total { get; set; }
        public IEnumerable<IEnumerable<dynamic>> Meals { get; set; }
    }
}
