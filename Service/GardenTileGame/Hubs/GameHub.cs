using GardenTileGame.API.Abstractions;
using GardenTileGame.Data;
using GardenTileGame.Data.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Numerics;

namespace GardenTileGame.API.Hubs;

public class GameHub : Hub<IGameClient>
{
    private readonly GardenTileGameDbContext _db;

    public GameHub(GardenTileGameDbContext db)
    {

        _db = db;
    }

    public async Task NewConnectionMade(string userId)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(userId));

        var gameIds = await _db.Players
            .Where(x => x.UserId == Guid.Parse(userId))
            .Select(x => x.GameId.ToString())
            .Distinct()
            .ToListAsync();

        if (user == null)
        {
            throw new Exception($"User with ID: {userId} could not be found");
        }

        foreach (var game in gameIds)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, game);
        }
    }
}
