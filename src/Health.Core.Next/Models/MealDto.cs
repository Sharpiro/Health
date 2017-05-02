using System.Collections.Generic;

namespace Health.Core.Next.Models
{
    public class MealDto
    {
        public int Id { get; set; }
        public int MealNumber { get; set; }
        public int DayId { get; set; }
        public virtual ICollection<MealEntryDto> MealEntries { get; set; }
    }
}