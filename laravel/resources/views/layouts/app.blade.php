<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="icon" type="image/svg+xml" href="{{ asset('images/logos/favicon-mono.svg') }}">
  <link rel="icon" href="{{ asset('images/logos/favicon.ico') }}" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/logos/favicon-32x32.png') }}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/logos/favicon-16x16.png') }}">
  <link rel="apple-touch-icon" href="{{ asset('images/logos/apple-touch-icon.png') }}">
  <link rel="manifest" href="{{ asset('site.webmanifest') }}">
  <meta name="theme-color" content="#ffffff">
  <meta name="color-scheme" content="light">
  <title>@yield('title', 'HResume — Free Professional Resume Builder')</title>
  <meta name="description" content="@yield('meta_description', 'Build a professional resume in minutes. Pick from 33 polished templates, customise with live preview, and download as PDF.')">
  
  <link rel="preload" href="{{ asset('fonts/geist-latin-wght-normal.woff2') }}" as="font" type="font/woff2" crossorigin>
  
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ asset('css/resume.css?v=canadian') }}">

  @stack('styles')
  <link rel="stylesheet" href="{{ asset('css/theme.css') }}">
  <script>window.HRESUME_AUTHENTICATED = @json(auth()->check());</script>
  <script src="{{ asset('js/theme.js') }}" defer></script>
