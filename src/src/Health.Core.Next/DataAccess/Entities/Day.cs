using System;
using System.Collections.Generic;

namespace Health.Core.Next.DataAccess.Entities
{
    public class Day
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();
    }
}