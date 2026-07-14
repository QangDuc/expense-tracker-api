using ExpenseTracker.Application.DTOs;
using FluentValidation;

namespace ExpenseTracker.Application.Validators;

public sealed class RegisterValidator : AbstractValidator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email).EmailAddress();
        RuleFor(x => x.Password).MinimumLength(6);
        RuleFor(x => x.FullName).NotEmpty();
    }
}

public sealed class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public sealed class RefreshTokenValidator : AbstractValidator<RefreshRequest>
{
    public RefreshTokenValidator()
    {
        RuleFor(x => x.RefreshToken).NotEmpty();
    }
}

public sealed class CategoryValidator : AbstractValidator<CategoryRequest>
{
    public CategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Icon).NotEmpty();
        RuleFor(x => x.Color).NotEmpty();
    }
}

public sealed class TransactionValidator : AbstractValidator<TransactionRequest>
{
    public TransactionValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.Title).NotEmpty();
    }
}

public sealed class BudgetValidator : AbstractValidator<BudgetRequest>
{
    public BudgetValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.LimitAmount).GreaterThan(0);
        RuleFor(x => x.Month).InclusiveBetween(1, 12);
    }
}

public sealed class ProfileValidator : AbstractValidator<ProfileRequest>
{
    public ProfileValidator()
    {
        RuleFor(x => x.FullName).NotEmpty();
    }
}
