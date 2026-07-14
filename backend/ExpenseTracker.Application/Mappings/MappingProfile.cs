using AutoMapper;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Application.Mappings;

public sealed class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserResponse>();
        CreateMap<Category, CategoryResponse>();
        CreateMap<Transaction, TransactionResponse>();
        CreateMap<Budget, BudgetResponse>();
    }
}
