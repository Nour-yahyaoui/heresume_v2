@extends('layouts.app')

@section('title', 'Create account — HResume')
@section('page_name', 'register')

@section('content')
  <main class="auth" style="padding: 48px 20px 64px;">
    <div class="auth-card">
      <nav class="auth-tabs" aria-label="Account">
        <a href="{{ route('login') }}">Log in</a>
        <a href="{{ route('register') }}" class="is-active" aria-current="page">Sign up</a>
      </nav>

      <h1>Create your account</h1>
      <p class="muted">Start building your resume in a few minutes.</p>

      <form action="{{ route('register') }}" method="POST" class="form">
        @csrf

        @if($errors->any())
          <div style="background: #f5f5f5; border: 1px solid #d5d5d5; color: #363636; padding: 10px 14px; border-radius: 8px; font-size: 13.5px; margin-bottom: 16px;">
            {{ $errors->first() }}
          </div>
        @endif

        <div class="field">
          <label for="name">Full name</label>
          <input id="name" name="name" type="text" value="{{ old('name') }}" autocomplete="name" required autofocus>
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="password">Password</label>
          <div class="input-wrap">
            <input id="password" name="password" type="password" autocomplete="new-password" minlength="6" required>
            <button type="button" class="input-action" id="togglePasswordBtn">Show</button>
          </div>
          <span class="field-hint">At least 6 characters.</span>
        </div>
        
        <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 8px;">Create account</button>

        <div style="display: flex; align-items: center; margin: 20px 0; color: #a2a2a2; font-size: 13px;">
          <div style="flex: 1; height: 1px; background: #e5e7eb;"></div>
          <span style="padding: 0 12px;">or sign up with</span>
          <div style="flex: 1; height: 1px; background: #e5e7eb;"></div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="{{ route('auth.google') }}" class="btn btn-secondary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#7f7f7f" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#898989" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#bcbcbc" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#656565" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            Sign up with Google
          </a>
          <a href="{{ route('auth.linkedin') }}" class="btn btn-secondary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#595959"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            Sign up with LinkedIn
          </a>
        </div>
      </form>
    </div>

    <p class="auth-switch">Already have an account? <a href="{{ route('login') }}">Log in</a></p>
  </main>
@endsection

@push('scripts')
  <script>
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const pwdInput = document.getElementById('password');
    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        toggleBtn.textContent = isPwd ? 'Hide' : 'Show';
      });
    }
  </script>
@endpush
