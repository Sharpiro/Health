using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Health.Core.Entities;

namespace Health.Core.Models.ViewModels
{
    public class MealViewModel
    {
        public int  Id { get; set; }
        public int MealNumber { get; set; }
        public ICollection<MealEntry> MealEntries { get; set; }
        //public MealEntry MealEntries { get; set; }
    }
}
