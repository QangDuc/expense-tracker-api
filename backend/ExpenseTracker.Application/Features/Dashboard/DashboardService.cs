using AutoMapper;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Enums;

namespace ExpenseTracker.Application.Features.Dashboard;

public sealed class DashboardService(
    ITransactionRepository transactions,
    IBudgetRepository budgets,
    IMapper mapper) : IDashboardService
{
    public async Task<object> Dashboard(Guid userId)
    {
        var t = await transactions.List(userId);
        var income = t.Where(x => x.Type == TransactionType.Income).Sum(x => x.Amount);
        var expense = t.Where(x => x.Type == TransactionType.Expense).Sum(x => x.Amount);

        var budgetRows = (await budgets.List(userId)).Select(b => new
        {
            b.Id,
            b.CategoryId,
            b.LimitAmount,
            b.Month,
            b.Year,
            spent = t.Where(x =>
                x.CategoryId == b.CategoryId &&
                x.Type == TransactionType.Expense &&
                x.Date.Month == b.Month &&
                x.Date.Year == b.Year)
              .Sum(x => x.Amount)
        });

        var monthlyExpense = t
            .Where(x => x.Type == TransactionType.Expense)
            .GroupBy(x => new { x.Date.Year, x.Date.Month })
            .OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month)
            .Select(x => new
            {
                name = $"{x.Key.Month}/{x.Key.Year}",
                amount = x.Sum(y => y.Amount)
            });

        // Map recent transactions to DTOs so no entity is leaked through the API
        var recentTransactions = mapper.Map<List<TransactionResponse>>(t.Take(5).ToList());

        return new
        {
            income,
            expense,
            balance = income - expense,
            recentTransactions,
            monthlyExpense,
            budgetProgress = budgetRows
        };
    }
}
