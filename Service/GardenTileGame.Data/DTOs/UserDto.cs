using GardenTileGame.Data.DTOs;
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.Models;

public class UserDto : BaseDto<Guid>
{
    [Required]
    public string Name { get; set; }
    public virtual IEnumerable<Player> Players { get; set; }
}
