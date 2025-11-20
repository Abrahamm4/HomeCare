using System.ComponentModel.DataAnnotations;

namespace HomeCareApi.Models.Dto
{
 // Input model when a patient books an appointment using an existing AvailableDay
 public class BookAppointmentRequest
 {
 [Required]
 public int AvailableDayId { get; set; }

 [Required]
 public int PatientId { get; set; }

 [StringLength(200)]
 public string? Notes { get; set; }
 }

 // Minimal data we return to clients (no heavy navigation graphs)
 public class AppointmentDto
 {
 public int AppointmentId { get; set; }
 public int? PatientId { get; set; }
 public int PersonnelId { get; set; }
 public int AvailableDayId { get; set; }
 public DateTime Date { get; set; }
 public string? Notes { get; set; }
 }
}
