> Tracking ID: `SEC-09` · Severity: **Medium** · CWE-434 / CWE-79 / CWE-552
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
`uploadPhoto()` stores client files on the `public` disk under a generated name and serves them directly from `/storage/...`; Laravel's `image` rule can accept SVG, which may contain script.

## Evidence
- `laravel/app/Http/Controllers/ResumeController.php:119` — `'photo' => 'required|image|max:4096'`.
- `laravel/app/Http/Controllers/ResumeController.php:123-126` — `$request->file('photo')->store('photos', 'public')`, then `Storage::url($path)` and `$data['personal']['photo'] = $url`.
- `laravel/config/filesystems.php:41-47` — the `public` disk has `'visibility' => 'public'`.
- `laravel/resources/views/pages/editor.blade.php` / `laravel/public/js/editor.js` — the returned URL is used directly in `<img src>` / CSS `url()`.
- No deletion of the previous photo on re-upload, no per-user directory, no download authorisation.

## Impact
SVG is among the MIME types Laravel's `image` rule accepts; an SVG containing `<script>` executes when the file is opened directly from the same origin, giving stored XSS. All uploaded CV photos are publicly reachable by URL enumeration and are never removed, so personal photos persist after account deletion (see SEC-17). A 4 MB (4096 KB) per-file limit with unlimited uploads allows disk exhaustion.

## Remediation
- Restrict to raster formats: `'photo' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048']`, plus `getimagesize()` / re-encode server-side (e.g. Intervention Image) to strip metadata and scripts.
- Store outside the public web root and serve through an authorised controller, or use signed/temporary URLs.
- Serve uploads with `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff` and a CSP on the storage path.
- Delete the old file on replace/delete, and scope paths per user.
