using HomeCareApi.DAL;
using HomeCareApi.Models;
using HomeCareApi.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointments;
        private readonly IAvailableDayRepository _days;
        private readonly IPatientRepository _patients;
        private readonly IPersonnelRepository _personnels;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(
            IAppointmentRepository appointments,
            IAvailableDayRepository days,
            IPatientRepository patients,
            IPersonnelRepository personnels,
            ILogger<AppointmentsController> logger)
        {
            _appointments = appointments;
            _days = days;
            _patients = patients;
            _personnels = personnels;
            _logger = logger;
        }

        private static AppointmentDto ToDto(Appointment a) => new()
        {
            AppointmentId = a.AppointmentId,
            PatientId = a.PatientId,
            PersonnelId = a.PersonnelId,
            AvailableDayId = a.AvailableDayId,
            Date = a.Date,
            Notes = a.Notes
        };

        // GET: api/appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            var list = await _appointments.GetAllAsync() ?? Enumerable.Empty<Appointment>();
            return Ok(list.OrderBy(a => a.Date).Select(ToDto));
        }

        // GET: api/appointments/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AppointmentDto>> GetById(int id)
        {
            var appt = await _appointments.GetByIdAsync(id);
            if (appt == null) return NotFound();
            return Ok(ToDto(appt));
        }

        // GET: api/appointments/by-patient/{patientId}
        [HttpGet("by-patient/{patientId:int}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByPatient(int patientId)
        {
            var list = await _appointments.GetByPatientAsync(patientId) ?? Enumerable.Empty<Appointment>();
            return Ok(list.OrderBy(a => a.Date).Select(ToDto));
        }

        // GET: api/appointments/by-personnel/{personnelId}
        [HttpGet("by-personnel/{personnelId:int}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByPersonnel(int personnelId)
        {
            var list = await _appointments.GetByPersonnelAsync(personnelId) ?? Enumerable.Empty<Appointment>();
            return Ok(list.OrderBy(a => a.Date).Select(ToDto));
        }

        // POST: api/appointments (Booking endpoint)
        // Patient books using an AvailableDay id. Marks the slot as booked by creating the appointment linked to that AvailableDay.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> Book([FromBody] BookAppointmentRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            // Validate patient exists
            var patient = await _patients.GetByIdAsync(request.PatientId);
            if (patient == null) return NotFound($"Patient {request.PatientId} not found");

            // Validate available day exists and is free
            var day = await _days.GetByIdWithRelationsAsync(request.AvailableDayId);
            if (day == null) return NotFound($"AvailableDay {request.AvailableDayId} not found");
            if (day.Appointment != null) return Conflict("This slot is already booked");

            var appt = new Appointment
            {
                Date = day.Date,
                Notes = request.Notes,
                PatientId = request.PatientId,
                PersonnelId = day.PersonnelId,
                AvailableDayId = day.Id
            };

            var ok = await _appointments.CreateAsync(appt);
            if (!ok)
            {
                _logger.LogError("[AppointmentsController] Book failed {@Appointment}", appt);
                return Problem("Could not book appointment");
            }

            return CreatedAtAction(nameof(GetById), new { id = appt.AppointmentId }, ToDto(appt));
        }

        // PUT: api/appointments/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Appointment model)
        {
            if (model == null || id != model.AppointmentId) return BadRequest("Id mismatch");
            if (model.Date == default)
                ModelState.AddModelError(nameof(model.Date), "Date is required.");
            if (model.PersonnelId <= 0)
                ModelState.AddModelError(nameof(model.PersonnelId), "PersonnelId is required.");
            if (model.AvailableDayId <= 0)
                ModelState.AddModelError(nameof(model.AvailableDayId), "AvailableDayId is required.");
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var ok = await _appointments.UpdateAsync(model);
            if (!ok)
            {
                _logger.LogError("[AppointmentsController] Update failed {@Appointment}", model);
                return Problem("Could not update appointment");
            }
            return NoContent();
        }

        // DELETE: api/appointments/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _appointments.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}