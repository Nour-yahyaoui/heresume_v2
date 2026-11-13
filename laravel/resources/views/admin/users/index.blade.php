@extends('layouts.admin')

@section('title', 'User Management — Admin HResume')

@section('content')
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
    <div>
      <h1 style="font-size: 26px; margin: 0 0 6px; font-weight: 700;">Users</h1>
      <p style="color: #727272; margin: 0; font-size: 14.5px;">Manage platform users, roles, and pro subscription tiers.</p>
    </div>
  </div>

  <div class="admin-card" style="margin-bottom: 24px;">
    <div style="padding: 16px 20px; background: #ffffff; border-bottom: 1px solid #e7e7e7;">
      <form action="{{ route('admin.users.index') }}" method="GET" style="display: flex; gap: 12px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 220px;">
          <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by name or email..." style="width: 100%; padding: 8px 12px; border: 1px solid #d4d4d4; border-radius: 6px; font-size: 14px;">
        </div>
        <div style="width: 160px;">
          <select name="role" style="width: 100%; padding: 8px 12px; border: 1px solid #d4d4d4; border-radius: 6px; font-size: 14px; background: #fff;">
            <option value="">All Roles</option>
            <option value="admin" {{ request('role') === 'admin' ? 'selected' : '' }}>Admins only</option>
            <option value="pro" {{ request('role') === 'pro' ? 'selected' : '' }}>Pro members</option>
            <option value="standard" {{ request('role') === 'standard' ? 'selected' : '' }}>Standard users</option>
          </select>
        </div>
        <button type="submit" class="btn btn-secondary btn-sm">Filter</button>
        @if(request()->hasAny(['search', 'role']))
          <a href="{{ route('admin.users.index') }}" class="btn btn-ghost btn-sm">Reset</a>
        @endif
      </form>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Provider</th>
          <th>Resumes</th>
          <th>Role / Status</th>
          <th>Joined</th>
          <th style="text-align: right;">Actions</th>
        </tr>
      </thead>
      <tbody>
        @forelse($users as $user)
          <tr>
            <td>
              <div style="font-weight: 600; color: #171717;">{{ $user->name }}</div>
              <div style="color: #727272; font-size: 13px;">{{ $user->email }}</div>
            </td>
            <td>
              @if($user->oauth_provider)
                <span class="badge-pill" style="background: #e7e7e7; color: #3a3a3a; text-transform: capitalize;">{{ $user->oauth_provider }}</span>
              @else
                <span style="color: #a1a1a1; font-size: 13px;">Email / Pwd</span>
              @endif
            </td>
            <td>
              <strong style="color: #171717;">{{ $user->resumes_count }}</strong>
            </td>
            <td>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                @if($user->is_admin)
                  <span class="badge-pill badge-admin-role">Admin</span>
                @endif
                @if($user->is_pro)
                  <span class="badge-pill badge-pro">Pro</span>
                @endif
                @if(!$user->is_admin && !$user->is_pro)
                  <span class="badge-pill badge-standard">Standard</span>
                @endif
              </div>
            </td>
            <td style="color: #727272; font-size: 13px;">
              {{ $user->created_at->format('M d, Y') }}
            </td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 8px;">
                <!-- Toggle Pro -->
                <form action="{{ route('admin.users.toggle-pro', $user) }}" method="POST" style="margin: 0;">
                  @csrf
                  @method('PATCH')
                  <button type="submit" class="btn btn-sm {{ $user->is_pro ? 'btn-ghost' : 'btn-secondary' }}" style="font-size: 12px; padding: 4px 10px;">
                    {{ $user->is_pro ? 'Remove Pro' : 'Grant Pro' }}
                  </button>
                </form>

                <!-- Toggle Admin -->
                @if($user->id !== auth()->id())
                  <form action="{{ route('admin.users.toggle-admin', $user) }}" method="POST" style="margin: 0;" onsubmit="return confirm('Change administrator status for this user?');">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="btn btn-sm {{ $user->is_admin ? 'btn-danger' : 'btn-secondary' }}" style="font-size: 12px; padding: 4px 10px;">
                      {{ $user->is_admin ? 'Demote' : 'Make Admin' }}
                    </button>
                  </form>
                @endif
              </div>
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="6" style="text-align: center; color: #a1a1a1; padding: 32px;">No matching users found.</td>
          </tr>
        @endforelse
      </tbody>
    </table>

    @if($users->hasPages())
      <div style="padding: 16px 20px; border-top: 1px solid #e7e7e7;">
        {{ $users->links() }}
      </div>
    @endif
  </div>
@endsection
