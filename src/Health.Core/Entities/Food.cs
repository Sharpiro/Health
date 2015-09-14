using System.ComponentModel.DataAnnotations;

namespace Health.Core.Entities
{
    public class Food
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int ServingSize { get; set; }
        public int Calories { get; set; }
    }
}
