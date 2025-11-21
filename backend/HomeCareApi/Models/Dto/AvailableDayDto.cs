namespace HomeCareApi.Models.Dto
{
 public class AvailableDayDto
 {
 public int Id { get; set; }
 public int PersonnelId { get; set; }
 public DateTime Date { get; set; }
 public TimeSpan StartTime { get; set; }
 public TimeSpan EndTime { get; set; }
 public bool IsBooked { get; set; }
 }
}
