namespace ExpenseTracker.Application.Features.Dashboard;

public interface IDashboardService
{
    Task<object> Dashboard(Guid userId);
}
