#nullable disable

using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class PlayerDto : BaseDto<Guid>
{
    [Required]
    public string Name { get; set; }

    [Required]
    public Guid GameId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public bool GameReady { get; set; }

    [Required]
    public bool GameLeader { get; set; }

    [Required]
    public string GamePieceColor { get; set; }
}

public class UpdatePlayerDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string GameId { get; set; }

    [Required]
    public bool GameReady { get; set; }

    [Required]
    public string GamePieceColor { get; set; }
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