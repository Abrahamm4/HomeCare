using Microsoft.EntityFrameworkCore;
using HomeCareApi.Models;

namespace HomeCareApi.DAL
{
 public class HomeCareDbContext : DbContext
 {
 public DbSet<AvailableDay> AvailableDays { get; set; }
 public DbSet<Personnel> Personnels { get; set; }
 public DbSet<Appointment> Appointments { get; set; }
 public DbSet<Patient> Patients { get; set; }

 protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
 {
 if (!optionsBuilder.IsConfigured)
 {
 optionsBuilder.UseLazyLoadingProxies();
 }
 }

 public HomeCareDbContext(DbContextOptions<HomeCareDbContext> options)
 : base(options)
 {
 }

 protected override void OnModelCreating(ModelBuilder modelBuilder)
 {
 // Configure one-to-one: AvailableDay <-> Appointment
 modelBuilder.Entity<AvailableDay>()
 .HasOne(d => d.Appointment)
 .WithOne(a => a.AvailableDay)
 .HasForeignKey<Appointment>(a => a.AvailableDayId)
 .OnDelete(DeleteBehavior.Cascade);

 base.OnModelCreating(modelBuilder);
 }
 }
}
