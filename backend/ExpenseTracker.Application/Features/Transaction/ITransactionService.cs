using ExpenseTracker.Application.DTOs;

namespace ExpenseTracker.Application.Features.Transaction;

public interface ITransactionService
{
    Task<List<TransactionResponse>> Transactions(Guid userId);
    Task<TransactionResponse> AddTransaction(Guid userId, TransactionRequest r);
    Task<TransactionResponse> UpdateTransaction(Guid userId, Guid id, TransactionRequest r);
    Task DeleteTransaction(Guid userId, Guid id);
}
