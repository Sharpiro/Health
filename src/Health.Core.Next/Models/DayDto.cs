using System;
using System.Collections.Generic;
using Health.Core.Next.DataAccess.Entities;

namespace Health.Core.Next.Models
{
    public class DayDto
    {
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public virtual ICollection<MealDto> Meals { get; set; }
    }
}