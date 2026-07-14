using System.Text;
using ExpenseTracker.API.Extensions;
using ExpenseTracker.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;

var b = WebApplication.CreateBuilder(args);
var connectionString = b.Configuration.GetConnectionString("SqlServer");
var jwtKey = b.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("The SqlServer connection string must be configured.");

if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException("The Jwt:Key signing key must be configured.");

b.Host.UseSerilog((_, _, c) => c.WriteTo.Console());

b.Services.AddDbContext<ExpenseTrackerDbContext>(o =>
    o.UseSqlServer(connectionString));

b.Services.AddApplicationServices();

b.Services.AddControllers();
b.Services.AddEndpointsApiExplorer();
b.Services.AddSwaggerGen();

Microsoft.AspNetCore.Authentication.AuthenticationBuilder authenticationBuilder = b.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.MapInboundClaims = false;

        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),

            ValidateIssuer = false,
            ValidateAudience = false,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            NameClaimType = JwtRegisteredClaimNames.Sub
        };
    });

b.Services.AddAuthorization();
b.Services.AddCors(o =>
    o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = b.Build();

app.UseSerilogRequestLogging();
app.UseMiddleware<ExpenseTracker.API.Middleware.ExceptionMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { }
