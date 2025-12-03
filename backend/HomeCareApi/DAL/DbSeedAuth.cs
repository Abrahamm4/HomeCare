using HomeCareApi.Models;
using Microsoft.AspNetCore.Identity;
using HomeCareApi.DAL;
using Microsoft.EntityFrameworkCore;

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
                username: "personnel1",
                email: "personnel1@homecare.com",
                password: "Personnel1!",
                role: "Personnel");

            await CreateUserIfNotExists(userManager,
                username: "personnel2",
                email: "personnel2@homecare.com",
                password: "Personnel2!",
                role: "Personnel");

            await CreateUserIfNotExists(userManager,
                username: "patient1",
                email: "patient1@homecare.com",
                password: "Patient1!",
                role: "Patient");

            await CreateUserIfNotExists(userManager,
                username: "patient2",
                email: "patient2@homecare.com",
                password: "Patient2!",
                role: "Patient");
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

        // Link Identity users to domain entities for testing/demo
        public static async Task SeedLinkedProfiles(UserManager<AuthUser> userManager, HomeCareDbContext db)
        {
            // Patients: every Identity user in Patient role gets a Patient with AuthUserId
            var patientUsers = await userManager.GetUsersInRoleAsync("Patient");
            foreach (var user in patientUsers)
            {
                var exists = await db.Patients.AsNoTracking().AnyAsync(p => p.AuthUserId == user.Id);
                if (!exists)
                {
                    db.Patients.Add(new Patient
                    {
                        Name = user.UserName ?? user.Email ?? "",
                        Email = user.Email,
                        Phone = null,
                        AuthUserId = user.Id
                    });
                }
            }

            // Personnel: Identity users in Personnel role get a Personnel with AuthUserId
            var personnelUsers = await userManager.GetUsersInRoleAsync("Personnel");
            foreach (var user in personnelUsers)
            {
                var exists = await db.Personnels.AsNoTracking().AnyAsync(p => p.AuthUserId == user.Id);
                if (!exists)
                {
                    db.Personnels.Add(new Personnel
                    {
                        Name = user.UserName ?? user.Email ?? "",
                        AuthUserId = user.Id
                    });
                }
            }

            await db.SaveChangesAsync();
        }
    }
}
