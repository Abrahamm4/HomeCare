namespace HomeCareApi.Models
{
    public class Personnel
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";

        // Link to ASP.NET Identity user (stored as string key)
        public string? AuthUserId { get; set; }

        // Not mapped navigation to avoid cross-context FK (Identity lives in a separate DbContext)
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public AuthUser? AuthUser { get; set; }

        // Navigation property (one-to-many)
        public virtual ICollection<AvailableDay>? AvailableDays { get; set; }
    }
}
