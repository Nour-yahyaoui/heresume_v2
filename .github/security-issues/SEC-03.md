> Tracking ID: `SEC-03` · Severity: **Medium** · CWE-307 / CWE-799
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Neither front end throttles authentication, newsletter, contact or review submissions, and Laravel enables long-lived remember-me cookies for every login by default.

## Evidence
- `laravel/routes/web.php:33` `POST /login`, `:18` `POST /subscribe`, `:26` `POST /contact`, `:72` `POST /reviews` — no `throttle` middleware on any route; no `RateLimiter` usage anywhere in `app/`.
- `laravel/app/Http/Controllers/AuthController.php:28` — `$remember = $request->boolean('remember', true);` (defaults to `true` even when the checkbox is absent).
- `laravel/resources/views/pages/login.blade.php` — the remember checkbox is checked by default.
- `js/auth.js:67-85` — static login has no attempt counter, delay or lockout; `js/auth.js:47` only enforces 8 characters on new passwords.
- `laravel/app/Http/Controllers/SubscriberController.php` / `ContactController.php` / `ReviewController.php` — unlimited DB writes, no CAPTCHA, no double opt-in, no moderation (`is_public => true` on every review).

## Impact
Password brute force / credential stuffing against `POST /login`; unlimited spam rows in `subscribers`, `contact_messages` and `reviews`; public review spam. Persistent remember-me tokens widen the window for session theft.

## Remediation
- Apply `->middleware('throttle:5,1')` to login/register and `throttle` to all public POST routes, or use Laravel's `RateLimiter` with a per-email+IP key.
- Default `remember` to `false`, and let users opt in explicitly.
- Add CAPTCHA / honeypot / double opt-in for newsletter and contact forms; moderate reviews before `is_public`.
- Add a client-side attempt backoff to the static demo as defence in depth.
