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
