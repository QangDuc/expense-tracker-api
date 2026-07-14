using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ExpenseTracker.API.Tests;

public sealed class ApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Login_endpoint_is_exposed()
    {
        var r = await factory.CreateClient()
            .PostAsJsonAsync("/auth/login", new { email = "nobody@example.com", password = "secret1" });
        Assert.NotEqual(System.Net.HttpStatusCode.NotFound, r.StatusCode);
    }

    [Fact]
    public async Task Transaction_endpoint_requires_authentication()
    {
        var r = await factory.CreateClient().GetAsync("/transactions");
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, r.StatusCode);
    }
}
