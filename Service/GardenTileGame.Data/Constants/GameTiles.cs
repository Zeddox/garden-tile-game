using GardenTileGame.Data.Models;

namespace GardenTileGame.Data.Constants;

public static class GameTiles
{
    private static readonly List<TileType> Types = new List<TileType> { TileType.MapleTree, TileType.Pagoda, TileType.Fish, TileType.AzaleaBush, TileType.Stone };

    public static List<Tile> Singles = new List<Tile>()
        .Concat(Enumerable.Range(1, 6).Select((_) => new Tile { Type = TileType.MapleTree, Shape = TileShape.Single, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 1 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.Pagoda, Shape = TileShape.Single, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 1 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.Fish, Shape = TileShape.Single, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 1 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.AzaleaBush, Shape = TileShape.Single, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 1 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.Boxwood, Shape = TileShape.Single, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 1 }))
        .Concat(Enumerable.Range(1, 6).Select((_) => new Tile { Type = TileType.Stone, Shape = TileShape.Single, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 1 }))
        .ToList();

    public static List<Tile> Doubles = new List<Tile>()
        .Concat(Enumerable.Range(1, 6).Select((_) => new Tile { Type = TileType.MapleTree, Shape = TileShape.Double, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 2 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.Pagoda, Shape = TileShape.Double, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 2 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.Fish, Shape = TileShape.Double, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 2 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.AzaleaBush, Shape = TileShape.Double, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 2 }))
        .Concat(Enumerable.Range(1, 5).Select((_) => new Tile { Type = TileType.Boxwood, Shape = TileShape.Double, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 2 }))
        .Concat(Enumerable.Range(1, 6).Select((_) => new Tile { Type = TileType.Stone, Shape = TileShape.Double, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 2 }))
        .ToList();

    public static List<Tile> Triples = new List<Tile>()
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.MapleTree, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 1, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 2).Select((_) => new Tile { Type = TileType.Pagoda, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 1, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 2).Select((_) => new Tile { Type = TileType.Fish, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 1, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 2).Select((_) => new Tile { Type = TileType.AzaleaBush, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 1, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 2).Select((_) => new Tile { Type = TileType.Boxwood, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 1, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.Stone, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 1, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.MapleTree, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.Pagoda, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.Fish, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.AzaleaBush, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.Boxwood, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 1).Select((_) => new Tile { Type = TileType.Stone, Shape = TileShape.Triple, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .ToList();

    public static List<Tile> Corners = new List<Tile>()
        .Concat(Enumerable.Range(1, 2).Select((_) => new Tile { Type = TileType.MapleTree, Shape = TileShape.Corner, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 3).Select((_) => new Tile { Type = TileType.Pagoda, Shape = TileShape.Corner, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 3).Select((_) => new Tile { Type = TileType.Fish, Shape = TileShape.Corner, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 3).Select((_) => new Tile { Type = TileType.AzaleaBush, Shape = TileShape.Corner, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 3).Select((_) => new Tile { Type = TileType.Boxwood, Shape = TileShape.Corner, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .Concat(Enumerable.Range(1, 2).Select((_) => new Tile { Type = TileType.Stone, Shape = TileShape.Corner, TypePositionX = 0, TypePositionY = 0, TypeQuantity = 3 }))
        .ToList();
}