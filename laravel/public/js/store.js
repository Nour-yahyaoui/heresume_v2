/*
 * Data layer: accounts, session and resumes are kept in localStorage.
 * This is a front-end only app — swap these functions for API calls when a backend exists.
 */
(function () {
  const KEYS = { users: 'cvm_users', session: 'cvm_session', resumes: 'cvm_resumes' };

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  async function hash(text) {
    if (window.crypto && crypto.subtle) {
      const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0;
    for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0;
    return 'h' + h;
  }

  /* ---------- Auth ---------- */

  const Auth = {
    current() {
      const id = read(KEYS.session, null);
      if (!id) return null;
      return read(KEYS.users, []).find((u) => u.id === id) || null;
    },

    async register({ name, email, password }) {
      email = email.trim().toLowerCase();
      const users = read(KEYS.users, []);
      if (users.some((u) => u.email === email)) {
        throw new Error('An account with this email already exists.');
      }
      const user = { id: uid(), name: name.trim(), email, password: await hash(password), createdAt: Date.now() };
      users.push(user);
      write(KEYS.users, users);
      write(KEYS.session, user.id);
      return user;
    },

    async login(email, password) {
      email = email.trim().toLowerCase();
      const user = read(KEYS.users, []).find((u) => u.email === email);
      if (user && !user.password) {
        throw new Error('This account uses Google sign-in. Continue with Google instead.');
      }
      if (!user || user.password !== (await hash(password))) {
        throw new Error('Incorrect email or password.');
      }
      write(KEYS.session, user.id);
      return user;
    },

    /* Signs in with a Google profile, linking to an existing account with the same email or creating one. */
    loginWithGoogle({ sub, email, name }) {
      email = email.trim().toLowerCase();
      const users = read(KEYS.users, []);
      let user = users.find((u) => u.googleId === sub) || users.find((u) => u.email === email);
      if (user) {
        user.googleId = sub;
      } else {
        user = { id: uid(), name: (name || email.split('@')[0]).trim(), email, password: null, googleId: sub, createdAt: Date.now() };
        users.push(user);
      }
      write(KEYS.users, users);
      write(KEYS.session, user.id);
      return user;
    },

    logout() {
      localStorage.removeItem(KEYS.session);
    },

    updateProfile(id, { name, email }) {
      email = email.trim().toLowerCase();
      const users = read(KEYS.users, []);
      if (users.some((u) => u.email === email && u.id !== id)) {
        throw new Error('This email is already used by another account.');
      }
      const user = users.find((u) => u.id === id);
      user.name = name.trim();
      user.email = email;
      write(KEYS.users, users);
      return user;
    },

    async changePassword(id, current, next) {
      const users = read(KEYS.users, []);
      const user = users.find((u) => u.id === id);
      // Google-only accounts have no password yet, so there is nothing to confirm
      if (user.password && user.password !== (await hash(current))) {
        throw new Error('Current password is incorrect.');
      }
      user.password = await hash(next);
      write(KEYS.users, users);
    },

    deleteAccount(id) {
      write(KEYS.users, read(KEYS.users, []).filter((u) => u.id !== id));
      write(KEYS.resumes, read(KEYS.resumes, []).filter((r) => r.userId !== id));
      this.logout();
    },

    /* Redirects to login when signed out. Returns the user otherwise. */
    requireUser() {
      const user = this.current();
      if (!user) location.replace('login.html');
      return user;
    },

    redirectIfSignedIn() {
      if (this.current()) location.replace('dashboard.html');
    },
  };

  /* ---------- Resumes ---------- */

  function emptyData() {
    return {
      personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', photo: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      socials: [],
      projects: [],
      certificates: [],
      hobbies: [],
    };
  }

  const Resumes = {
    all(userId) {
      return read(KEYS.resumes, [])
        .filter((r) => r.userId === userId)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },

    get(id, userId) {
      return read(KEYS.resumes, []).find((r) => r.id === id && r.userId === userId) || null;
    },

    create(userId, { title, template, color, data, pageBreaks }) {
      const now = Date.now();
      const resume = {
        id: uid(),
        userId,
        title: title.trim() || 'Untitled resume',
        template: template || 'classic',
        color: color || '#111111',
        data: data || emptyData(),
        pageBreaks: pageBreaks || [],
        createdAt: now,
        updatedAt: now,
      };
      const all = read(KEYS.resumes, []);
      all.push(resume);
      write(KEYS.resumes, all);
      return resume;
    },

    save(resume) {
      const all = read(KEYS.resumes, []);
      const index = all.findIndex((r) => r.id === resume.id);
      resume.updatedAt = Date.now();
      if (index === -1) all.push(resume);
      else all[index] = resume;
      write(KEYS.resumes, all);
      return resume;
    },

    /* Next automatic name for this user: hresume_001, hresume_002, … (older resume_### names count too) */
    nextTitle(userId) {
      const numbers = this.all(userId)
        .map((r) => /^h?resume_(\d+)$/i.exec(r.title))
        .filter(Boolean)
        .map((match) => Number(match[1]));
      const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
      return `hresume_${String(next).padStart(3, '0')}`;
    },

    duplicate(id, userId) {
      const source = this.get(id, userId);
      if (!source) return null;
      return this.create(userId, {
        title: source.title + ' (copy)',
        template: source.template,
        color: source.color,
        data: JSON.parse(JSON.stringify(source.data)),
        pageBreaks: [...(source.pageBreaks || [])],
      });
    },

    remove(id, userId) {
      write(KEYS.resumes, read(KEYS.resumes, []).filter((r) => !(r.id === id && r.userId === userId)));
    },
  };

  /* Share of key fields that are filled in, 0–100. */
  function completeness(data) {
    const p = data.personal || {};
    const checks = [
      p.fullName, p.jobTitle, p.email, p.phone, p.location,
      (data.summary || '').trim(),
      (data.experience || []).length > 0,
      (data.education || []).length > 0,
      (data.skills || []).length >= 3,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  /* ---------- Utils ---------- */

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function timeAgo(timestamp) {
    const seconds = Math.round((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, size] of units) {
      const n = Math.floor(seconds / size);
      if (n >= 1) return `${n} ${unit}${n > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function initials(name) {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  }

  window.CVM = {
    Auth,
    Resumes,
    emptyData,
    completeness,
    utils: { escapeHtml, timeAgo, formatDate, initials, uid },
  };
})();
