using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeCareApi.Models
{
    public class Patient
    {
        public int PatientId { get; set; }

        [Required, StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        // Link to ASP.NET Identity user (string key). Optional for seeded/demo data.
        public string? AuthUserId { get; set; }

        // Not mapped navigation to avoid cross-context FK (Identity lives in a separate DbContext)
        [NotMapped]
        public AuthUser? AuthUser { get; set; }

        // Navigation property: one patient can have many appointments
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
