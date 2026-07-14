using AutoMapper;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Validators;
using FluentValidation;

namespace ExpenseTracker.Application.Features.Budget;

public sealed class BudgetService(
    IBudgetRepository budgets,
    IMapper mapper) : IBudgetService
{
    public async Task<List<BudgetResponse>> Budgets(Guid userId)
        => mapper.Map<List<BudgetResponse>>(await budgets.List(userId));

    public async Task<BudgetResponse> AddBudget(Guid userId, BudgetRequest r)
    {
        await new BudgetValidator().ValidateAndThrowAsync(r);
        if ((await budgets.List(userId))
            .Any(x => x.CategoryId == r.CategoryId && x.Month == r.Month && x.Year == r.Year))
            throw new Domain.Exceptions.ValidationException("One budget per category/month");

        var x = new Domain.Entities.Budget
        {
            UserId = userId,
            CategoryId = r.CategoryId,
            LimitAmount = r.LimitAmount,
            Month = r.Month,
            Year = r.Year
        };
        await budgets.Add(x);
        await budgets.Save();
        return mapper.Map<BudgetResponse>(x);
    }

    public async Task<BudgetResponse> UpdateBudget(Guid userId, Guid id, BudgetRequest r)
    {
        await new BudgetValidator().ValidateAndThrowAsync(r);
        var x = await budgets.Get(id, userId)
            ?? throw new Domain.Exceptions.NotFoundException("Budget not found");
        x.CategoryId = r.CategoryId;
        x.LimitAmount = r.LimitAmount;
        x.Month = r.Month;
        x.Year = r.Year;
        await budgets.Save();
        return mapper.Map<BudgetResponse>(x);
    }

    public async Task DeleteBudget(Guid userId, Guid id)
    {
        var x = await budgets.Get(id, userId)
            ?? throw new Domain.Exceptions.NotFoundException("Budget not found");
        budgets.Delete(x);
        await budgets.Save();
    }
}
