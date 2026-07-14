using ExpenseTracker.Application.DTOs;

namespace ExpenseTracker.Application.Features.Budget;

public interface IBudgetService
{
    Task<List<BudgetResponse>> Budgets(Guid userId);
    Task<BudgetResponse> AddBudget(Guid userId, BudgetRequest r);
    Task<BudgetResponse> UpdateBudget(Guid userId, Guid id, BudgetRequest r);
    Task DeleteBudget(Guid userId, Guid id);
}
