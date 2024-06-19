using GardenTileGame.Data.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace GardenTileGame.Data.DbContextConfigurations;

public class UserConfigurations : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToContainer("Users")
            .HasNoDiscriminator()
            .HasKey(x => x.Id);
    }
}
