# HResume

A browser-based resume builder for creating, customizing, and printing professional resumes. Fill in your details, choose a layout and accent color, review the live preview, and export a PDF through your browser's print dialog.

## Two versions in one repository

| Version | Location | Requirements | Data storage |
| --- | --- | --- | --- |
| Static frontend | Repository root | A static HTTP server | Browser `localStorage` |
| Laravel application | `laravel/` | PHP 8.3+, Composer, and a database | Laravel database and filesystem storage; the guest editor also uses browser storage |

The Laravel application serves its own assets from `laravel/public/`; it does not serve the root HTML files. The two versions do not automatically synchronize accounts or resumes.

## Features

- Guided editor for contact details, a professional summary, experience, education, skills, languages, social links, projects, certificates, hobbies, and an optional photo.
- Live, paginated resume preview with template switching, accent colors, and section-level page-break controls.
- Classic, modern, creative, Europass, and Canadian-inspired designs.
- A4 print styles and PDF export using **Save as PDF** in the browser's print dialog.
- Resume creation, editing, duplication, and deletion.
- Laravel-backed registration, login, account settings, Google/LinkedIn sign-in routes, photo uploads, and an administrator dashboard.
- Template gallery, blog, contact form, newsletter subscription, reviews, and legal pages in the Laravel application.

## Repository structure

```text
heresume_v2/
├── index.html, editor.html, ...   # Static frontend pages
├── css/
│   ├── style.css                 # Site, editor, and print styles
│   └── resume.css                # Resume template styles
├── js/
│   ├── store.js                  # Browser-local accounts and resumes
│   ├── editor.js                 # Editor interactions and autosave
│   ├── render.js                 # Template registry, rendering, pagination
│   ├── auth.js                   # Static login and registration flows
│   └── ...                       # Dashboard, gallery, blog, and site scripts
├── images/                       # Logos, template images, and sample assets
└── laravel/
    ├── app/                      # Controllers, models, middleware, services
    ├── bootstrap/                # Application bootstrap and middleware aliases
    ├── config/                   # Database, authentication, services, storage
    ├── database/
    │   ├── migrations/           # Database schema
    │   └── seeders/              # Templates, demo resumes, and blog posts
    ├── public/                   # Laravel web root and frontend assets
    │   ├── css/
    │   ├── js/
    │   └── images/
    ├── resources/
    │   ├── views/                # Blade pages, editor, and admin layouts
    │   ├── css/                  # Tailwind entrypoint
    │   └── js/                   # Vite JavaScript entrypoint
    ├── routes/web.php            # Public, account, resume, and admin routes
    ├── tests/                    # PHPUnit feature and unit tests
    ├── composer.json             # PHP dependencies and scripts
    ├── package.json              # Vite/Tailwind tooling
    └── .env.example              # Environment configuration template
```

## Quick start

Clone the repository:

```bash
git clone https://github.com/Nour-yahyaoui/heresume_v2.git
cd heresume_v2
```

Choose one of the following setups.

### Option 1: Run the static frontend

No Composer or npm installation is required. With Python 3 installed, run this from the repository root:

```bash
python3 -m http.server 8765
```

Open **http://localhost:8765**. Any other static HTTP server can be used instead.

The static version stores accounts, sessions, and resumes under the `cvm_users`, `cvm_session`, and `cvm_resumes` localStorage keys. Data is specific to the browser and origin; clearing site data removes it. Its client-side authentication is a frontend prototype, not production access control.

### Option 2: Run the Laravel application

Prerequisites:

- **PHP 8.3 or newer**, with the extensions required by the locked Laravel dependencies and the PDO driver for your database. Composer will report missing extensions.
- **Composer 2**.
- **SQLite** for the default setup, or another database supported by `laravel/config/database.php`.

From the repository root:

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate

# Create the default SQLite database file.
touch database/database.sqlite

# Set up the schema and load development sample data.
php artisan migrate --seed

# Make uploaded photos available through public/storage.
php artisan storage:link

php artisan serve
```

Open **http://localhost:8000**. You can set `APP_NAME=HResume` in `.env`; the example file otherwise retains Laravel's default application name.

The default environment uses SQLite for application data, sessions, cache, and queues, so running migrations is required. On Windows, use `copy .env.example .env` instead of `cp`, and create an empty `database/database.sqlite` file manually if `touch` is unavailable.

#### Development seed data

`php artisan migrate --seed` loads the template catalog, sample resumes, and blog posts. It also creates this demonstration account:

| Field | Value |
| --- | --- |
| Email | `demo@heresume.com` |
| Password | `password123` |

These credentials are for local development only. Use `php artisan migrate` without `--seed` if you do not want sample data, and do not run the demo seeder against a public production database.

The main Blade layouts load the checked-in CSS and JavaScript from `laravel/public/`. An npm build or Vite development server is **not required** for those pages.

## Configuration

Configure the Laravel application in `laravel/.env`, never by putting secrets in Blade files or public JavaScript.

| Variable | Purpose |
| --- | --- |
| `APP_NAME` | Application display name. |
| `APP_URL` | Base URL, also used to derive default OAuth callback URLs and public storage URLs. |
| `APP_ENV`, `APP_DEBUG` | Environment and debug behavior; use `production` and `false` in production. |
| `DB_CONNECTION` | Database driver; defaults to `sqlite`. Other connection settings are in `config/database.php`. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials for Laravel Socialite. |
| `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | LinkedIn OpenID Connect credentials for Laravel Socialite. |
| `GOOGLE_REDIRECT_URI` | Optional Google callback override; defaults to `APP_URL/auth/google/callback`. |
| `LINKEDIN_REDIRECT_URI` | Optional LinkedIn callback override; defaults to `APP_URL/auth/linkedin/callback`. |

