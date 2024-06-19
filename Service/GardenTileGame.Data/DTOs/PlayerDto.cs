#nullable disable

using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class PlayerDto: BaseDto<Guid>
{
    public string Name { get; set; }
    public Guid GameId { get; set; }
    public Guid UserId { get; set; }
    public bool GameReady { get; set; }
    public bool GameLeader { get; set; }
}

public class UpdatePlayerDto
{
    [Required]
    public string Id { get; set; }
    [Required]
    public string GameId { get; set; }
    [Required]
    public bool GameReady { get; set; }
}

public class UpdatePlayerConnectionIdDto
{
    [Required]
    public string Id { get; set; }
    [Required]
    public string GameId { get; set; }
    [Required]
    public string OldConnectionId { get; set; }
    [Required]
    public string NewConnectionId { get; set; }
}