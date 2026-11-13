# HResume — security review

**Reviewed:** 2026-11-12 · **Branch:** `arena/65752401-heresume-v2` (from `main` @ `9b3a934`)
**Scope:** static front end (`*.html`, `js/`, `css/`) and the Laravel 13 app in `laravel/`.
**Method:** manual source review of authentication, authorisation, input validation, output
encoding, file uploads, session/CSP configuration, secrets handling and data retention.
**Limitations:** no running PHP/Composer, no database, no DAST/SAST scanner, no dependency
audit, and no live authentication testing. Findings are based on reading code, not on
exploiting a deployed instance. Line numbers refer to this branch at review time.

> This is a **review**, not a fix. None of the findings below were remediated in this
> branch — the branch only rebuilds the visual theme. Each finding has its own tracking
> issue (or a ready-to-file draft; see _Issue tracking_ below).

---

## 1. Executive summary

HResume ships **two independent front ends**:

| Build | Accounts & data | Trust boundary |
| --- | --- | --- |
| Static (`/` → `index.html`) | `localStorage` only (`cvm_users`, `cvm_session`, `cvm_resumes`) | **None.** The browser is the authority. |
| Laravel (`laravel/`) | SQLite/MySQL, server sessions, Eloquent | Real, but with several authorisation gaps. |

The static build is a **demo**, not a secure application: authentication is a value in
`localStorage`, credentials are unsalted SHA-256 hashes, and resume PII is stored in the
browser forever. It must never be advertised as a place to enter real personal data.

The Laravel build has a more serious, exploitable chain: an **IDOR** in `ResumeController`
(SEC-04) plus **unvalidated autosave input** (SEC-05) feeding an **unescaped `innerHTML`
sink** (SEC-06). Together these allow stored, same-origin XSS and cross-account resume
access. **OAuth account linking by unverified email** (SEC-10) is the second high-risk path.
Neither build sends a CSP or standard security headers (SEC-14), so any XSS runs unrestricted.

**17 findings:** 6 High · 9 Medium · 2 Low.

Recommended order: **SEC-04 → SEC-05 → SEC-06 → SEC-10 → SEC-01/02 → SEC-14**, then the
Medium hardening items. SEC-04/05/06/10 should be treated as a single release-blocking
cluster.

---

## 2. Findings index

| ID | Severity | Area | Finding | Tracking |
| --- | --- | --- | --- | --- |
| SEC-01 | High | Static auth | Client-side-only authentication; forgeable `cvm_session` | `.github/security-issues/SEC-01.md` |
| SEC-02 | High | Static storage | Unsalted SHA-256 passwords + PII kept in `localStorage` | `.github/security-issues/SEC-02.md` |
| SEC-03 | Medium | Rate limiting | No throttling on login/subscribe/contact/reviews; remember-me defaults on | `.github/security-issues/SEC-03.md` |
| SEC-04 | High | Laravel authz | Ownership check skipped when `user_id` is null (IDOR) | `.github/security-issues/SEC-04.md` |
| SEC-05 | High | Laravel input | `PUT /resumes/{id}` accepts unvalidated JSON, colour and photo URLs | `.github/security-issues/SEC-05.md` |
| SEC-06 | High | XSS | Unescaped accent colour written into editor HTML attributes | `.github/security-issues/SEC-06.md` |
| SEC-07 | Medium | CSS injection | Colour/photo values injected into `style` attributes and CSS `url()` | `.github/security-issues/SEC-07.md` |
| SEC-08 | Medium | XSS | `{!! $post->content !!}` renders unsanitised blog HTML | `.github/security-issues/SEC-08.md` |
| SEC-09 | Medium | Uploads | SVG-capable `image` rule; public disk, no access control or cleanup | `.github/security-issues/SEC-09.md` |
| SEC-10 | High | OAuth | Account linking by unverified email; tokens stored in plaintext | `.github/security-issues/SEC-10.md` |
| SEC-11 | Medium | Passwords | `Password::min(6)`, no breach check | `.github/security-issues/SEC-11.md` |
| SEC-12 | Medium | Config | `APP_DEBUG=true`, `SESSION_ENCRYPT=false`, no `SESSION_SECURE_COOKIE` | `.github/security-issues/SEC-12.md` |
| SEC-13 | Medium | Defaults | Hardcoded `demo@heresume.com` / `password123` seeder | `.github/security-issues/SEC-13.md` |
| SEC-14 | Medium | Headers | No CSP/SRI/security headers; external GIS script and fonts | `.github/security-issues/SEC-14.md` |
| SEC-15 | Medium | CSRF/abuse | State-changing `GET /resumes/create`; unauthenticated guest editor | `.github/security-issues/SEC-15.md` |
| SEC-16 | Low | Tabnabbing | `target="_blank"` without `rel="noopener noreferrer"` | `.github/security-issues/SEC-16.md` |
| SEC-17 | Low | Retention | Account deletion leaves resumes, photos and OAuth tokens | `.github/security-issues/SEC-17.md` |

