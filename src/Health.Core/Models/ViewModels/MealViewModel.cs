﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Health.Core.Entities;

namespace Health.Core.Models.ViewModels
{
    public class MealViewModel
    {
        public IEnumerable<int> MealEntries { get; set; }
    }
}
