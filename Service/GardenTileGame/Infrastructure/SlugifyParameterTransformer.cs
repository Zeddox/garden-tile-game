namespace GardenTileGame.API.Infrastructure;

using Microsoft.AspNetCore.Routing;
using System.Text.RegularExpressions;

// Reference: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-3.1#use-a-parameter-transformer-to-customize-token-replacement
public class SlugifyParameterTransformer : IOutboundParameterTransformer
{
    public string TransformOutbound(object value)
    {
        return value == null
            ? null
            : Regex.Replace(value.ToString()!, "([a-z])([A-Z])", "$1-$2").ToLower();
    }
}
