#nullable disable

using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class GameDto : BaseDto<Guid>
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }

    [Required]
    public Guid StartingPlayerId { get; set; }

    [Required]
    public List<TileDto> FirstRoundTiles { get; set; }

    [Required]
    public List<TileDto> SecondRoundTiles { get; set; }

    [Required]
    public List<TileDto> ThirdRoundTiles { get; set; }

    [Required]
    public List<TileDto> FourthRoundTiles { get; set; }

    [Required]
    public List<TileDto> FifthRoundTiles { get; set; }

    [Required]
    public List<TileDto> SixthRoundTiles { get; set; }

    [Required]
    public IList<PlayerDto> Players { get; set; }

    [Required]
    public List<TurnDto> Turns { get; set; }
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