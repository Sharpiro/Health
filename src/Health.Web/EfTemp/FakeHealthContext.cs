using Health.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace Health.Web.EFTemp
{
    public class FakeHealthContext : IdentityDbContext
    {
        public static string ConnectionString;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
#if DEBUG
            ConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=Health;Trusted_Connection=True;";
#endif
            optionsBuilder.UseSqlServer(ConnectionString);
        }
    }
}
