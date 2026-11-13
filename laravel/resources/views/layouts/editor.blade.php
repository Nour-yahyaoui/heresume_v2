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
  <title>@yield('title', 'Editor — HResume')</title>
  
  <link rel="preload" href="{{ asset('fonts/geist-latin-wght-normal.woff2') }}" as="font" type="font/woff2" crossorigin>
  
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ asset('css/resume.css?v=canadian') }}">
  <link rel="stylesheet" href="{{ asset('css/theme.css') }}">
  <script>window.HRESUME_AUTHENTICATED = @json(auth()->check());</script>
  <script src="{{ asset('js/theme.js') }}" defer></script>
</head>
<body class="editor-body">
  @yield('content')

  <script src="{{ asset('js/store.js') }}"></script>
  <script src="{{ asset('js/render.js?v=canadian') }}"></script>
  @stack('scripts')
</body>
</html>
