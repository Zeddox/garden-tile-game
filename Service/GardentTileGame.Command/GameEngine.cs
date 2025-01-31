using GardenTileGame.Data;
using GardenTileGame.Data.Constants;

namespace GardentTileGame.Command;

public class GameEngine
{
    public void MakeGameStartState(Game game)
    {
        if (game.Players.Count <= 1)
        {
            throw new InvalidDataException("Players must be greater than 1");
        }

        var random = new Random();
        var playerOrder = game.Players.ToArray();
        random.Shuffle(playerOrder);
        for (int i = 0; i < playerOrder.Length; i++)
        {
            var player = game.Players.Single(x => x.Id == playerOrder[i].Id);
            player.Order = i + 1;
        }
        game.StartingPlayerId = playerOrder[0].Id;

        var roundTiles = MakeTilesForRounds(game.Players.Count == 4 ? 4 : game.Players.Count == 3 ? 5 : 6);
        game.FirstRoundTiles = roundTiles.GetValueOrDefault(1);
        game.SecondRoundTiles = roundTiles.GetValueOrDefault(2);
        game.ThirdRoundTiles = roundTiles.GetValueOrDefault(3);
        game.FourthRoundTiles = roundTiles.GetValueOrDefault(4);
        game.FifthRoundTiles = roundTiles.GetValueOrDefault(5);
        game.SixthRoundTiles = roundTiles.GetValueOrDefault(6);
    }

    public Tile MakePassTile()
    {
        return new Tile
        {
            Id = Guid.Empty,
            Shape = TileShape.Pass,
            Type = TileType.Pass,
            TypePositionX = -1,
            TypePositionY = -1,
            TypeQuantity = 0,
        };
    }

    public Dictionary<int, List<Tile>> MakeTilesForRounds(int numberOfRounds)
    {
        var random = new Random();
        (int Singles, int Doubles, int Triples, int Corners) perRoundTileCounts = (numberOfRounds == 4) ? (8, 8, 4, 4) : numberOfRounds == 3 ? (6, 6, 3, 3) : (4, 4, 2, 2);

        var singleTiles = GameTiles.Singles.ToArray();
        random.Shuffle(singleTiles);
        var doubleTiles = GameTiles.Doubles.ToArray();
        random.Shuffle(doubleTiles);
        var tripleTiles = GameTiles.Triples.ToArray();
        random.Shuffle(tripleTiles);
        var cornerTiles = GameTiles.Corners.ToArray();
        random.Shuffle(cornerTiles);

        return Enumerable.Range(1, numberOfRounds).Select(round => new
        {
            Round = round,
            Tiles = new List<Tile>()
                .Concat(singleTiles.Skip(perRoundTileCounts.Singles * (round - 1)).Take(perRoundTileCounts.Singles))
                .Concat(doubleTiles.Skip(perRoundTileCounts.Doubles * (round - 1)).Take(perRoundTileCounts.Doubles))
                .Concat(tripleTiles.Skip(perRoundTileCounts.Triples * (round - 1)).Take(perRoundTileCounts.Triples))
                .Concat(cornerTiles.Skip(perRoundTileCounts.Corners * (round - 1)).Take(perRoundTileCounts.Corners))
                .ToList()
        })
         .ToDictionary(x => x.Round, x => x.Tiles);
    }
}