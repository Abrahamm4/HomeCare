using HomeCareApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HomeCareApi.DAL
{
    public interface IPersonnelRepository
    {
        //Basis CRUD/spørringer
        Task<IEnumerable<Personnel>?> GetAllAsync();
        Task<Personnel?> GetByIdAsync(int id);

        //Fremtidige metoder for full CRUD, hvis vi trenger det
        Task<bool> CreateAsync(Personnel personnel);
        Task<bool> UpdateAsync(Personnel personnel);
        Task<bool> DeleteAsync(int id);
    }
}
