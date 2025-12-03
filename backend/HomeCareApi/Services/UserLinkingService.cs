using HomeCareApi.DAL;
using HomeCareApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeCareApi.Services
{
 public class UserLinkingService
 {
 private readonly HomeCareDbContext _db;

 public UserLinkingService(HomeCareDbContext db)
 {
 _db = db;
 }

 // Auto-create a Patient profile for a newly registered Identity user
 public async Task<Patient> CreatePatientProfileAsync(AuthUser user)
 {
 // Ensure no duplicate profile for the same auth user
 var existing = await _db.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.AuthUserId == user.Id);
 if (existing != null)
 {
 return existing;
 }

 var patient = new Patient
 {
 Name = user.UserName ?? user.Email ?? "",
 Email = user.Email,
 Phone = null,
 AuthUserId = user.Id
 };

 _db.Patients.Add(patient);
 await _db.SaveChangesAsync();
 return patient;
 }
 }
}
