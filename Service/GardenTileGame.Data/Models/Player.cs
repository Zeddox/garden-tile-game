#nullable disable

using GardenTileGame.Data.DTOs;
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.Models;
public class Player : BaseModel<Guid>
{
    [Required]
    public string Name { get; set; }

    public Guid GameId { get; set; }

}

public static class PlayerExtensions
{
    public static PlayerDto ToDto(this Player player)
    {
        return new PlayerDto
        {
            Id = player.Id,
            Name = player.Name,
            GameId = player.GameId
        };
    }
}