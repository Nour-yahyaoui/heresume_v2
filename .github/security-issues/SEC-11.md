> Tracking ID: `SEC-11` · Severity: **Medium** · CWE-521
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Registration and password change allow six-character passwords with no complexity or compromised-password check.

## Evidence
- `laravel/app/Http/Controllers/AuthController.php:53` — `['required', Password::min(6)]`.
- `laravel/app/Http/Controllers/AccountController.php:53` — `['required', 'confirmed', Password::min(6)]`.
- `js/auth.js:47` (static build) — only `v.length >= 8`.
- `laravel/.env.example` — `BCRYPT_ROUNDS=12` (good), but no password policy config.

## Impact
Six characters is far below modern guidance (NIST SP 800-63B: at least 8, preferably 15+, with breached-password screening). Combined with SEC-03 (no throttling) this makes online guessing practical.

## Remediation
Use `Password::min(12)->letters()->mixedCase()->numbers()->uncompromised()` (Laravel's `Password` rule supports `uncompromised()` via Have I Been Pwned), and align the static demo to the same minimum. Consider passphrase-friendly length limits rather than composition gimmicks.
