@extends('layouts.app')

@section('title', 'My Resumes — HResume')
@section('page_name', 'resumes')

@section('content')
  <main class="container page" style="padding-top: 36px; padding-bottom: 64px;">
    <div class="page-head" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 28px; margin-bottom: 4px;">My Resumes</h1>
        <p class="muted">{{ $resumes->count() }} {{ Str::plural('resume', $resumes->count()) }} created</p>
      </div>
      <button class="btn btn-primary" id="openNewResumeModal">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style="margin-right: 6px;"><path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z"/></svg>
        New resume
      </button>
    </div>

    @if($resumes->isEmpty())
      <div class="empty-state" style="text-align: center; padding: 64px 20px; background: #ffffff; border: 1px dashed #d1d5db; border-radius: 12px; margin-top: 20px;">
        <div style="font-size: 40px; margin-bottom: 12px;">📄</div>
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No resumes yet</h3>
        <p class="muted" style="max-width: 400px; margin: 0 auto 20px;">Pick from any of our 33 modern templates and create your first professional resume in minutes.</p>
        <a href="{{ route('templates.index') }}" class="btn btn-primary btn-lg">Browse templates</a>
      </div>
    @else
      <div class="resume-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        @foreach($resumes as $r)
          <div class="resume-card" data-id="{{ $r->id }}" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
            <a href="{{ route('resumes.edit', $r) }}" style="display: block; position: relative; padding-top: 135%; background: #f9fafb; border-bottom: 1px solid #f3f4f6; overflow: hidden;">
              <div class="resume-card-thumb" id="thumb-{{ $r->id }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                   data-template="{{ $r->template }}" data-color="{{ $r->color }}" data-resume-json='@json($r->data)'>
              </div>
            </a>
            <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 6px;">
                  <a href="{{ route('resumes.edit', $r) }}" style="color: inherit; text-decoration: none;">{{ $r->title }}</a>
                </h3>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #727272; margin-bottom: 12px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: {{ $r->color }};"></span>
                  <span style="text-transform: capitalize;">{{ $r->template }}</span>
                  <span>·</span>
                  <span>{{ $r->updated_at->diffForHumans() }}</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
                <a href="{{ route('resumes.edit', $r) }}" class="btn btn-sm btn-primary" style="flex: 1; text-align: center;">Edit</a>
                
                <form action="{{ route('resumes.duplicate', $r) }}" method="POST" style="margin: 0;">
                  @csrf
                  <button type="submit" class="btn btn-sm btn-secondary" title="Duplicate" aria-label="Duplicate">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h6.75A1.75 1.75 0 0 1 17 3.75V11.5a1.5 1.5 0 0 1-1.5 1.5H14v1.75A1.75 1.75 0 0 1 12.25 16.5H4.75A1.75 1.75 0 0 1 3 14.75V7A1.75 1.75 0 0 1 4.75 5.25H7V3.5zm1.5.5V5.25h3.75A1.75 1.75 0 0 1 14 7V11.5h1.5a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H8.5zm-3.75 3a.25.25 0 0 0-.25.25v7.75c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25V7.25a.25.25 0 0 0-.25-.25h-7.5z"/></svg>
                  </button>
                </form>

                <form action="{{ route('resumes.destroy', $r) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this resume?');" style="margin: 0;">
                  @csrf
                  @method('DELETE')
                  <button type="submit" class="btn btn-sm btn-ghost" style="color: #686868;" title="Delete" aria-label="Delete">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5z" clip-rule="evenodd"/></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        @endforeach
      </div>
    @endif
  </main>

  <!-- New Resume Modal -->
  <dialog id="newResumeModal" class="modal" style="border: none; border-radius: 16px; padding: 0; max-width: 680px; width: 90%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
    <div style="padding: 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="font-size: 20px; margin: 0;">Create new resume</h2>
      <button type="button" id="closeNewResumeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #727272;">&times;</button>
    </div>
    <form action="{{ route('resumes.create') }}" method="GET" style="padding: 24px;">
      <div style="margin-bottom: 20px;">
        <label for="modalResumeTitle" class="label" style="display: block; margin-bottom: 6px; font-weight: 500;">Resume Title</label>
        <input type="text" id="modalResumeTitle" name="title" class="input" placeholder="e.g. Software Engineer Resume" required style="width: 100%;">
      </div>
      <div style="margin-bottom: 24px;">
        <label for="modalResumeTemplate" class="label" style="display: block; margin-bottom: 6px; font-weight: 500;">Select Template</label>
        <select id="modalResumeTemplate" name="template" class="input" style="width: 100%;">
          <!-- Options populated dynamically from CVRender.TEMPLATES -->
        </select>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button type="button" id="cancelNewResumeBtn" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-primary">Create & Edit</button>
      </div>
    </form>
  </dialog>
@endsection

@push('scripts')
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Mount live thumbnails for each resume card
      document.querySelectorAll('.resume-card-thumb').forEach((el) => {
        const template = el.dataset.template || 'classic';
        const color = el.dataset.color || '#7b7b7b';
        let resumeData = null;
        try {
          resumeData = JSON.parse(el.dataset.resumeJson);
        } catch (e) {}

        if (window.CVRender && window.CVRender.mountThumb) {
          window.CVRender.mountThumb(el, template, color, resumeData);
        }
      });

      // Populate template dropdown in modal
      const templateSelect = document.getElementById('modalResumeTemplate');
      if (templateSelect && window.CVRender && window.CVRender.TEMPLATES) {
        templateSelect.innerHTML = window.CVRender.TEMPLATES.map((t) => `
          <option value="${t.id}">${t.name} (${t.layout === 'two' ? '2 columns' : '1 column'}${t.photo ? ', photo' : ''})</option>
        `).join('');
      }

      // Modal open/close handlers
      const modal = document.getElementById('newResumeModal');
      const openBtn = document.getElementById('openNewResumeModal');
      const closeBtn = document.getElementById('closeNewResumeModal');
      const cancelBtn = document.getElementById('cancelNewResumeBtn');

      if (modal && openBtn) {
        openBtn.addEventListener('click', () => modal.showModal());
        if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
        if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.close();
        });
      }
    });
  </script>
@endpush
