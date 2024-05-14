using GardenTileGame.API.Abstractions;
using GardenTileGame.Data.Models;
using Microsoft.AspNetCore.SignalR;

namespace GardenTileGame.API.Hubs;

public class GameHub : Hub<IGameClient>
{
    public async Task NotifyGameCreated(Game game)
    {
        await Clients.All.NotifyGameCreated(game.ToDto());
    }
}
