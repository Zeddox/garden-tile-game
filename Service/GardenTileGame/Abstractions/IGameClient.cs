using GardenTileGame.Data.DTOs;

namespace GardenTileGame.API.Abstractions;

public interface IGameClient
{
    Task NotifyGameCreated(GameDto game);

    Task NotifyPlayerAdded(PlayerDto player);

    Task NotifyGameStart(GameDto game);

    Task NotifyPlayerUpdated(PlayerDto player);

    Task NotifyPlayersConnectionIdUpdated(IEnumerable<UpdatePlayerConnectionIdDto> players);

    Task NotifyGameTurnRecorded(Guid gameId, TurnDto turn);
}