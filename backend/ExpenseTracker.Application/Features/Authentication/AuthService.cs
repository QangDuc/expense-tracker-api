using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Validators;
using ExpenseTracker.Domain.Entities;
using FluentValidation;

namespace ExpenseTracker.Application.Features.Authentication;

public sealed class AuthService(
    IUserRepository users,
    IRefreshTokenRepository tokens,
    ITokenService jwt) : IAuthService
{
    public async Task<AuthResponse> Register(RegisterRequest r)
    {
        await new RegisterValidator().ValidateAndThrowAsync(r);
        if (await users.ByEmail(r.Email) != null)
            throw new Domain.Exceptions.ValidationException("Email already exists");
        var u = new User
        {
            FullName = r.FullName,
            Email = r.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(r.Password)
        };
        await users.Add(u);
        await users.Save();
        return await Issue(u);
    }

    public async Task<AuthResponse> Login(LoginRequest r)
    {
        await new LoginValidator().ValidateAndThrowAsync(r);
        var u = await users.ByEmail(r.Email)
            ?? throw new Domain.Exceptions.UnauthorizedException("Invalid credentials");
        if (!BCrypt.Net.BCrypt.Verify(r.Password, u.PasswordHash))
            throw new Domain.Exceptions.UnauthorizedException("Invalid credentials");
        return await Issue(u);
    }

    public async Task<AuthResponse> Refresh(string value)
    {
        await new RefreshTokenValidator().ValidateAndThrowAsync(new RefreshRequest(value));
        var r = await tokens.Find(value);
        if (r is null || r.Revoked || r.ExpiredAt <= DateTime.UtcNow)
            throw new Domain.Exceptions.UnauthorizedException("Invalid refresh token");
        r.Revoked = true;
        await tokens.Save();
        return await Issue(await users.Get(r.UserId)
            ?? throw new Domain.Exceptions.UnauthorizedException("User unavailable"));
    }

    public async Task Logout(string value)
    {
        var r = await tokens.Find(value);
        if (r != null)
        {
            r.Revoked = true;
            await tokens.Save();
        }
    }

    private async Task<AuthResponse> Issue(User u)
    {
        var rt = jwt.CreateRefreshToken();
        await tokens.Add(new RefreshToken
        {
            UserId = u.Id,
            Token = rt,
            ExpiredAt = DateTime.UtcNow.AddDays(7)
        });
        await tokens.Save();
        return new AuthResponse(jwt.CreateAccessToken(u), rt, u.Id, u.FullName, u.Email);
    }
}
