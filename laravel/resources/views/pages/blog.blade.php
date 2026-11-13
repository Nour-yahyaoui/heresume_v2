@extends('layouts.app')

@section('title', 'Blog — HResume')
@section('meta_description', 'Practical advice on writing resumes, career guidance, and finding your next job.')
@section('page_name', 'blog')

@section('content')
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Blog</p>
        <h1>Resume and career advice</h1>
        <p>Practical guides to help you write a stronger resume and land your next role.</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="post-grid">
          @forelse($posts as $post)
            <article class="post-card" data-reveal>
              <a href="{{ route('blog.show', $post->slug) }}" class="post-thumb" style="background: #f3f4f6; position: relative; display: block; overflow: hidden; height: 180px;">
                <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #fafafa; color: #000000; padding: 20px;">
                  <span style="font-size: 15px; font-weight: 600; text-align: center;">{{ $post->title }}</span>
                </div>
              </a>
              <div class="post-meta" style="margin-top: 14px;">
                <span class="pill">{{ $post->category }}</span>
                <span class="muted">{{ $post->reading_time }}</span>
              </div>
              <h2 style="font-size: 18px; margin: 8px 0 6px;">
                <a href="{{ route('blog.show', $post->slug) }}" style="color: inherit; text-decoration: none;">{{ $post->title }}</a>
              </h2>
              <p class="muted" style="font-size: 14px; margin: 0 0 16px;">{{ $post->excerpt }}</p>
              <a href="{{ route('blog.show', $post->slug) }}" class="read-more" style="font-size: 13.5px; font-weight: 600; color: #575757;">Read article &rarr;</a>
            </article>
          @empty
            <p class="muted">No blog posts found.</p>
          @endforelse
        </div>
      </div>
    </section>
  </main>
@endsection
