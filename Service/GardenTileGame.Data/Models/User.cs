using GardenTileGame.Data.DTOs;
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.Models;

public class User: BaseModel<Guid>
{
    [Required]
    public string Name { get; set; }
    public virtual IEnumerable<Player> Players { get; set; }
}

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name
        };
    }
}