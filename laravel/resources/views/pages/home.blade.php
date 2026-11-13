@extends('layouts.app')

@section('title', 'HResume — Free Professional Resume Builder')
@section('page_name', 'home')

@section('content')
  <main>
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <span class="blob blob--1"></span>
        <span class="blob blob--2"></span>
        <span class="blob blob--3"></span>
        <span class="hero-grid"></span>
      </div>
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow eyebrow--pill" data-reveal><span class="pulse-dot"></span>Free resume builder</p>
          <h1 data-reveal>Build a resume that gets you <span class="hero-emphasis">noticed.</span></h1>
          <p class="lead" data-reveal>Fill in your details, pick a template and download a polished PDF. No design skills needed.</p>
          <div class="hero-cta" data-reveal>
            <a href="{{ auth()->check() ? route('resumes.index') : route('register') }}" class="btn btn-primary btn-lg btn-shine" data-cta>
              Create your resume
              <svg class="btn-arrow" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10h11m-4-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a href="{{ route('templates.index') }}" class="btn btn-secondary btn-lg">View templates</a>
          </div>
          <ul class="hero-checks" data-reveal>
            <li>Free forever</li>
            <li>Live preview</li>
            <li>Print-ready PDF</li>
          </ul>
        </div>
        <div class="hero-visual" data-reveal>
          <div class="hero-stack">
            <div class="hero-back" data-thumb="executive" aria-hidden="true"></div>
            <div class="hero-front" id="heroThumb" data-thumb="modern" data-color="#2b2b2b"></div>

            <div class="float-chip float-chip--pdf">
              <span class="chip-icon chip-icon--green">
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span><strong>PDF ready</strong><span class="muted">A4 · print quality</span></span>
            </div>

            <div class="float-chip float-chip--colors">
              <span class="muted small">Accent color</span>
              <div class="swatches" id="heroSwatches" role="group" aria-label="Preview accent colors"></div>
            </div>

            <div class="float-chip float-chip--typing" aria-hidden="true">
              <span class="chip-icon">
                <svg viewBox="0 0 20 20" width="16" height="16"><path d="M4 16h3l8.5-8.5a2.1 2.1 0 0 0-3-3L4 13v3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
              </span>
              <span class="typing" id="heroTyping"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-strip" aria-label="HResume at a glance">
      <div class="container stats-strip-inner">
        <div class="stat-item" data-reveal>
          <strong><span data-count="33">0</span></strong>
          <span class="muted">Resume templates</span>
        </div>
        <div class="stat-item" data-reveal>
          <strong><span data-count="7">0</span></strong>
          <span class="muted">Accent colors each</span>
        </div>
        <div class="stat-item" data-reveal>
          <strong><span data-count="100">0</span>%</strong>
          <span class="muted">Free, no watermark</span>
        </div>
        <div class="stat-item" data-reveal>
          <strong><span data-count="0">0</span></strong>
          <span class="muted">Data sent to servers</span>
        </div>
      </div>
    </section>

    <section id="how" class="section section--alt">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2>How it works</h2>
          <p class="muted">Three steps from a blank page to a finished resume.</p>
        </div>
        <div class="steps steps--connected" data-reveal-trigger>
          <div class="step" data-reveal>
            <span class="step-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6m-6 4h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="step-num">01</span>
            <h3>Add your details</h3>
            <p class="muted">Experience, education and skills in a simple, guided form.</p>
          </div>
          <div class="step" data-reveal>
            <span class="step-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
            </span>
            <span class="step-num">02</span>
            <h3>Choose a template</h3>
            <p class="muted">Switch designs and colors at any time. Your content stays in place.</p>
          </div>
          <div class="step" data-reveal>
            <span class="step-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="step-num">03</span>
            <h3>Download as PDF</h3>
            <p class="muted">Export a print-ready A4 file you can send to any employer.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="section">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2>Everything you need, nothing you don't</h2>
          <p class="muted">A focused editor that keeps you moving toward a finished resume.</p>
        </div>
        <div class="features">
          <div class="feature" data-reveal>
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>
            </span>
            <h3>Live preview</h3>
            <p class="muted">See every change on the page as you type. What you see is what you download.</p>
          </div>
          <div class="feature" data-reveal>
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2Z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>
            </span>
            <h3>Templates &amp; colors</h3>
            <p class="muted">Try a new layout or accent color in one click. Your content reflows automatically.</p>
          </div>
          <div class="feature" data-reveal>
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>
            </span>
            <h3>Multiple versions</h3>
            <p class="muted">Duplicate a resume and tailor it for each role you apply to.</p>
          </div>
          <div class="feature" data-reveal>
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>
            </span>
            <h3>Private by default</h3>
            <p class="muted">Your resumes are stored safely and securely. Full control over your data.</p>
          </div>
          <div class="feature" data-reveal>
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            </span>
            <h3>Photo support</h3>
            <p class="muted">Add a profile photo to templates designed to show one.</p>
          </div>
          <div class="feature" data-reveal>
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
            </span>
            <h3>Print-ready PDF</h3>
            <p class="muted">Clean A4 output that looks just as sharp on paper as on screen.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="templates" class="section section--alt">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2>Templates</h2>
          <p class="muted">Clean, readable layouts that work for any industry.</p>
        </div>
        <div class="template-grid" id="templateGrid"></div>
        <p class="section-more"><a href="{{ route('templates.index') }}" class="btn btn-secondary">Browse all 33 templates</a></p>
      </div>
    </section>

    <section id="testimonials" class="section">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2>What people say</h2>
          <p class="muted">Job seekers who built their resume with HResume.</p>
        </div>
        <div class="testimonials">
          @forelse($reviews as $rev)
            <figure class="testimonial" data-reveal>
              <span class="stars" aria-label="{{ $rev->rating }} out of 5">{{ str_repeat('★', $rev->rating) }}{{ str_repeat('☆', 5 - $rev->rating) }}</span>
              <blockquote>“{{ $rev->comment }}”</blockquote>
              <figcaption>
                <span class="testimonial-avatar">{{ strtoupper(substr($rev->user?->name ?? 'User', 0, 2)) }}</span>
                <span><strong>{{ $rev->user?->name ?? 'User' }}</strong><span class="muted">{{ $rev->title }}</span></span>
              </figcaption>
            </figure>
          @empty
            <figure class="testimonial" data-reveal>
              <span class="stars" aria-label="5 out of 5">★★★★★</span>
              <blockquote>“I had a clean, professional resume in about twenty minutes. Two weeks later I had three interviews lined up.”</blockquote>
              <figcaption>
                <span class="testimonial-avatar">DL</span>
                <span><strong>Daniel Lee</strong><span class="muted">Software Engineer</span></span>
              </figcaption>
            </figure>
            <figure class="testimonial" data-reveal>
              <span class="stars" aria-label="5 out of 5">★★★★★</span>
              <blockquote>“Keeping a separate version for each role I apply to used to be a mess. Now I just duplicate and adjust.”</blockquote>
              <figcaption>
                <span class="testimonial-avatar">MR</span>
                <span><strong>Maria Rossi</strong><span class="muted">Marketing Manager</span></span>
              </figcaption>
            </figure>
            <figure class="testimonial" data-reveal>
              <span class="stars" aria-label="5 out of 5">★★★★★</span>
              <blockquote>“The live preview is what sold me. I could see exactly how every change would look before downloading.”</blockquote>
              <figcaption>
                <span class="testimonial-avatar">AK</span>
                <span><strong>Amira Khalil</strong><span class="muted">Recent graduate</span></span>
              </figcaption>
            </figure>
          @endforelse
        </div>

        @auth
          <div style="margin-top: 36px; text-align: center;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('reviewDialog').showModal()">Share your feedback</button>
          </div>

          <dialog id="reviewDialog" style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; max-width: 480px; width: 90%; margin: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="margin: 0; font-size: 18px;">Share your experience</h3>
              <button type="button" onclick="document.getElementById('reviewDialog').close()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #727272;">&times;</button>
            </div>
            <form action="{{ route('reviews.store') }}" method="POST">
              @csrf
              <div style="margin-bottom: 14px;">
                <label style="display: block; font-weight: 500; font-size: 14px; margin-bottom: 4px;">Rating</label>
                <select name="rating" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
                  <option value="5">★★★★★ (5 Stars - Excellent)</option>
                  <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                  <option value="3">★★★☆☆ (3 Stars - Average)</option>
                  <option value="2">★★☆☆☆ (2 Stars - Needs Improvement)</option>
                  <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>
              <div style="margin-bottom: 14px;">
                <label style="display: block; font-weight: 500; font-size: 14px; margin-bottom: 4px;">Headline / Role</label>
                <input type="text" name="title" placeholder="e.g. ATS Resume, or Software Developer" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
              </div>
              <div style="margin-bottom: 18px;">
                <label style="display: block; font-weight: 500; font-size: 14px; margin-bottom: 4px;">Your Review</label>
                <textarea name="comment" rows="3" placeholder="How did HResume help your job search?" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;"></textarea>
              </div>
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('reviewDialog').close()">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm">Submit Review</button>
              </div>
            </form>
          </dialog>
        @endauth
      </div>
    </section>

    <section id="faq" class="section section--alt">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2>Questions</h2>
        </div>
        <div class="faq" data-reveal>
          <details>
            <summary>Is HResume free?</summary>
            <p>Yes. You can create, edit and download as many resumes as you like.</p>
          </details>
          <details>
            <summary>Where is my data stored?</summary>
            <p>Your account and resumes are securely stored in your personal account.</p>
          </details>
          <details>
            <summary>Can I keep more than one resume?</summary>
            <p>Yes. Many people keep a version for each type of role they apply for. Duplicate an existing resume to get started quickly.</p>
          </details>
          <details>
            <summary>How do I download my resume?</summary>
            <p>Click “Download PDF” in the editor and choose “Save as PDF” in the print dialog.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="cta section section--cta">
      <div class="container">
        <div class="cta-box" data-reveal>
          <span class="cta-glow" aria-hidden="true"></span>
          <h2>Ready to start?</h2>
          <p>Your next resume is a few minutes away.</p>
          <a href="{{ auth()->check() ? route('resumes.index') : route('register') }}" class="btn btn-lg btn-shine" data-cta>Create your resume</a>
        </div>
      </div>
    </section>
  </main>
@endsection

@push('scripts')
  <script src="{{ asset('js/landing.js') }}"></script>
@endpush
