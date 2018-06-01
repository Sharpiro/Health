using System;
using System.Collections.Generic;

namespace Health.Core.Next.Dtos
{
    public class MacroTimingDto
    {
        public IEnumerable<(int Macros, DateTime TimeStamp, int Calories)> CarbsList { get; set; }
        public IEnumerable<(int Macros, DateTime TimeStamp, int Calories)> FatList { get; set; }
        public IEnumerable<(int Macros, DateTime TimeStamp, int Calories)> ProteinList { get; set; }
    }
}