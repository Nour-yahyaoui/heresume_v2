> Tracking ID: `SEC-12` · Severity: **Medium** · CWE-1188 / CWE-614 / CWE-489
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
The shipped environment template is a development config that is commonly copied verbatim into production.

## Evidence
- `laravel/.env.example:4` — `APP_DEBUG=true`; `:3` — `APP_ENV=local`; `:12` — `LOG_LEVEL=debug`.
- `laravel/.env.example` — `SESSION_ENCRYPT=false`; `SESSION_SECURE_COOKIE` is **not set at all**.
- `laravel/config/session.php:50` (`encrypt`), `:172` (`'secure' => env('SESSION_SECURE_COOKIE')` — defaults to `null`/false), `:185` (`http_only` true by default), `:202` (`same_site` lax).
- `laravel/public/.htaccess` — no `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options` or CSP headers.
- `laravel/.env.example` — `APP_KEY=` empty; `FILESYSTEM_DISK=local`; `MAIL_MAILER=log`.

## Impact
`APP_DEBUG=true` in production exposes stack traces, environment variables, DB queries and file paths through Whoops error pages. Session cookies are not marked `Secure` and DB-stored sessions are not encrypted, so they can travel over plain HTTP and be read by anyone with database access. No HSTS means first-request downgrade.

## Remediation
- Ship `APP_DEBUG=false`, `APP_ENV=production`, `LOG_LEVEL=warning`, `SESSION_ENCRYPT=true`, `SESSION_SECURE_COOKIE=true`, `SESSION_SAME_SITE=lax` in the example (or a dedicated `.env.production.example`), with comments explaining the dev overrides.
- Add a deployment check that refuses to boot with debug enabled on a public host.
- Add security headers at the web server or via middleware (see SEC-14).
