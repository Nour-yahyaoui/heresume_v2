> Tracking ID: `SEC-17` · Severity: **Low** · CWE-212 / CWE-459 / GDPR Art. 17
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
`AccountController::destroy()` deletes only the `users` row; related personal data is retained.

## Evidence
- `laravel/app/Http/Controllers/AccountController.php:63-72` — `Auth::logout(); $user->delete(); $request->session()->invalidate(); ...` with no cascade, no `Storage::delete()` and no token revocation.
- `laravel/app/Models/Resume.php` uses `SoftDeletes`; resumes (names, emails, employers, base64 photos) remain in the DB.
- `laravel/app/Models/User.php` — `google_token` / `linkedin_*_token` / `github_import_token` columns are retained on the deleted row until the row itself is purged; no provider-side revoke call.
- `laravel/app/Http/Controllers/ResumeController.php:123` — uploaded photos stay in `storage/app/public/photos`.
- `laravel/database/migrations` — no `onDelete('cascade')` / `afterCommit` cleanup was observed for related tables populated by `ResumeSyncService`.

## Impact
Personal data and credentials survive a "delete my account" request, which is a data-retention/GDPR erasure gap. Soft-deleted resumes are still readable via direct id if the IDOR in SEC-04 is exploited. Stored OAuth refresh tokens remain usable if the DB is leaked.

## Remediation
- Force-delete or anonymise all related rows in a DB transaction (`ForceDelete` resumes, `BasicInfo`, `Experience`, reviews, contact messages, subscribers) and delete uploaded files.
- Revoke provider tokens and null the token columns before deletion.
- Add a feature test asserting no PII remains after `DELETE /account`, and document the retention period in the privacy policy.
