using GardenTileGame.API.Infrastructure;
using GardenTileGame.Data;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace GardenTileGame.API;

public class Startup
{
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _environment;

    public Startup(IConfiguration configuration, IHostEnvironment environment)
    {
        _configuration = configuration;
        _environment = environment;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services
            .AddMvc(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
            });

        services
            .AddResponseCompression()
            .AddDbConnections<GardenTileGameDbContext>(_configuration, _environment.EnvironmentName)
            .AddServices(_configuration)
            .AddProblemDetails()
            .AddCors(_configuration)
            .AddOpenApi(1, "CAMP API")
            .AddMvcWithOptions()
            .AddControllersAsServices()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            });
    }
    public void Configure(IApplicationBuilder app)
    {
        app.ConfigureSecurityHeaders();
        app
            .UseSecurityHeaders()
            .RouteNonApiCallsToClient()
            //.UseHeaderPropagation()
            .UseResponseCompression()
            .UseFileServer()
            .UseOpenApi()
            .UseSwaggerUi(config =>
            {
                config.AdditionalSettings.Add("displayRequestDuration", true);
                config.TransformToExternalPath = (url, request) =>
                {
                    // stupid hack to get the UI to properly find the relative path of the swagger json instead of absolute path.
                    return url.EndsWith(".json") || request.Path.ToString().EndsWith("/") ? ".." + url : request.PathBase + "." + url;
                };
            }).UseRouting()
            .UseAuthentication()
            .UseAuthorization()
            .UseCors("CorsPolicy")
            .UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
    }
}