Email/password authentication works without OAuth credentials. To enable social sign-in, add the relevant credentials to `.env` and register the exact callback URL with the provider. These OAuth variables are read by `config/services.php` even though they are not included in `.env.example`.

The **static frontend** has a separate Google Identity Services configuration: set `googleClientId` in `js/config.js` and authorize the site's origin in Google Cloud. This does not configure Laravel authentication. Leave it empty to use the static email/password flow without Google sign-in.

## Main Laravel routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/templates` | Template catalog |
| `/editor` | Guest editor |
| `/register`, `/login` | Account registration and login |
| `/resumes`, `/dashboard` | Signed-in user's resumes |
| `/resumes/create` | Create a resume, or continue as a guest |
| `/resumes/{id}/edit` | Edit a resume |
| `/account` | Profile, password, and account settings |
| `/blog`, `/contact` | Blog and contact pages |
| `/privacy`, `/terms` | Legal pages |
| `/admin` | Administrator dashboard; requires an admin account |
| `/admin/users` | User search, filters, and PRO/admin flag management |

See [`laravel/routes/web.php`](laravel/routes/web.php) for all routes and middleware. Resume-saving and photo-upload endpoints are web routes with JSON responses, not a separate `/api` service.

### Granting administrator access

The seeders do not create an administrator. Register an account through the application, then promote that existing user locally:

```bash
cd laravel
php artisan tinker
```

Inside Tinker, replace the example email with your registered account's email:

```php
\App\Models\User::where('email', 'your-email@example.com')->firstOrFail()->update(['is_admin' => true]);
```

Exit Tinker and visit `/admin`. Administrator access is controlled by the user's `is_admin` flag. The admin user-management screen can toggle PRO status; the repository does not include payment processing.

## Development notes

- **Static frontend:** edit the root HTML, `css/`, and `js/` files.
- **Laravel backend and pages:** edit `laravel/app/`, `laravel/routes/`, and `laravel/resources/views/`.
- **Laravel frontend:** edit `laravel/public/css/` and `laravel/public/js/`. These are separate copies of the root assets, not automatically generated or synchronized from them. Apply shared UI fixes to the appropriate copy or copies deliberately.
- **Templates:** rendering definitions live in the `TEMPLATES` registry in `js/render.js` and its Laravel public copy. Template appearance is controlled by the resume/site stylesheets. Keep the Laravel catalog in `database/seeders/TemplateSeeder.php` aligned when adding or changing designs.
- **Persistence:** the static store uses localStorage. Laravel resume updates go through `ResumeController` and `ResumeSyncService`; uploaded photos use the public storage disk and require `storage:link`.
- **PDF export:** the download action opens `window.print()`, rather than generating a PDF on the server. Select **Save as PDF**; the stylesheet defines A4 page sizing.

### Optional Vite/Tailwind tooling

The Laravel directory includes Vite 8 and Tailwind CSS 4 entrypoints. For work on those entrypoints, use Node.js 22.12+ and npm:

```bash
cd laravel
npm install
npm run build
```

Use `npm run dev` for the Vite development server. The current main Blade layouts use Laravel's `asset()` helper for their checked-in styles and scripts rather than the `@vite` directive.

## Tests and formatting

Run the PHP tests and check formatting with Laravel Pint:

```bash
cd laravel
composer test
vendor/bin/pint --test
```

The test configuration uses an in-memory SQLite database. The repository currently contains basic example tests, not comprehensive coverage of the resume or authentication workflows.

## Deployment checklist

- Point the web server's document root at **`laravel/public/`**, not the repository root.
- Set `APP_ENV=production`, `APP_DEBUG=false`, and the correct HTTPS `APP_URL`.
- Configure the production database and required service credentials outside version control.
- Ensure `storage/` and `bootstrap/cache/` are writable by the application.
- Run migrations in a controlled deployment step and create the public storage link. Avoid demo seed data in production.
- Build any Vite-managed assets you use and run Laravel's route, view, and configuration cache commands as appropriate for your deployment.
