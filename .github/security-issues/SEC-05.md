> Tracking ID: `SEC-05` · Severity: **High** · CWE-20 / CWE-915 / CWE-79
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
The autosave endpoint validates the *shape* of only a few top-level fields and persists attacker-controlled nested JSON and arbitrary strings.

## Evidence
- `laravel/app/Http/Controllers/ResumeController.php:85-98` — `data` is only `sometimes|array`; `color` is `sometimes|string|max:32`; `template` is `sometimes|string|max:64`; `photo_path` is `nullable|string` with no URL/scheme check.
- `laravel/app/Http/Controllers/ResumeController.php:101-110` — `$resume->update($validated); syncToRelational($resume);` and the full `$resume` is returned in JSON.
- `laravel/app/Models/Resume.php` — `$fillable` includes `user_id`, `public_profile_enabled`, `public_profile_slug`, `photo_path`, `data`.
- `laravel/public/js/editor.js:53-63` — the browser sends `{ title, template, color, data }` on a 500 ms autosave; nothing constrains nested keys.
- `laravel/resources/views/pages/editor.blade.php:190-196` — `@json($resume->data)` injects stored values into an inline script.

## Impact
Arbitrary keys and sizes in `data` (storage/DoS), arbitrary `color` strings (see SEC-07), `photo_path` pointing at external trackers or `data:`/`javascript:` URLs, client-controlled `public_profile_*` flags, and a JSON response that echoes everything back. Unvalidated content also feeds the relational sync service and the print/PDF renderer.

## Remediation
- Use a `FormRequest` with explicit nested rules (`data.personal.fullName => nullable|string|max:255`, array sizes, allowed keys, `color => regex:/^#[0-9a-fA-F]{6}$/`, `template => in:<known ids>`).
- Whitelist the fields that may be updated; never pass the whole validated array to `update()` when `$fillable` contains privileged fields.
- Validate URLs with an allowlist of schemes/hosts; cap JSON payload size and array lengths.
- Return only the fields the editor needs, not the whole model.
