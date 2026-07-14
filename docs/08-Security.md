# Security

Passwords use BCrypt. Access JWTs expire after 15 minutes. Refresh tokens expire after 7 days, are persisted, and can be revoked. Bearer authorization protects all non-auth routes. Frontend currently stores tokens in localStorage; moving refresh tokens to HttpOnly cookies is a future hardening improvement.
