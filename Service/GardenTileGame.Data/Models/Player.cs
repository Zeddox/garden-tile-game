#nullable disable

using GardenTileGame.Data.DTOs;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GardenTileGame.Data.Models;

public class Player : BaseModel<Guid>
{
    [Required]
    public string Name { get; set; }

    public Guid GameId { get; set; }

    [ForeignKey(nameof(GameId))]
    public virtual Game Game { get; set; }

    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }

    public bool GameReady { get; set; }

    public bool GameLeader { get; set; }

    public string GamePieceColor { get; set; }

    public int Order { get; set; }
}

public static class PlayerExtensions
{
    public static PlayerDto ToDto(this Player player)
    {
        return new PlayerDto
        {
            Id = player.Id,
            Name = player.Name,
            UserId = player.UserId,
            GameId = player.GameId,
            GameReady = player.GameReady,
            GameLeader = player.GameLeader,
            GamePieceColor = player.GamePieceColor
        };
    }
}