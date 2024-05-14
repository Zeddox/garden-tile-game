
using GardenTileGame.API.Hubs;
using GardenTileGame.Data;

namespace GardenTileGame.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using IServiceScope scope = host.Services.CreateScope();

            try
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<GardenTileGameDbContext>();
                dbContext.Database.EnsureCreated();
                host.Run();
            }
            catch (Exception ex)
            {
                scope.ServiceProvider.GetRequiredService<ILogger<Program>>()
                    .LogCritical(ex, ex.Message);
                throw;
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host
                .CreateDefaultBuilder(args)
                .ConfigureLogging(loggingBuilder =>
                {
                    loggingBuilder.ClearProviders();
                    loggingBuilder.AddConsole();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var env = webBuilder.GetSetting("ENVIRONMENT");
                    if (env == null)
                    {
                        throw new Exception("Environment variable ASPNETCORE_ENVIRONMENT cannot be null or empty");
                    }

                    webBuilder.ConfigureKestrel(serverOptions => serverOptions.AddServerHeader = false);
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureAppConfiguration((hostBuilder, configBuilder) =>
                {
                    configBuilder.AddUserSecrets<Startup>();
                    configBuilder.Build();
                });
        }
    }
}