---

## 3. Findings in detail

### SEC-01 — Static frontend authentication is forgeable · **High** · CWE-639/602/922
`js/store.js:6,38-43,121-129` — `Auth.current()` resolves `cvm_session` against the local
`cvm_users` array; `requireUser()`/`redirectIfSignedIn()` are the only page guards.
`uid()` (`js/store.js:20-23`) is `Date.now() + Math.random()`, so ids are predictable.
**Impact:** full auth bypass on the static build; any script on the origin can impersonate any
user and read all resumes. **Fix:** use server-side sessions for real accounts; label the
static build as a demo; never authorise from client-mutable storage.

### SEC-02 — Unsalted SHA-256 credentials in localStorage · **High** · CWE-916/328/312/922
`js/store.js:25-34` uses `crypto.subtle.digest('SHA-256', ...)` with a non-cryptographic
djb2 fallback; `:44-67` stores and compares that hash; `:86-88` `logout()` removes only
`cvm_session`. Resume JSON contains names, emails, phone, employer history and base64 photos.
**Impact:** offline brute force, indefinite PII retention, shared-device exposure.
**Fix:** no browser-side credential storage; bcrypt/argon2 on the server; explicit local-data
clear on logout.

### SEC-03 — No rate limiting; remember-me always on · **Medium** · CWE-307/799
`laravel/routes/web.php:18,26,33,72` have no `throttle`; no `RateLimiter` in `app/`.
`AuthController.php:28` defaults `$remember` to `true`; `login.blade.php` pre-checks the box.
`js/auth.js:67-85` has no attempt counter; `js/auth.js:47` enforces only 8 characters.
Public `subscribe`/`contact`/`reviews` endpoints write unlimited rows, and reviews are
published immediately (`is_public => true`).
**Fix:** `throttle:5,1` on auth, throttles on all public POSTs, `remember=false` by default,
CAPTCHA/double opt-in, review moderation.

### SEC-04 — IDOR on ownerless resumes · **High** · CWE-639/862
`ResumeController.php:65,81,115,142,155` all guard with
`if ($resume->user_id && $resume->user_id !== Auth::id())`. A null/0 `user_id` therefore
passes. `routes/web.php:46-49` exposes unauthenticated guest editor routes, and
`ResumeController.php:146` uses `replicate()`, inheriting the owner. Sequential ids make
enumeration trivial; `Resume` uses `SoftDeletes`.
**Fix:** a single `ResumePolicy` with `abort_unless($resume->user_id === Auth::id(), 403)`;
non-nullable `user_id`; feature tests for ownerless rows; UUID/ULID ids.