</head>
<body data-page="@yield('page_name', 'home')">

  @if(auth()->check() && request()->routeIs(['resumes.index', 'dashboard', 'account.index']))
    <!-- App Header for authenticated dashboard/account pages -->
    <header class="app-header">
      <div class="container app-header-inner">
        <a href="{{ route('home') }}" class="logo">
          <span class="logo-mark"><img src="{{ asset('images/logos/logo.webp') }}" alt=""></span>H<span>Resume</span>
        </a>
        <nav class="app-nav">
          <a href="{{ route('resumes.index') }}" class="{{ request()->routeIs('resumes.index') ? 'is-active' : '' }}">Resumes</a>
          <a href="{{ route('templates.index') }}" class="{{ request()->routeIs('templates.index') ? 'is-active' : '' }}">Templates</a>
          <a href="{{ route('blog.index') }}" class="{{ request()->routeIs('blog.*') ? 'is-active' : '' }}">Blog</a>
        </nav>
        <div class="user-menu" id="userMenu">
          <button type="button" class="user-menu-button" id="userMenuButton" aria-haspopup="menu" aria-expanded="false">
            <span class="avatar">{{ strtoupper(substr(auth()->user()->name, 0, 2)) }}</span>
            <span class="user-menu-name">{{ auth()->user()->name }}</span>
          </button>
          <div class="user-menu-list" id="userMenuList" role="menu" hidden>
            <div class="user-menu-head">
              <strong>{{ auth()->user()->name }}</strong>
              <span>{{ auth()->user()->email }}</span>
            </div>
            <a href="{{ route('account.index') }}" role="menuitem">Account</a>
            <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
              @csrf
              <button type="submit" role="menuitem" style="width: 100%; text-align: left; background: none; border: none; cursor: pointer;">Log out</button>
            </form>
          </div>
        </div>
      </div>
    </header>
  @else
    <!-- Public Site Header -->
    <header class="site-header" id="siteHeader">
      <div class="container site-header-inner">
        <a href="{{ route('home') }}" class="logo">
          <span class="logo-mark"><img src="{{ asset('images/logos/logo.webp') }}" alt=""></span>H<span>Resume</span>
        </a>
        <nav class="site-nav" aria-label="Main">
          <a href="{{ route('home') }}#how" class="{{ request()->is('/') ? 'is-active' : '' }}">How it works</a>
          <a href="{{ route('templates.index') }}" class="{{ request()->routeIs('templates.index') ? 'is-active' : '' }}">Templates</a>
          <a href="{{ route('home') }}#testimonials">Testimonials</a>
          <a href="{{ route('blog.index') }}" class="{{ request()->routeIs('blog.*') ? 'is-active' : '' }}">Blog</a>
          <a href="{{ route('contact.show') }}" class="{{ request()->routeIs('contact.show') ? 'is-active' : '' }}">Contact</a>
        </nav>
        <div class="site-actions">
          @auth
            @if(auth()->user()->isAdmin())
              <a href="{{ route('admin.dashboard') }}" class="btn btn-ghost" style="color: #606060; font-weight: 600;">Admin</a>
            @endif
            <a href="{{ route('resumes.index') }}" class="btn btn-brand">Dashboard</a>
          @else
            <a href="{{ route('login') }}" class="btn btn-ghost site-login">Log in</a>
            <a href="{{ route('register') }}" class="btn btn-brand">Get started</a>
          @endauth
        </div>
        <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="siteMenu" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="site-menu" id="siteMenu">
        <div class="container">
          <nav class="site-menu-nav" aria-label="Main">
            <a href="{{ route('home') }}#how">How it works</a>
            <a href="{{ route('templates.index') }}">Templates</a>
            <a href="{{ route('home') }}#testimonials">Testimonials</a>
            <a href="{{ route('blog.index') }}">Blog</a>
            <a href="{{ route('contact.show') }}">Contact</a>
          </nav>
          <div class="site-menu-actions">
            @auth
              <a href="{{ route('resumes.index') }}" class="btn btn-brand btn-lg btn-block">Dashboard</a>
            @else
              <a href="{{ route('register') }}" class="btn btn-brand btn-lg btn-block">Get started — it’s free</a>
              <a href="{{ route('login') }}" class="btn btn-secondary btn-lg btn-block">Log in</a>
            @endauth
          </div>
        </div>
      </div>
      <div class="site-menu-backdrop" id="menuBackdrop" data-menu-close></div>
    </header>
  @endif

  @if(session('success'))
    <div class="container" style="margin-top: 18px;">
      <div class="alert alert-success" style="background: #f9f9f9; border: 1px solid #e0e0e0; color: #4a4a4a; padding: 12px 16px; border-radius: 8px; font-size: 14px;">
        {{ session('success') }}
      </div>
    </div>
  @endif

  @if(session('error') || $errors->any())
    <div class="container" style="margin-top: 18px;">
      <div class="alert alert-danger" style="background: #f5f5f5; border: 1px solid #d5d5d5; color: #363636; padding: 12px 16px; border-radius: 8px; font-size: 14px;">
        {{ session('error') ?? $errors->first() }}
      </div>
    </div>
  @endif

  @yield('content')

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="{{ route('home') }}" class="logo"><span class="logo-mark"><img src="{{ asset('images/logos/logo.webp') }}" alt=""></span>H<span>Resume</span></a>
          <p>Create a professional resume in minutes and download it as a PDF.</p>
          <form action="{{ route('newsletter.subscribe') }}" method="POST" style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
            @csrf
            <input type="email" name="email" placeholder="Get career advice & updates..." required style="padding: 7px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; background: #ffffff; color: #181818; flex: 1; min-width: 180px;">
            <button type="submit" class="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
        <div class="footer-col">
          <h3>Product</h3>
          <ul>
            <li><a href="{{ route('home') }}#how">How it works</a></li>
            <li><a href="{{ route('templates.index') }}">Templates</a></li>
            <li><a href="{{ auth()->check() ? route('resumes.index') : route('register') }}">Create a resume</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Resources</h3>
          <ul>
            <li><a href="{{ route('blog.index') }}">Blog</a></li>
            <li><a href="{{ route('home') }}#faq">FAQ</a></li>
            <li><a href="{{ route('contact.show') }}">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Legal</h3>
          <ul>
            <li><a href="{{ route('privacy') }}">Privacy policy</a></li>
            <li><a href="{{ route('terms') }}">Terms of service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© {{ date('Y') }} HResume. Built with Laravel 12.</div>
    </div>
  </footer>

  <script src="{{ asset('js/store.js') }}"></script>
  <script src="{{ asset('js/render.js?v=canadian') }}"></script>
  <script src="{{ asset('js/motion.js') }}"></script>
  <script>
    // Header scroll & mobile toggle
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
      const onScroll = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      
      const toggle = document.getElementById('navToggle');
      const menu = document.getElementById('siteMenu');
      const backdrop = document.getElementById('menuBackdrop');
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          const open = menu.classList.toggle('is-open');
          toggle.classList.toggle('is-active', open);
          toggle.setAttribute('aria-expanded', String(open));
          document.body.classList.toggle('menu-open', open);
        });
        if (backdrop) {
          backdrop.addEventListener('click', () => {
            menu.classList.remove('is-open');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
          });
        }
      }
    }

    // User menu toggle
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenuList = document.getElementById('userMenuList');
    if (userMenuButton && userMenuList) {
      userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !userMenuList.hasAttribute('hidden');
        if (isOpen) {
          userMenuList.setAttribute('hidden', '');
        } else {
          userMenuList.removeAttribute('hidden');
        }
      });
      document.addEventListener('click', () => {
        if (userMenuList) userMenuList.setAttribute('hidden', '');
      });
    }
  </script>
  @stack('scripts')
</body>
</html>
