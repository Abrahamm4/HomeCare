using Microsoft.AspNetCore.Mvc;
using HomeCareApi.DAL;
using HomeCareApi.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace HomeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientRepository _repo;
        private readonly ILogger<PatientController> _logger;

        public PatientController(IPatientRepository repo, ILogger<PatientController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        // GET: api/patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetAll()
        {
            var patients = await _repo.GetAllAsync() ?? Enumerable.Empty<Patient>();
            return Ok(patients);
        }

        // GET: api/patient/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Patient>> GetById(int id)
        {
            var patient = await _repo.GetByIdAsync(id);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        // POST: api/patient
        [HttpPost]
        public async Task<ActionResult<Patient>> Create([FromBody] Patient model)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var success = await _repo.CreateAsync(model);
            if (!success)
            {
                _logger.LogError("[PatientController] Create failed for {@Patient}", model);
                return Problem("Could not create patient");
            }
            return CreatedAtAction(nameof(GetById), new { id = model.PatientId }, model);
        }

        // PUT: api/patient/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Patient model)
        {
            if (id != model.PatientId) return BadRequest("Id mismatch");
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var success = await _repo.UpdateAsync(model);
            if (!success) return Problem("Could not update patient");
            return NoContent();
        }

        // DELETE: api/patient/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repo.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
