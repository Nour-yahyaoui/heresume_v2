/*
 * Resume rendering: turns resume data into HTML for one of the templates.
 * Used by the editor preview, resume thumbnails and the landing page.
 */
(function () {
  const PAGE_WIDTH = 794; // A4 at 96dpi

  const TEMPLATES = [
    // layout: 'one' or 'two' columns; photo: shows the uploaded photo
    { id: 'classic', name: 'Classic', layout: 'one', photo: false, description: 'Centered header and a single, traditional column.' },
    { id: 'modern', name: 'Modern', layout: 'two', photo: false, description: 'Bold header with a sidebar for contact and skills.' },
    { id: 'minimal', name: 'Minimal', layout: 'one', photo: false, description: 'Quiet typography with labels in the margin.' },
    { id: 'professional', name: 'Professional', layout: 'two', photo: true, description: 'Full-height sidebar with photo, contact details and skills.' },
    { id: 'executive', name: 'Executive', layout: 'two', photo: false, description: 'Two-tone layout with a bold name and gold accents.', color: '#0f3a5c' },
    { id: 'creative', name: 'Creative', layout: 'one', photo: true, description: 'Photo banner with bold headings and a column layout.', color: '#111827' },
    { id: 'fresh', name: 'Fresh', layout: 'two', photo: true, description: 'Soft color header with photo and highlighted skill boxes.', color: '#4a78ab' },
    { id: 'elegant', name: 'Elegant', layout: 'one', photo: false, description: 'Framed serif name with centered section headings.', color: '#b39b77' },
    { id: 'signature', name: 'Signature', layout: 'two', photo: true, description: 'Charcoal sidebar with gold accents and spaced headings.', color: '#454545' },
    { id: 'blush', name: 'Blush', layout: 'two', photo: false, description: 'Warm tinted page with a bold name and a slim side column.', color: '#7a5663' },
    { id: 'vivid', name: 'Vivid', layout: 'two', photo: true, description: 'Bright accent color, photo header and skill tags.', color: '#f05a28' },
    { id: 'spark', name: 'Spark', layout: 'two', photo: true, description: 'Color block behind the photo, light sidebar and skill ratings.', color: '#f5c518' },
    { id: 'studio', name: 'Studio', layout: 'two', photo: true, description: 'Tall photo, dark intro band and a three-column grid.', color: '#f28c28' },
    { id: 'bold', name: 'Bold', layout: 'two', photo: true, description: 'Bright sidebar with a round photo, a dark name band and an education timeline.', color: '#f9c923' },
    { id: 'campus', name: 'Campus', layout: 'one', photo: true, description: 'Color header with a photo, labelled contact details and airy sections. Great for students.', color: '#5f9e63' },
    { id: 'monogram', name: 'Monogram', layout: 'two', photo: false, description: 'Spaced-out name over a faint script monogram, with ruled columns in soft grey.', color: '#4a4a4a' },
    { id: 'harbor', name: 'Harbor', layout: 'two', photo: false, description: 'Deep header band with an initials badge, a spaced serif name and ruled columns.', color: '#243142' },
    { id: 'scarlet', name: 'Scarlet', layout: 'two', photo: true, description: 'Two-tone name, a tinted round photo and slider-style skill ratings.', color: '#d63a3a' },
    { id: 'gilded', name: 'Gilded', layout: 'two', photo: true, description: 'Framed page with a gold-ringed photo, a serif name and a centered side column.', color: '#9c8a60' },
    { id: 'meridian', name: 'Meridian', layout: 'two', photo: false, description: 'Tinted sidebar with circled initials over a deep name band, and banded headings.', color: '#2f3a55' },
    { id: 'linen', name: 'Linen', layout: 'two', photo: true, description: 'Soft grey sidebar with a round photo, a two-tone name and grouped expertise.', color: '#c4a898' },
    { id: 'europass', name: 'Europass', layout: 'one', photo: true, description: 'Official Europass single-column format with European Union emblem and labelled sections.', color: '#1d4b8f' },
    { id: 'europass-timeline', name: 'Europass Timeline', layout: 'two', photo: true, description: 'Official Europass two-column design with contact sidebar and vertical timeline nodes.', color: '#1d4b8f' },
    { id: 'onyx', name: 'Onyx', layout: 'two', photo: false, description: 'Black name block, ring icons and bold condensed headings.', color: '#111111' },
    { id: 'pacific', name: 'Pacific', layout: 'one', photo: true, description: 'Single column with a ringed photo, a contact bar and skill pills.', color: '#2d6a86' },
    { id: 'beacon', name: 'Beacon', layout: 'two', photo: true, description: 'Photo in the corner, bright accent tabs and dotted skill ratings.', color: '#f5b82e' },
    { id: 'maple', name: 'Maple', layout: 'two', photo: true, description: 'Canadian modern layout with red header framing, social pill and skill progress bars.', color: '#c53030' },
    { id: 'toronto', name: 'Toronto', layout: 'two', photo: true, description: 'Three-column hero header with central portrait photo, contact bar and quick facts tiles.', color: '#c62828' },
    { id: 'vancouver', name: 'Vancouver', layout: 'two', photo: true, description: 'Warm golden photo band with bold name overlay, split education and timeline experience.', color: '#d49b28' },
    { id: 'montreal', name: 'Montreal', layout: 'two', photo: true, description: 'Desert tan photo block with ruled header, progress bars and 3-column references.', color: '#b8956e' },
    { id: 'calgary', name: 'Calgary', layout: 'two', photo: true, description: 'Navy slate header with center photo portrait, expertise sliders and stats KPI tiles.', color: '#1e3a5f' },
    { id: 'ottawa', name: 'Ottawa', layout: 'two', photo: true, description: 'Center vertical timeline divider with circular icon nodes, green ring photo and side-by-side education.', color: '#689f38' },
    { id: 'quebec', name: 'Quebec', layout: 'two', photo: true, description: 'Light grey sidebar with dark icon badges, and dual-column role-and-company entries.', color: '#2d3748' },
  ];

  const COLORS = ['#111111', '#2b2b2b', '#444444', '#5c5c5c', '#767676', '#8f8f8f', '#a6a6a6'];

  /* Color a template starts with when none is chosen. */
  function defaultColor(template) {
    const t = TEMPLATES.find((item) => item.id === template);
    return (t && t.color) || COLORS[0];
  }

  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  /* True for colors light enough to carry dark text (relative luminance, WCAG formula). */
  function isLight(hex) {
    const [r, g, b] = rgb(hex).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4;
  }

  function distance(a, b) {
    const [r1, g1, b1] = rgb(a);
    const [r2, g2, b2] = rgb(b);
    return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
  }

  /*
   * The 7 colors offered for a template, its own default first. A color that isn't in the
   * shared palette (a template default, or `current` kept from another template) takes the
   * place of the most similar palette color, so every template always offers 7.
   */
  function colorsFor(template, current) {
    const colors = [...COLORS];
    [current, defaultColor(template)].forEach((color) => {
      if (!color || colors.includes(color)) return;
      const nearest = colors
        .filter((c) => c !== defaultColor(template) && c !== current)
        .reduce((best, c) => (distance(c, color) < distance(best, color) ? c : best));
      colors[colors.indexOf(nearest)] = color;
    });
    const first = defaultColor(template);
    return [first, ...colors.filter((c) => c !== first)];
  }

  const SAMPLE = {
    personal: {
      fullName: 'Alex Bennett',
      jobTitle: 'Product Designer',
      email: 'alex.bennett@email.com',
      phone: '+1 555 012 3456',
      location: 'Austin, TX',
      website: 'alexbennett.design',
      photo: 'images/user-avatar.webp', // preview only; not copied into new resumes
    },
    summary: 'Product designer with 6 years of experience shaping web and mobile products. I focus on clear interfaces, measurable outcomes and close collaboration with engineering teams.',
    experience: [
      {
        role: 'Senior Product Designer', company: 'Northwind', location: 'Austin, TX', start: 'Mar 2022', end: '',
        description: 'Led the redesign of the onboarding flow, lifting activation by 18%\nBuilt a shared design system used by four product teams\nMentored two junior designers',
      },
      {
        role: 'Product Designer', company: 'Brightline Studio', location: 'Remote', start: 'Jun 2019', end: 'Feb 2022',
        description: 'Designed end-to-end features for a B2B analytics platform\nRan usability studies with more than 60 customers',
      },
    ],
    education: [
      { degree: 'B.A. Interaction Design', school: 'University of Texas', location: 'Austin, TX', start: '2015', end: '2019', description: '' },
    ],
    skills: ['Product design', 'Figma', 'Prototyping', 'User research', 'Design systems', 'HTML & CSS'],
    languages: ['English — Native', 'Spanish — Professional'],
    socials: [{ label: 'LinkedIn', url: 'linkedin.com/in/alexbennett' }],
    projects: [
      {
        name: 'Open-source icon library', link: 'github.com/alexb/icons', start: '2023', end: '2024',
        description: 'Designed and published 400+ icons used by more than 2,000 developers',
      },
    ],
    certificates: [
      { name: 'Google UX Design Certificate', issuer: 'Google', date: '2021', link: '' },
    ],
    hobbies: ['Photography', 'Trail running', 'Pottery'],
  };

  const esc = (value) => window.CVM.utils.escapeHtml(value);

  function normalize(data) {
    const base = window.CVM.emptyData();
    data = data || {};
    return {
      ...base,
      ...data,
      personal: { ...base.personal, ...(data.personal || {}) },
    };
  }

  function lines(text) {
    return String(text || '')
      .split('\n')
      .map((l) => l.replace(/^\s*[-•*]\s*/, '').trim())
      .filter(Boolean);
  }

  function textBlock(text) {
    const items = lines(text);
    if (!items.length) return '';
    if (items.length === 1) return `<p>${esc(items[0])}</p>`;
    return `<ul class="cv-bullets">${items.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`;
  }

  function dateRange(start, end) {
    if (start && end) return `${start} – ${end}`;
    if (start) return `${start} – Present`;
    return end || '';
  }

  function hasContent(item) {
    return Object.values(item).some((v) => String(v || '').trim());
  }

  /* Clickable link (kept in the PDF). Accepts "site.com" or "https://site.com". */
  function link(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    if (!/^https?:\/\/[^\s"'<>]+$/i.test(href)) return esc(raw);
    const label = raw.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
    return `<a href="${esc(href)}">${esc(label)}</a>`;
  }

  function entries(items, titleKey, subKey) {
    return items.filter(hasContent).map((item) => {
      const sub = [
        ...[item[subKey], item.location].filter(Boolean).map(esc),
        link(item.link),
      ].filter(Boolean).join(' · ');
      const when = dateRange(item.start, item.end || item.date);
      return `
        <div class="cv-entry">
          <div class="cv-entry-head">
            <div>
              <h4 class="cv-entry-title">${esc(item[titleKey])}</h4>
              ${sub ? `<p class="cv-entry-sub">${sub}</p>` : ''}
            </div>
            ${when ? `<span class="cv-entry-date">${esc(when)}</span>` : ''}
          </div>
          ${textBlock(item.description)}
        </div>`;
    }).join('');
  }

  function tags(items) {
    const clean = items.filter((s) => String(s).trim());
    return clean.length ? `<ul class="cv-tags">${clean.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '';
  }

  const icon = (path) => `<svg class="cv-icon" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  const ICONS = {
    email: icon('<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>'),
    phone: icon('<path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" fill="currentColor"/>'),
    location: icon('<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>'),
    web: icon('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" fill="none" stroke="currentColor" stroke-width="2"/>'),
    link: icon('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    building: icon('<path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17M3 21h18M9 7h2m-2 4h2m-2 4h2m4-8h2m-2 4h2m-2 4h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
    linkedin: icon('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="currentColor"/><rect x="2" y="9" width="4" height="12" fill="currentColor"/><circle cx="4" cy="4" r="2" fill="currentColor"/>'),
  };

  /* Contact details, one per line, each with an icon. */
  function iconContacts(p, socials) {
    const rows = [
      [ICONS.phone, esc(p.phone)],
      [ICONS.email, esc(p.email)],
      [ICONS.location, esc(p.location)],
      [ICONS.web, link(p.website)],
      ...socials.filter((s) => String(s.url || '').trim()).map((s) => [ICONS.link, link(s.url)]),
    ].filter(([, value]) => value);
    return rows.length
      ? `<ul class="cv-icon-list">${rows.map(([ico, value]) => `<li>${ico}<span>${value}</span></li>`).join('')}</ul>`
      : '';
  }

  function bulletList(items) {
    const clean = items.filter((s) => String(s).trim());
    return clean.length ? `<ul class="cv-bullets">${clean.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '';
  }

  /* A small labelled block inside a section, e.g. "Professional" skills. Empty when there is no content. */
  function labelledGroup(label, html) {
    return html ? `<div class="cv-group"><h4 class="cv-group-h">${label}</h4>${html}</div>` : '';
  }

  /* Entries led by their dates: dates, TITLE, then place and location. */
  function datedEntries(items, titleKey, subKey) {
    return items.filter(hasContent).map((item) => {
      const when = dateRange(item.start, item.end || item.date);
      const sub = [esc(item[subKey]), esc(item.location), link(item.link)].filter(Boolean).join(', ');
      return `
        <div class="cv-entry">
          ${when ? `<p class="cv-entry-date">${esc(when)}</p>` : ''}
          ${item[titleKey] ? `<h4 class="cv-entry-title">${esc(item[titleKey])}</h4>` : ''}
          ${sub ? `<p class="cv-entry-sub">${sub}</p>` : ''}
          ${textBlock(item.description)}
        </div>`;
    }).join('');
  }

  /* Items as simple lines, no bullets. */
  function plainList(items) {
    const clean = items.filter((s) => String(s).trim());
    return clean.length ? `<ul class="cv-plain">${clean.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '';
  }

  /* Entries as stacked lines for narrow columns: TITLE, then place, location and dates. */
  function stackEntries(items, titleKey, subKey) {
    return items.filter(hasContent).map((item) => {
      const when = dateRange(item.start, item.end || item.date);
      return `
        <div class="cv-entry">
          ${item[titleKey] ? `<h4 class="cv-entry-title">${esc(item[titleKey])}</h4>` : ''}
          ${item[subKey] ? `<p>${esc(item[subKey])}</p>` : ''}
          ${item.location ? `<p>${esc(item.location)}</p>` : ''}
          ${when ? `<p>${esc(when)}</p>` : ''}
        </div>`;
    }).join('');
  }

  /*
   * Entries as a title line, then one line of details: "Company / place / dates".
   * `strongSub` bolds the company part.
   */
  function lineEntries(items, titleKey, subKey, sep, strongSub = false) {
    return items.filter(hasContent).map((item) => {
      const meta = [
        item[subKey] ? (strongSub ? `<strong>${esc(item[subKey])}</strong>` : esc(item[subKey])) : '',
        esc(item.location),
        link(item.link),
        esc(dateRange(item.start, item.end || item.date)),
      ].filter(Boolean).join(sep);
      return `
        <div class="cv-entry">
          ${item[titleKey] ? `<h4 class="cv-entry-title">${esc(item[titleKey])}</h4>` : ''}
          ${meta ? `<p class="cv-entry-meta">${meta}</p>` : ''}
          ${textBlock(item.description)}
        </div>`;
    }).join('');
  }

  /*
   * Items with an optional score, e.g. "French 8/10" or "Figma 4/5", shown as a row of dots.
   * Falls back to plain tags when no item has a score.
   */
  /* Splits "Figma 4/5", "Photoshop:90", or "Skills 85%" into { name, score, max }; score is null when there is none. */
  function parseRated(items) {
    return items.filter((s) => String(s).trim()).map((text) => {
      let match = /^(.*?)[\s—–-]*(\d{1,2})\s*\/\s*(5|10)\s*$/.exec(text);
      if (match) {
        const max = Number(match[3]);
        return { name: match[1].trim(), score: Math.min(max, Number(match[2])), max };
      }
      match = /^(.*?)(?::|\s+)?\s*(\d{1,3})\s*%\s*$/.exec(text) || /^(.*?):\s*(\d{1,3})\s*$/.exec(text);
      if (match) {
        const val = Number(match[2]);
        if (val <= 100) {
          return { name: match[1].trim(), score: val, max: 100 };
        }
      }
      return { name: text, score: null };
    });
  }

  function ratedList(items) {
    const rated = parseRated(items);
    if (!rated.length) return '';
    if (rated.every((r) => r.score === null)) return tags(rated.map((r) => r.name));
    return `<ul class="cv-ratings">${rated.map((r) => `
      <li>
        <div class="cv-rating-head"><span>${esc(r.name)}</span>${r.score !== null ? `<span class="cv-rating-score">${r.score}/${r.max}</span>` : ''}</div>
        ${r.score !== null ? `<span class="cv-dots">${Array.from({ length: r.max }, (_, i) => `<i${i < r.score ? ' class="on"' : ''}></i>`).join('')}</span>` : ''}
      </li>`).join('')}</ul>`;
  }

  function progressBarList(items, fillClass = '') {
    const defaultPercents = [90, 85, 95, 80, 75, 85, 70, 80];
    const rated = parseRated(items);
    if (!rated.length) return '';
    return `<ul class="cv-progress-list">${rated.map((r, i) => {
      const pct = r.score !== null ? Math.round((r.score / r.max) * 100) : defaultPercents[i % defaultPercents.length];
      return `
        <li>
          <div class="cv-progress-head"><span>${esc(r.name)}</span></div>
          <div class="cv-progress-track"><div class="cv-progress-bar ${fillClass}" style="width:${pct}%"></div></div>
        </li>`;
    }).join('')}</ul>`;
  }

  const CANADIAN_ICONS = {
    ball: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12a14.5 14.5 0 0 0 20 0"/><path d="M4.9 4.9a14.5 14.5 0 0 0 14.2 14.2"/><path d="M4.9 19.1A14.5 14.5 0 0 0 19.1 4.9"/></svg>`,
    camera: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h4l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="18" cy="10" r="0.75" fill="currentColor"/></svg>`,
    chess: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5v-2a2 2 0 0 1 1.2-1.8c1.3-.6 2.3-1.4 2.8-2.7.5-1.3.1-3-.6-4.5-.7-1.5-.7-3.5.3-5.5C9.7 2.5 12 1.5 14 1.5c1.2 0 2.2.6 2.2 1.8 0 1.1-.6 1.7-1.2 2.2.6.2 1.7.8 2.2 1.8.6 1.2.5 2.5-.1 3.7-.6 1.2-1.7 1.8-2.3 2.5.5.7 1.2 1.8 1.2 3v2.5H19v2z"/><circle cx="11.5" cy="6.5" r="0.75" fill="currentColor"/></svg>`,
    gamepad: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4m-2-2v4m9-2h.01m3 0h.01"/></svg>`,
    book: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>`,
    plane: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19.5 2.5S16 3 14.5 4.5L11 8 2.8 6.2 1.5 7.5 7 12l-4 4-2-1-1 1 2 2 2 2 1-1-1-2 4-4 4.5 5.5 1.3-1.3z"/></svg>`,
    bike: `<svg class="cv-canadian-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 11l3-5h3l3 5.5m-3-5.5V17.5"/></svg>`,
    profile: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4z"/></svg>`,
    graduation: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm0 8.5L5.5 8 12 4.5 18.5 8 12 11.5zM6 12.3v4.2c0 2.2 2.7 4 6 4s6-1.8 6-4v-4.2l-6 3.3-6-3.3z"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.5 1.9 4.6 4.4 4.9.7 1.8 2.2 3.2 4.1 3.8V19H8v2h8v-2h-3.5v-2.3c1.9-.6 3.4-2 4.1-3.8 2.5-.3 4.4-2.4 4.4-4.9V7c0-1.1-.9-2-2-2zm-14 3V7h2v3.8c-1.2-.4-2-1.5-2-2.8zm14 0c0 1.3-.8 2.4-2 2.8V7h2v1z"/></svg>`,
    qr: `<svg class="cv-qr-code" viewBox="0 0 29 29" width="64" height="64" fill="currentColor"><rect x="2" y="2" width="7" height="7" rx="0.5"/><rect x="3" y="3" width="5" height="5" fill="#ffffff"/><rect x="4" y="4" width="3" height="3"/><rect x="20" y="2" width="7" height="7" rx="0.5"/><rect x="21" y="3" width="5" height="5" fill="#ffffff"/><rect x="22" y="4" width="3" height="3"/><rect x="2" y="20" width="7" height="7" rx="0.5"/><rect x="3" y="21" width="5" height="5" fill="#ffffff"/><rect x="4" y="22" width="3" height="3"/><rect x="10" y="3" width="1.5" height="1.5"/><rect x="13" y="3" width="1.5" height="1.5"/><rect x="16" y="3" width="1.5" height="1.5"/><rect x="3" y="10" width="1.5" height="1.5"/><rect x="3" y="13" width="1.5" height="1.5"/><rect x="3" y="16" width="1.5" height="1.5"/><rect x="10" y="10" width="3" height="3"/><rect x="15" y="10" width="2" height="2"/><rect x="11" y="15" width="2.5" height="2.5"/><rect x="15" y="14" width="3" height="3"/><rect x="20" y="11" width="2" height="2"/><rect x="24" y="11" width="2" height="2"/><rect x="21" y="15" width="3" height="2"/><rect x="11" y="21" width="2" height="2"/><rect x="14" y="21" width="3" height="2"/><rect x="11" y="24" width="3" height="2"/><rect x="16" y="24" width="2" height="2.5"/><rect x="20" y="20" width="2.5" height="2.5"/><rect x="24" y="20" width="2.5" height="2.5"/><rect x="21" y="24" width="5" height="2.5"/></svg>`,
  };

  function boxedIcons(items) {
    const clean = items.filter((s) => String(s).trim());
    if (!clean.length) return '';
    const iconList = [CANADIAN_ICONS.ball, CANADIAN_ICONS.camera, CANADIAN_ICONS.chess, CANADIAN_ICONS.gamepad, CANADIAN_ICONS.book, CANADIAN_ICONS.plane, CANADIAN_ICONS.bike];
    return `<div class="cv-boxed-icons">${clean.map((item, i) => `
      <div class="cv-boxed-icon" title="${esc(item)}">
        ${iconList[i % iconList.length]}
      </div>`).join('')}</div>`;
  }

  function section(key, title, body) {
    if (!body) return '';
    return `<section class="cv-section" data-section="${key}"><h3 class="cv-h">${title}</h3><div class="cv-body">${body}</div></section>`;
  }

  function render(data, template, color) {
    const d = normalize(data);
    const p = d.personal;
    template = TEMPLATES.some((t) => t.id === template) ? template : 'classic';

    const name = p.fullName ? esc(p.fullName) : '<span class="cv-placeholder">Your Name</span>';
    const title = p.jobTitle ? `<p class="cv-title">${esc(p.jobTitle)}</p>` : '';
    const socials = d.socials
      .filter((s) => String(s.url || '').trim())
      .map((s) => `${s.label ? `<span class="cv-link-label">${esc(s.label)}</span> ` : ''}${link(s.url)}`);
    const contacts = [
      ...[p.email, p.phone, p.location].filter(Boolean).map(esc),
      link(p.website),
      ...socials,
    ].filter(Boolean);

    const summary = textBlock(d.summary);
    const experience = entries(d.experience, 'role', 'company');
    const education = entries(d.education, 'degree', 'school');
    const projects = entries(d.projects, 'name', 'role');
    const certificates = entries(d.certificates, 'name', 'issuer');
    const skills = tags(d.skills);
    const languages = tags(d.languages);
    const hobbies = tags(d.hobbies);

    const contactList = contacts.length
      ? `<ul class="cv-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>`
      : '';

    // Only accept images produced by the editor's photo upload
    // Photos uploaded in the editor (data URLs) or images shipped with the app (e.g. the preview photo)
    const photoSrc = /^data:image\/(png|jpeg|webp);base64,/.test(p.photo || '')
      || /^images\/[\w/-]+\.(webp|png|jpe?g)$/.test(p.photo || '')
      ? p.photo
      : '';
    const grid = (html, cols, extra = '') => (html ? `<div class="cv-grid cv-grid--${cols} ${extra}">${html}</div>` : '');

    let body;
    if (template === 'bold') {
      // Name on two lines: first name(s), then last name
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = words.length > 1
        ? `${esc(words.slice(0, -1).join(' '))}<br>${esc(words[words.length - 1])}`
        : name;

      const sideTone = isLight(color || defaultColor('bold')) ? '' : ' cv-side--dark';

      body = `
        <div class="cv-cols">
          <aside class="cv-aside${sideTone}">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            ${section('profile', 'Profile', summary)}
            ${section('contact', 'Contact', iconContacts(p, d.socials))}
            ${section('skills', 'Skills', ratedList(d.skills))}
            ${section('languages', 'Languages', ratedList(d.languages))}
          </aside>
          <div class="cv-main">
            <header class="cv-header"><h1 class="cv-name">${splitName}</h1>${title}</header>
            <div class="cv-main-body">
              ${section('experience', 'Professional experience', experience)}
              ${section('projects', 'Projects', projects)}
              ${section('education', 'Education', education)}
              ${section('certificates', 'Certificates', certificates)}
              ${section('hobbies', 'Interests', bulletList(d.hobbies))}
            </div>
          </div>
        </div>`;
    } else if (template === 'linen') {
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = words.length > 1
        ? `${esc(words.slice(0, -1).join(' '))} <span class="cv-name-last">${esc(words[words.length - 1])}</span>`
        : name;
      const contactBlock = iconContacts(p, d.socials);
      const expertise = labelledGroup('Professional', bulletList(d.skills)) + labelledGroup('Languages', bulletList(d.languages));

      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            <div class="cv-photo-slot">${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}</div>
            ${contactBlock ? `<section class="cv-section" data-section="contact">${contactBlock}</section>` : ''}
            ${section('education', 'Education', stackEntries(d.education, 'degree', 'school'))}
            ${section('skills', 'Expertise', expertise)}
            ${section('hobbies', 'Interests', bulletList(d.hobbies))}
          </aside>
          <div class="cv-main">
            <header class="cv-header"><h1 class="cv-name">${splitName}</h1>${title}</header>
            ${summary ? `<div class="cv-summary">${summary}</div>` : ''}
            ${section('experience', 'Work experience', lineEntries(d.experience, 'role', 'company', ' | '))}
            ${section('projects', 'Projects', projects)}
            ${section('certificates', 'Professional development', certificates)}
          </div>
        </div>`;
    } else if (template === 'europass') {
      const europassLogo = () => {
        const stars = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = (20 + 9 * Math.sin(rad)).toFixed(2);
          const cy = (15 - 9 * Math.cos(rad)).toFixed(2);
          return `<circle cx="${cx}" cy="${cy}" r="0.9" fill="#ffcc00"/>`;
        }).join('');
        return `
          <div class="cv-europass-brand" aria-label="Europass">
            <svg class="cv-eu-flag" viewBox="0 0 40 30" width="40" height="30" aria-hidden="true">
              <rect width="40" height="30" fill="#003399"/>
              ${stars}
            </svg>
            <span class="cv-europass-wordmark">europass</span>
          </div>`;
      };

      const workEntries = d.experience.filter(hasContent).map((item) => {
        const when = dateRange(item.start, item.end || item.date);
        const cityCountry = item.location ? item.location.split(',') : [];
        const city = cityCountry[0] ? cityCountry[0].trim() : '';
        const country = cityCountry[1] ? cityCountry[1].trim() : '';
        return `
          <div class="cv-entry cv-europass-entry">
            <div class="cv-company-row">
              ${ICONS.building}
              <span class="cv-company-name">${esc(item.company)}${item.location ? ` – ${esc(item.location)}` : ''}</span>
            </div>
            ${city && country ? `<div class="cv-sub-loc">City: ${esc(city)} | Country: ${esc(country)}</div>` : ''}
            <div class="cv-role-row">
              <h4 class="cv-entry-title">${esc(item.role)}</h4>
              ${when ? `<span class="cv-entry-dates">[ ${esc(when)} ]</span>` : ''}
            </div>
            ${textBlock(item.description)}
          </div>`;
      }).join('');

      const eduEntries = d.education.filter(hasContent).map((item) => {
        const when = dateRange(item.start, item.end || item.date);
        return `
          <div class="cv-entry cv-europass-entry">
            <h4 class="cv-entry-title">${esc(item.degree)}</h4>
            <div class="cv-school-row">
              <span>${esc(item.school)}${item.location ? `, ${esc(item.location)}` : ''}</span>
              ${when ? `<span class="cv-entry-dates">[ ${esc(when)} ]</span>` : ''}
            </div>
            ${textBlock(item.description)}
          </div>`;
      }).join('');

      const cleanSkills = d.skills.filter((s) => String(s).trim());
      const skillsHtml = cleanSkills.length
        ? `<p class="cv-inline-text">${cleanSkills.map((s) => `${esc(s)}.`).join(' &nbsp;/&nbsp; ')}</p>`
        : '';

      const cleanLangs = d.languages.filter((s) => String(s).trim());
      let langsHtml = '';
      if (cleanLangs.length) {
        langsHtml = `
          <div class="cv-lang-block">
            <div class="cv-lang-row"><strong class="cv-lang-label">Mother tongue(s):</strong> <span>${esc(cleanLangs[0])}</span></div>
            ${cleanLangs.length > 1 ? `<div class="cv-lang-row"><strong class="cv-lang-label">Other language(s):</strong> <span>${cleanLangs.slice(1).map(esc).join(', ')}</span></div>` : ''}
          </div>`;
      }

      const cleanHobbies = d.hobbies.filter((s) => String(s).trim());
      const hobbiesHtml = cleanHobbies.length
        ? `<p class="cv-inline-text">${cleanHobbies.map(esc).join(' &nbsp;/&nbsp; ')}</p>`
        : '';

      const contactItems = [
        p.phone ? `<li>${ICONS.phone}<strong>Phone number:</strong> <span>${esc(p.phone)}</span></li>` : '',
        p.email ? `<li>${ICONS.email}<strong>Email address:</strong> <a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>` : '',
        ...d.socials.filter((s) => s.url).map((s) => `<li>${ICONS.linkedin}<strong>${esc(s.label || 'LinkedIn')}:</strong> ${link(s.url)}</li>`),
        p.website ? `<li>${ICONS.web}<strong>Website:</strong> ${link(p.website)}</li>` : '',
        p.location ? `<li>${ICONS.location}<strong>Home:</strong> <span>${esc(p.location)}</span></li>` : '',
      ].filter(Boolean).join('');

      body = `
        <div class="cv-europass-top-bar" aria-hidden="true"></div>
        <header class="cv-header">
          <div class="cv-head-top">
            <div class="cv-photo-area">
              ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo-placeholder"></div>'}
            </div>
            <div class="cv-identity">
              <h1 class="cv-name">${name}</h1>
              ${title ? `<p class="cv-title">${title}</p>` : ''}
              ${contactItems ? `<ul class="cv-contact-lines">${contactItems}</ul>` : ''}
            </div>
            <div class="cv-brand-col">
              ${europassLogo()}
            </div>
          </div>
        </header>
        <div class="cv-body">
          ${section('profile', 'ABOUT ME', summary)}
          ${section('experience', 'WORK EXPERIENCE', workEntries)}
          ${section('education', 'EDUCATION AND TRAINING', eduEntries)}
          ${section('skills', 'SKILLS', skillsHtml)}
          ${section('languages', 'LANGUAGE SKILLS', langsHtml)}
          ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
          ${section('certificates', 'CERTIFICATES', datedEntries(d.certificates, 'name', 'issuer'))}
          ${section('hobbies', 'HOBBIES AND INTERESTS', hobbiesHtml)}
        </div>
        <div class="cv-corner-bl" aria-hidden="true"></div>
        <div class="cv-corner-br" aria-hidden="true"></div>`;
    } else if (template === 'europass-timeline') {
      const europassLogo = () => {
        const stars = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = (20 + 9 * Math.sin(rad)).toFixed(2);
          const cy = (15 - 9 * Math.cos(rad)).toFixed(2);
          return `<circle cx="${cx}" cy="${cy}" r="0.9" fill="#ffcc00"/>`;
        }).join('');
        return `
          <div class="cv-europass-brand" aria-label="Europass">
            <svg class="cv-eu-flag" viewBox="0 0 40 30" width="40" height="30" aria-hidden="true">
              <rect width="40" height="30" fill="#003399"/>
              ${stars}
            </svg>
            <span class="cv-europass-wordmark">europass</span>
          </div>`;
      };

      const timelineEntries = (items, titleKey, subKey) => {
        const clean = items.filter(hasContent);
        if (!clean.length) return '';
        return `<div class="cv-timeline">${clean.map((item) => {
          const when = dateRange(item.start, item.end || item.date);
          const whenLine = [when ? esc(when) : '', item.location ? esc(item.location) : ''].filter(Boolean).join(' – ');
          return `
            <div class="cv-timeline-entry cv-entry">
              <span class="cv-timeline-node" aria-hidden="true"></span>
              ${whenLine ? `<p class="cv-timeline-date">${whenLine}</p>` : ''}
              ${item[titleKey] ? `<h4 class="cv-entry-title">${esc(item[titleKey])}</h4>` : ''}
              ${item[subKey] ? `<p class="cv-entry-sub">${esc(item[subKey])}</p>` : ''}
              ${textBlock(item.description)}
            </div>`;
        }).join('')}</div>`;
      };

      const cleanSkills = d.skills.filter((s) => String(s).trim());
      const skillsHtml = cleanSkills.length
        ? `<p class="cv-inline-slash">${cleanSkills.map(esc).join(' &nbsp;/&nbsp; ')}</p>`
        : '';

      const cleanLangs = d.languages.filter((s) => String(s).trim());
      let langsHtml = '';
      if (cleanLangs.length) {
        langsHtml = `
          <div class="cv-lang-block">
            <div class="cv-lang-row"><strong class="cv-lang-lbl">MOTHER TONGUE(S):</strong> <span>${esc(cleanLangs[0]).toUpperCase()}</span></div>
            ${cleanLangs.length > 1 ? `<div class="cv-lang-row"><strong class="cv-lang-lbl">OTHER LANGUAGE(S):</strong> <span>${cleanLangs.slice(1).map((l) => esc(l).toUpperCase()).join(', ')}</span></div>` : ''}
          </div>`;
      }

      const cleanHobbies = d.hobbies.filter((s) => String(s).trim());
      const hobbiesHtml = cleanHobbies.length
        ? `<p class="cv-inline-slash">${cleanHobbies.map(esc).join(' &nbsp;/&nbsp; ')}</p>`
        : '';

      const metaRows = [
        p.phone ? `<div class="cv-meta-item"><p class="cv-meta-label">Phone number:</p><p class="cv-meta-val">${esc(p.phone)}</p></div>` : '',
        p.email ? `<div class="cv-meta-item"><p class="cv-meta-label">Email address:</p><p class="cv-meta-val"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p></div>` : '',
        ...d.socials.filter((s) => s.url).map((s) => `<div class="cv-meta-item"><p class="cv-meta-label">${esc(s.label || 'LinkedIn')}:</p><p class="cv-meta-val">${link(s.url)}</p></div>`),
        p.location ? `<div class="cv-meta-item"><p class="cv-meta-label">Address:</p><p class="cv-meta-val">${esc(p.location)}</p></div>` : '',
        p.website ? `<div class="cv-meta-item"><p class="cv-meta-label">Website:</p><p class="cv-meta-val">${link(p.website)}</p></div>` : '',
      ].filter(Boolean).join('');

      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            <div class="cv-photo-box">
              ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo-placeholder"></div>'}
            </div>
            <h1 class="cv-name">${name}</h1>
            ${title ? `<p class="cv-title">${title}</p>` : ''}
            <div class="cv-meta-stack">
              ${metaRows}
            </div>
          </aside>
          <div class="cv-main">
            <div class="cv-top-brand">
              ${europassLogo()}
            </div>
            ${section('profile', 'ABOUT ME:', summary)}
            ${section('education', 'EDUCATION AND TRAINING', timelineEntries(d.education, 'degree', 'school'))}
            ${section('experience', 'WORK EXPERIENCE', timelineEntries(d.experience, 'role', 'company'))}
            ${section('languages', 'LANGUAGE SKILLS', langsHtml)}
            ${section('skills', 'DIGITAL SKILLS', skillsHtml)}
            ${section('projects', 'PROJECTS', timelineEntries(d.projects, 'name', 'role'))}
            ${section('certificates', 'CERTIFICATES', timelineEntries(d.certificates, 'name', 'issuer'))}
            ${section('hobbies', 'HOBBIES AND INTERESTS', hobbiesHtml)}
          </div>
        </div>`;
    } else if (template === 'onyx') {
      const ring = '<span class="cv-ring" aria-hidden="true"></span>';
      const sec = (key, text, html) => section(key, `${ring}${text}`, html);

      body = `
        <header class="cv-band">
          ${ring}
          <div class="cv-identity"><h1 class="cv-name">${name}</h1>${title}</div>
          ${ring}
        </header>
        <div class="cv-cols">
          <div class="cv-main">
            ${sec('profile', 'About me', summary)}
            ${sec('experience', 'Work experience', datedEntries(d.experience, 'role', 'company'))}
            ${sec('projects', 'Projects', datedEntries(d.projects, 'name', 'role'))}
          </div>
          <aside class="cv-aside">
            ${sec('contact', 'Contacts', iconContacts(p, d.socials))}
            ${sec('education', 'Education', datedEntries(d.education, 'degree', 'school'))}
            ${sec('skills', 'Skills', bulletList(d.skills))}
            ${sec('languages', 'Languages', bulletList(d.languages))}
            ${sec('certificates', 'Certificates', datedEntries(d.certificates, 'name', 'issuer'))}
            ${sec('hobbies', 'Hobbies', bulletList(d.hobbies))}
          </aside>
        </div>`;
    } else if (template === 'pacific') {
      const contactBlock = iconContacts(p, d.socials);

      body = `
        <header class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          <div class="cv-identity">
            <h1 class="cv-name">${name}</h1>
            ${title}
            ${summary ? `<div class="cv-intro">${summary}</div>` : ''}
          </div>
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
        </header>
        ${contactBlock ? `<div class="cv-contact-bar">${contactBlock}</div>` : ''}
        ${section('skills', 'Skills', skills)}
        ${section('experience', 'Work experience', experience)}
        ${section('education', 'Education', education)}
        ${section('projects', 'Projects', projects)}
        ${section('certificates', 'Certificates', certificates)}
        ${section('languages', 'Languages', languages)}
        ${section('hobbies', 'Interests', hobbies)}`;
    } else if (template === 'beacon') {
      // "Role - dates" on one line, then the place
      const itemLines = (items, titleKey, subKey) => items.filter(hasContent).map((item) => {
        const head = [esc(item[titleKey]), esc(dateRange(item.start, item.end || item.date))].filter(Boolean).join(' - ');
        const sub = [esc(item[subKey]), esc(item.location), link(item.link)].filter(Boolean).join(', ');
        return `
          <div class="cv-entry">
            ${head ? `<h4 class="cv-entry-title">${head}</h4>` : ''}
            ${sub ? `<p class="cv-entry-sub">${sub}</p>` : ''}
            ${textBlock(item.description)}
          </div>`;
      }).join('');

      body = `
        <div class="cv-cols">
          <div class="cv-main">
            <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
            ${section('profile', 'Summary', summary)}
            ${section('experience', 'Experience', itemLines(d.experience, 'role', 'company'))}
            ${section('education', 'Education', itemLines(d.education, 'degree', 'school'))}
            ${section('projects', 'Projects', itemLines(d.projects, 'name', 'role'))}
            ${section('certificates', 'Certifications', itemLines(d.certificates, 'name', 'issuer'))}
            ${section('hobbies', 'Interests', bulletList(d.hobbies))}
          </div>
          <aside class="cv-aside${photoSrc ? ' cv-aside--photo' : ''}">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            ${section('contact', 'Contact', contactList)}
            ${section('skills', 'Skills', ratedList(d.skills))}
            ${section('languages', 'Languages', ratedList(d.languages))}
          </aside>
        </div>`;
    } else if (template === 'maple') {
      const eduLines = d.education.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <h4 class="cv-entry-title">${esc(item.degree).toUpperCase()}</h4>
          <p class="cv-entry-sub"><em>${esc(item.school)}${item.location ? `, ${esc(item.location)}` : ''}</em></p>
          ${item.start || item.end || item.date ? `<span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const expLines = d.experience.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <div class="cv-entry-head">
            <h4 class="cv-entry-title">${esc(item.role).toUpperCase()}</h4>
            <span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>
          </div>
          <p class="cv-entry-sub"><em>${esc(item.company)}${item.location ? ` / ${esc(item.location)}` : ''}</em></p>
          ${textBlock(item.description)}
        </div>`).join('');

      const contactBlock = `
        <div class="cv-contact-lines">
          ${p.location ? `<p>${esc(p.location)}</p>` : ''}
          <div class="cv-contact-compact">
            ${p.phone ? `<p><strong>P:</strong> ${esc(p.phone)}</p>` : ''}
            ${p.email ? `<p><strong>E:</strong> ${esc(p.email)}</p>` : ''}
            ${p.website ? `<p><strong>W:</strong> ${link(p.website)}</p>` : ''}
          </div>
        </div>`;

      const socialLabel = d.socials.length && d.socials[0].url ? link(d.socials[0].url) : '/username';

      body = `
        <header class="cv-header">
          <div class="cv-header-frame">
            <div class="cv-identity">
              <h1 class="cv-name">${name}</h1>
              <div class="cv-social-pill">
                <span class="cv-social-icons">f &bull; in</span>
                <span>${socialLabel}</span>
              </div>
            </div>
            <div class="cv-contact-col">
              <h3 class="cv-contact-title">CONTACT</h3>
              ${contactBlock}
            </div>
            <div class="cv-photo-area">
              <div class="cv-photo-ring">
                ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo-placeholder"></div>'}
              </div>
            </div>
          </div>
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('skills', 'EXPERTISE', progressBarList(d.skills, 'cv-progress-accent'))}
            ${section('education', 'EDUCATION', eduLines)}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
            ${section('certificates', 'CERTIFICATES', stackEntries(d.certificates, 'name', 'issuer'))}
            ${section('hobbies', 'INTERESTS', boxedIcons(d.hobbies))}
          </aside>
          <div class="cv-main">
            ${section('profile', 'ABOUT ME', summary)}
            ${section('experience', 'WORK EXPERIENCE', expLines)}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
          </div>
        </div>
        <div class="cv-bottom-accent-bar" aria-hidden="true"></div>`;
    } else if (template === 'toronto') {
      const expLines = d.experience.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <div class="cv-entry-head">
            <h4 class="cv-entry-title">${esc(item.role).toUpperCase()}</h4>
            <span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>
          </div>
          <p class="cv-entry-sub"><em>${esc(item.company)}${item.location ? ` / ${esc(item.location)}` : ''}</em></p>
          ${textBlock(item.description)}
        </div>`).join('');

      const eduLines = d.education.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <h4 class="cv-entry-title">${esc(item.degree)}</h4>
          <p class="cv-entry-sub"><em>${esc(item.school)}${item.location ? `, ${esc(item.location)}` : ''}</em></p>
          ${item.start || item.end || item.date ? `<span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const statsTiles = `
        <div class="cv-quick-facts">
          <div class="cv-stat-badge"><span class="cv-badge-num">15</span><span class="cv-badge-lbl">Years Experience</span></div>
          <div class="cv-stat-badge"><span class="cv-badge-num">80</span><span class="cv-badge-lbl">Projects Done</span></div>
          <div class="cv-stat-badge"><span class="cv-badge-num">75</span><span class="cv-badge-lbl">Global Clients</span></div>
          <div class="cv-stat-badge"><span class="cv-badge-num">18</span><span class="cv-badge-lbl">Awards Won</span></div>
        </div>`;

      body = `
        <header class="cv-header">
          <div class="cv-hero-3col">
            <div class="cv-hero-id">
              <h1 class="cv-name">${name}</h1>
              ${title}
              <div class="cv-rule-accent"></div>
              <div class="cv-contact-box">
                <h3 class="cv-contact-h">CONTACT</h3>
                <div class="cv-contact-body">
                  ${p.location ? `<p>${esc(p.location)}</p>` : ''}
                  ${p.phone ? `<p><strong>P:</strong> ${esc(p.phone)}</p>` : ''}
                  ${p.email ? `<p><strong>E:</strong> ${esc(p.email)}</p>` : ''}
                  ${p.website ? `<p><strong>W:</strong> ${link(p.website)}</p>` : ''}
                </div>
              </div>
            </div>
            <div class="cv-hero-photo">
              ${photoSrc ? `<div class="cv-photo cv-photo--portrait"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo cv-photo--portrait cv-photo-placeholder"></div>'}
            </div>
            <div class="cv-hero-about">
              <h3 class="cv-h">ABOUT ME</h3>
              <div class="cv-summary">${summary}</div>
            </div>
          </div>
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('skills', 'EXPERTISE', progressBarList(d.skills, 'cv-progress-accent'))}
            ${section('education', 'EDUCATION', eduLines)}
            ${section('certificates', 'CERTIFICATES', stackEntries(d.certificates, 'name', 'issuer'))}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
          </aside>
          <div class="cv-main">
            ${section('experience', 'WORK EXPERIENCE', expLines)}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
            <div class="cv-facts-section">
              <h3 class="cv-h">QUICK FACTS</h3>
              <div class="cv-facts-row">
                ${statsTiles}
                <div class="cv-qr-wrap">${CANADIAN_ICONS.qr}</div>
              </div>
            </div>
          </div>
        </div>`;
    } else if (template === 'vancouver') {
      const rawName = (p.fullName || '').trim().toUpperCase();
      const words = rawName.split(/\s+/).filter(Boolean);
      const splitName = words.length > 1
        ? `<span class="cv-name-light">${esc(words.slice(0, -1).join(' '))}</span> <span class="cv-name-bold">${esc(words[words.length - 1])}</span>`
        : (name ? `<span class="cv-name-bold">${name}</span>` : '');

      const eduGrid = d.education.filter(hasContent).map((item) => `
        <div class="cv-edu-cell">
          <h4 class="cv-entry-title">${esc(item.degree)}</h4>
          <p class="cv-entry-sub"><em>${esc(item.school)}${item.location ? `, ${esc(item.location)}` : ''}</em></p>
          ${item.start || item.end || item.date ? `<span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const expTimeline = d.experience.filter(hasContent).map((item) => `
        <div class="cv-timeline-entry cv-entry">
          <span class="cv-timeline-node" aria-hidden="true"></span>
          <div class="cv-entry-head">
            <h4 class="cv-entry-title">${esc(item.role).toUpperCase()}</h4>
            <span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>
          </div>
          <p class="cv-entry-sub"><em>${esc(item.company)}${item.location ? ` / ${esc(item.location)}` : ''}</em></p>
          ${textBlock(item.description)}
        </div>`).join('');

      body = `
        <header class="cv-header">
          <div class="cv-banner-row">
            <div class="cv-id-block">
              <h1 class="cv-name">${splitName}</h1>
              ${title}
              <div class="cv-contact-gold">
                <span class="cv-gold-bar" aria-hidden="true"></span>
                <div class="cv-contact-details">
                  <h3 class="cv-contact-h">CONTACT</h3>
                  ${p.location ? `<p class="cv-contact-addr">${esc(p.location)}</p>` : ''}
                  ${p.phone ? `<p class="cv-contact-row"><span class="cv-contact-ico">${ICONS.phone}</span><span>${esc(p.phone)}</span></p>` : ''}
                  ${p.email ? `<p class="cv-contact-row"><span class="cv-contact-ico">${ICONS.email}</span><span>${esc(p.email)}</span></p>` : ''}
                  ${p.website ? `<p class="cv-contact-row"><span class="cv-contact-ico">${ICONS.web}</span><span>${link(p.website)}</span></p>` : ''}
                </div>
              </div>
            </div>
            <div class="cv-photo-banner">
              <div class="cv-gold-backdrop" aria-hidden="true"></div>
              ${photoSrc ? `<div class="cv-photo cv-photo--banner"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo cv-photo--banner cv-photo-placeholder"></div>'}
            </div>
            <div class="cv-qr-side">
              <div class="cv-qr-box">
                ${CANADIAN_ICONS.qr}
              </div>
              <div class="cv-vertical-social-strip">
                <div class="cv-social-circles">
                  <span class="cv-social-circle-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><circle cx="12" cy="12" r="11" fill="#111827"/><path d="M13.5 18v-5.5h1.9l.3-2.2h-2.2V9c0-.6.2-1.1 1.1-1.1h1.2V6c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.8H9v2.2h1.7V18h2.8z" fill="#ffffff"/></svg>
                  </span>
                  <span class="cv-social-circle-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><circle cx="12" cy="12" r="11" fill="#111827"/><path d="M15.5 8.5a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0zm-3.5.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm0 4.4a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zm4.2-5.7c-.1-.7-.4-1.2-1-1.7-.5-.5-1.1-.8-1.7-1-.6-.2-1.9-.2-3.5-.2s-2.9 0-3.5.2c-.6.2-1.2.5-1.7 1-.5.5-.8 1-1 1.7-.2.6-.2 1.9-.2 3.5s0 2.9.2 3.5c.2.6.5 1.2 1 1.7.5.5 1.1.8 1.7 1 .6.2 1.9.2 3.5.2s2.9 0 3.5-.2c.6-.2 1.2-.5 1.7-1 .5-.5.8-1.1 1-1.7.2-.6.2-1.9.2-3.5s0-2.9-.2-3.5zm-.9 7.7c-.1.5-.3.9-.7 1.3-.4.4-.8.6-1.3.7-.5.2-1.8.2-3.3.2s-2.8 0-3.3-.2c-.5-.1-.9-.3-1.3-.7-.4-.4-.6-.8-.7-1.3-.2-.5-.2-1.8-.2-3.3s0-2.8.2-3.3c.1-.5.3-.9.7-1.3.4-.4.8-.6 1.3-.7.5-.2 1.8-.2 3.3-.2s2.8 0 3.3.2c.5.1.9.3 1.3.7.4.4.6.8.7 1.3.2.5.2 1.8.2 3.3s0 2.8-.2 3.3z" fill="#ffffff"/></svg>
                  </span>
                </div>
                <div class="cv-vertical-social">
                  <span>/${esc(p.website ? p.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'username goes here')}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('profile', 'ABOUT ME', summary)}
            ${section('skills', 'SKILLS', progressBarList(d.skills))}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
            ${section('hobbies', 'INTERESTS', boxedIcons(d.hobbies))}
          </aside>
          <div class="cv-main">
            ${section('education', 'EDUCATION', eduGrid ? `<div class="cv-edu-2col">${eduGrid}</div>` : '')}
            ${section('experience', 'WORK EXPERIENCE', expTimeline ? `<div class="cv-timeline">${expTimeline}</div>` : '')}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
            ${section('certificates', 'CERTIFICATES', datedEntries(d.certificates, 'name', 'issuer'))}
          </div>
        </div>`;
    } else if (template === 'montreal') {
      const eduLines = d.education.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <h4 class="cv-entry-title">${esc(item.degree)}</h4>
          <p class="cv-entry-sub"><em>${esc(item.school)}</em></p>
          ${item.start || item.end || item.date ? `<span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const expTimeline = d.experience.filter(hasContent).map((item) => `
        <div class="cv-timeline-entry cv-entry">
          <span class="cv-timeline-node" aria-hidden="true"></span>
          <div class="cv-entry-head">
            <h4 class="cv-entry-title">${esc(item.role).toUpperCase()}</h4>
            <span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>
          </div>
          <p class="cv-entry-sub"><em>${esc(item.company)}${item.location ? ` / ${esc(item.location)}` : ''}</em></p>
          ${textBlock(item.description)}
        </div>`).join('');

      const certLines = d.certificates.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <h4 class="cv-entry-title">${esc(item.name).toUpperCase()}</h4>
          <p class="cv-entry-sub"><em>${esc(item.issuer)}</em></p>
          ${item.date ? `<span class="cv-entry-date">${esc(item.date)}</span>` : ''}
        </div>`).join('');

      body = `
        <header class="cv-header">
          <div class="cv-header-grid">
            <div class="cv-id-col">
              <h1 class="cv-name">${name}</h1>
              <div class="cv-title-bar">
                ${title}
                <span class="cv-rule-tan" aria-hidden="true"></span>
              </div>
            </div>
            <div class="cv-contact-col">
              <h3 class="cv-contact-h">CONTACT</h3>
              ${p.location ? `<p>${esc(p.location)}</p>` : ''}
              ${p.phone ? `<p><strong>P:</strong> ${esc(p.phone)}</p>` : ''}
              ${p.email ? `<p><strong>E:</strong> ${esc(p.email)}</p>` : ''}
              ${p.website ? `<p><strong>W:</strong> ${link(p.website)}</p>` : ''}
            </div>
            <div class="cv-photo-tan">
              <div class="cv-tan-block" aria-hidden="true"></div>
              ${photoSrc ? `<div class="cv-photo cv-photo--portrait"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo cv-photo--portrait cv-photo-placeholder"></div>'}
            </div>
          </div>
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('profile', 'ABOUT ME', summary)}
            ${section('education', 'EDUCATION', eduLines)}
            ${section('skills', 'SKILLS', progressBarList(d.skills, 'cv-progress-accent'))}
            ${section('certificates', 'AWARDS', certLines)}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
          </aside>
          <div class="cv-main">
            ${section('experience', 'WORK EXPERIENCE', expTimeline ? `<div class="cv-timeline">${expTimeline}</div>` : '')}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
            ${section('hobbies', 'INTERESTS', boxedIcons(d.hobbies))}
          </div>
        </div>`;
    } else if (template === 'calgary') {
      const expLines = d.experience.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <div class="cv-entry-head">
            <h4 class="cv-entry-title">${esc(item.role).toUpperCase()}</h4>
            <span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>
          </div>
          <p class="cv-entry-sub"><em>${esc(item.company)}${item.location ? ` / ${esc(item.location)}` : ''}</em></p>
          ${textBlock(item.description)}
        </div>`).join('');

      const eduLines = d.education.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <h4 class="cv-entry-title">${esc(item.degree)}</h4>
          <p class="cv-entry-sub"><em>${esc(item.school)}${item.location ? `, ${esc(item.location)}` : ''}</em></p>
          ${item.start || item.end || item.date ? `<span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const statsTiles = `
        <div class="cv-quick-facts">
          <div class="cv-stat-badge"><span class="cv-badge-num">15</span><span class="cv-badge-lbl">Years Experience</span></div>
          <div class="cv-stat-badge"><span class="cv-badge-num">80</span><span class="cv-badge-lbl">Projects Done</span></div>
          <div class="cv-stat-badge"><span class="cv-badge-num">75</span><span class="cv-badge-lbl">Global Clients</span></div>
          <div class="cv-stat-badge"><span class="cv-badge-num">18</span><span class="cv-badge-lbl">Awards Won</span></div>
        </div>`;

      body = `
        <header class="cv-header">
          <div class="cv-hero-3col">
            <div class="cv-hero-id">
              <h1 class="cv-name">${name}</h1>
              ${title}
              <div class="cv-rule-accent"></div>
              <div class="cv-contact-box">
                <h3 class="cv-contact-h">CONTACT</h3>
                <div class="cv-contact-body">
                  ${p.location ? `<p>${esc(p.location)}</p>` : ''}
                  ${p.phone ? `<p><strong>P:</strong> ${esc(p.phone)}</p>` : ''}
                  ${p.email ? `<p><strong>E:</strong> ${esc(p.email)}</p>` : ''}
                  ${p.website ? `<p><strong>W:</strong> ${link(p.website)}</p>` : ''}
                </div>
              </div>
            </div>
            <div class="cv-hero-photo">
              ${photoSrc ? `<div class="cv-photo cv-photo--portrait"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo cv-photo--portrait cv-photo-placeholder"></div>'}
            </div>
            <div class="cv-hero-about">
              <h3 class="cv-h">ABOUT ME</h3>
              <div class="cv-summary">${summary}</div>
            </div>
          </div>
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('skills', 'EXPERTISE', progressBarList(d.skills, 'cv-progress-accent'))}
            ${section('education', 'EDUCATION', eduLines)}
            ${section('certificates', 'CERTIFICATES', stackEntries(d.certificates, 'name', 'issuer'))}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
          </aside>
          <div class="cv-main">
            ${section('experience', 'WORK EXPERIENCE', expLines)}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
            <div class="cv-facts-section">
              <h3 class="cv-h">QUICK FACTS</h3>
              <div class="cv-facts-row">
                ${statsTiles}
                <div class="cv-qr-wrap">${CANADIAN_ICONS.qr}</div>
              </div>
            </div>
          </div>
        </div>`;
    } else if (template === 'ottawa') {
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = words.length > 1
        ? `<span class="cv-name-light">${esc(words.slice(0, -1).join(' '))}</span> <span class="cv-name-bold">${esc(words[words.length - 1])}</span>`
        : name;

      const expLines = d.experience.filter(hasContent).map((item) => `
        <div class="cv-entry">
          <div class="cv-entry-head">
            <h4 class="cv-entry-title">${esc(item.role).toUpperCase()}</h4>
            <span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>
          </div>
          <p class="cv-entry-sub"><em>${esc(item.company)}${item.location ? ` / ${esc(item.location)}` : ''}</em></p>
          ${textBlock(item.description)}
        </div>`).join('');

      const eduGrid = d.education.filter(hasContent).map((item) => `
        <div class="cv-edu-cell">
          <h4 class="cv-entry-title">${esc(item.degree)}</h4>
          <p class="cv-entry-sub"><em>${esc(item.school)}${item.location ? `, ${esc(item.location)}` : ''}</em></p>
          ${item.start || item.end || item.date ? `<span class="cv-entry-date">${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const secWithIcon = (key, iconSvg, titleText, html) => {
        if (!html) return '';
        return `
          <section class="cv-section cv-sec-badge" data-section="${key}">
            <div class="cv-h-badge"><span class="cv-node-icon">${iconSvg}</span><h3 class="cv-h">${titleText}</h3></div>
            <div class="cv-body">${html}</div>
          </section>`;
      };

      body = `
        <header class="cv-header">
          <h1 class="cv-name">${splitName}</h1>
          ${title}
        </header>
        <div class="cv-cols cv-cols--timeline-split">
          <aside class="cv-aside">
            <div class="cv-photo-ring">
              ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo-placeholder"></div>'}
            </div>
            <div class="cv-contact-box">
              <h3 class="cv-contact-h">CONTACT</h3>
              ${p.location ? `<p>${esc(p.location)}</p>` : ''}
              ${p.phone ? `<p><strong>P:</strong> ${esc(p.phone)}</p>` : ''}
              ${p.email ? `<p><strong>E:</strong> ${esc(p.email)}</p>` : ''}
              ${p.website ? `<p><strong>W:</strong> ${link(p.website)}</p>` : ''}
            </div>
            ${section('skills', 'SKILLS', progressBarList(d.skills))}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
            ${section('hobbies', 'INTERESTS', bulletList(d.hobbies))}
          </aside>
          <div class="cv-main">
            ${secWithIcon('profile', CANADIAN_ICONS.profile, 'ABOUT ME', summary)}
            ${secWithIcon('experience', CANADIAN_ICONS.briefcase, 'WORK EXPERIENCE', expLines)}
            ${secWithIcon('education', CANADIAN_ICONS.graduation, 'EDUCATION', eduGrid ? `<div class="cv-edu-2col">${eduGrid}</div>` : '')}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
            ${section('certificates', 'CERTIFICATES', datedEntries(d.certificates, 'name', 'issuer'))}
          </div>
        </div>`;
    } else if (template === 'quebec') {
      const splitEntries = (items, titleKey, subKey) => items.filter(hasContent).map((item) => `
        <div class="cv-split-entry cv-entry">
          <div class="cv-entry-place"><strong>${esc(item[subKey] || '').toUpperCase()}</strong></div>
          <div class="cv-entry-content">
            <div class="cv-entry-head">
              <h4 class="cv-entry-title">${esc(item[titleKey] || '').toUpperCase()}</h4>
              ${item.start || item.end || item.date ? `<span class="cv-entry-date">// ${esc(dateRange(item.start, item.end || item.date))}</span>` : ''}
            </div>
            ${textBlock(item.description)}
          </div>
        </div>`).join('');

      const secWithDisc = (key, iconSvg, titleText, html) => {
        if (!html) return '';
        return `
          <section class="cv-section" data-section="${key}">
            <div class="cv-h-disc"><span class="cv-disc-icon">${iconSvg}</span><h3 class="cv-h">${titleText}</h3></div>
            <div class="cv-body">${html}</div>
          </section>`;
      };

      const contactListDisc = [
        p.phone ? `<li><span class="cv-disc-icon">${ICONS.phone}</span><div><strong>Phone</strong><p>${esc(p.phone)}</p></div></li>` : '',
        p.website ? `<li><span class="cv-disc-icon">${ICONS.web}</span><div><strong>Website</strong><p>${link(p.website)}</p></div></li>` : '',
        p.email ? `<li><span class="cv-disc-icon">${ICONS.email}</span><div><strong>Email</strong><p>${esc(p.email)}</p></div></li>` : '',
        p.location ? `<li><span class="cv-disc-icon">${ICONS.location}</span><div><strong>Location</strong><p>${esc(p.location)}</p></div></li>` : '',
      ].filter(Boolean).join('');

      body = `
        <div class="cv-cols cv-cols--sidebar">
          <aside class="cv-aside">
            <div class="cv-photo-frame">
              ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '<div class="cv-photo-placeholder"></div>'}
            </div>
            <h1 class="cv-name">${name}</h1>
            ${title}
            <div class="cv-contact-section">
              <h3 class="cv-aside-h">CONTACT ME</h3>
              <ul class="cv-icon-disc-list">${contactListDisc}</ul>
            </div>
            ${section('skills', 'PRO SKILL', progressBarList(d.skills))}
            ${section('languages', 'LANGUAGES', bulletList(d.languages))}
            ${section('certificates', 'REFERENCES', stackEntries(d.certificates, 'name', 'issuer'))}
            ${section('hobbies', 'HOBBIES', bulletList(d.hobbies))}
          </aside>
          <div class="cv-main">
            ${secWithDisc('profile', CANADIAN_ICONS.profile, '— MY STATEMENT', summary)}
            ${secWithDisc('education', CANADIAN_ICONS.graduation, '— EDUCATION', splitEntries(d.education, 'degree', 'school'))}
            ${secWithDisc('experience', CANADIAN_ICONS.briefcase, '— EXPERIENCE', splitEntries(d.experience, 'role', 'company'))}
            ${secWithDisc('certificates', CANADIAN_ICONS.trophy, '— WIN AWARDS', splitEntries(d.certificates, 'name', 'issuer'))}
            ${section('projects', 'PROJECTS', datedEntries(d.projects, 'name', 'role'))}
          </div>
        </div>`;
    } else if (template === 'meridian') {
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const initials = words.length > 1
        ? `${esc(words[0][0])}<i>|</i>${esc(words[words.length - 1][0])}`
        : words.length ? esc(words[0][0]) : '';

      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            <div class="cv-mark">${initials ? `<span>${initials}</span>` : ''}</div>
            ${section('contact', 'Contact', iconContacts(p, d.socials))}
            ${section('education', 'Education', stackEntries(d.education, 'degree', 'school'))}
            ${section('skills', 'Skills', plainList(d.skills))}
            ${section('languages', 'Languages', plainList(d.languages))}
            ${section('certificates', 'Certificates', stackEntries(d.certificates, 'name', 'issuer'))}
          </aside>
          <div class="cv-main">
            <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
            <div class="cv-main-body">
              ${section('profile', 'Professional profile', summary)}
              ${section('experience', 'Experience', lineEntries(d.experience, 'role', 'company', ' / '))}
              ${section('projects', 'Projects', lineEntries(d.projects, 'name', 'role', ' / '))}
              ${section('hobbies', 'Interests', bulletList(d.hobbies))}
            </div>
          </div>
        </div>`;
    } else if (template === 'gilded') {
      const contactBlock = iconContacts(p, d.socials);

      body = `
        <div class="cv-frame">
          <header class="cv-header${photoSrc ? ' cv-header--photo' : ''}">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            <div class="cv-identity"><h1 class="cv-name">${name}</h1>${title}</div>
          </header>
          <div class="cv-cols">
            <aside class="cv-aside">
              ${contactBlock ? `<section class="cv-section" data-section="contact">${contactBlock}</section>` : ''}
              ${section('education', 'Education', stackEntries(d.education, 'degree', 'school'))}
              ${section('skills', 'Skills', plainList(d.skills))}
              ${section('languages', 'Languages', plainList(d.languages))}
              ${section('certificates', 'Certificates', stackEntries(d.certificates, 'name', 'issuer'))}
            </aside>
            <div class="cv-main">
              ${section('profile', 'Summary', summary)}
              ${section('experience', 'Work experience', lineEntries(d.experience, 'role', 'company', ' / '))}
              ${section('projects', 'Projects', lineEntries(d.projects, 'name', 'role', ' / '))}
              ${section('hobbies', 'Interests', bulletList(d.hobbies))}
            </div>
          </div>
        </div>`;
    } else if (template === 'scarlet') {
      // First name(s) light, last name bold in the accent color
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = words.length > 1
        ? `<span class="cv-name-first">${esc(words.slice(0, -1).join(' '))}</span> <span class="cv-name-last">${esc(words[words.length - 1])}</span>`
        : name;

      // Ratings as a line with a marker at the score; plain lines when nothing is scored
      const sliders = (items) => {
        const rated = parseRated(items);
        if (!rated.length) return '';
        return `<ul class="cv-sliders">${rated.map((r) => `
          <li>
            <span>${esc(r.name)}</span>
            <span class="cv-slider">${r.score !== null ? `<i style="left:${Math.round((r.score / r.max) * 100)}%"></i>` : ''}</span>
          </li>`).join('')}</ul>`;
      };

      // Stacked: TITLE, dates, then the place
      const stack = (items, titleKey, subKey) => items.filter(hasContent).map((item) => {
        const when = dateRange(item.start, item.end || item.date);
        const sub = [item[subKey], item.location].filter(Boolean).map(esc).join(', ');
        return `
          <div class="cv-entry">
            ${item[titleKey] ? `<h4 class="cv-entry-title">${esc(item[titleKey])}</h4>` : ''}
            ${when ? `<p class="cv-entry-date">${esc(when)}</p>` : ''}
            ${sub ? `<p class="cv-entry-sub">${sub}</p>` : ''}
            ${textBlock(item.description)}
          </div>`;
      }).join('');

      const contactBlock = iconContacts(p, d.socials);

      body = `
        <header class="cv-band">
          <div class="cv-contact-col">
            ${contactBlock ? `<h3 class="cv-h">Contact info</h3>${contactBlock}` : ''}
          </div>
          <div class="cv-identity"><h1 class="cv-name">${splitName}</h1>${title}</div>
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            ${section('certificates', 'Awards', stack(d.certificates, 'name', 'issuer'))}
            ${section('skills', 'Skills', sliders(d.skills))}
            ${section('languages', 'Languages', sliders(d.languages))}
            ${section('hobbies', 'Hobbies', bulletList(d.hobbies))}
          </aside>
          <div class="cv-main">
            ${section('profile', 'About me', summary)}
            ${section('experience', 'Employment history', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', grid(stack(d.education, 'degree', 'school'), 2))}
          </div>
        </div>`;
    } else if (template === 'harbor') {
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const initials = words.length > 1
        ? `${esc(words[0][0])}<i>|</i>${esc(words[words.length - 1][0])}`
        : words.length ? esc(words[0][0]) : '';

      // Stacked lines for the narrow column: //DEGREE, school, place, dates
      const stackEntries = (items, titleKey, subKey) => items.filter(hasContent).map((item) => `
        <div class="cv-entry">
          ${item[titleKey] ? `<h4 class="cv-entry-title">//${esc(item[titleKey])}</h4>` : ''}
          ${item[subKey] ? `<p class="cv-entry-sub">${esc(item[subKey])}</p>` : ''}
          ${item.location ? `<p>${esc(item.location)}</p>` : ''}
          ${item.start || item.end || item.date ? `<p>${esc(dateRange(item.start, item.end || item.date))}</p>` : ''}
          ${textBlock(item.description)}
        </div>`).join('');

      const skillGroups = labelledGroup('//Professional', bulletList(d.skills)) + labelledGroup('//Languages', bulletList(d.languages));

      body = `
        <header class="cv-band">
          ${initials ? `<span class="cv-badge" aria-hidden="true">${initials}</span>` : ''}
          <h1 class="cv-name">${name}</h1>
          ${title}
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('contact', 'Contact', iconContacts(p, d.socials))}
            ${section('education', 'Education', stackEntries(d.education, 'degree', 'school'))}
            ${section('skills', 'Skills', skillGroups)}
            ${section('certificates', 'Certificates', stackEntries(d.certificates, 'name', 'issuer'))}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Summary', summary)}
            ${section('experience', 'Work experience', lineEntries(d.experience, 'role', 'company', ' — ', true))}
            ${section('projects', 'Projects', lineEntries(d.projects, 'name', 'role', ' — ', true))}
            ${section('hobbies', 'Interests', bulletList(d.hobbies))}
          </div>
        </div>`;
    } else if (template === 'monogram') {
      // Initials in a script face, set faintly behind the name
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const initials = words.length ? esc((words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase()) : '';
      const heading = (text) => `<span class="cv-h-mark">${text[0]}</span>${text.slice(1)}`;
      const sec = (key, text, html) => section(key, heading(text), html);

      body = `
        <header class="cv-header">
          ${initials ? `<span class="cv-monogram" aria-hidden="true">${initials}</span>` : ''}
          <h1 class="cv-name">${name}</h1>
          ${title}
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${sec('contact', 'Contact', iconContacts(p, d.socials))}
            ${sec('education', 'Education', education)}
            ${sec('skills', 'Skills', bulletList(d.skills))}
            ${sec('languages', 'Languages', bulletList(d.languages))}
            ${sec('hobbies', 'Hobbies', bulletList(d.hobbies))}
          </aside>
          <div class="cv-main">
            ${sec('profile', 'Profile summary', summary)}
            ${sec('experience', 'Work experience', experience)}
            ${sec('projects', 'Projects', projects)}
            ${sec('certificates', 'Certificates', certificates)}
          </div>
        </div>`;
    } else if (template === 'campus') {
      const rows = [
        ['Address', esc(p.location)],
        ['Phone', esc(p.phone)],
        ['Email', esc(p.email)],
        ['Website', link(p.website)],
        ...d.socials.filter((s) => String(s.url || '').trim()).map((s) => [esc(s.label || 'Link'), link(s.url)]),
      ].filter(([, value]) => value);
      const contactRows = rows.length
        ? `<ul class="cv-labelled">${rows.map(([label, value]) => `<li>${label}: <strong>${value}</strong></li>`).join('')}</ul>`
        : '';
      const mail = p.email
        ? `<p class="cv-mail"><svg class="cv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h20v14H2z" fill="currentColor"/><path d="m2 6 10 7 10-7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.6"/></svg>${esc(p.email)}</p>`
        : '';
      const bandTone = isLight(color || defaultColor('campus')) ? ' cv-band--light' : '';

      body = `
        <header class="cv-band${bandTone}${photoSrc ? ' cv-band--photo' : ''}">
          <div class="cv-identity"><h1 class="cv-name">${name}</h1>${title}${mail}</div>
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
        </header>
        <div class="cv-inner">
          <h2 class="cv-doc-title">Curriculum Vitae</h2>
          ${contactRows ? `<div class="cv-contact-block">${contactRows}</div>` : ''}
          ${section('profile', 'Objective', summary)}
          ${section('education', 'Education', education)}
          ${section('experience', 'Experience', experience)}
          ${section('projects', 'Projects', projects)}
          ${section('skills', 'Skills', skills)}
          ${section('certificates', 'Certificates', certificates)}
          ${section('languages', 'Languages', languages)}
          ${section('hobbies', 'Interests', hobbies)}
        </div>`;
    } else if (template === 'studio') {
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = !words.length
        ? name
        : `${words.length > 1 ? `<span class="cv-name-first">${esc(words.slice(0, -1).join(' '))}</span> ` : ''}<span class="cv-name-last">${esc(words[words.length - 1])}</span>`;

      // Contact as a labelled table
      const rows = [
        ['Phone', esc(p.phone)],
        ['Email', esc(p.email)],
        ['Location', esc(p.location)],
        ['Website', link(p.website)],
        ...d.socials.filter((s) => String(s.url || '').trim()).map((s) => [esc(s.label || 'Link'), link(s.url)]),
      ].filter(([, value]) => value);
      const contactTable = rows.length
        ? `<dl class="cv-table">${rows.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('')}</dl>`
        : '';

      const row = (...cells) => {
        const filled = cells.filter(Boolean);
        return filled.length ? `<div class="cv-row cv-row--${filled.length}">${filled.map((c) => `<div class="cv-cell">${c}</div>`).join('')}</div>` : '';
      };

      body = `
        <div class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          ${photoSrc ? `<div class="cv-photo-col"><div class="cv-photo"><img src="${photoSrc}" alt=""></div></div>` : ''}
          <div class="cv-top-main">
            <header class="cv-header"><h1 class="cv-name">${splitName}</h1>${title}</header>
            ${summary ? `<div class="cv-about">${section('profile', 'About me', summary)}</div>` : ''}
            ${row(section('contact', 'Contact', contactTable), section('languages', 'Languages', languages))}
          </div>
        </div>
        ${row(section('skills', 'Skills', ratedList(d.skills)), section('education', 'Education', education), section('certificates', 'Certificates', certificates))}
        ${experience ? `<div class="cv-band-section">${section('experience', 'Experience', grid(experience, 3, 'cv-grid--entries'))}</div>` : ''}
        ${projects ? `<div class="cv-band-section">${section('projects', 'Projects', grid(projects, 3, 'cv-grid--entries'))}</div>` : ''}
        ${hobbies ? `<div class="cv-band-section">${section('hobbies', 'Hobbies', hobbies)}</div>` : ''}`;
    } else if (template === 'spark') {
      // First name(s) light, last name bold, on separate lines
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = !words.length
        ? name
        : words.length === 1
          ? `<span class="cv-name-last">${esc(words[0])}</span>`
          : `<span class="cv-name-first">${esc(words.slice(0, -1).join(' '))}</span> <span class="cv-name-last">${esc(words[words.length - 1])}</span>`;
      body = `
        <div class="cv-cols">
          <aside class="cv-aside${photoSrc ? ' cv-aside--photo' : ''}">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            ${section('contact', 'Contact', contactList)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('languages', 'Languages', ratedList(d.languages))}
          </aside>
          <div class="cv-main">
            <header class="cv-header"><h1 class="cv-name">${splitName}</h1>${title}</header>
            ${section('profile', 'Profile', summary)}
            ${section('experience', 'Job experience', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('skills', 'Skills', ratedList(d.skills))}
            ${section('hobbies', 'Interests', hobbies)}
          </div>
        </div>`;
    } else if (template === 'vivid') {
      const intro = lines(d.summary).join(' ');
      body = `
        <header class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
          <div class="cv-identity">
            <h1 class="cv-name">${name}</h1>
            ${title}
            ${intro ? `<p class="cv-intro">${esc(intro)}</p>` : ''}
          </div>
        </header>
        ${contacts.length ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>` : ''}
        <div class="cv-cols">
          <div>
            ${section('skills', 'Skills', skills)}
            ${section('experience', 'Work experience', experience)}
            ${section('languages', 'Languages', languages)}
          </div>
          <div>
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('projects', 'Projects', projects)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </div>
        </div>`;
    } else if (template === 'blush') {
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
        <div class="cv-cols">
          <div class="cv-main">
            ${section('profile', 'Profile', summary)}
            ${section('education', 'Education', education)}
            ${section('experience', 'Professional experience', experience)}
            ${section('projects', 'Projects', projects)}
          </div>
          <aside class="cv-aside">
            ${section('contact', 'Contact info', contactList)}
            ${section('skills', 'Skills &amp; abilities', skills)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
        </div>`;
    } else if (template === 'signature') {
      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            <header class="cv-header">
              <h1 class="cv-name">${name}</h1>
              ${title ? `<span class="cv-rule"></span>${title}` : ''}
              <span class="cv-rule"></span>
            </header>
            ${contacts.length ? `<ul class="cv-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Professional summary', summary)}
            ${section('experience', 'Work experience', experience)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </div>
        </div>`;
    } else if (template === 'elegant') {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      body = `
        <div class="cv-band">
          <header class="cv-frame"><h1 class="cv-name">${name}</h1>${title}</header>
        </div>
        <div class="cv-inner">
          ${contactRow}
          ${summary ? `<div class="cv-summary">${summary}</div>` : ''}
          ${section('skills', 'Core proficiencies', skills)}
          ${section('experience', 'Professional work experience', experience)}
          ${section('projects', 'Projects', projects)}
          ${section('education', 'Education &amp; credentials', education)}
          ${section('certificates', 'Certificates', certificates)}
          ${section('languages', 'Languages', languages)}
          ${section('hobbies', 'Hobbies', hobbies)}
        </div>`;
    } else if (template === 'fresh') {
      body = `
        <header class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
          <div class="cv-identity"><h1 class="cv-name">${name}</h1>${title}</div>
          ${contactList}
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('profile', 'Career overview', summary ? `<div class="cv-quote">${summary}</div>` : '')}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', ratedList(d.languages))}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
          <div class="cv-main">
            ${section('experience', 'Work experience', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certifications', certificates)}
          </div>
        </div>`;
    } else if (template === 'creative') {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      const left = section('skills', 'Expertise', skills) + section('languages', 'Languages', languages) + section('hobbies', 'Hobbies', hobbies);
      const right = section('profile', 'Profile', summary) + section('projects', 'Projects', projects) + section('certificates', 'Certificates', certificates);
      body = `
        <div class="cv-hero${photoSrc ? ' cv-hero--photo' : ''}">
          <div class="cv-band"></div>
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
        </div>
        <div class="cv-inner">
          <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
          ${contactRow}
          ${section('education', 'Education', grid(education, 3))}
          ${section('experience', 'Experience', grid(experience, 2, 'cv-grid--experience'))}
          ${left || right ? `
            <div class="cv-split">
              <div>${left}</div>
              <div>${right}</div>
            </div>` : ''}
        </div>`;
    } else if (template === 'executive') {
      const contactList = contacts.length
        ? `<ul class="cv-contact-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>`
        : '';
      body = `
        <div class="cv-cols">
          <div class="cv-main">
            <header class="cv-header">
              <h1 class="cv-name">${name}</h1>
              ${title}
              <span class="cv-rule"></span>
            </header>
            ${summary ? `<div class="cv-summary">${summary}</div>` : ''}
            ${section('experience', 'Relevant work experience', experience)}
            ${section('projects', 'Projects', projects)}
          </div>
          <aside class="cv-aside">
            ${contactList}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
        </div>`;
    } else if (template === 'professional') {
      const photo = photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '';
      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            ${photo}
            <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
            ${section('contact', 'Contact details', contactList)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Personal statement', summary)}
            ${section('experience', 'Work history', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
          </div>
        </div>`;
    } else if (template === 'modern') {
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('contact', 'Contact', contactList)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Profile', summary)}
            ${section('experience', 'Experience', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
          </div>
        </div>`;
    } else {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}${contactRow}</header>
        ${section('profile', 'Profile', summary)}
        ${section('experience', 'Experience', experience)}
        ${section('projects', 'Projects', projects)}
        ${section('education', 'Education', education)}
        ${section('certificates', 'Certificates', certificates)}
        ${section('skills', 'Skills', skills)}
        ${section('languages', 'Languages', languages)}
        ${section('hobbies', 'Hobbies', hobbies)}`;
    }

    return `<div class="cv cv--${template}" style="--cv-accent:${esc(color || defaultColor(template))}">${body}</div>`;
  }

  /* ---------- Pagination ---------- */

  const PAGE_HEIGHT = 1123; // A4 at 96dpi
  const PAGE_TOP = 48; // top margin on continued pages
  const PAGE_BOTTOM = 40; // content never goes closer than this to the bottom of a page
  const KEEP_WITH_HEADING = 60; // minimum content that must fit under a section heading

  /*
   * Splits a rendered page (.cv) into A4 pages: entries and headings that would be cut
   * by a page edge are pushed to the next page, and sections listed in `pageBreaks`
   * start on a new page. Pushes are empty spacer blocks (not margins, which browsers
   * drop at the top of a printed page), so the PDF matches the preview.
   * Returns the number of pages.
   */
  function paginate(page, pageBreaks = []) {
    if (!page || !page.offsetHeight) return 1;
    const forced = new Set(pageBreaks);
    const scale = page.getBoundingClientRect().height / page.offsetHeight || 1;
    const topOf = (el) => (el.getBoundingClientRect().top - page.getBoundingClientRect().top) / scale;
    const maxUnit = PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM;

    /* Moves el's content down so it starts at `to`. Returns false if el cannot be re-checked. */
    function moveTo(el, from, to) {
      const spacer = document.createElement('div');
      spacer.className = 'cv-page-gap';
      // In grid/flex rows a sibling spacer would become an extra cell, so pad inside instead
      if (/grid|flex/.test(getComputedStyle(el.parentElement).display)) {
        spacer.style.height = `${to - from}px`;
        el.prepend(spacer);
        return false;
      }
      el.before(spacer);
      // Inserting the spacer can change el's own margin (e.g. `.cv-entry + .cv-entry`), so measure again
      spacer.style.height = `${Math.max(0, to - topOf(el))}px`;
      return true;
    }

    // .cv-split (Creative's two-column footer) moves as one block so its divider line isn't cut
    const units = page.querySelectorAll('.cv-split, .cv-section, .cv-entry, .cv-summary, .cv-body > p, .cv-body > ul');
    units.forEach((el) => {
      // Second pass double-checks the result after the move
      for (let pass = 0; pass < 2; pass++) {
        const y = topOf(el);
        const index = Math.floor(y / PAGE_HEIGHT);
        const pageStart = index * PAGE_HEIGHT;
        const limit = pageStart + PAGE_HEIGHT - PAGE_BOTTOM;
        const nextPage = pageStart + PAGE_HEIGHT + PAGE_TOP;
        const atTop = index > 0 && y <= pageStart + PAGE_TOP + 1;
        let target = null;

        if (index > 0 && y < pageStart + PAGE_TOP) {
          target = pageStart + PAGE_TOP; // leave a top margin on continued pages
        } else if (el.classList.contains('cv-section') || el.classList.contains('cv-split')) {
          const heading = el.querySelector('.cv-h');
          const headingEnd = heading ? topOf(heading) + heading.offsetHeight : y;
          if (forced.has(el.dataset.section) && !atTop) target = nextPage;
          else if (headingEnd + KEEP_WITH_HEADING > limit) target = nextPage;
        } else if (y + el.offsetHeight > limit && el.offsetHeight <= maxUnit) {
          target = nextPage;
        }

        if (target === null || Math.abs(target - y) < 1) break;
        if (!moveTo(el, y, target)) break;
      }
    });

    const pages = Math.max(1, Math.ceil((page.offsetHeight - 1) / PAGE_HEIGHT));
    // Let backgrounds (sidebars) fill the last page; -2px avoids a blank extra printed page
    if (pages > 1) page.style.minHeight = `${pages * PAGE_HEIGHT - 2}px`;
    return pages;
  }

  /* Renders a scaled-down page inside `el` and keeps it fitted to the element's width. */
  function mountThumb(el, data, template, color) {
    el.classList.add('thumb');
    el.innerHTML = render(data, template, color);
    const page = el.firstElementChild;
    const fit = () => { page.style.transform = `scale(${el.clientWidth / PAGE_WIDTH})`; };
    fit();
    if (!el._observer && 'ResizeObserver' in window) {
      el._observer = new ResizeObserver(() => {
        const current = el.firstElementChild;
        if (current) current.style.transform = `scale(${el.clientWidth / PAGE_WIDTH})`;
      });
      el._observer.observe(el);
    }
  }

  window.CVRender = { render, paginate, mountThumb, defaultColor, colorsFor, TEMPLATES, COLORS, SAMPLE, PAGE_WIDTH, PAGE_HEIGHT };
})();
