using System.ComponentModel.DataAnnotations;

namespace GardenTileGame.Data.DTOs;

public class BaseDto<TType>
{
    [Required]
    public TType Id { get; set; }
}
