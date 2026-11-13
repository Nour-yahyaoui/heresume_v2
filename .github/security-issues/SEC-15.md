> Tracking ID: `SEC-15` · Severity: **Medium** · CWE-352 / CWE-650 / CWE-770
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
A GET request creates a database row for signed-in users, and guest editor routes accept arbitrary query parameters without validation or limits.

## Evidence
- `laravel/routes/web.php:49` — `Route::get('/resumes/create', [ResumeController::class, 'create'])`.
- `laravel/app/Http/Controllers/ResumeController.php:19-21` — `$template`, `$color`, `$title` come straight from the query string with no validation.
- `laravel/app/Http/Controllers/ResumeController.php:43-55` — for `Auth::check()` it calls `Resume::create([...])` and `syncToRelational()` on a GET.
- `laravel/routes/web.php:46-48`, `ResumeController.php:74-79` — `/editor`, `/editor.html` and `/editor/guest` are public with no throttle.
- `laravel/public/js/editor.js:17-24` — guest editor reads `template`/`color` from the URL and uses them in `render()` unvalidated.

## Impact
GETs are supposed to be safe and are not CSRF-protected by Laravel's `VerifyCsrfToken`; a third-party page can silently create resumes in a victim's account via an `<img>`/prefetch. Unvalidated `color`/`template`/`title` feed the renderer and DB (see SEC-05/07). Unlimited anonymous editor requests allow resource abuse and disk/CPU exhaustion via the preview renderer.

## Remediation
- Convert creation to `POST /resumes` with `@csrf` (and validation), and make the GET route a redirect-only form.
- Validate `template` against the known registry and `color` with a hex regex; cap `title` length.
- Add `throttle` to guest editor routes and consider a signed guest draft token.
