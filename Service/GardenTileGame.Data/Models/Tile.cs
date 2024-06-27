using GardenTileGame.Data.DTOs;

namespace GardenTileGame.Data.Models;

public class Tile
{
    public TileType Type { get; set; }

    public TileShape Shape { get; set; }

    public int TypePositionX { get; set; }
    public int TypePositionY { get; set; }
    public int TypeQuantity { get; set; }
}

public static class TileExtensions
{
    public static TileDto ToDto(this Tile tile)
    {
        return new TileDto
        {
            Type = tile.Type,
            Shape = tile.Shape,
            TypePositionX = tile.TypePositionX,
            TypePositionY = tile.TypePositionY,
            TypeQuantity = tile.TypeQuantity
        };
    }
}