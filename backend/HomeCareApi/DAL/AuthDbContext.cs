using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using HomeCareApi.Models;

namespace HomeCareApi.DAL
{
    public class AuthDbContext : IdentityDbContext<AuthUser>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }
    }
}
