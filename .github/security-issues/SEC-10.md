> Tracking ID: `SEC-10` · Severity: **High** · CWE-287 / CWE-312 / CWE-522
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Social login merges identities on a plain email match and persists provider access/refresh tokens unencrypted in the database.

## Evidence
- `laravel/app/Http/Controllers/SocialAuthController.php:31-32` — `User::where('google_id', ...)->orWhere('email', $googleUser->getEmail())->first()`.
- `laravel/app/Http/Controllers/SocialAuthController.php:81-82` — same `orWhere('email', ...)` for `linkedin-openid`.
- `laravel/app/Http/Controllers/SocialAuthController.php:39-52`, `:89-102` — `google_token`, `google_refresh_token`, `linkedin_token`, `linkedin_refresh_token` written directly to the DB; `Auth::login($user, true)` at `:57` and `:107`.
- `laravel/app/Models/User.php` — tokens are `$fillable` and `$hidden` but not `encrypted` casts.
- `laravel/app/Http/Controllers/AuthController.php:23-30` — local passwords are never re-verified before a social login attaches to an existing account.
- `js/store.js:71-84` — the static Google flow also links by email (`users.find(u => u.email === email)`).

## Impact
If a provider returns an unverified or attacker-controlled email (notably OIDC providers where email verification is optional), an attacker can attach their social identity to a victim's existing local account and be logged in as that user, including admin accounts. No `email_verified` check, no account-linking confirmation, no `aud`/`azp` validation on the token. Stored refresh tokens are long-lived credentials: a DB backup, read-only SQL injection or a leaked `.env`/dump exposes them in cleartext.

## Remediation
- Only auto-link when the provider explicitly reports a verified email AND the account already uses the same provider; otherwise require the user to sign in with their password (or send a verification email) before linking.
- Verify the ID token (`aud`, `iss`, `exp`, `nonce`) rather than relying on the userinfo endpoint alone; check `email_verified`.
- Encrypt token columns with Laravel's `encrypted` cast (or drop them — they are never used), and rotate/revoke on logout.
- Add an audit log for account linking.
