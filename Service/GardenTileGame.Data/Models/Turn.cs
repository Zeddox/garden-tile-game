using GardenTileGame.Data.DTOs;

namespace GardenTileGame.Data.Models;

public class Turn
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

public static class TurnExtensions
{
    public static TurnDto ToDto(this Turn turn)
    {
        return new TurnDto
        {
            Round = turn.Round,
            TurnNumber = turn.TurnNumber,
            PlayerId = turn.PlayerId,
            TileId = turn.TileId,
            PositionX = turn.PositionX,
            PositionY = turn.PositionY,
            Rotation = turn.Rotation,
            Layer = turn.Layer
        };
    }
}