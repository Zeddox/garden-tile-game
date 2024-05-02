using GardenTileGame.Data;
using GardenTileGame.Data.DTOs;
using GardenTileGame.Data.Infrastructure;
using GardenTileGame.Data.Models;
using GardenTileGame.Data.Routes;
using Microsoft.AspNetCore.Mvc;

namespace GardenTileGame.API.Controllers;

[Route(ApiRoutes.GamesBase)]
//[Route("[controller]")]
public class GameController : BaseController
{
    private readonly ILogger<GameController> _logger;
    private readonly GardenTileGameDbContext _db;

    public GameController(ILogger<GameController> logger,
        GardenTileGameDbContext dbContext) : base()
    {
        _logger = logger;
        _db = dbContext;
    }
    //public GameController(ILogger<GameController> logger) : base()
    //{
    //    _logger = logger;
    //}

    /// <summary>
    /// Create a new Game.
    /// </summary>
    /// <param name="dto">A Game DTO.</param>
    [HttpPost]
    [ApiConventionMethod(typeof(GardenTileGameApiConventions), nameof(GardenTileGameApiConventions.Post))]
    public async Task<ActionResult> CreateNewGame([FromBody] GameDto dto, CancellationToken cancellationToken)
    {
        var game = new Game
        {
            GameName = dto.GameName,
            GameStatus = GameStatus.Setup
        };

        _db.Games.Add(game);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(CreateNewGame), game.ToDto());
    }
}
