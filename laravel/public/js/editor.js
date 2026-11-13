/*
 * Resume editor: form on the left, live preview on the right, autosave.
 */
(function () {
  const { Auth, Resumes, utils } = window.CVM;
  const { render, paginate, mountThumb, colorsFor, TEMPLATES, PAGE_WIDTH, PAGE_HEIGHT } = window.CVRender;
  const esc = utils.escapeHtml;

  let resume;
  if (window.LARAVEL_RESUME) {
    resume = window.LARAVEL_RESUME;
  } else {
    const user = Auth ? Auth.current() : null;
    resume = Resumes.get(new URLSearchParams(location.search).get('id'), user ? user.id : null);
  }

  if (!resume) {
    resume = {
      id: 'guest',
      title: 'Untitled Resume',
      template: new URLSearchParams(location.search).get('template') || 'classic',
      color: new URLSearchParams(location.search).get('color') || '#111111',
      data: window.CVM ? window.CVM.emptyData() : {}
    };
  }

  window.currentResume = resume;
  const base = window.CVM ? window.CVM.emptyData() : {};
  resume.data = { ...base, ...resume.data, personal: { ...(base.personal || {}), ...(resume.data?.personal || {}) } };
  const data = resume.data;

  const el = {
    title: document.getElementById('titleInput'),
    status: document.getElementById('saveStatus'),
    panelScroll: document.getElementById('panelScroll'),
    previewPane: document.getElementById('previewPane'),
    frame: document.getElementById('previewFrame'),
    picker: document.getElementById('templatePicker'),
    swatches: document.getElementById('swatches'),
    prev: document.getElementById('prevTab'),
    next: document.getElementById('nextTab'),
    togglePreview: document.getElementById('togglePreview'),
  };

  /* ---------- Saving ---------- */

  let saveTimer = null;

  function save() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (window.SAVE_URL) {
      fetch(window.SAVE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': window.CSRF_TOKEN || ''
        },
        body: JSON.stringify({
          title: resume.title,
          template: resume.template,
          color: resume.color,
          data: resume.data
        })
      }).then(() => {
        if (el.status) el.status.textContent = 'Saved';
      }).catch(() => {
        Resumes.save(resume);
        if (el.status) el.status.textContent = 'Saved';
      });
    } else {
      Resumes.save(resume);
      if (el.status) el.status.textContent = 'Saved';
    }
  }

  function changed() {
    schedulePreview();
    if (el.status) el.status.textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 500);
  }

  window.addEventListener('beforeunload', () => { if (saveTimer) save(); });

  /* ---------- Preview ---------- */

  let previewFrame = 0;

  function schedulePreview() {
    cancelAnimationFrame(previewFrame);
    previewFrame = requestAnimationFrame(renderPreview);
  }

  let pageCount = 1;

  function renderPreview() {
    el.frame.innerHTML = render(data, resume.template, resume.color);
    pageCount = paginate(el.frame.firstElementChild, resume.pageBreaks || []);
    fitPreview();
    updatePageNotice();
  }

  function fitPreview() {
    const page = el.frame.firstElementChild;
    if (!page) return;
    const style = getComputedStyle(el.previewPane);
    const available = el.previewPane.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    if (available <= 0) return;
    const scale = Math.min(1, available / PAGE_WIDTH);
    page.style.transform = `scale(${scale})`;
    el.frame.style.width = `${PAGE_WIDTH * scale}px`;
    el.frame.style.height = `${page.offsetHeight * scale}px`;

    // Dashed line where each new page starts (not printed)
    el.frame.querySelectorAll('.page-break').forEach((marker) => marker.remove());
    for (let n = 2; n <= pageCount; n++) {
      el.frame.insertAdjacentHTML('beforeend',
        `<div class="page-break" style="top:${(n - 1) * PAGE_HEIGHT * scale}px"><span>Page ${n}</span></div>`);
    }
  }

  /* ---------- Page breaks (shown only when the resume is longer than one page) ---------- */

  const pageNotice = document.getElementById('pageNotice');
  const pageBreaksButton = document.getElementById('pageBreaksButton');
  const pageBreaksMenu = document.getElementById('pageBreaksMenu');
  const pageBreaksList = document.getElementById('pageBreaksList');

  function updatePageNotice() {
    pageNotice.hidden = pageCount <= 1;
    if (pageCount <= 1) {
      setMenuOpen(false);
      return;
    }
    document.getElementById('pageCount').textContent = `Your resume is ${pageCount} pages.`;

    const breaks = resume.pageBreaks || [];
    const sections = Array.from(el.frame.querySelectorAll('.cv-section[data-section]'));
    pageBreaksList.innerHTML = sections.map((section) => {
      const key = section.dataset.section;
      const heading = section.querySelector('.cv-h');
      const label = heading ? heading.textContent : (key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Section');
      return `
        <label class="checkbox">
          <input type="checkbox" value="${esc(key)}" ${breaks.includes(key) ? 'checked' : ''}> ${esc(label)}
        </label>`;
    }).join('');
  }

  function setMenuOpen(open) {
    pageBreaksMenu.hidden = !open;
    pageBreaksButton.setAttribute('aria-expanded', String(open));
  }

  pageBreaksButton.addEventListener('click', () => setMenuOpen(pageBreaksMenu.hidden));

  pageBreaksList.addEventListener('change', (event) => {
    const key = event.target.value;
    const breaks = new Set(resume.pageBreaks || []);
    if (event.target.checked) breaks.add(key);
    else breaks.delete(key);
    resume.pageBreaks = Array.from(breaks);
    changed();
  });

  document.addEventListener('click', (event) => {
    if (!pageBreaksMenu.hidden && !pageNotice.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !pageBreaksMenu.hidden) {
      setMenuOpen(false);
      pageBreaksButton.focus();
    }
  });

  window.addEventListener('resize', fitPreview);

  /* ---------- Tabs ---------- */

  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  let tabIndex = 0;

  function showTab(index) {
    tabIndex = index;
    const name = tabs[index].dataset.tab;
    tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === index)));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== name; });

    el.prev.style.visibility = index === 0 ? 'hidden' : 'visible';
    el.next.textContent = index === tabs.length - 1 ? 'Download PDF' : `Next: ${tabs[index + 1].textContent}`;
    el.panelScroll.scrollTop = 0;

    if (name === 'design') renderDesign();
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => showTab(i)));
  el.prev.addEventListener('click', () => showTab(Math.max(0, tabIndex - 1)));
  el.next.addEventListener('click', () => {
    if (tabIndex === tabs.length - 1) download();
    else showTab(tabIndex + 1);
  });

  /* ---------- Simple bound fields ---------- */

  function getPath(path) {
    return path.split('.').reduce((obj, key) => (obj == null ? obj : obj[key]), data);
  }

  function setPath(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    keys.reduce((obj, key) => obj[key], data)[last] = value;
  }

  document.querySelectorAll('[data-panel="details"] [data-bind]').forEach((input) => {
    input.value = getPath(input.dataset.bind) || '';
  });

  el.panelScroll.addEventListener('input', (event) => {
    const input = event.target;
    if (!input.dataset.bind) return;
    setPath(input.dataset.bind, input.value);
    const entry = input.closest('.entry');
    if (entry) updateEntrySummary(entry);
    changed();
  });

  /* ---------- Experience & education ---------- */

  const LISTS = {
    experience: {
      blank: () => ({ role: '', company: '', location: '', start: '', end: '', description: '' }),
      title: (e) => e.role || 'New position',
      sub: (e) => e.company,
      fields: [
        { key: 'role', label: 'Job title' },
        { key: 'company', label: 'Company' },
        { key: 'start', label: 'Start date', placeholder: 'e.g. Jan 2022' },
        { key: 'end', label: 'End date', placeholder: 'Present' },
        { key: 'location', label: 'Location', wide: true },
        { key: 'description', label: 'Description', type: 'textarea', wide: true, placeholder: 'One achievement per line' },
      ],
    },
    education: {
      blank: () => ({ degree: '', school: '', location: '', start: '', end: '', description: '' }),
      title: (e) => e.degree || 'New education',
      sub: (e) => e.school,
      fields: [
        { key: 'degree', label: 'Degree' },
        { key: 'school', label: 'School' },
        { key: 'start', label: 'Start date', placeholder: 'e.g. 2018' },
        { key: 'end', label: 'End date', placeholder: 'e.g. 2022' },
        { key: 'location', label: 'Location', wide: true },
        { key: 'description', label: 'Description', type: 'textarea', wide: true, placeholder: 'Optional: honours, thesis, relevant courses' },
      ],
    },
    projects: {
      blank: () => ({ name: '', role: '', link: '', start: '', end: '', description: '' }),
      title: (e) => e.name || 'New project',
      sub: (e) => e.role || e.link,
      fields: [
        { key: 'name', label: 'Project name' },
        { key: 'role', label: 'Your role', placeholder: 'Optional' },
        { key: 'start', label: 'Start date', placeholder: 'e.g. 2023' },
        { key: 'end', label: 'End date', placeholder: 'Present' },
        { key: 'link', label: 'Link', wide: true, placeholder: 'e.g. github.com/you/project' },
        { key: 'description', label: 'Description', type: 'textarea', wide: true, placeholder: 'What you built and the result. One point per line.' },
      ],
    },
    certificates: {
      blank: () => ({ name: '', issuer: '', date: '', link: '' }),
      title: (e) => e.name || 'New certificate',
      sub: (e) => [e.issuer, e.date].filter(Boolean).join(' · '),
      fields: [
        { key: 'name', label: 'Certificate', wide: true },
        { key: 'issuer', label: 'Issued by' },
        { key: 'date', label: 'Date', placeholder: 'e.g. 2024' },
        { key: 'link', label: 'Credential link', wide: true, placeholder: 'Optional' },
      ],
    },
    socials: {
      blank: () => ({ label: '', url: '' }),
      title: (e) => e.label || 'New link',
      sub: (e) => e.url,
      fields: [
        { key: 'label', label: 'Name', placeholder: 'e.g. LinkedIn' },
        { key: 'url', label: 'URL', placeholder: 'e.g. linkedin.com/in/you' },
      ],
    },
  };

  const openEntries = new WeakSet();

  function fieldHtml(list, index, field, item) {
    const id = `${list}-${index}-${field.key}`;
    const attrs = `id="${id}" data-bind="${list}.${index}.${field.key}" placeholder="${esc(field.placeholder || '')}"`;
    const control = field.type === 'textarea'
      ? `<textarea ${attrs} rows="4">${esc(item[field.key])}</textarea>`
      : `<input ${attrs} value="${esc(item[field.key])}">`;
    return `<div class="field${field.wide ? ' span-2' : ''}"><label for="${id}">${field.label}</label>${control}</div>`;
  }

  function renderList(list) {
    const config = LISTS[list];
    const items = data[list];
    const container = document.querySelector(`[data-list="${list}"]`);

    container.innerHTML = items.map((item, i) => `
      <details class="entry" data-index="${i}" ${openEntries.has(item) ? 'open' : ''}>
        <summary>
          <span class="entry-heading">
            <span class="entry-title"></span>
            <span class="entry-sub"></span>
          </span>
          <span class="entry-toggle"></span>
        </summary>
        <div class="entry-body">
          <div class="grid-2">${config.fields.map((f) => fieldHtml(list, i, f, item)).join('')}</div>
          <div class="entry-tools">
            <button class="btn btn-ghost btn-sm" data-move="-1" ${i === 0 ? 'disabled' : ''}>Move up</button>
            <button class="btn btn-ghost btn-sm" data-move="1" ${i === items.length - 1 ? 'disabled' : ''}>Move down</button>
            <button class="btn btn-danger-ghost btn-sm" data-remove>Remove</button>
          </div>
        </div>
      </details>`).join('');

    container.querySelectorAll('.entry').forEach(updateEntrySummary);
  }

  function updateEntrySummary(entry) {
    const list = entry.closest('[data-list]').dataset.list;
    const item = data[list][Number(entry.dataset.index)];
    entry.querySelector('.entry-title').textContent = LISTS[list].title(item);
    entry.querySelector('.entry-sub').textContent = LISTS[list].sub(item) || '';
  }

  // Remember which entries are expanded across re-renders ('toggle' does not bubble)
  document.addEventListener('toggle', (event) => {
    const entry = event.target;
    if (!entry.classList || !entry.classList.contains('entry')) return;
    const item = data[entry.closest('[data-list]').dataset.list][Number(entry.dataset.index)];
    if (entry.open) openEntries.add(item);
    else openEntries.delete(item);
  }, true);

  el.panelScroll.addEventListener('click', (event) => {
    const add = event.target.closest('[data-add]');
    if (add) {
      const list = add.dataset.add;
      const item = LISTS[list].blank();
      data[list].push(item);
      openEntries.add(item);
      renderList(list);
      changed();
      const entry = document.querySelector(`[data-list="${list}"] .entry:last-child`);
      entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      entry.querySelector('input').focus({ preventScroll: true });
      return;
    }

    const entry = event.target.closest('.entry');
    if (!entry) return;
    const list = entry.closest('[data-list]').dataset.list;
    const index = Number(entry.dataset.index);
    const items = data[list];

    const move = event.target.closest('[data-move]');
    if (move) {
      const target = index + Number(move.dataset.move);
      [items[index], items[target]] = [items[target], items[index]];
      renderList(list);
      changed();
      return;
    }

    if (event.target.closest('[data-remove]')) {
      items.splice(index, 1);
      renderList(list);
      changed();
    }
  });

  /* ---------- Skills & languages ---------- */

  document.querySelectorAll('[data-tags]').forEach((box) => {
    const list = box.dataset.tags;
    const input = box.querySelector('input');

    function draw() {
      box.querySelectorAll('.tag').forEach((t) => t.remove());
      data[list].forEach((value, i) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${esc(value)}<button type="button" data-i="${i}" aria-label="Remove ${esc(value)}">×</button>`;
        box.insertBefore(tag, input);
      });
    }

    function add(text) {
      text.split(',').map((s) => s.trim()).filter(Boolean).forEach((value) => {
        if (!data[list].some((v) => v.toLowerCase() === value.toLowerCase())) data[list].push(value);
      });
      input.value = '';
      draw();
      changed();
    }

    input.addEventListener('keydown', (event) => {
      if (event.isComposing) return;
      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        if (input.value.trim()) add(input.value);
      } else if (event.key === 'Backspace' && !input.value && data[list].length) {
        data[list].pop();
        draw();
        changed();
      }
    });

    input.addEventListener('blur', () => { if (input.value.trim()) add(input.value); });

    box.addEventListener('click', (event) => {
      const remove = event.target.closest('button[data-i]');
      if (remove) {
        data[list].splice(Number(remove.dataset.i), 1);
        draw();
        changed();
      }
      input.focus();
    });

    draw();
  });

  /* ---------- Design ---------- */

  function renderDesign() {
    el.picker.innerHTML = TEMPLATES.map((t) => `
      <label class="template-option">
        <input type="radio" name="template" value="${t.id}" ${t.id === resume.template ? 'checked' : ''}>
        <div data-thumb="${t.id}"></div>
        <span>${t.name}</span>
      </label>`).join('');
    el.picker.querySelectorAll('[data-thumb]').forEach((thumb) => {
      mountThumb(thumb, data, thumb.dataset.thumb, resume.color);
    });

    const colors = colorsFor(resume.template, resume.color);
    el.swatches.innerHTML = colors.map((color) => `
      <button type="button" class="swatch" style="background:${color}" data-color="${color}"
        aria-label="Accent color ${color}" aria-pressed="${color === resume.color}"></button>`).join('');
  }

  el.picker.addEventListener('change', (event) => {
    resume.template = event.target.value;
    renderDesign(); // refresh the colors offered for this template
    el.picker.querySelector(`input[value="${resume.template}"]`).focus();
    changed();
  });

  el.swatches.addEventListener('click', (event) => {
    const swatch = event.target.closest('[data-color]');
    if (!swatch) return;
    resume.color = swatch.dataset.color;
    renderDesign();
    changed();
  });

  /* ---------- Photo ---------- */

  const PHOTO_SIZE = 320; // px; keeps the stored image small

  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  const photoRemove = document.getElementById('photoRemove');

  function drawPhoto() {
    const photo = data.personal.photo;
    photoPreview.style.backgroundImage = photo ? `url("${photo}")` : '';
    photoRemove.hidden = !photo;
    document.getElementById('photoButtonLabel').textContent = photo ? 'Change photo' : 'Upload photo';
  }

  /* Crops the image to a centered square and compresses it to a small JPEG. */
  function processPhoto(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = PHOTO_SIZE;
        canvas.getContext('2d').drawImage(
          img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE,
        );
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(); };
      img.src = url;
    });
  }

  photoInput.addEventListener('change', async () => {
    const file = photoInput.files[0];
    photoInput.value = '';
    if (!file) return;
    try {
      data.personal.photo = await processPhoto(file);
      drawPhoto();
      changed();
    } catch {
      alert('This image could not be read. Please choose a JPG, PNG or WebP file.');
    }
  });

  photoRemove.addEventListener('click', () => {
    data.personal.photo = '';
    drawPhoto();
    changed();
  });

  drawPhoto();

  /* ---------- Title, download, mobile preview ---------- */

  el.title.value = resume.title;
  el.title.addEventListener('input', () => {
    resume.title = el.title.value.trim() || 'Untitled resume';
    document.title = `${resume.title} — HResume`;
    changed();
  });
  el.title.addEventListener('blur', () => { el.title.value = resume.title; });
  el.title.addEventListener('keydown', (event) => { if (event.key === 'Enter') el.title.blur(); });

  function download() {
    save();
    const pageTitle = document.title;
    document.title = resume.title; // used as the default PDF file name
    window.print();
    document.title = pageTitle;
  }

  document.getElementById('downloadBtn').addEventListener('click', download);

  el.togglePreview.addEventListener('click', () => {
    const showing = document.body.classList.toggle('show-preview');
    el.togglePreview.textContent = showing ? 'Edit' : 'Preview';
    renderPreview();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      save();
    }
  });

  /* ---------- Init ---------- */

  document.title = `${resume.title} — HResume`;
  Object.keys(LISTS).forEach(renderList);
  showTab(0);
  renderPreview();
  if (document.fonts) document.fonts.ready.then(renderPreview);

  // A freshly created resume has an automatic name: select it so it can be renamed right away
  const params = new URLSearchParams(location.search);
  if (params.has('new')) {
    el.title.focus();
    el.title.select();
    params.delete('new');
    history.replaceState(null, '', `${location.pathname}?${params}`);
  }
})();
