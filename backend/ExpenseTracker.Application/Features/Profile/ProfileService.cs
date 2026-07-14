using AutoMapper;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Validators;
using FluentValidation;

namespace ExpenseTracker.Application.Features.Profile;

public sealed class ProfileService(
    IUserRepository users,
    IMapper mapper) : IProfileService
{
    public async Task<UserResponse> Profile(Guid id)
    {
        EnsureValidUserId(id);
        var u = await users.Get(id) ?? throw new Domain.Exceptions.NotFoundException("User not found");
        return mapper.Map<UserResponse>(u);
    }

    public async Task<UserResponse> UpdateProfile(Guid id, ProfileRequest r)
    {
        EnsureValidUserId(id);
        await new ProfileValidator().ValidateAndThrowAsync(r);
        var u = await users.Get(id) ?? throw new Domain.Exceptions.NotFoundException("User not found");
        u.FullName = r.FullName;
        u.Avatar = r.Avatar;
        await users.Save();
        return mapper.Map<UserResponse>(u);
    }

    private static void EnsureValidUserId(Guid id)
    {
        if (id == Guid.Empty)
            throw new Domain.Exceptions.UnauthorizedException("Invalid user token");
    }
}