### SEC-05 — Unvalidated autosave payload · **High** · CWE-20/915/79
`ResumeController.php:85-98`: `data` is only `sometimes|array`, `color` `string|max:32`,
`photo_path` `nullable|string`, `template` `string|max:64`; then `update($validated)` and the
whole model is echoed back (`:101-110`). `Resume::$fillable` also contains `user_id` and
`public_profile_*`. The browser sends this every 500 ms (`laravel/public/js/editor.js:53-63`).
**Fix:** a `FormRequest` with nested rules, key allowlists, a hex-colour regex, a template
`in:` rule, URL scheme validation, size caps, and an explicit update whitelist.

### SEC-06 — Stored XSS via colour swatches · **High** · CWE-79/116
`js/editor.js:421-423` and `laravel/public/js/editor.js:453-455` interpolate `color` into
`style`, `data-color` and `aria-label` attributes with **no escaping**; `js/app.js:216`
interpolates `resume.id` unescaped. Those values are attacker-controlled via SEC-05 or via
`localStorage`. A quoted value containing `"` + an event handler executes in-origin.
**Fix:** build elements with `createElement`/`setAttribute`/`textContent`, validate colours,
escape ids and query parameters, and add a CSP.

### SEC-07 — CSS injection through colour and photo · **Medium** · CWE-79/116/20
`resumes.blade.php:41` uses `background: {{ $r->color }};`; `js/render.js:1682` uses
`style="--cv-accent:${esc(color)}"`; `js/editor.js:451` builds `url("${photo}")` from stored
JSON. HTML escaping does not stop `;` or `url()`. `color` is limited to 32 chars, which is
enough for `red;background:url(//x)`.
**Fix:** strict hex validation server-side, no inline styles from user values, image URL
allowlists, and a `style-src` CSP directive.

### SEC-08 — Raw blog HTML · **Medium** · CWE-79
`post.blade.php:23` renders `{!! $post->content !!}` with no purifier; `BlogPost::$fillable`
includes `content`; the seeder writes raw HTML. `js/blog.js:204` does the same on the static
side (currently hardcoded). Any future CMS/import path becomes stored XSS.
**Fix:** sanitise on write with an allowlist (HTMLPurifier) or render markdown through `{{ }}`.

### SEC-09 — Uploads · **Medium** · CWE-434/79/552
`ResumeController.php:119-126` validates `image|max:4096` and stores on the `public` disk
(`config/filesystems.php:41-47`). Laravel's `image` rule can accept SVG, which executes when
opened from the same origin. Files are public by URL, never deleted on replace/delete, and
there is no per-user scoping or download authorisation.
**Fix:** `mimes:jpg,jpeg,png,webp` + server-side re-encode, private storage with authorised
serving, `nosniff`/CSP on the storage path, cleanup on replace/delete.

### SEC-10 — OAuth account linking and plaintext tokens · **High** · CWE-287/312/522
`SocialAuthController.php:31-32,81-82` match existing users by `orWhere('email', ...)` and
log them in (`:57,:107`) without checking `email_verified` or verifying an ID token's
`aud`/`iss`/`nonce`. Access and refresh tokens (`:39-52,:89-102`) are stored unencrypted;
`User.php` has no `encrypted` cast. `js/store.js:71-84` links by email on the static side too.
**Fix:** require verified email + password/email confirmation before linking, validate ID
tokens, encrypt or drop token columns, and log linking events.

### SEC-11 — Weak password policy · **Medium** · CWE-521
`AuthController.php:53` and `AccountController.php:53` use `Password::min(6)`.
**Fix:** `Password::min(12)->letters()->mixedCase()->numbers()->uncompromised()`; align the
static demo's 8-character rule.

### SEC-12 — Unsafe environment defaults · **Medium** · CWE-1188/614/489
`laravel/.env.example` sets `APP_DEBUG=true`, `APP_ENV=local`, `LOG_LEVEL=debug`,
`SESSION_ENCRYPT=false`, leaves `SESSION_SECURE_COOKIE` unset (defaults to false per
`config/session.php:172`) and `APP_KEY` empty. `laravel/public/.htaccess` sends no security
headers. Whoops error pages leak env/DB details in production.
**Fix:** ship production-safe defaults, add a boot-time debug guard, set HSTS and headers.

