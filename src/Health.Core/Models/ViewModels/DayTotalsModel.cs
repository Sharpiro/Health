using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Health.Core.Models.ViewModels
{
    public class DayTotalsModel
    {
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fat { get; set; }
    }
}
