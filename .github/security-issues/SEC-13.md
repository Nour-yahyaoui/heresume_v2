> Tracking ID: `SEC-13` · Severity: **Medium** · CWE-798 / CWE-1188
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
`DatabaseSeeder` always creates a login with public credentials and sample PII; `README.md` documents it.

## Evidence
- `laravel/database/seeders/DatabaseSeeder.php:19-25` — `User::firstOrCreate(['email' => 'demo@heresume.com'], ['password' => Hash::make('password123')])`.
- `laravel/database/seeders/DatabaseSeeder.php` — three resumes and four published blog posts are attached to that account.
- `README.md` — quick-start instructs `php artisan migrate --seed` and lists the demo credentials.

## Impact
Running the documented setup against a public host yields a trivially guessable account with valid data and any future privileges granted to it. Attackers routinely scan for demo accounts. Seeded content also pollutes production analytics and search results.

## Remediation
- Gate demo data behind `app()->environment('local')` or a dedicated `--demo` seeder flag; never seed accounts in production.
- If a demo account is needed publicly, generate a random password at seed time and print it once, force a password change on first login, and mark the account as non-privileged.
- Add a check that `is_admin` is never set by seeders.
