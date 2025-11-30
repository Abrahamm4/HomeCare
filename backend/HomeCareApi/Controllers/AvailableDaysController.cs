using Microsoft.AspNetCore.Mvc;
using HomeCareApi.DAL;
using HomeCareApi.Models;
using HomeCareApi.Models.Dto;

namespace HomeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailableDaysController : BaseApiController
    {
        private readonly IAvailableDayRepository _days;
        private readonly IPersonnelRepository _personnel;
        private readonly ILogger<AvailableDaysController> _logger;

        public AvailableDaysController(
            IAvailableDayRepository days,
            IPersonnelRepository personnel,
            ILogger<AvailableDaysController> logger)
        {
            _days = days;
            _personnel = personnel;
            _logger = logger;
        }

        private static AvailableDayDto ToDto(AvailableDay d) => new()
        {
            Id = d.Id,
            PersonnelId = d.PersonnelId,
            Date = d.Date,
            StartTime = d.StartTime,
            EndTime = d.EndTime,
            IsBooked = d.Appointment != null
        };

        // GET: api/availabledays
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AvailableDayDto>>> GetAll()
        {
            var list = await _days.GetAllWithRelationsAsync() ?? Enumerable.Empty<AvailableDay>();
            return Ok(list.OrderBy(d => d.Date).ThenBy(d => d.StartTime).Select(ToDto));
        }

        // GET: api/availabledays/free
        [HttpGet("free")]
        public async Task<ActionResult<IEnumerable<AvailableDayDto>>> GetFree()
        {
            var list = await _days.GetFreeAsync() ?? Enumerable.Empty<AvailableDay>();
            return Ok(list.OrderBy(d => d.Date).ThenBy(d => d.StartTime).Select(ToDto));
        }

        // GET: api/availabledays/free/by-date?date=2025-11-12
        [HttpGet("free/by-date")]
        public async Task<ActionResult<IEnumerable<AvailableDayDto>>> GetFreeByDate([FromQuery] DateTime date)
        {
            var list = await _days.GetFreeByDateAsync(date) ?? Enumerable.Empty<AvailableDay>();
            return Ok(list.OrderBy(d => d.StartTime).Select(ToDto));
        }

        // GET: api/availabledays/free/by-personnel/3
        [HttpGet("free/by-personnel/{personnelId:int}")]
        public async Task<ActionResult<IEnumerable<AvailableDayDto>>> GetFreeByPersonnel(int personnelId)
        {
            var list = await _days.GetFreeByPersonnelAsync(personnelId) ?? Enumerable.Empty<AvailableDay>();
            return Ok(list.OrderBy(d => d.Date).ThenBy(d => d.StartTime).Select(ToDto));
        }

        // GET: api/availabledays/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AvailableDayDto>> GetById(int id)
        {
            var day = await _days.GetByIdWithRelationsAsync(id);
            if (day == null) return NotFoundProblem(detail: $"AvailableDay {id} not found");
            return Ok(ToDto(day));
        }

        // GET: api/availabledays/by-date?date=2025-11-12
        [HttpGet("by-date")]
        public async Task<ActionResult<IEnumerable<AvailableDayDto>>> GetByDate([FromQuery] DateTime date)
        {
            var all = await _days.GetAllWithRelationsAsync() ?? Enumerable.Empty<AvailableDay>();
            var list = all.Where(d => d.Date.Date == date.Date);
            return Ok(list.OrderBy(d => d.StartTime).Select(ToDto));
        }

        // GET: api/availabledays/by-personnel/3
        [HttpGet("by-personnel/{personnelId:int}")]
        public async Task<ActionResult<IEnumerable<AvailableDayDto>>> GetByPersonnel(int personnelId)
        {
            var all = await _days.GetAllWithRelationsAsync() ?? Enumerable.Empty<AvailableDay>();
            var list = all.Where(d => d.PersonnelId == personnelId);
            return Ok(list.OrderBy(d => d.Date).ThenBy(d => d.StartTime).Select(ToDto));
        }

        // POST: api/availabledays
        [HttpPost]
        public async Task<ActionResult<AvailableDayDto>> Create([FromBody] AvailableDay model)
        {
            // basic validation
            if (model.Date.Date < DateTime.Today)
                ModelState.AddModelError(nameof(model.Date), "Date cannot be a past date.");
            if (model.EndTime <= model.StartTime)
                ModelState.AddModelError(nameof(model.EndTime), "EndTime must be after StartTime.");

            // overlap validation for same personnel and date
            var currentSlots = await _days.GetAllAsync() ?? new List<AvailableDay>();
            var sameDaySlots = currentSlots
                .Where(s => s.PersonnelId == model.PersonnelId && s.Date.Date == model.Date.Date)
                .ToList();
            var overlap = sameDaySlots.Any(s => (model.StartTime < s.EndTime) && (s.StartTime < model.EndTime));
            if (overlap)
                ModelState.AddModelError(string.Empty, "Timeslot overlaps with an existing slot for this personnel.");

            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var ok = await _days.CreateAsync(model);
            if (!ok)
            {
                _logger.LogError("[AvailableDaysController] Create failed {@AvailableDay}", model);
                return InternalServerErrorProblem(detail: "Could not create available day");
            }

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, ToDto(model));
        }

        // PUT: api/availabledays/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AvailableDay model)
        {
            if (id != model.Id) return BadRequestProblem(detail: "Id mismatch");

            if (model.Date.Date < DateTime.Today)
                ModelState.AddModelError(nameof(model.Date), "Date cannot be a past date.");
            if (model.EndTime <= model.StartTime)
                ModelState.AddModelError(nameof(model.EndTime), "EndTime must be after StartTime.");

            var currentSlots = await _days.GetAllAsync() ?? new List<AvailableDay>();
            var sameDaySlots = currentSlots
                .Where(s => s.PersonnelId == model.PersonnelId && s.Date.Date == model.Date.Date && s.Id != model.Id)
                .ToList();
            var overlap = sameDaySlots.Any(s => (model.StartTime < s.EndTime) && (s.StartTime < model.EndTime));
            if (overlap)
                ModelState.AddModelError(string.Empty, "Timeslot overlaps with an existing slot for this personnel.");

            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var ok = await _days.UpdateAsync(model);
            if (!ok)
            {
                _logger.LogError("[AvailableDaysController] Update failed {@AvailableDay}", model);
                return InternalServerErrorProblem(detail: "Could not update available day");
            }

            return NoContent();
        }

        // DELETE: api/availabledays/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _days.DeleteAsync(id);
            if (!ok) return NotFoundProblem(detail: $"AvailableDay {id} not found");
            return NoContent();
        }
    }
}
