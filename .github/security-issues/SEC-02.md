> Tracking ID: `SEC-02` · Severity: **High** · CWE-916 / CWE-328 / CWE-312 / CWE-922
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Static accounts are stored in the browser with a fast, unsalted hash (and a non-cryptographic fallback), alongside plaintext resume PII.

## Evidence
- `js/store.js:25-34` — `hash()` is `crypto.subtle.digest('SHA-256', ...)`; if `crypto.subtle` is unavailable it falls back to a djb2-style integer hash (`let h = 0; h = ((h << 5) - h + ...) | 0`).
- `js/store.js:44-55` — `register()` stores `{ id, name, email, password: await hash(password) }` in `cvm_users`.
- `js/store.js:57-67` — `login()` compares that hash directly.
- `js/store.js:86-88` — `logout()` removes only `cvm_session`; `cvm_users` and `cvm_resumes` persist indefinitely.
- `js/editor.js:451` — photos are stored as base64 data URLs in the resume JSON.

## Impact
SHA-256 without a salt or work factor is trivially brute-forced offline; the JS fallback is not a cryptographic hash at all. Names, emails, password hashes, CV contents (phone, address, employer history) and photos remain readable by any script on the origin and by the next user of a shared device. There is no session expiry or "clear my data" on logout.

## Remediation
- Do not store credentials in the browser. Use server-side auth with `password_hash()`/bcrypt/argon2.
- If a local demo account is unavoidable, use a memory-only store, never persist it, and clear all keys on logout.
- Provide an explicit "delete local data" action and document the retention behaviour.
