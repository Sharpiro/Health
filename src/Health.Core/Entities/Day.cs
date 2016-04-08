using System;
using System.Collections.Generic;

namespace Health.Core.Entities
{
    //public class Day
    //{
    //    public DateTime Created { get; set; }
    //}
    public class Day
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public virtual ICollection<Meal> Meals { get; set; }
    }
}
