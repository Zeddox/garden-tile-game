#nullable disable
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.Models
{
    public abstract class BaseModel<TTYpe>
    {
        [Key]
        public TTYpe Id { get; set; }
    }
}
