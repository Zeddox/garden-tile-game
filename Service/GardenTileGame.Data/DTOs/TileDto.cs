using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class TileDto : BaseDto<Guid>
{
    [Required]
    public TileType Type { get; set; }

    [Required]
    public TileShape Shape { get; set; }

    [Required]
    public int TypePositionX { get; set; }

    [Required]
    public int TypePositionY { get; set; }

    [Required]
    public int TypeQuantity { get; set; }
}