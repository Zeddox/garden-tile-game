#nullable disable

namespace GardenTileGame.Data.DTOs;

public class PlayerDto: BaseDto<Guid>
{
    public string Name { get; set; }
    public Guid GameId { get; set; }
}
