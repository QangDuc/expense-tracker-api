using ExpenseTracker.Application.DTOs;

namespace ExpenseTracker.Application.Features.Profile;

public interface IProfileService
{
    Task<UserResponse> Profile(Guid id);
    Task<UserResponse> UpdateProfile(Guid id, ProfileRequest r);
}