### SEC-13 — Hardcoded demo account · **Medium** · CWE-798/1188
`DatabaseSeeder.php:19-25` creates `demo@heresume.com` / `password123` with three resumes;
`README.md` documents `migrate --seed` and the credentials.
**Fix:** gate demo seeding to `local`, generate a random password, force change on first login.

### SEC-14 — No CSP / SRI / security headers · **Medium** · CWE-693/1021/829
No CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
or HSTS in static HTML, `.htaccess`, `bootstrap/app.php`, or middleware.
`js/auth.js:123` injects `https://accounts.google.com/gsi/client` with no `integrity`;
`js/config.js:7` and `js/contact.js:14` hold client-side configuration constants.
**Fix:** nonce/hash-based CSP, response-header middleware, SRI/`crossorigin` on third-party
scripts, Trusted Types for `innerHTML` sinks, and server-side proxying of third-party calls.

> **Positive change in this branch:** the 13 static pages and the Laravel layouts no longer
> load Google Fonts from a CDN. Geist is now self-hosted in `fonts/` (SIL OFL 1.1). This
> removes two third-party stylesheet origins, but the GIS script and the missing headers
> remain, so SEC-14 is still open.

### SEC-15 — State-changing GET and unauthenticated guest editor · **Medium** · CWE-352/650/770
`routes/web.php:49` maps `GET /resumes/create`; `ResumeController.php:19-21,43-55` creates a
DB row on that GET and takes `template`/`color`/`title` from the query string unvalidated.
`routes/web.php:46-48` exposes `/editor`, `/editor.html`, `/editor/guest` without throttling.
Laravel CSRF protects POST/PUT/PATCH/DELETE, not GET.
**Fix:** move creation to `POST /resumes` with validation; validate query params; throttle
guest editor routes.

### SEC-16 — Reverse tabnabbing · **Low** · CWE-1022
`laravel/resources/views/layouts/admin.blade.php:197,201,205,226` and
`laravel/resources/views/welcome.blade.php:64,91,113,121` use `target="_blank"` without
`rel="noopener noreferrer"`.
**Fix:** add the attribute everywhere; add a static check.

### SEC-17 — Incomplete account deletion · **Low** · CWE-212/459 · GDPR Art. 17
`AccountController.php:63-72` deletes only the `users` row. `Resume` uses `SoftDeletes`;
`ResumeSyncService` populates related tables; uploaded photos stay in
`storage/app/public/photos`; OAuth tokens remain. No provider-side revoke.
**Fix:** transactional cascade/force-delete + file cleanup + token revocation + a regression
test.

---

## 4. How the findings compose

1. An attacker stores a malicious `color` through `PUT /resumes/{id}` (SEC-05), or reaches an
   ownerless resume via SEC-04.
2. The editor renders it through `innerHTML` without escaping (SEC-06) → **stored XSS**.
3. With no CSP (SEC-14), the payload reads `localStorage` (SEC-01/02) and the CSRF meta tag,
   then acts as the victim — including admin pages if the victim is an admin (SEC-10 makes
   admin takeover easier).
4. Stolen refresh tokens (SEC-10) and soft-deleted resumes (SEC-17) keep the access alive.

Breaking any one of SEC-04, SEC-05, SEC-06 or SEC-14 substantially reduces the chain; fixing
all four closes it.

---

## 5. Remediation plan

**P0 (before any public deployment)**
- SEC-04 authorisation policy + non-nullable owner + tests.
- SEC-05 `FormRequest` validation and update whitelist.
- SEC-06/SEC-07 safe DOM construction, hex-colour validation, escaped ids.
- SEC-10 verified-email linking, ID-token validation, encrypted/dropped tokens.
- SEC-01/SEC-02 mark the static build as demo-only; stop persisting credentials.

