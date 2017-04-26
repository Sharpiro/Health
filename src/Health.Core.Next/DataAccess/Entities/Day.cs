using System;
using System.Collections.Generic;

namespace Health.Core.Next.DataAccess.Entities
{
    internal class Day
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public virtual ICollection<Meal> Meals { get; set; }
    }
}