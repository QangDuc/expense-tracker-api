using AutoMapper;
using ExpenseTracker.Application.Features.Authentication;
using ExpenseTracker.Application.Features.Budget;
using ExpenseTracker.Application.Features.Category;
using ExpenseTracker.Application.Features.Dashboard;
using ExpenseTracker.Application.Features.Profile;
using ExpenseTracker.Application.Features.Transaction;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Mappings;
using ExpenseTracker.Infrastructure.Identity;
using ExpenseTracker.Infrastructure.Repositories;

namespace ExpenseTracker.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IBudgetRepository, BudgetRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        // Infrastructure
        services.AddScoped<ITokenService, JwtService>();

        // Feature Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IBudgetService, BudgetService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IProfileService, ProfileService>();

        return services;
    }
}
