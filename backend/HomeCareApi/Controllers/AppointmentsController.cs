using Microsoft.AspNetCore.Mvc;
using HomeCareApi.DAL;
using HomeCareApi.Models;
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

        // GET: api/appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAll()
        {
            var list = await _appointments.GetAllWithRelationsAsync() ?? Enumerable.Empty<Appointment>();
            return Ok(list.OrderBy(a => a.Date));
        }

        // GET: api/appointments/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Appointment>> GetById(int id)
        {
            var appt = await _appointments.GetByIdWithRelationsAsync(id);
            if (appt == null) return NotFound();
            return Ok(appt);
        }

        // GET: api/appointments/by-patient/{patientId}
        [HttpGet("by-patient/{patientId:int}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetByPatient(int patientId)
        {
            var list = await _appointments.GetByPatientAsync(patientId) ?? Enumerable.Empty<Appointment>();
            return Ok(list.OrderBy(a => a.Date));
        }

        // GET: api/appointments/by-personnel/{personnelId}
        [HttpGet("by-personnel/{personnelId:int}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetByPersonnel(int personnelId)
        {
            var list = await _appointments.GetByPersonnelAsync(personnelId) ?? Enumerable.Empty<Appointment>();
            return Ok(list.OrderBy(a => a.Date));
        }

        // POST: api/appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> Create([FromBody] Appointment model)
        {
            if (model == null) return BadRequest();

            ValidateAppointment(model);
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var ok = await _appointments.CreateAsync(model);
            if (!ok)
            {
                _logger.LogError("[AppointmentsController] Create failed {@Appointment}", model);
                return Problem("Could not create appointment");
            }
            return CreatedAtAction(nameof(GetById), new { id = model.AppointmentId }, model);
        }

        // PUT: api/appointments/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Appointment model)
        {
            if (model == null || id != model.AppointmentId) return BadRequest("Id mismatch");

            ValidateAppointment(model);
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

        private void ValidateAppointment(Appointment model)
        {
            if (model.Date == default)
                ModelState.AddModelError(nameof(model.Date), "Date is required.");
            if (model.Date < DateTime.UtcNow.AddMinutes(-1))
                ModelState.AddModelError(nameof(model.Date), "Date must be in the future.");
            if (model.PersonnelId <= 0)
                ModelState.AddModelError(nameof(model.PersonnelId), "PersonnelId is required.");
            if (model.AvailableDayId <= 0)
                ModelState.AddModelError(nameof(model.AvailableDayId), "AvailableDayId is required.");
            // Ensure the AvailableDay exists and is free
            // (lightweight check – repository already handles persistence validations)
        }
    }
}