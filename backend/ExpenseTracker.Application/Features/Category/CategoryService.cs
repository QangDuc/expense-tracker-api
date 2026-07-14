using AutoMapper;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Validators;
using FluentValidation;

namespace ExpenseTracker.Application.Features.Category;

public sealed class CategoryService(
    ICategoryRepository categories,
    IMapper mapper) : ICategoryService
{
    public async Task<List<CategoryResponse>> Categories(Guid userId)
        => mapper.Map<List<CategoryResponse>>(await categories.List(userId));

    public async Task<CategoryResponse> AddCategory(Guid userId, CategoryRequest r)
    {
        await new CategoryValidator().ValidateAndThrowAsync(r);
        if ((await categories.List(userId))
            .Any(x => x.Name.Equals(r.Name, StringComparison.OrdinalIgnoreCase)))
            throw new Domain.Exceptions.ValidationException("Category name must be unique");

        var x = new Domain.Entities.Category
        {
            UserId = userId,
            Name = r.Name,
            Type = r.Type,
            Icon = r.Icon,
            Color = r.Color
        };
        await categories.Add(x);
        await categories.Save();
        return mapper.Map<CategoryResponse>(x);
    }

    public async Task<CategoryResponse> UpdateCategory(Guid userId, Guid id, CategoryRequest r)
    {
        await new CategoryValidator().ValidateAndThrowAsync(r);
        var x = await categories.Get(id, userId)
            ?? throw new Domain.Exceptions.NotFoundException("Category not found");
        x.Name = r.Name;
        x.Type = r.Type;
        x.Icon = r.Icon;
        x.Color = r.Color;
        await categories.Save();
        return mapper.Map<CategoryResponse>(x);
    }

    public async Task DeleteCategory(Guid userId, Guid id)
    {
        var x = await categories.Get(id, userId)
            ?? throw new Domain.Exceptions.NotFoundException("Category not found");
        categories.Delete(x);
        await categories.Save();
    }
}
