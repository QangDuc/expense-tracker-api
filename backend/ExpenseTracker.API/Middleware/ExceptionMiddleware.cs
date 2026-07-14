using FluentValidation;

namespace ExpenseTracker.API.Middleware;

public sealed class ExceptionMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext c)
    {
        try
        {
            await next(c);
        }
        catch (Exception e)
        {
            var status = e switch
            {
                Domain.Exceptions.ValidationException => 400,
                FluentValidation.ValidationException => 400,
                Domain.Exceptions.NotFoundException => 404,
                Domain.Exceptions.UnauthorizedException => 401,
                _ => 500
            };
            var errors = e is FluentValidation.ValidationException fv
                ? fv.Errors
                    .GroupBy(x => x.PropertyName)
                    .ToDictionary(x => x.Key, x => x.Select(y => y.ErrorMessage).ToArray())
                : null;
            c.Response.StatusCode = status;
            await c.Response.WriteAsJsonAsync(new { message = e.Message, errors });
        }
    }
}
