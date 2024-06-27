namespace GardenTileGame.Data.DTOs;

public class TileDto
{
    public TileType Type { get; set; }

    public TileShape Shape { get; set; }

    public int TypePositionX { get; set; }
    public int TypePositionY { get; set; }
    public int TypeQuantity { get; set; }
}