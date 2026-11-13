> Tracking ID: `SEC-04` · Severity: **High** · CWE-639 / CWE-862
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Every ownership check in `ResumeController` is conditional on the resume having an owner, so rows with a null/0 `user_id` are readable and writable by any authenticated user.

## Evidence
- `laravel/app/Http/Controllers/ResumeController.php:65` (`edit`), `:81` (`update`), `:115` (`uploadPhoto`), `:142` (`duplicate`), `:155` (`destroy`) — all use `if ($resume->user_id && $resume->user_id !== Auth::id()) { ... }`.
- `laravel/routes/web.php:46-49` — `/editor`, `/editor/guest` and `/resumes/create` are unauthenticated; the guest editor writes resumes without an owner.
- `laravel/app/Http/Controllers/ResumeController.php:146` — `duplicate()` uses `$resume->replicate()`, inheriting `user_id` (and `photo_path`, `public_profile_*`) from the source row.
- `laravel/app/Models/Resume.php` uses `SoftDeletes`, so deleted rows remain resolvable by id.

## Impact
An authenticated user who knows or enumerates a resume id can `GET /resumes/{id}/edit`, `PUT /resumes/{id}`, `POST /resumes/{id}/photo`, duplicate or delete any ownerless resume. Because ids are sequential, enumeration is trivial. Any guest/orphan/imported row is exposed.

## Remediation
- Replace all five checks with a single policy: `Gate::authorize('manage', $resume)` or `abort_unless($resume->user_id === Auth::id(), 403)` — a null owner must never pass.
- Add a `ResumePolicy` and apply it consistently; add feature tests for ownerless rows.
- Make `user_id` non-nullable at the DB level (or explicitly scope guest drafts to a signed guest token).
- Randomise public ids (UUID/ULID) or validate ownership before any response is built.
