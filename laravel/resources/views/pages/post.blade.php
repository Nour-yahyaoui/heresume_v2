@extends('layouts.app')

@section('title', $post->title . ' — HResume Blog')
@section('meta_description', $post->excerpt)
@section('page_name', 'post')

@section('content')
  <main class="article-page" style="padding: 48px 0 80px;">
    <div class="container" style="max-width: 760px;">
      <article class="article">
        <header class="article-head" style="margin-bottom: 32px;">
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <span class="pill">{{ $post->category }}</span>
            <span class="muted">{{ $post->reading_time }}</span>
            <span class="muted">·</span>
            <span class="muted">{{ $post->published_at ? $post->published_at->format('M d, Y') : date('M d, Y') }}</span>
          </div>
          <h1 style="font-size: 36px; line-height: 1.2; margin-bottom: 16px;">{{ $post->title }}</h1>
          <p class="lead" style="font-size: 18px; color: #545454;">{{ $post->excerpt }}</p>
        </header>

        <div class="article-body" style="font-size: 16px; line-height: 1.7; color: #282828;">
          {!! $post->content !!}
        </div>
      </article>

      @if($related->isNotEmpty())
        <div class="more-posts" style="margin-top: 64px; border-top: 1px solid #e5e7eb; padding-top: 40px;">
          <h2 style="font-size: 22px; margin-bottom: 20px;">More articles</h2>
          <div class="post-grid">
            @foreach($related as $r)
              <article class="post-card">
                <div class="post-meta" style="margin-bottom: 8px;">
                  <span class="pill">{{ $r->category }}</span>
                  <span class="muted">{{ $r->reading_time }}</span>
                </div>
                <h3 style="font-size: 16px; margin: 0 0 6px;">
                  <a href="{{ route('blog.show', $r->slug) }}" style="color: inherit; text-decoration: none;">{{ $r->title }}</a>
                </h3>
                <p class="muted" style="font-size: 13.5px; margin: 0 0 10px;">{{ Str::limit($r->excerpt, 90) }}</p>
                <a href="{{ route('blog.show', $r->slug) }}" style="font-size: 13px; font-weight: 600; color: #575757;">Read &rarr;</a>
              </article>
            @endforeach
          </div>
        </div>
      @endif
    </div>
  </main>
@endsection
