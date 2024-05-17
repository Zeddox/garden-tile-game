using GardenTileGame.Data.DTOs;

namespace GardenTileGame.API.Abstractions;

public interface IGameClient
{
    Task NotifyGameCreated(GameDto game);
    Task NotifyPlayerAdded(PlayerDto player);
}
