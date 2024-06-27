#nullable disable

using GardenTileGame.Data.DTOs;
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.Models;

public class Game : BaseModel<Guid>
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }

    public Guid StartingPlayerId { get; set; }

    public List<Tile> FirstRoundTiles { get; set; }
    public List<Tile> SecondRoundTiles { get; set; }
    public List<Tile> ThirdRoundTiles { get; set; }
    public List<Tile> FourthRoundTiles { get; set; }
    public List<Tile> FifthRoundTiles { get; set; }
    public List<Tile> SixthRoundTiles { get; set; }

    public virtual IList<Player> Players { get; set; }
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
            StartingPlayerId = game?.StartingPlayerId ?? Guid.Empty,
            Players = game.Players.Select(x => x.ToDto()).ToList(),
            FirstRoundTiles = game.FirstRoundTiles?.Select(x => x.ToDto()).ToList() ?? new List<TileDto>(),
            SecondRoundTiles = game.SecondRoundTiles?.Select(x => x.ToDto()).ToList() ?? new List<TileDto>(),
            ThirdRoundTiles = game.ThirdRoundTiles?.Select(x => x.ToDto()).ToList() ?? new List<TileDto>(),
            FourthRoundTiles = game.FourthRoundTiles?.Select(x => x.ToDto()).ToList() ?? new List<TileDto>(),
            FifthRoundTiles = game.FifthRoundTiles?.Select(x => x.ToDto()).ToList() ?? new List<TileDto>(),
            SixthRoundTiles = game.SixthRoundTiles?.Select(x => x.ToDto()).ToList() ?? new List<TileDto>(),
        };
    }
}