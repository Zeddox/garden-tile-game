using GardenTileGame.API.Abstractions;
using GardenTileGame.API.Hubs;
using GardenTileGame.Data;
using GardenTileGame.Data.DTOs;
using GardenTileGame.Data.Infrastructure;
using GardenTileGame.Data.Models;
using GardenTileGame.Data.Routes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GardenTileGame.API.Controllers;

[Route(ApiRoutes.GamesBase)]
public class GameController : BaseController
{
    private readonly ILogger<GameController> _logger;
    private readonly GardenTileGameDbContext _db;
    private readonly IHubContext<GameHub, IGameClient> _gameHubContext;

    public GameController(ILogger<GameController> logger,
        GardenTileGameDbContext dbContext,
        IHubContext<GameHub, IGameClient> gameHubContext) : base()
    {
        _logger = logger;
        _db = dbContext;
        _gameHubContext = gameHubContext;
    }

    /// <summary>
    /// Create a new Game.
    /// Client is notified of Game creation via SignalR
    /// </summary>
    /// <param name="dto">A Game DTO.</param>
    [HttpPost]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Post))]
    public async Task<ActionResult<GameDto>> CreateNewGame([FromBody] GameDto dto, CancellationToken cancellationToken)
    {
        var game = new Game
        {
            Id = dto.Id,
            GameName = dto.GameName,
            GameStatus = GameStatus.Setup
        };

        _db.Games.Add(game);
        await _db.SaveChangesAsync(cancellationToken);

        await _gameHubContext.Clients.All.NotifyGameCreated(game.ToDto());

        return CreatedAtAction(nameof(CreateNewGame), game.ToDto());
    }

    /// <summary>
    /// Create a new Game.
    /// Client is notified of Game creation via SignalR
    /// </summary>
    /// <returns>A list of active games</returns>
    [HttpGet]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Get))]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetAllJoinableGames(CancellationToken cancellationToken)
    {
        var games = await _db.Games
            .Where(x => x.GameStatus == GameStatus.Setup)
            .Select(x => x.ToDto())
            .ToListAsync(cancellationToken);

        return Ok(games);
    }
}
