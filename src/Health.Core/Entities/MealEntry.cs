namespace Health.Core.Entities
{
    public class MealEntry
    {
        public int Id { get; set; }
        public int MealEntryNumber { get; set; }
        public int MealId { get; set; }
        public int FoodId { get; set; }
        public virtual Food Food { get; set; }
        public int Calories { get; set; }
    }
}
