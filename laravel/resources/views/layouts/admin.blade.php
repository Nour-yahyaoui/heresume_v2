<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', 'Admin Backoffice — HResume')</title>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="color-scheme" content="light">
  <link rel="preload" href="{{ asset('fonts/geist-latin-wght-normal.woff2') }}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ asset('css/theme.css') }}">
  <style>
    :root {
      --admin-sidebar-bg: #171717;
      --admin-sidebar-hover: #282828;
      --admin-sidebar-active: #606060;
      --admin-text: #f8fafc;
      --admin-muted: #a1a1a1;
      --admin-bg: #f8fafc;
    }
    body {
      background: var(--admin-bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      color: #282828;
    }
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
    }
    .admin-sidebar {
      width: 250px;
      background: var(--admin-sidebar-bg);
      color: var(--admin-text);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .admin-brand {
      padding: 24px 20px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .admin-brand span.badge-admin {
      background: #7b7b7b;
      color: #fff;
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 999px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .admin-nav {
      padding: 16px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .admin-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      color: var(--admin-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.15s ease;
    }
    .admin-nav a:hover {
      background: var(--admin-sidebar-hover);
      color: #ffffff;
    }
    .admin-nav a.is-active {
      background: var(--admin-sidebar-active);
      color: #ffffff;
      font-weight: 600;
    }
    .admin-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    .admin-topbar {
      background: #ffffff;
      border-bottom: 1px solid #e7e7e7;
      padding: 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .admin-main {
      padding: 32px;
      flex: 1;
    }
    .stat-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid #e7e7e7;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .stat-card-title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #727272;
      margin-bottom: 8px;
    }
    .stat-card-value {
      font-size: 28px;
      font-weight: 700;
      color: #171717;
    }
    .admin-card {
      background: #ffffff;
      border: 1px solid #e7e7e7;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      overflow: hidden;
    }
    .admin-card-head {
      padding: 20px 24px;
      border-bottom: 1px solid #e7e7e7;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .admin-card-head h2 {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .admin-table th {
      background: #f8fafc;
      padding: 12px 20px;
      color: #727272;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid #e7e7e7;
    }
    .admin-table td {
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .admin-table tr:hover td {
      background: #f8fafc;
    }
    .badge-pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-pro { background: #f2f2f2; color: #4e4e4e; }
    .badge-admin-role { background: #e8e8e8; color: #414141; }
    .badge-standard { background: #f1f5f9; color: #535353; }
  </style>
  @stack('styles')
  <script>window.HRESUME_AUTHENTICATED = @json(auth()->check());</script>
  <script src="{{ asset('js/theme.js') }}" defer></script>
</head>
<body>
  <div class="admin-wrapper">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        HResume <span class="badge-admin">Admin</span>
      </div>
      <nav class="admin-nav">
        <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'is-active' : '' }}">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
          Dashboard
        </a>
        <a href="{{ route('admin.users.index') }}" class="{{ request()->routeIs('admin.users.*') ? 'is-active' : '' }}">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
          Users
        </a>
        <a href="{{ route('templates.index') }}" target="_blank">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
          Templates
        </a>
        <a href="{{ route('home') }}#testimonials" target="_blank">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          Reviews
        </a>
        <a href="{{ route('blog.index') }}" target="_blank">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"/></svg>
          Blog Posts
        </a>

        <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
          <a href="{{ route('resumes.index') }}">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
            Exit to App
          </a>
        </div>
      </nav>
    </aside>

    <div class="admin-content">
      <header class="admin-topbar">
        <div>
          <strong style="font-size: 15px;">{{ auth()->user()->name }}</strong>
          <span style="color: #727272; font-size: 13px; margin-left: 6px;">({{ auth()->user()->email }})</span>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <a href="{{ route('home') }}" class="btn btn-ghost btn-sm" target="_blank">View Site</a>
          <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
            @csrf
            <button type="submit" class="btn btn-secondary btn-sm">Log out</button>
          </form>
        </div>
      </header>

      @if(session('success'))
        <div style="padding: 16px 32px 0;">
          <div style="background: #f9f9f9; border: 1px solid #e0e0e0; color: #4a4a4a; padding: 12px 18px; border-radius: 8px; font-size: 14px;">
            {{ session('success') }}
          </div>
        </div>
      @endif

      @if(session('error'))
        <div style="padding: 16px 32px 0;">
          <div style="background: #f5f5f5; border: 1px solid #d5d5d5; color: #363636; padding: 12px 18px; border-radius: 8px; font-size: 14px;">
            {{ session('error') }}
          </div>
        </div>
      @endif

      <main class="admin-main">
        @yield('content')
      </main>
    </div>
  </div>
  @stack('scripts')
</body>
</html>
