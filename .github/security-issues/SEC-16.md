> Tracking ID: `SEC-16` · Severity: **Low** · CWE-1022
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Several links open a new tab without severing the `window.opener` relationship.

## Evidence
- `laravel/resources/views/layouts/admin.blade.php:197`, `:201`, `:205`, `:226` — `<a ... target="_blank">` with no `rel`.
- `laravel/resources/views/welcome.blade.php:64`, `:91`, `:113`, `:121` — same (framework welcome view).

## Impact
Classic reverse-tabnabbing: the opened page can redirect the original tab (e.g. to a phishing lookalike) via `window.opener.location`. Modern browsers imply `noopener` for `target="_blank"`, but older browsers and embedded webviews do not.

## Remediation
Add `rel="noopener noreferrer"` to every `target="_blank"` anchor, and add a lint/static check so new links cannot regress.
