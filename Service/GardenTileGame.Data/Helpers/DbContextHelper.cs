using GardenTileGame.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GardenTileGame.Data.Helpers;

public static class DbContextHelper
{
    public static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(GetUsers(new List<string> { "Andrew", "Brandon", "Brooks", "Aaron" }));
    }

    private static List<User> GetUsers(IList<string> names)
    {
        return names.Select(x => new User { Id = Guid.NewGuid(), Name = x, Players = new List<Player>() }).ToList();
    }
}
