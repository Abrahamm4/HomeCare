using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HomeCareApi.DAL;
using HomeCareApi.Models;
using HomeCareApi.Models.Dto;

namespace HomeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonnelController : BaseApiController
    {
        private readonly IPersonnelRepository _personnels;
        private readonly ILogger<PersonnelController> _logger;

        public PersonnelController(IPersonnelRepository personnels, ILogger<PersonnelController> logger)
        {
            _personnels = personnels;
            _logger = logger;
        }

        private static PersonnelDto ToDto(Personnel p) => new()
        {
            Id = p.Id,
            Name = p.Name
        };

        // GET: api/personnel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonnelDto>>> GetAll()
        {
            var list = await _personnels.GetAllAsync() ?? Enumerable.Empty<Personnel>();
            return Ok(list.OrderBy(p => p.Name).Select(ToDto));
        }

        // GET: api/personnel/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PersonnelDto>> GetById(int id)
        {
            var entity = await _personnels.GetByIdAsync(id);
            if (entity == null) return NotFoundProblem(detail: $"Personnel {id} not found");
            return Ok(ToDto(entity));
        }

        // POST: api/personnel
        [HttpPost]
        public async Task<ActionResult<PersonnelDto>> Create([FromBody] Personnel model)
        {
            if (model == null) return BadRequestProblem();
            if (string.IsNullOrWhiteSpace(model.Name))
                ModelState.AddModelError(nameof(model.Name), "Name is required.");
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var ok = await _personnels.CreateAsync(model);
            if (!ok)
            {
                _logger.LogError("[PersonnelController] Create failed {@Personnel}", model);
                return InternalServerErrorProblem(detail: "Could not create personnel");
            }
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, ToDto(model));
        }

        // PUT: api/personnel/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Personnel model)
        {
            if (model == null || id != model.Id) return BadRequestProblem(detail: "Id mismatch");
            if (string.IsNullOrWhiteSpace(model.Name))
                ModelState.AddModelError(nameof(model.Name), "Name is required.");
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var ok = await _personnels.UpdateAsync(model);
            if (!ok)
            {
                _logger.LogError("[PersonnelController] Update failed {@Personnel}", model);
                return InternalServerErrorProblem(detail: "Could not update personnel");
            }
            return NoContent();
        }

        // DELETE: api/personnel/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _personnels.DeleteAsync(id);
            if (!ok) return NotFoundProblem(detail: $"Personnel {id} not found");
            return NoContent();
        }
    }
}
