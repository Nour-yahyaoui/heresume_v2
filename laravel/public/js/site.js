/*
 * Shared header and footer for public pages (landing, blog, contact, legal).
 * Include right after <body> so the header renders before the page content.
 * Pages set <body data-page="..."> to mark the active link.
 *
 * Mobile navigation lives in js/theme.js (bottom bar); there is no hamburger
 * menu any more.
 */
(function () {
  'use strict';

  const page = document.body.dataset.page || '';
  const onHome = page === 'home';
  const user = window.CVM ? window.CVM.Auth.current() : null;
  const home = (hash) => (onHome ? hash : `index.html${hash}`);

  const NAV = [
    { href: home('#how'), label: 'How it works' },
    { href: 'templates.html', label: 'Templates', pages: ['templates'] },
    { href: home('#testimonials'), label: 'Testimonials' },
    { href: 'blog.html', label: 'Blog', pages: ['blog', 'post'] },
    { href: 'contact.html', label: 'Contact', pages: ['contact'] },
  ];

  const actions = user
    ? '<a href="dashboard.html" class="btn btn-primary">Go to dashboard</a>'
    : `<a href="login.html" class="btn btn-ghost site-login">Log in</a>
       <a href="register.html" class="btn btn-primary">Get started</a>`;

  const navLinks = NAV.map((item) => `<a href="${item.href}"${item.pages && item.pages.includes(page) ? ' class="is-active" aria-current="page"' : ''}>${item.label}</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="site-header" id="siteHeader">
      <div class="container site-header-inner">
        <a href="index.html" class="logo"><span class="logo-mark"><img src="images/logos/logo.webp" alt=""></span>H<span>Resume</span></a>
        <nav class="site-nav" aria-label="Main">${navLinks}</nav>
        <div class="site-actions">${actions}</div>
      </div>
    </header>`);

  const startHref = user ? 'dashboard.html' : 'register.html';

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="index.html" class="logo"><span class="logo-mark"><img src="images/logos/logo.webp" alt=""></span>H<span>Resume</span></a>
              <p>Create a professional resume in minutes and download it as a PDF.</p>
            </div>
            <div class="footer-col">
              <h3>Product</h3>
              <ul>
                <li><a href="${home('#how')}">How it works</a></li>
                <li><a href="templates.html">Templates</a></li>
                <li><a href="${startHref}">Create a resume</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Resources</h3>
              <ul>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="${home('#faq')}">FAQ</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Legal</h3>
              <ul>
                <li><a href="privacy.html">Privacy policy</a></li>
                <li><a href="terms.html">Terms of service</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">© ${new Date().getFullYear()} HResume</div>
        </div>
      </footer>`);
  });

  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
