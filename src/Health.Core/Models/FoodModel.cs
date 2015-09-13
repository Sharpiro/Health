using Newtonsoft.Json;

namespace Health.Core.Models
{
    public class FoodModel
    {
        public string Name { get; set; }
        public int ServingSize { get; set; }
        public int Calories { get; set; }
    }
}
