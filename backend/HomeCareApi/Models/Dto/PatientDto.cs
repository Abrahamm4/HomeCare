using System.ComponentModel.DataAnnotations;

namespace HomeCareApi.Models.Dto
{
 public class PatientDto
 {
 public int PatientId { get; set; }
 public string Name { get; set; } = string.Empty;
 public string? Phone { get; set; }
 public string? Email { get; set; }
 }
}
