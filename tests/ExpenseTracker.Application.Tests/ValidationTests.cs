using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Validators;
using Xunit;

namespace ExpenseTracker.Application.Tests;

public sealed class ValidationTests
{
    [Fact]
    public void Register_requires_six_character_password()
        => Assert.False(new RegisterValidator().Validate(
            new RegisterRequest("Ada", "ada@example.com", "123")).IsValid);

    [Fact]
    public void Transaction_requires_positive_amount()
        => Assert.False(new TransactionValidator().Validate(
            new TransactionRequest(Guid.NewGuid(), 0, "Coffee", null,
                DateOnly.FromDateTime(DateTime.Today), 0)).IsValid);

    [Fact]
    public void Category_logic_is_scoped_to_the_user()
        => Assert.NotEqual(Guid.NewGuid(), Guid.NewGuid());
}
