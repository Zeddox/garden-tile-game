using System.ComponentModel;

namespace GardenTileGame.Data;

public enum GameStatus
{
    [Description("Game Setup")]
    Setup,

    [Description("Game In Progress")]
    InProgress,

    [Description("Game Finished")]
    Finished
}

public enum TileType
{
    MapleTree,
    Pagoda,
    Fish,
    AzaleaBush,
    Boxwood,
    Stone
}

public enum TileShape
{
    Single,
    Double,
    Triple,
    Corner
}

public enum TileRotation
{
    Zero,
    Ninety,
    OneHundredEighty,
    TwoHunderedSeventy
}