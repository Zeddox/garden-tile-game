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
using System.Data;

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
    public async Task<ActionResult<GameDto>> CreateNewGame([FromBody] CreateGameDto dto, CancellationToken cancellationToken)
    {
        var game = new Game
        {
            Id = Guid.NewGuid(),
            GameName = dto.GameName,
            GameStatus = GameStatus.Setup,
            Players = new List<Player>
            {
                new Player
                {
                    Id = Guid.NewGuid(),
                    Name = dto.PlayerName,
                    GameLeader = true,
                    GameReady = true,
                    ConnectionId = dto.PlayerConnectionId
                }
            }
        };

        _db.Games.Add(game);
        await _db.SaveChangesAsync(cancellationToken);

        await _gameHubContext.Groups.AddToGroupAsync(game.Players.First().ConnectionId, game.Id.ToString(), cancellationToken);
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
            .ToListAsync(cancellationToken) ?? new List<GameDto>();

        return Ok(games);
    }

    /// <summary>
    /// Get a list of games the user is playing
    /// </summary>
    /// <param name="gameIds">A list of Game Ids</param>
    [HttpPost("my-games")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Get))]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetMyGames([FromBody] IEnumerable<string> gameIds, CancellationToken cancellationToken)
    {
        var games = await _db.Games
            .Where(x => gameIds.Any(y => Guid.Parse(y) == x.Id))
            .Select(x => x.ToDto())
            .ToListAsync(cancellationToken) ?? new List<GameDto>();

        return Ok(games);
    }
    /// <summary>
    /// Get Game by ID
    /// </summary>
    /// <returns>The Game</returns>
    [HttpGet("{id}")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Get))]
    public async Task<ActionResult<GameDto>> GetGameById(Guid id, CancellationToken cancellationToken)
    {
        var game = await _db.Games.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (game == null)
        {
            throw new Exception($"Game with ID: {id} could not be found");

        }

        return Ok(game.ToDto());
    }

    /// <summary>
    /// Get Game by ID
    /// </summary>
    /// <returns>The Game</returns>
    [HttpGet("{gameId}/players/{connectionId}")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Get))]
    public async Task<ActionResult<PlayerDto>> GetPlayerByConnectionId(Guid gameId, string connectionId, CancellationToken cancellationToken)
    {
        var game = await _db.Games.FirstOrDefaultAsync(x => x.Id == gameId, cancellationToken);

        if (game == null)
        {
            throw new Exception($"Game with ID: {gameId} could not be found");

        }

        var player = game.Players.FirstOrDefault(x => x.ConnectionId == connectionId);

        if (player == null)
        {
            throw new Exception($"Player with ID: {connectionId} could not be found");

        }

        return Ok(player.ToDto());
    }

    /// <summary>
    /// Create a new Game.
    /// Client is notified of Game creation via SignalR
    /// </summary>
    /// <param name="dto">A Game DTO.</param>
    [HttpPut]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Put))]
    public async Task<ActionResult> UpdateGame([FromBody] UpdateGameDto dto, CancellationToken cancellationToken)
    {
        var game = await _db.Games.FirstOrDefaultAsync(x => x.Id == Guid.Parse(dto.Id), cancellationToken);

        if (game == null)
        {
            throw new Exception($"Game {dto.Id} could not be found");
        }

        if (!string.IsNullOrEmpty(dto.PlayerName))
        {
            var player = new Player
            {
                Id = Guid.NewGuid(),
                Name = dto.PlayerName,
                ConnectionId = dto.PlayerConnectionId
            };

            game.Players.Add(player);

            var playerDto = player.ToDto();
            playerDto.GameId = game.Id;

            await _gameHubContext.Groups.AddToGroupAsync(player.ConnectionId, game.Id.ToString(), cancellationToken);
            await _gameHubContext.Clients.Group(game.Id.ToString()).NotifyPlayerAdded(playerDto);
        }

        if (dto.GameStatus != game.GameStatus)
        {
            game.GameStatus = dto.GameStatus;

            if (game.GameStatus == GameStatus.InProgress)
            {
                await _gameHubContext.Clients.Group(game.Id.ToString()).NotifyGameStart(game.Id.ToString());
            }
        }

        _db.Games.Update(game);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok();
    }

    /// <summary>
    /// Create a new Game.
    /// Client is notified of Game creation via SignalR
    /// </summary>
    /// <param name="dto">A Game DTO.</param>
    [HttpPut("player")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Put))]
    public async Task<ActionResult> UpdatePlayer([FromBody] UpdatePlayerDto dto, CancellationToken cancellationToken)
    {
        var game = await _db.Games.FirstOrDefaultAsync(x => x.Id == Guid.Parse(dto.GameId), cancellationToken);

        if (game == null)
        {
            throw new Exception($"Game with ID {dto.GameId} could not be found");
        }

        var player = game.Players.FirstOrDefault(x => x.Id == Guid.Parse(dto.Id));

        if (player == null)
        {
            throw new Exception($"Player with ID {dto.Id} could not be found");
        }

        player.GameReady = dto.GameReady;

        _db.Games.Update(game);
        await _db.SaveChangesAsync(cancellationToken);

        await _gameHubContext.Clients.Group(game.Id.ToString()).NotifyPlayerUpdated(player.ToDto());

        return Ok();
    }

    /// <summary>
    /// Create a new Game.
    /// Client is notified of Game creation via SignalR
    /// </summary>
    /// <param name="dto">A Game DTO.</param>
    [HttpPut("players/{connectionId}")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.PutReturnsDto))]
    public async Task<ActionResult<IEnumerable<PlayerDto>>> UpdatePlayersConnectionIds(string connectionId, [FromBody] string newConnectionId, CancellationToken cancellationToken)
    {
        var games = (await _db.Games
            .ToListAsync(cancellationToken))
            .Where(x => x.Players.Any(y => y.ConnectionId == connectionId));

        var players = games.SelectMany(x => x.Players).Where(x => x.ConnectionId == connectionId).ToList();
        players.ForEach(async (player) => 
        {
            await _gameHubContext.Groups.RemoveFromGroupAsync(connectionId, player.GameId.ToString());
            await _gameHubContext.Groups.AddToGroupAsync(newConnectionId, player.GameId.ToString());

            player.ConnectionId = newConnectionId; 
        });

        _db.Games.UpdateRange(games);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(players.Select(x => x.ToDto()));
    }
}
