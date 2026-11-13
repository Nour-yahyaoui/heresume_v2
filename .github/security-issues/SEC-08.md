> Tracking ID: `SEC-08` · Severity: **Medium** · CWE-79
>
> Full context: `SECURITY_REVIEW.md` at the repository root

## Summary
Blog post HTML is printed raw, with no sanitisation policy between the database and the browser.

## Evidence
- `laravel/resources/views/pages/post.blade.php:23` — `{!! $post->content !!}`.
- `laravel/app/Models/BlogPost.php` — `content` is a plain fillable string; no cast, mutator or purifier.
- `laravel/database/seeders/DatabaseSeeder.php` — seeds `content` as raw HTML.
- `laravel/app/Http/Controllers/BlogController.php:34-42` — `show()` fetches by slug and passes the post straight to the view.
- `js/blog.js:204` — the static build also injects `${post.body}` as raw HTML (currently a hardcoded constant).

## Impact
Any path that writes `blog_posts.content` (admin tooling, an import, a compromised DB user, a future CMS, or a mass-assignment bug) yields stored, same-origin XSS on `/blog/{slug}`. There is also no documented trust boundary telling maintainers that this field must contain safe HTML.

## Remediation
- Sanitise on write (e.g. HTMLPurifier / `mews/purifier`) with an allowlist of tags, and/or render with `{{ }}` plus a controlled markdown pipeline.
- Strip `on*` attributes, `javascript:` URLs, `<script>`, `<iframe>` and inline `style`.
- Document the field as untrusted and add a test asserting that `<script>` in content is not emitted.
