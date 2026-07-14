using ExpenseTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Persistence;

public sealed class ExpenseTrackerDbContext(DbContextOptions<ExpenseTrackerDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(x => x.Email).IsUnique();
        b.Entity<Category>().HasIndex(x => new { x.UserId, x.Name }).IsUnique();
        b.Entity<Budget>().HasIndex(x => new { x.UserId, x.CategoryId, x.Month, x.Year }).IsUnique();
        b.Entity<Transaction>().HasIndex(x => new { x.UserId, x.Date });
        b.Entity<Transaction>().HasIndex(x => new { x.UserId, x.CategoryId });
        b.Entity<RefreshToken>().HasIndex(x => x.Token).IsUnique();

        b.Entity<Category>().HasOne(x => x.User).WithMany(x => x.Categories).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Transaction>().HasOne(x => x.User).WithMany(x => x.Transactions).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Transaction>().HasOne(x => x.Category).WithMany(x => x.Transactions).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Budget>().HasOne(x => x.User).WithMany(x => x.Budgets).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Budget>().HasOne(x => x.Category).WithMany(x => x.Budgets).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);

        b.Entity<Transaction>().Property(x => x.Amount).HasPrecision(18, 2);
        b.Entity<Budget>().Property(x => x.LimitAmount).HasPrecision(18, 2);

        var user = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var food = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var salary = Guid.Parse("33333333-3333-3333-3333-333333333333");
        b.Entity<User>().HasData(new User { Id = user, FullName = "Demo User", Email = "demo@expensetracker.local", PasswordHash = "$2a$11$kVWwBLuxJZCSYc1YRzXSDO4IViGizq36eQ78X9QmPbyxKvi0zVGru", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) });
        b.Entity<Category>().HasData(new Category { Id = food, UserId = user, Name = "Food", Type = Domain.Enums.TransactionType.Expense, Icon = "utensils", Color = "#ef4444" }, new Category { Id = salary, UserId = user, Name = "Salary", Type = Domain.Enums.TransactionType.Income, Icon = "wallet", Color = "#22c55e" });
        b.Entity<Transaction>().HasData(new Transaction { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), UserId = user, CategoryId = food, Title = "Lunch", Amount = 75000, Date = new DateOnly(2026, 1, 5), Type = Domain.Enums.TransactionType.Expense }, new Transaction { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), UserId = user, CategoryId = salary, Title = "January salary", Amount = 15000000, Date = new DateOnly(2026, 1, 1), Type = Domain.Enums.TransactionType.Income });
        b.Entity<Budget>().HasData(new Budget { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), UserId = user, CategoryId = food, LimitAmount = 2500000, Month = 1, Year = 2026 });
    }
}
