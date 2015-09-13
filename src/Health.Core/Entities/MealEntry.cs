namespace Health.Core.Entities
{
    public class MealEntry
    {
        public int Id { get; set; }
        public Food Food { get; set; }
        public int Calories { get; set; }
    }
}
