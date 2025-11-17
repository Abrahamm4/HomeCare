using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeCareApi.Models;
using HomeCareApi.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HomeCareApi.Repositories
{public class AvailableDayRepository : IAvailableDayRepository
{
    private readonly AppDbContext _db;
    private readonly ILogger<AvailableDayRepository> _logger;

    public AvailableDayRepository(AppDbContext db, ILogger<AvailableDayRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<AvailableDay>?> GetAllAsync()
    {
        try
        {
            var list = await _db.AvailableDays.AsNoTracking().ToListAsync();
            return list.OrderBy(d => d.Date).ThenBy(d => d.StartTime);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "[AvailableDayRepository] GetAllAsync failed");
            return null;
        }
    }

    public async Task<AvailableDay?> GetByIdAsync(int id)
    {
        try
        {
            return await _db.AvailableDays.FindAsync(id);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "[AvailableDayRepository] GetByIdAsync failed for Id {AvailableDayId:0000}", id);
            return null;
        }
    }

    public async Task<bool> CreateAsync(AvailableDay day)
    {
        try
        {
            _db.AvailableDays.Add(day);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "[AvailableDayRepository] CreateAsync failed {@AvailableDay}", day);
            return false;
        }
    }

    public async Task<bool> UpdateAsync(AvailableDay day)
    {
        try
        {
            _db.AvailableDays.Update(day);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "[AvailableDayRepository] UpdateAsync failed {@AvailableDay}", day);
            return false;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var entity = await _db.AvailableDays.FindAsync(id);
            if (entity == null)
            {
                _logger.LogError("[AvailableDayRepository] DeleteAsync failed, not found Id {AvailableDayId:0000}", id);
                return false;
            }

            _db.AvailableDays.Remove(entity);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "[AvailableDayRepository] DeleteAsync failed for Id {AvailableDayId:0000}", id);
            return false;
        }
    }
}

}
