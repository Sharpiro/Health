using System.ComponentModel.DataAnnotations;

namespace Health.Core.Models
{
    public class UserModel
    {
        [Required]
        public string Username { get; set; }
        [Required, DataType(DataType.Password), MinLength(6)]
        public string Password { get; set; }
    }
}
