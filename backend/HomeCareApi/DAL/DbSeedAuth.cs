using HomeCareApi.Models;
using Microsoft.AspNetCore.Identity;

namespace HomeCareApi.DAL
{
    public static class DbSeedAuth
    {
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "Personnel", "Patient" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        public static async Task SeedUsers(UserManager<AuthUser> userManager)
        {
            await CreateUserIfNotExists(userManager,
                username: "admin",
                email: "admin@homecare.com",
                password: "Admin123!",
                role: "Admin");

            await CreateUserIfNotExists(userManager,
                username: "personnel",
                email: "personnel@homecare.com",
                password: "Personnel123!",
                role: "Personnel");
        }

        private static async Task CreateUserIfNotExists(
            UserManager<AuthUser> userManager,
            string username,
            string email,
            string password,
            string role)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new AuthUser
                {
                    UserName = username,
                    Email = email
                };

                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
                else
                {
                    throw new Exception(
                        $"Failed to create {role} user: " +
                        $"{string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}
