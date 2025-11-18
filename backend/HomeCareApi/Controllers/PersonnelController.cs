using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HomeCareApi.DAL;
using HomeCareApi.Models;

namespace HomeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonnelController : ControllerBase
    {
        private readonly IPersonnelRepository _personnels;
        private readonly ILogger<PersonnelController> _logger;

        public PersonnelController(IPersonnelRepository personnels, ILogger<PersonnelController> logger)
        {
            _personnels = personnels;
            _logger = logger;
        }

        // GET: api/personnel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Personnel>>> GetAll()
        {
            var list = await _personnels.GetAllAsync() ?? Enumerable.Empty<Personnel>();
            return Ok(list.OrderBy(p => p.Name));
        }

        // GET: api/personnel/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Personnel>> GetById(int id)
        {
            var entity = await _personnels.GetByIdAsync(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

        // POST: api/personnel
        [HttpPost]
        public async Task<ActionResult<Personnel>> Create([FromBody] Personnel model)
        {
            if (model == null) return BadRequest();
            if (string.IsNullOrWhiteSpace(model.Name))
                ModelState.AddModelError(nameof(model.Name), "Name is required.");
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var ok = await _personnels.CreateAsync(model);
            if (!ok)
            {
                _logger.LogError("[PersonnelController] Create failed {@Personnel}", model);
                return Problem("Could not create personnel");
            }
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        // PUT: api/personnel/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Personnel model)
        {
            if (model == null || id != model.Id) return BadRequest("Id mismatch");
            if (string.IsNullOrWhiteSpace(model.Name))
                ModelState.AddModelError(nameof(model.Name), "Name is required.");
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var ok = await _personnels.UpdateAsync(model);
            if (!ok)
            {
                _logger.LogError("[PersonnelController] Update failed {@Personnel}", model);
                return Problem("Could not update personnel");
            }
            return NoContent();
        }

        // DELETE: api/personnel/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _personnels.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
