using System.Collections.Generic;
using Health.Core.Entities;

namespace Health.Core
{
    public static class LINQExtensions
    {
        public static void AddOrUpdate<T>(this IEnumerable<T> list, MealEntry mealEntry)
        {
            using (var context = new HealthContext())
            {
            }
        }
    }
}
