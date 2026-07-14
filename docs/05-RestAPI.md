# REST API Reference

`POST /auth/register|login|refresh|logout`; protected CRUD endpoints: `/categories`, `/transactions`, `/budgets`; `GET /dashboard`; `GET|PUT /profile`. Transaction listing accepts `search`, `page`, and `pageSize`. Successful responses use `{ success, message, data }`; errors are ProblemDetails.
