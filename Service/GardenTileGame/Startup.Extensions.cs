using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Azure.Cosmos;
using Microsoft.EntityFrameworkCore;
using NSwag;

namespace GardenTileGame.API;

public static class StartupExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        return serviceCollection;
    }

    public static IServiceCollection AddDbConnections<TContext>(this IServiceCollection serviceCollection, IConfiguration configuration, string environment) where TContext : DbContext
    {
        var connectionString = configuration.GetConnectionString("Database");
        if (connectionString == null)
        {
            throw new ArgumentException($"'ConnectionStrings:Database' is not defined in ConfigurationManager");
        }

        var databaseName = configuration.GetValue<string>("Cosmos:DatabaseName");

        if (databaseName == null)
        {
            throw new ArgumentException($"'Cosmos:DatabaseName' is not defined in ConfigurationManager");
        }

        // TODO: 
        // Implement extension methods and use constants
        if (environment.Equals("Test"))
        {
            return serviceCollection;
        }
        else
        {
            return serviceCollection.AddDbContext<TContext>(options => options
                .UseLazyLoadingProxies()
                .UseCosmos(connectionString, databaseName: databaseName));
        }
    }

    public static IServiceCollection AddOpenApi(this IServiceCollection serviceCollection, int apiVersion, string apiTitle)
    {
        return serviceCollection.AddOpenApiDocument(config =>
        {
            config.PostProcess = document =>
            {
                document.Info.Version = $"v{apiVersion}";
                document.Info.Title = apiTitle;
                document.Info.Contact = new NSwag.OpenApiContact
                {
                    Name = "Garden Tile Game Admins",
                    Email = "andrew.joung@gmail.com",
                    Url = "https://github.com/Zeddox/garden-tile-game"
                };
            };

            // NOTES: Not quite sure if we need this yet
            //config.AddSecurity("Bearer", new List<string>(), new OpenApiSecurityScheme
            //{
            //    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            //    Name = "Authorization",
            //    In = OpenApiSecurityApiKeyLocation.Header,
            //    Type = OpenApiSecuritySchemeType.ApiKey
            //});
        });
    }

    /// <summary>7
    /// Configure Cross-Origin Request Sharing (CORS) options
    /// </summary>
    /// <param name="serviceCollection">Source object of extension method</param>
    /// <param name="configuration">App configuration.</param>
    /// <param name="env">Hosting environment</param>
    /// <returns>Same object that went in</returns>
    public static IServiceCollection AddCors(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        return serviceCollection.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", opts => opts
                .WithOrigins(new[] { configuration.GetValue<string>("ClientUrl")! })
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
        });
    }

    /// <summary>
    /// Startup extension method to add the default mvc services and our custom filters
    /// </summary>
    /// <param name="serviceCollection">Source object of extension method</param>
    /// <returns>Same object that went in</returns>
    public static IMvcCoreBuilder AddMvcWithOptions(this IServiceCollection serviceCollection)
    {
        return serviceCollection
            .AddMvcCore()
            .AddApiExplorer()
            .AddAuthorization()
            .AddFormatterMappings()
            .AddDataAnnotations()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            });
    }

    /// <summary>
    /// Configure HTTP Headers to improve the security of the API
    /// </summary>
    /// <param name="app">Source object of extension method</param>
    /// <returns>Same object that went in</returns>
    public static IApplicationBuilder ConfigureSecurityHeaders(this IApplicationBuilder app)
    {
        // https://github.com/andrewlock/NetEscapades.AspNetCore.SecurityHeaders#customising-the-security-headers-added-to-reponses
        return app.UseSecurityHeaders(policy =>
        {
            policy.AddDefaultSecurityHeaders();
            policy.AddContentSecurityPolicy(builder =>
            {
                builder.AddObjectSrc().None();
                builder.AddFormAction().Self();
                builder.AddFrameAncestors().Self();
            });
            policy.RemoveServerHeader();
        });
    }

    /// <summary>
    /// Ensure routing redirects to the front-end for non-API requests
    /// </summary>
    /// <param name="app">Source object of extension method</param>
    /// <returns>Same object that went in</returns>
    public static IApplicationBuilder RouteNonApiCallsToClient(this IApplicationBuilder app)
    {
        return app
            .UseStatusCodePagesWithReExecute("/")
            .Use(async (ctx, next) =>
            {
                if (ctx.Request.Path.HasValue && ctx.Request.Path.Value.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
                {
                    var statusCodeFeature = ctx.Features.Get<IStatusCodePagesFeature>();
                    if (statusCodeFeature?.Enabled == true)
                    {
                        statusCodeFeature.Enabled = false;
                    }
                }

                await next();
            });
    }
}
