using GardenTileGame.API.Abstractions;
using GardenTileGame.API.Hubs;
using GardenTileGame.Data;
using GardenTileGame.Data.DTOs;
using GardenTileGame.Data.Infrastructure;
using GardenTileGame.Data.Models;
using GardenTileGame.Data.Routes;
using GardentTileGame.Command;
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
    private readonly GameEngine _gameEngine;

    public GameController(ILogger<GameController> logger,
        GardenTileGameDbContext dbContext,
        IHubContext<GameHub, IGameClient> gameHubContext,
        GameEngine gameEngine) : base()
    {
        _logger = logger;
        _db = dbContext;
        _gameHubContext = gameHubContext;
        _gameEngine = gameEngine;
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
                    UserId = Guid.Parse(dto.UserId),
                    GameLeader = true,
                    GameReady = true,
                    GamePieceColor = "#FF0000"
                }
            }
        };

        _db.Games.Add(game);
        await _db.SaveChangesAsync(cancellationToken);

        await _gameHubContext.Groups.AddToGroupAsync(dto.ConnectionId, game.Id.ToString(), cancellationToken);
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
            //.Where(x => x.GameStatus == GameStatus.Setup)
            .Select(x => x.ToDto())
            .ToListAsync(cancellationToken) ?? new List<GameDto>();

        foreach (var game in games)
        {
            var players = await _db.Players
                .Where(x => x.GameId == game.Id)
                .ToListAsync(cancellationToken);

            game.Players = players.Select(x => x.ToDto()).ToList();
        }

        return Ok(games);
    }

    /// <summary>
    /// Get a list of games the user is playing
    /// </summary>
    /// <param name="gameIds">A list of Game Ids</param>
    [HttpGet("user/{userId}/my-games")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Get))]
    public async Task<ActionResult<IEnumerable<GameDto>>> GetMyGames(Guid userId, CancellationToken cancellationToken)
    {
        var games = (await _db.Players
            .Include(x => x.Game)
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken))
            .Select(x => x.Game.ToDto());

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
        var game = await _db.Games
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (game == null)
        {
            throw new Exception($"Game with ID: {id} could not be found");
        }

        var players = await _db.Players
            .Where(x => x.GameId == id)
            .ToListAsync(cancellationToken);

        game.Players = players;

        return Ok(game.ToDto());
    }

    [HttpGet("users")]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Get))]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers(CancellationToken cancellationToken)
    {
        var userDtos = (await _db.Users.ToListAsync(cancellationToken))
            .Select(x => x.ToDto());

        return Ok(userDtos);
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

        if (!string.IsNullOrEmpty(dto.UserId))
        {
            var players = await _db.Players
                .Where(x => x.GameId == game.Id)
                .ToListAsync(cancellationToken);

            var player = new Player
            {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse(dto.UserId),
                Name = dto.PlayerName,
                GamePieceColor = new List<string> { "#00FF00", "#0000FF", "#00FF66" }.ElementAt(players.Count - 1)
            };

            game.Players.Add(player);

            var playerDto = player.ToDto();
            playerDto.GameId = game.Id;

            await _gameHubContext.Groups.AddToGroupAsync(dto.ConnectionId, game.Id.ToString(), cancellationToken);
            await _gameHubContext.Clients.Group(game.Id.ToString()).NotifyPlayerAdded(playerDto);
        }

        var isNewGameStart = false;

        if (dto.GameStatus != game.GameStatus)
        {
            game.GameStatus = dto.GameStatus;

            if (game.GameStatus == GameStatus.InProgress)
            {
                isNewGameStart = true;
                _gameEngine.MakeGameStartState(game);
            }
        }

        _db.Games.Update(game);
        await _db.SaveChangesAsync(cancellationToken);

        if (isNewGameStart)
        {
            await _gameHubContext.Clients.Group(game.Id.ToString()).NotifyGameStart(game.ToDto());
        }

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
        var player = await _db.Players
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(dto.Id), cancellationToken);

        if (player == null)
        {
            throw new Exception($"Player with ID {dto.Id} could not be found");
        }

        player.Name = dto.Name;
        player.GameReady = dto.GameReady;
        player.GamePieceColor = dto.GamePieceColor;

        _db.Players.Update(player);
        await _db.SaveChangesAsync(cancellationToken);

        await _gameHubContext.Clients.Group(player.GameId.ToString()).NotifyPlayerUpdated(player.ToDto());

        return Ok();
    }
}