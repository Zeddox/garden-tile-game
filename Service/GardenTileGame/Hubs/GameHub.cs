using GardenTileGame.API.Abstractions;
using GardenTileGame.Data.Models;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;

namespace GardenTileGame.API.Hubs;

public class GameHub : Hub<IGameClient>
{
    public async Task NotifyGameCreated(Game game)
    {
        await Groups.AddToGroupAsync(game.Players.First().ConnectionId, game.Id.ToString());
        await Clients.All.NotifyGameCreated(game.ToDto());
    }

    public async Task NotifyPlayerAdded(Player player)
    {
        await Groups.AddToGroupAsync(player.ConnectionId, player.GameId.ToString());
        await Clients.Group(player.GameId.ToString()).NotifyPlayerAdded(player.ToDto());
        //await Clients.All.NotifyPlayerAdded(player.ToDto());
    }

    public async Task NotifyGameStart(string gameId)
    {
        await Clients.Group(gameId).NotifyGameStart(gameId);
        //await Clients.All.NotifyGameStart(gameId);
    }

    public async Task NotifyPlayerUpdated(Player player)
    {
        await Clients.Group(player.GameId.ToString()).NotifyPlayerUpdated(player.ToDto());
        //await Clients.All.NotifyPlayerUpdated(player.ToDto());
    }

    public async Task NotifyPlayerConnectionClosed(string connectionId)
    {
        var test = connectionId;
    }

    //public override Task OnDisconnectedAsync(Exception? exception)
    //{
    //    var test = Context.ConnectionId;
    //    return base.OnDisconnectedAsync(exception);
    //}
}
