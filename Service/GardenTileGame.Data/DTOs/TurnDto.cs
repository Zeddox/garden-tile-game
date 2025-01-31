using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class TurnDto
{
    [Required]
    public int Round { get; set; }

    [Required]
    public int TurnNumber { get; set; }

    [Required]
    public Guid PlayerId { get; set; }

    [Required]
    public Guid TileId { get; set; }

    [Required]
    public int PositionX { get; set; }

    [Required]
    public int PositionY { get; set; }

    [Required]
    public TileRotation Rotation { get; set; }

    [Required]
    public int Layer { get; set; }
}