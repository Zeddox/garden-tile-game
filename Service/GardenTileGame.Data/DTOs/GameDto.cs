#nullable disable
using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class GameDto : BaseDto<int>
{
    [Required, MaxLength(64)]
    public string GameName { get; set; }

    [Required]
    public GameStatus GameStatus { get; set; }
}
