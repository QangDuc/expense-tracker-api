using ExpenseTracker.Application.DTOs;

namespace ExpenseTracker.Application.Features.Authentication;

public interface IAuthService
{
    Task<AuthResponse> Register(RegisterRequest r);
    Task<AuthResponse> Login(LoginRequest r);
    Task<AuthResponse> Refresh(string refreshToken);
    Task Logout(string refreshToken);
}
