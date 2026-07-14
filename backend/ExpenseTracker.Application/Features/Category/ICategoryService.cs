using ExpenseTracker.Application.DTOs;

namespace ExpenseTracker.Application.Features.Category;

public interface ICategoryService
{
    Task<List<CategoryResponse>> Categories(Guid userId);
    Task<CategoryResponse> AddCategory(Guid userId, CategoryRequest r);
    Task<CategoryResponse> UpdateCategory(Guid userId, Guid id, CategoryRequest r);
    Task DeleteCategory(Guid userId, Guid id);
}
