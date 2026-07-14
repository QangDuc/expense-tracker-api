using AutoMapper;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Validators;
using FluentValidation;

namespace ExpenseTracker.Application.Features.Transaction;

public sealed class TransactionService(
    ITransactionRepository transactions,
    ICategoryRepository categories,
    IMapper mapper) : ITransactionService
{
    public async Task<List<TransactionResponse>> Transactions(Guid userId)
        => mapper.Map<List<TransactionResponse>>(await transactions.List(userId));

    public async Task<TransactionResponse> AddTransaction(Guid userId, TransactionRequest r)
    {
        await new TransactionValidator().ValidateAndThrowAsync(r);
        if (await categories.Get(r.CategoryId, userId) == null)
            throw new Domain.Exceptions.NotFoundException("Category not found");

        var x = new Domain.Entities.Transaction
        {
            UserId = userId,
            CategoryId = r.CategoryId,
            Amount = r.Amount,
            Title = r.Title,
            Note = r.Note,
            Date = r.Date,
            Type = r.Type
        };
        await transactions.Add(x);
        await transactions.Save();
        return mapper.Map<TransactionResponse>(x);
    }

    public async Task<TransactionResponse> UpdateTransaction(Guid userId, Guid id, TransactionRequest r)
    {
        await new TransactionValidator().ValidateAndThrowAsync(r);
        var x = await transactions.Get(id, userId)
            ?? throw new Domain.Exceptions.NotFoundException("Transaction not found");
        if (await categories.Get(r.CategoryId, userId) == null)
            throw new Domain.Exceptions.NotFoundException("Category not found");

        x.CategoryId = r.CategoryId;
        x.Amount = r.Amount;
        x.Title = r.Title;
        x.Note = r.Note;
        x.Date = r.Date;
        x.Type = r.Type;
        await transactions.Save();
        return mapper.Map<TransactionResponse>(x);
    }

    public async Task DeleteTransaction(Guid userId, Guid id)
    {
        var x = await transactions.Get(id, userId)
            ?? throw new Domain.Exceptions.NotFoundException("Transaction not found");
        transactions.Delete(x);
        await transactions.Save();
    }
}
