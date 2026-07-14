using ExpenseTracker.Domain.Enums;

namespace ExpenseTracker.Application.DTOs;

/// <summary>Response DTO for User/Profile — field names match what the frontend reads.</summary>
public sealed record UserResponse(
    Guid Id,
    string FullName,
    string Email,
    string? Avatar,
    DateTime CreatedAt);

/// <summary>Response DTO for Category — field names: id, name, type, icon, color (matches App.tsx).</summary>
public sealed record CategoryResponse(
    Guid Id,
    Guid UserId,
    string Name,
    TransactionType Type,
    string Icon,
    string Color);

/// <summary>Response DTO for Transaction — field names: id, categoryId, amount, title, note, date, type (matches App.tsx).</summary>
public sealed record TransactionResponse(
    Guid Id,
    Guid UserId,
    Guid CategoryId,
    decimal Amount,
    string Title,
    string? Note,
    DateOnly Date,
    TransactionType Type);

/// <summary>Response DTO for Budget — field names: id, categoryId, limitAmount, month, year (matches App.tsx).</summary>
public sealed record BudgetResponse(
    Guid Id,
    Guid UserId,
    Guid CategoryId,
    decimal LimitAmount,
    int Month,
    int Year);
