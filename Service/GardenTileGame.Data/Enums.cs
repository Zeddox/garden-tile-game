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
    Stone,
    Pass
}

public enum TileShape
{
    Single,
    Double,
    Triple,
    Corner,
    Pass
}

public enum TileRotation
{
    Zero,
    Ninety,
    OneHundredEighty,
    TwoHunderedSeventy,
    Pass
}