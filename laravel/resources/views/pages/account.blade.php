@extends('layouts.app')

@section('title', 'Account Settings — HResume')
@section('page_name', 'account')

@section('content')
  <main class="container page" style="padding-top: 36px; padding-bottom: 64px;">
    <div class="page-head" style="margin-bottom: 28px;">
      <div>
        <h1 style="font-size: 28px; margin-bottom: 4px;">Account Settings</h1>
        <p class="muted">Member since {{ $user->created_at->format('F Y') }}</p>
      </div>
    </div>

    <div class="settings" style="display: flex; flex-direction: column; gap: 32px; max-width: 680px;">
      <!-- Profile Card -->
      <section class="card settings-card" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px;">
        <h2 style="font-size: 20px; margin: 0 0 6px;">Profile</h2>
        <p class="muted" style="margin: 0 0 20px;">Your personal account information.</p>
        
        <form action="{{ route('account.profile') }}" method="POST" class="form">
          @csrf
          @method('PUT')

          <div class="grid-2">
            <div class="field">
              <label for="name">Full name</label>
              <input id="name" name="name" type="text" value="{{ old('name', $user->name) }}" required>
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" value="{{ old('email', $user->email) }}" required>
            </div>
          </div>

          <div class="field" style="margin-top: 14px;">
            <label for="bio">Professional Bio</label>
            <textarea id="bio" name="bio" rows="3" placeholder="Tell employers about your career journey and strengths..." style="width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px; font-family: inherit;">{{ old('bio', $user->candidate?->bio) }}</textarea>
          </div>

          <div class="grid-2" style="margin-top: 14px;">
            <div class="field">
              <label for="linkedin_url">LinkedIn URL</label>
              <input id="linkedin_url" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/yourprofile" value="{{ old('linkedin_url', $user->candidate?->linkedin_url) }}">
            </div>
            <div class="field">
              <label for="portfolio_url">Portfolio URL</label>
              <input id="portfolio_url" name="portfolio_url" type="url" placeholder="https://yourportfolio.com" value="{{ old('portfolio_url', $user->candidate?->portfolio_url) }}">
            </div>
          </div>

          <button type="submit" class="btn btn-secondary" style="margin-top: 20px;">Save profile</button>
        </form>
      </section>

      <!-- Password Card -->
      <section class="card settings-card" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px;">
        <h2 style="font-size: 20px; margin: 0 0 6px;">Security</h2>
        <p class="muted" style="margin: 0 0 20px;">Update your password to keep your account secure.</p>
        
        <form action="{{ route('account.password') }}" method="POST" class="form">
          @csrf
          @method('PUT')

          <div class="field">
            <label for="current_password">Current password</label>
            <input id="current_password" name="current_password" type="password" required>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="password">New password</label>
              <input id="password" name="password" type="password" required minlength="6">
            </div>
            <div class="field">
              <label for="password_confirmation">Confirm password</label>
              <input id="password_confirmation" name="password_confirmation" type="password" required>
            </div>
          </div>
          <button type="submit" class="btn btn-secondary" style="margin-top: 14px;">Update password</button>
        </form>
      </section>

      <!-- Delete Account Card -->
      <section class="card settings-card" style="background: #ffffff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 28px;">
        <h2 style="font-size: 20px; color: #4d4d4d; margin: 0 0 6px;">Danger Zone</h2>
        <p class="muted" style="margin: 0 0 20px;">Permanently delete your account and all associated resumes.</p>
        
        <form action="{{ route('account.destroy') }}" method="POST" onsubmit="return confirm('Are you absolutely sure? This will delete all your resumes permanently.');">
          @csrf
          @method('DELETE')
          <button type="submit" class="btn btn-secondary" style="color: #4d4d4d; border-color: #d5d5d5;">Delete my account</button>
        </form>
      </section>
    </div>
  </main>
@endsection
