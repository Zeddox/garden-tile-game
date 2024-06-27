#nullable disable

using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class GameDto : BaseDto<Guid>
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }

    public Guid StartingPlayerId { get; set; }

    public List<TileDto> FirstRoundTiles { get; set; }
    public List<TileDto> SecondRoundTiles { get; set; }
    public List<TileDto> ThirdRoundTiles { get; set; }
    public List<TileDto> FourthRoundTiles { get; set; }
    public List<TileDto> FifthRoundTiles { get; set; }
    public List<TileDto> SixthRoundTiles { get; set; }

    public IList<PlayerDto> Players { get; set; }
}

public class CreateGameDto
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public string PlayerName { get; set; }

    [Required]
    public string UserId { get; set; }

    public string ConnectionId { get; set; }
}

public class UpdateGameDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }

    public string PlayerName { get; set; }
    public string UserId { get; set; }
    public string ConnectionId { get; set; }
}