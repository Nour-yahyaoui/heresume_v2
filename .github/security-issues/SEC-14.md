> Tracking ID: `SEC-14` · Severity: **Medium** · CWE-693 / CWE-1021 / CWE-829
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Neither build sends a Content Security Policy or standard security headers, and both loaded external code without integrity metadata.

## Evidence
- No `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or `Strict-Transport-Security` in any static HTML head, `laravel/public/.htaccess`, `bootstrap/app.php`, or any middleware in `laravel/app/Http/Middleware/`.
- `js/auth.js:123` — dynamically injects `https://accounts.google.com/gsi/client` with no `integrity` attribute and no `crossorigin` policy.
- `js/config.js:7` — `googleClientId` is configured in a client-side file; `js/contact.js:14` — `CONTACT_ENDPOINT` is a client-side constant (any form-service key placed there is public).
- Before the current theme rebuild, all 13 HTML pages loaded `https://fonts.googleapis.com` / `fonts.gstatic.com` stylesheets with no SRI. The rebuild self-hosts Geist in `fonts/`; the GIS script is still external.
- Static pages use inline `<script>` blocks (e.g. `editor.html` `CVM.Auth.requireUser()`) and inline `style` attributes, so a naive strict CSP would need nonces/hashes.

## Impact
Any XSS (SEC-06, SEC-08, SEC-09) executes unrestricted, can exfiltrate `localStorage` credentials and CSRF tokens, and can load arbitrary third-party scripts. Missing `X-Frame-Options` permits clickjacking; missing `Referrer-Policy` can leak URL contents; a compromised CDN would execute in-origin.

## Remediation
- Add a response middleware sending `Content-Security-Policy` (with per-request nonces for the inline scripts), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` and HSTS.
- For the static build, add the equivalent `<meta http-equiv>` headers plus a nonce/hash-based CSP, and move inline scripts into external files.
- Add SRI + `crossorigin` to any remaining third-party script, or self-host it; use Trusted Types for the `innerHTML` sinks.
- Keep secrets out of `js/config.js`; route third-party calls through the server.
