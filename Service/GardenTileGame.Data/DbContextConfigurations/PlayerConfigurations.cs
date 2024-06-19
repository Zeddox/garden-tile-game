using GardenTileGame.Data.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace GardenTileGame.Data.DbContextConfigurations;

public class PlayerConfigurations : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder.ToContainer("Players")
            .HasNoDiscriminator()
            .HasKey(x => x.Id);

        builder.HasOne(x => x.Game)
            .WithMany(x => x.Players)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany(x => x.Players)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