**P1 (hardening)**
- SEC-14 CSP + security headers + SRI; SEC-09 upload restrictions; SEC-08 sanitisation.
- SEC-03 throttling; SEC-11 password policy; SEC-12 production defaults; SEC-13 demo seeder.
- SEC-15 POST-based creation; SEC-17 deletion cascade.

**P2 (defence in depth)**
- SEC-16 `rel` attributes; automated tests for each fixed finding; dependency scanning
  (`composer audit`, `npm audit`); a `SECURITY.md` disclosure policy; periodic review.

---

## 6. Deployment checklist (Laravel)

- [ ] `APP_DEBUG=false`, `APP_ENV=production`, unique `APP_KEY`, HTTPS everywhere + HSTS.
- [ ] `SESSION_SECURE_COOKIE=true`, `SESSION_ENCRYPT=true`, `SESSION_SAME_SITE=lax`.
- [ ] Document root is `laravel/public/` only; `.env`, `vendor/`, `storage/` never web-served.
- [ ] `php artisan storage:link` done, `photos/` served with `nosniff` and a CSP.
- [ ] OAuth redirect URIs are HTTPS and allowlisted in Google/LinkedIn consoles.
- [ ] `migrate --fresh --seed` **not** run against a public database (SEC-13).
- [ ] Admin flag granted manually, never by a seeder; no demo accounts in production.
- [ ] Rate limiting and logging/monitoring enabled; backups encrypted.
- [ ] `composer audit` and `npm audit` clean; dependencies pinned.

---

## 7. What this branch changes (and does not)

This branch replaces the purple/blue gradient UI with a monochrome, Geist-based theme:
self-hosted fonts, flat black/white buttons and header, a custom display face for the hero,
and a mobile bottom bar instead of the hamburger menu. It touches `css/`, `js/`, `*.html`,
`laravel/public/{css,js,fonts}` and Blade views only.

It **does not** fix any finding above. New code in `js/theme.js` deliberately avoids
`innerHTML` with user data (static SVG icons plus `textContent` labels), and the mobile menu
markup was removed, but the underlying trust-boundary, validation, authorisation, upload and
header issues remain open and are tracked individually.

---

## 8. Issue tracking

One GitHub issue was requested per finding. At review time **Issues were disabled** on
`Nour-yahyaoui/heresume_v2` (REST `PATCH .../has_issues` returned 403
`Resource not accessible by integration`, and `POST .../issues` returned 410
`Issues has been disabled in this repository`). The configured GitHub App token can create
issues and labels but cannot change repository settings.

Everything needed is committed here, ready to file:

- `.github/security-issues/SEC-01.md` … `SEC-17.md` — one issue body per finding.
- `.github/security-issues/manifest.tsv` — id / title / severity.
- `scripts/create-security-issues.sh` — creates all 17 issues (idempotent, skips existing
  titles) with the `security` label once Issues are enabled.

To finish: enable **Settings → General → Features → Issues** on the repository, then run
`./scripts/create-security-issues.sh` (or ask the agent to run it). The GitHub issue URLs
can then be added to the table in section 2.

---

## 9. Reporting a vulnerability

Until a formal policy exists, please report suspected vulnerabilities privately to the
repository owner rather than opening a public issue with exploit details. Include the
affected build (static or Laravel), reproduction steps, impact and a suggested fix. Do not
include real credentials or personal data in reports.

## 10. Caveats

- Static review only; no exploitation, fuzzing, dependency CVE lookup or PHP runtime tests.
- PHP/Composer are unavailable in this environment, so Laravel tests were not executed.
- `laravel/resources/views/welcome.blade.php` (the framework's default Tailwind welcome
  page) was excluded from the theme rebuild and is not routed by `routes/web.php`.
- Severity ratings are qualitative (impact × exploitability) and should be re-scored once
  the deployment context (public vs internal, single vs multi-tenant) is known.
