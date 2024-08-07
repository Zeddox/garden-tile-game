namespace GardenTileGame.Data.DTOs;

public class TurnDto
{
    public int Round { get; set; }

    public int TurnNumber { get; set; }

    public Guid PlayerId { get; set; }

    public Guid TileId { get; set; }

    public int PositionX { get; set; }

    public int PositionY { get; set; }

    public TileRotation Rotation { get; set; }

    public int Layer { get; set; }
}