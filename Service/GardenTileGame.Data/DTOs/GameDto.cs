#nullable disable
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class GameDto : BaseDto<Guid>
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }

    public IList<PlayerDto> Players { get; set; }
}

public class CreateGameDto
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public string PlayerName { get; set; }
}

public class UpdateGameDto
{
    [Required]
    public string Id { get; set; }
    [Required]
    public GameStatus GameStatus { get; set; }
    public string PlayerName { get; set; }
}