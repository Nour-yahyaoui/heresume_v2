> Tracking ID: `SEC-01` · Severity: **High** · CWE-639 / CWE-602 / CWE-922
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
The static front end has no server-side authentication. Accounts, sessions and resumes live in `localStorage`, and the page guards only check whether `cvm_session` resolves to a local user object.

## Evidence
- `js/store.js:6` — `KEYS = { users: 'cvm_users', session: 'cvm_session', resumes: 'cvm_resumes' }`
- `js/store.js:38-43` — `Auth.current()` looks up an id from `localStorage` in the local user list.
- `js/store.js:121-129` — `requireUser()` / `redirectIfSignedIn()` are the only guards on `editor.html`, `dashboard.html`, `resumes.html`, `account.html`.
- `js/store.js:20-23` — `uid()` = `Date.now().toString(36) + Math.random().toString(36)`; ids are predictable.
- `laravel/public/js/store.js` is an identical copy.

## Impact
Anyone with devtools (or any XSS — see SEC-06) can set `cvm_session` to another user's id, read every account's name/email/password hash and every resume, or mint a new account object. The "session" is never validated by a server, so this is a full authentication and authorization bypass for the static build. On a shared browser, logging out only removes the session id.

## Remediation
- Treat the static build strictly as a demo; use the Laravel app (or a real API) for accounts and resume storage.
- Never make authorization decisions from client-mutable storage; enforce ownership server-side on every read and write.
- Use opaque, server-issued session identifiers, rotate them on login, and expire them.
- Add a visible "demo build — do not enter real personal data" notice to the static UI and the README.
