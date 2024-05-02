using GardenTileGame.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GardenTileGame.Data.DbContextConfigurations;

public class GameConfigurations : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.ToContainer("Games")
            .HasNoDiscriminator()
            .HasKey(g => g.Id);

        builder.Property(x => x.GameStatus)
            .HasConversion(x => (int)x, x => (GameStatus)x);
    }
}
