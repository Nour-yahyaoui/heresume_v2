@extends('layouts.admin')

@section('title', 'Admin Overview — HResume')

@section('content')
  <div style="margin-bottom: 24px;">
    <h1 style="font-size: 26px; margin: 0 0 6px; font-weight: 700;">Dashboard Overview</h1>
    <p style="color: #727272; margin: 0; font-size: 14.5px;">System statistics and recent platform activity.</p>
  </div>

  <div class="stat-cards">
    <div class="stat-card">
      <div class="stat-card-title">Total Users</div>
      <div class="stat-card-value">{{ number_format($stats['total_users']) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">Pro Members</div>
      <div class="stat-card-value" style="color: #848484;">{{ number_format($stats['pro_users']) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">Resumes Created</div>
      <div class="stat-card-value" style="color: #606060;">{{ number_format($stats['total_resumes']) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">Templates</div>
      <div class="stat-card-value">{{ number_format($stats['total_templates']) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">Reviews</div>
      <div class="stat-card-value">{{ number_format($stats['total_reviews']) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-title">Subscribers</div>
      <div class="stat-card-value">{{ number_format($stats['total_subscribers']) }}</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
    <!-- Recent Signups -->
    <div class="admin-card">
      <div class="admin-card-head">
        <h2>Recent Signups</h2>
        <a href="{{ route('admin.users.index') }}" class="btn btn-ghost btn-sm">View all</a>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          @forelse($latestUsers as $u)
            <tr>
              <td>
                <div style="font-weight: 600;">{{ $u->name }}</div>
                <div style="color: #727272; font-size: 12.5px;">{{ $u->email }}</div>
              </td>
              <td>
                @if($u->is_admin)
                  <span class="badge-pill badge-admin-role">Admin</span>
                @elseif($u->is_pro)
                  <span class="badge-pill badge-pro">Pro</span>
                @else
                  <span class="badge-pill badge-standard">Standard</span>
                @endif
              </td>
              <td style="color: #727272; font-size: 13px;">
                {{ $u->created_at->diffForHumans() }}
              </td>
            </tr>
          @empty
            <tr>
              <td colspan="3" style="text-align: center; color: #a1a1a1; padding: 24px;">No users yet.</td>
            </tr>
          @endforelse
        </tbody>
      </table>
    </div>

    <!-- Recent Resumes -->
    <div class="admin-card">
      <div class="admin-card-head">
        <h2>Latest Resumes</h2>
        <span style="font-size: 13px; color: #727272;">Recent activity</span>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Template</th>
          </tr>
        </thead>
        <tbody>
          @forelse($latestResumes as $r)
            <tr>
              <td>
                <div style="font-weight: 600;">{{ $r->title ?: $r->name }}</div>
                <div style="color: #727272; font-size: 12px;">{{ $r->updated_at->diffForHumans() }}</div>
              </td>
              <td>
                <div style="font-size: 13px;">{{ $r->user?->name ?? 'Guest/None' }}</div>
              </td>
              <td>
                <span class="badge-pill badge-standard">{{ ucfirst($r->templateModel?->name ?? $r->template ?? 'Classic') }}</span>
              </td>
            </tr>
          @empty
            <tr>
              <td colspan="3" style="text-align: center; color: #a1a1a1; padding: 24px;">No resumes yet.</td>
            </tr>
          @endforelse
        </tbody>
      </table>
    </div>
  </div>
@endsection
