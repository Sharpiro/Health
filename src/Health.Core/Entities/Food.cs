using System.ComponentModel.DataAnnotations;

namespace Health.Core.Entities
{
    public class Food
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Fat { get; set; }
        public int Carbs { get; set; }
        public int? Sugar { get; set; }
        public int ServingSize { get; set; }
        public string ServingName { get; set; }
        public int? Fiber { get; set; }
        public int? Sodium { get; set; }
        public int? Potassium { get; set; }
    }
}
