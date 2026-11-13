/*
 * Blog articles and rendering for blog.html (list) and post.html (?slug=...).
 * To publish a new article, add an entry to POSTS — newest first.
 * Thumbnails: set `image` to a photo (e.g. images/blog/my-post.jpg, ideally 1600×900).
 * Without one, a cover is drawn from `cover` (a resume template and color).
 */
(function () {
  const POSTS = [
    {
      slug: 'resume-summary',
      title: 'How to write a resume summary that actually gets read',
      category: 'Writing',
      date: '2026-09-22',
      readTime: 5,
      image: '', // e.g. 'images/blog/resume-summary.jpg'
      cover: { template: 'classic', color: '#111111' },
      excerpt: 'Recruiters spend seconds on the top of your resume. A focused, specific summary makes those seconds count.',
      body: `
        <p>The summary is the first thing a recruiter reads, and often the only thing they read before deciding whether to keep going. Most summaries waste that moment with vague claims. Here is how to write one that works.</p>

        <h2>Keep it short</h2>
        <p>Two or three sentences is enough. The summary is a preview, not a biography. If it runs longer than four lines on the page, cut it.</p>

        <h2>Lead with who you are professionally</h2>
        <p>Open with your role and level of experience. This immediately tells the reader whether you fit the position they are hiring for.</p>

        <div class="compare">
          <p class="before"><span>Before</span>Hard-working and passionate professional looking for new opportunities to grow.</p>
          <p class="after"><span>After</span>Product designer with 6 years of experience building web and mobile apps for B2B software companies.</p>
        </div>

        <h2>Add one concrete result</h2>
        <p>A number or a specific outcome is far more convincing than an adjective. Pick your strongest achievement and put it here.</p>
        <ul>
          <li>“Led a redesign that increased activation by 18%.”</li>
          <li>“Managed a $2M annual marketing budget across four channels.”</li>
          <li>“Reduced average support response time from 9 hours to 2.”</li>
        </ul>

        <h2>Say what you want next</h2>
        <p>Close with the kind of role or problem you are looking for. This helps the reader picture you in the job, and it shows you have thought about your direction.</p>

        <h2>Tailor it for each application</h2>
        <p>Your summary is the easiest part of the resume to adjust. Mirror the language of the job description where it is honest to do so. Keeping a separate resume version per type of role makes this quick.</p>`,
    },
    {
      slug: 'results-not-responsibilities',
      title: 'Show results, not responsibilities',
      category: 'Writing',
      date: '2026-09-10',
      readTime: 4,
      image: '', // e.g. 'images/blog/results-not-responsibilities.jpg'
      cover: { template: 'executive', color: '#3a3a3a' },
      excerpt: 'Anyone can list what their job was. Strong resumes show what changed because you were there.',
      body: `
        <p>Most experience sections read like job descriptions: “Responsible for social media,” “Handled customer inquiries.” They tell the reader what you were supposed to do, not how well you did it.</p>

        <h2>Use the action + result pattern</h2>
        <p>Start each line with a strong verb, describe what you did, then show the result. If you can measure it, do.</p>
        <div class="compare">
          <p class="before"><span>Before</span>Responsible for the company newsletter.</p>
          <p class="after"><span>After</span>Relaunched the company newsletter, growing subscribers from 4,000 to 11,500 in one year.</p>
        </div>

        <h2>No numbers? Use scope and outcome</h2>
        <p>Not every achievement comes with a metric. You can still show impact by describing scale, speed or what became possible afterwards.</p>
        <ul>
          <li><strong>Scope:</strong> “Coordinated onboarding for 40 new hires across three offices.”</li>
          <li><strong>Speed:</strong> “Delivered the new booking flow two weeks ahead of schedule.”</li>
          <li><strong>Outcome:</strong> “Documented the release process, allowing any engineer to ship safely.”</li>
        </ul>

        <h2>Three to five lines per role</h2>
        <p>Focus on your most relevant achievements. Older or less relevant roles can have one or two lines. In the HResume editor, put each achievement on its own line and it will be shown as a bullet point.</p>`,
    },
    {
      slug: 'ats-friendly-resume',
      title: 'Making your resume ATS-friendly',
      category: 'Job search',
      date: '2026-08-27',
      readTime: 6,
      image: '', // e.g. 'images/blog/ats-friendly-resume.jpg'
      cover: { template: 'minimal', color: '#5c5c5c' },
      excerpt: 'Many companies use applicant tracking systems to sort applications. A few simple habits help your resume get through.',
      body: `
        <p>An applicant tracking system (ATS) stores and searches applications for recruiters. Many companies use one, so your resume is often read by software before it reaches a person. The good news: what works for an ATS is mostly what works for human readers too.</p>

        <h2>Use standard section headings</h2>
        <p>Stick to headings like “Experience,” “Education” and “Skills.” Creative labels such as “Where I’ve made an impact” can confuse parsers.</p>

        <h2>Match the job description’s keywords</h2>
        <p>Recruiters often search for specific skills and job titles. If the posting asks for “project management” and you have that experience, use the same phrase rather than a synonym.</p>

        <h2>Keep the layout readable</h2>
        <ul>
          <li>Put your contact details in the main body of the document, not in images.</li>
          <li>Avoid text inside images or charts, which most systems cannot read.</li>
          <li>Use a common, legible font and clear dates for each role.</li>
        </ul>

        <h2>Submit a text-based PDF</h2>
        <p>PDFs exported from HResume contain real, selectable text, which is what tracking systems need. If a posting asks specifically for a Word document, follow that instruction.</p>

        <blockquote>Write for the person first. A clear, well-organised resume reads well to software and recruiters alike.</blockquote>`,
    },
    {
      slug: 'resume-length',
      title: 'One page or two? Choosing the right resume length',
      category: 'Job search',
      date: '2026-08-12',
      readTime: 3,
      image: '', // e.g. 'images/blog/resume-length.jpg'
      cover: { template: 'fresh', color: '#767676' },
      excerpt: 'There is no single rule, but there is a simple way to decide what belongs on your resume.',
      body: `
        <p>“Keep it to one page” is common advice, but it is not a law. The right length depends on how much relevant experience you have.</p>

        <h2>One page works when</h2>
        <ul>
          <li>You are a student, recent graduate or early in your career.</li>
          <li>You are changing fields and most of your history is not directly relevant.</li>
        </ul>

        <h2>Two pages work when</h2>
        <ul>
          <li>You have many years of relevant experience.</li>
          <li>Your role requires listing projects, publications or certifications.</li>
        </ul>

        <h2>The real test: relevance</h2>
        <p>For every line, ask whether it helps you get <strong>this</strong> job. If it does not, remove it. A focused two-page resume beats a crowded single page, and a sharp single page beats a padded two.</p>

        <h2>Check before you send</h2>
        <p>Use the live preview in the editor to see exactly where page breaks fall, and make sure no section is split awkwardly across pages.</p>`,
    },
  ];

  const esc = window.CVM.utils.escapeHtml;

  function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function meta(post) {
    return `<p class="post-meta"><span class="post-category">${esc(post.category)}</span> · ${formatDate(post.date)} · ${post.readTime} min read</p>`;
  }

  /* Post thumbnail: the photo when set, otherwise a drawn cover (a tilted resume on a tinted background). */
  function cover(post, className = '') {
    if (post.image) {
      return `<div class="post-cover ${className}"><img src="${esc(post.image)}" alt="" loading="lazy"></div>`;
    }
    const { template, color } = post.cover || { template: 'classic', color: '#111111' };
    return `
      <div class="post-cover post-cover--art ${className}" style="--cover:${esc(color)}">
        <div data-cover-thumb data-template="${esc(template)}" data-color="${esc(color)}"></div>
      </div>`;
  }

  function mountCovers(root) {
    root.querySelectorAll('[data-cover-thumb]').forEach((el) => {
      window.CVRender.mountThumb(el, window.CVRender.SAMPLE, el.dataset.template, el.dataset.color);
    });
  }

  function card(post, featured = false) {
    return `
      <a class="post-card${featured ? ' post-card--featured' : ''}" href="post.html?slug=${post.slug}">
        ${cover(post)}
        <div class="post-card-body">
          ${meta(post)}
          <h2>${esc(post.title)}</h2>
          <p>${esc(post.excerpt)}</p>
          <span class="read-more">Read article</span>
        </div>
      </a>`;
  }

  // Blog list
  const grid = document.getElementById('postGrid');
  if (grid) {
    grid.innerHTML = POSTS.map((post, i) => card(post, i === 0)).join('');
    mountCovers(grid);
  }

  // Single article
  const article = document.getElementById('article');
  if (article) {
    const slug = new URLSearchParams(location.search).get('slug');
    const post = POSTS.find((p) => p.slug === slug);

    if (!post) {
      article.innerHTML = `
        <a href="blog.html" class="article-back">All articles</a>
        <h1>Article not found</h1>
        <p class="article-lead">This article may have been moved or removed.</p>`;
      return;
    }

    document.title = `${post.title} — HResume`;
    const startHref = window.CVM.Auth.current() ? 'dashboard.html' : 'register.html';
    const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

    article.innerHTML = `
      <a href="blog.html" class="article-back">All articles</a>
      ${meta(post)}
      <h1>${esc(post.title)}</h1>
      <p class="article-lead">${esc(post.excerpt)}</p>
      ${cover(post, 'post-cover--hero')}
      <div class="prose">${post.body}</div>
      <div class="article-cta">
        <div>
          <h2>Put it into practice</h2>
          <p>Build your resume with a live preview and download it as a PDF.</p>
        </div>
        <a href="${startHref}" class="btn btn-primary">Create your resume</a>
      </div>`;

    const morePosts = document.getElementById('morePosts');
    morePosts.innerHTML = `
      <h2>More articles</h2>
      <div class="post-grid">${more.map((p) => card(p)).join('')}</div>`;
    mountCovers(article);
    mountCovers(morePosts);
  }
})();
