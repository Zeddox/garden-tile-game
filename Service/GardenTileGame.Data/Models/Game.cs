#nullable disable
using GardenTileGame.Data.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Net.NetworkInformation;

namespace GardenTileGame.Data.Models;

public class Game : BaseModel<Guid>
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }

    public IList<Player> Players { get; set; }
}

public static class GameExtensions
{
    public static GameDto ToDto(this Game game)
    {
        return new GameDto
        {
            Id = game.Id,
            GameName = game.GameName,
            GameStatus = game.GameStatus,
            Players = game.Players.Select(x => x.ToDto()).ToList()
        };
    }
}
