using Microsoft.AspNetCore.Mvc;
using HomeCareApi.Models;
using HomeCareApi.Repositories;
using HomeCareApi.Dal;

namespace HomeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailableDaysController : ControllerBase
    {
        private readonly IAvailableDayRepository _repo;

        public AvailableDaysController(IAvailableDayRepository repo)
        {
            _repo = repo;
        }

        // GET: api/AvailableDays
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _repo.GetAllAsync();
            return Ok(list);
        }

        // GET: api/AvailableDays/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST: api/AvailableDays
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AvailableDay model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _repo.CreateAsync(model);
            return success ? Ok(model) : BadRequest("Failed to create AvailableDay.");
        }

        // PUT: api/AvailableDays/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AvailableDay model)
        {
            if (id != model.Id) return BadRequest("ID mismatch");

            var success = await _repo.UpdateAsync(model);
            return success ? Ok(model) : BadRequest("Failed to update AvailableDay.");
        }

        // DELETE: api/AvailableDays/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repo.DeleteAsync(id);
            return success ? Ok() : NotFound();
        }
    }
}
