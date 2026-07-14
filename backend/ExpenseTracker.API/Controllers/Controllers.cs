using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Features.Authentication;
using ExpenseTracker.Application.Features.Budget;
using ExpenseTracker.Application.Features.Category;
using ExpenseTracker.Application.Features.Dashboard;
using ExpenseTracker.Application.Features.Profile;
using ExpenseTracker.Application.Features.Transaction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

public abstract class Base : ControllerBase
{
    protected Guid UserId
    {
        get
        {
            var raw = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(raw, out var id))
                throw new Domain.Exceptions.UnauthorizedException("Invalid user token.");
            return id;
        }
    }

    protected static object Data(object d) => new { success = true, message = "", data = d };
}

[ApiController, Route("auth")]
public sealed class AuthController(IAuthService s) : Base
{
    [HttpPost("register")]
    public async Task<object> Register(RegisterRequest r) => Data(await s.Register(r));

    [HttpPost("login")]
    public async Task<object> Login(LoginRequest r) => Data(await s.Login(r));

    [HttpPost("refresh")]
    public async Task<object> Refresh(RefreshRequest r) => Data(await s.Refresh(r.RefreshToken));

    [HttpPost("logout")]
    public async Task<object> Logout(RefreshRequest r)
    {
        await s.Logout(r.RefreshToken);
        return Data(new { });
    }
}

[Authorize, ApiController, Route("categories")]
public sealed class CategoryController(ICategoryService s) : Base
{
    [HttpGet]
    public async Task<object> Get() => Data(await s.Categories(UserId));

    [HttpPost]
    public async Task<object> Post(CategoryRequest r) => Data(await s.AddCategory(UserId, r));

    [HttpPut("{id:guid}")]
    public async Task<object> Put(Guid id, CategoryRequest r) => Data(await s.UpdateCategory(UserId, id, r));

    [HttpDelete("{id:guid}")]
    public async Task<object> Delete(Guid id)
    {
        await s.DeleteCategory(UserId, id);
        return Data(new { });
    }
}

[Authorize, ApiController, Route("transactions")]
public sealed class TransactionController(ITransactionService s) : Base
{
    [HttpGet]
    public async Task<object> Get(
        [FromQuery] string? keyword,
        [FromQuery] Guid? categoryId,
        [FromQuery] DateOnly? date,
        [FromQuery] int? type,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var x = await s.Transactions(UserId);
        if (!string.IsNullOrWhiteSpace(keyword))
            x = x.Where(t => t.Title.Contains(keyword, StringComparison.OrdinalIgnoreCase)).ToList();
        if (categoryId.HasValue)
            x = x.Where(t => t.CategoryId == categoryId).ToList();
        if (date.HasValue)
            x = x.Where(t => t.Date == date).ToList();
        if (type.HasValue)
            x = x.Where(t => (int)t.Type == type).ToList();
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        return Data(new
        {
            items = x.Skip((page - 1) * pageSize).Take(pageSize),
            total = x.Count,
            page,
            pageSize
        });
    }

    [HttpPost]
    public async Task<object> Post(TransactionRequest r) => Data(await s.AddTransaction(UserId, r));

    [HttpPut("{id:guid}")]
    public async Task<object> Put(Guid id, TransactionRequest r) => Data(await s.UpdateTransaction(UserId, id, r));

    [HttpDelete("{id:guid}")]
    public async Task<object> Delete(Guid id)
    {
        await s.DeleteTransaction(UserId, id);
        return Data(new { });
    }
}

[Authorize, ApiController, Route("budgets")]
public sealed class BudgetController(IBudgetService s) : Base
{
    [HttpGet]
    public async Task<object> Get() => Data(await s.Budgets(UserId));

    [HttpPost]
    public async Task<object> Post(BudgetRequest r) => Data(await s.AddBudget(UserId, r));

    [HttpPut("{id:guid}")]
    public async Task<object> Put(Guid id, BudgetRequest r) => Data(await s.UpdateBudget(UserId, id, r));

    [HttpDelete("{id:guid}")]
    public async Task<object> Delete(Guid id)
    {
        await s.DeleteBudget(UserId, id);
        return Data(new { });
    }
}

[Authorize, ApiController, Route("dashboard")]
public sealed class DashboardController(IDashboardService s) : Base
{
    [HttpGet]
    public async Task<object> Get() => Data(await s.Dashboard(UserId));
}

[Authorize, ApiController, Route("profile")]
public sealed class ProfileController(IProfileService s) : Base
{
    [HttpGet]
    public async Task<object> Get() => Data(await s.Profile(UserId));

    [HttpPut]
    public async Task<object> Put(ProfileRequest r) => Data(await s.UpdateProfile(UserId, r));
}
