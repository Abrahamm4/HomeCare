using Microsoft.EntityFrameworkCore;
using HomeCareApi.Models;

namespace HomeCareApi.DAL
{
    public class AppDbContext : DbContext
    {
        public DbSet<AvailableDay> AvailableDays { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }
    }
}
