/*
 * Monochrome theme runtime.
 *
 * Injects the mobile bottom bar that replaces the old hamburger menu, and
 * marks the current destination. Everything here is static markup: no user
 * data is ever interpolated into HTML (see SECURITY_REVIEW.md).
 */
(function () {
  'use strict';

  document.documentElement.dataset.theme = 'monochrome';

  // The editor is a full-height workspace with its own toolbar; a fixed bar
  // would overlap the panel and the print preview.
  if (document.body.classList.contains('editor-body')) return;

  // Laravel layouts carry a CSRF meta tag; the static build does not.
  const laravel = Boolean(document.querySelector('meta[name="csrf-token"]'));
  const signedIn = Boolean(
    window.HRESUME_AUTHENTICATED ||
    (window.CVM && window.CVM.Auth && window.CVM.Auth.current())
  );

  const hrefs = laravel
    ? {
        home: '/',
        templates: '/templates',
        create: signedIn ? '/resumes' : '/register',
        blog: '/blog',
        account: signedIn ? '/account' : '/login',
      }
    : {
        home: 'index.html',
        templates: 'templates.html',
        create: signedIn ? 'resumes.html' : 'register.html',
        blog: 'blog.html',
        account: signedIn ? 'account.html' : 'login.html',
      };

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>',
    templates: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    create: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h11l3 3v13H5z"/><path d="M8 11h8M8 15h8M8 7h5"/></svg>',
    account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-3.9 3.7-6 7.5-6s6.7 2.1 7.5 6"/></svg>',
  };

  const items = [
    { key: 'home', label: 'Home', href: hrefs.home },
    { key: 'templates', label: 'Templates', href: hrefs.templates },
    { key: 'create', label: 'Create', href: hrefs.create, primary: true },
    { key: 'blog', label: 'Blog', href: hrefs.blog },
    { key: 'account', label: signedIn ? 'Account' : 'Log in', href: hrefs.account },
  ];

  // Which item owns the current URL.
  const segments = location.pathname.split('/').filter(Boolean);
  const raw = laravel ? (segments[0] || 'home') : (segments.pop() || 'index.html');
  const current = String(raw).replace(/\.html$/, '');
  const activeKey = {
    '': 'home', index: 'home', home: 'home',
    templates: 'templates', template: 'templates',
    blog: 'blog', post: 'blog',
    register: 'create', dashboard: 'create', resumes: 'create', resume: 'create',
    login: 'account', account: 'account', 'editor': 'create',
  }[current];

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Mobile navigation');

  const inner = document.createElement('div');
  inner.className = 'bottom-nav-inner';

  items.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.className = item.primary ? 'bottom-nav-primary' : '';
    if (item.key === activeKey) link.setAttribute('aria-current', 'page');
    // Static icon markup only — labels are set as text, never as HTML.
    link.innerHTML = ICONS[item.key];
    const label = document.createElement('span');
    label.textContent = item.label;
    link.appendChild(label);
    inner.appendChild(link);
  });

  nav.appendChild(inner);
  document.body.classList.add('has-bottom-nav');
  document.body.appendChild(nav);
})();
