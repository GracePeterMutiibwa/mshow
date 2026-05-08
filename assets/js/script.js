/* ============================================================
   THEME TOGGLE
============================================================ */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeToggle');
const THEME_KEY = 'moldo-theme';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

(function initTheme() {
  const saved  = localStorage.getItem(THEME_KEY);
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || system);
})();

themeBtn.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   MOBILE SIDEBAR
============================================================ */
const menuBtn        = document.getElementById('menuToggle');
const sidebar        = document.getElementById('navSidebar');
const overlay        = document.getElementById('sidebarOverlay');
const sidebarClose   = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  menuBtn.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

/* Close on Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

/* Close when a sidebar link is clicked */
sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

/* ============================================================
   TABS
============================================================ */
document.querySelectorAll('.tabs').forEach(tabGroup => {
  const tabs   = tabGroup.querySelectorAll('.tab');
  const panels = tabGroup.closest('.tabs-wrap').querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('panel-' + target);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
    });
  });
});

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealEls = document.querySelectorAll(
  '.feature-card, .step, .install-card, .bio-card, .mold-callout, .tabs-wrap'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   OS DETECTION -- float matching download button first
============================================================ */
(function detectOS() {
  const ua = navigator.userAgent.toLowerCase();
  let detected = null;
  if      (ua.includes('win'))   detected = 'windows';
  else if (ua.includes('mac'))   detected = 'macos';
  else if (ua.includes('linux')) detected = 'linux';
  if (!detected) return;
  document.querySelectorAll('.download-btn').forEach(btn => {
    if (btn.dataset.os === detected) btn.style.order = '-1';
  });
})();

/* ============================================================
   ACTIVE NAV HIGHLIGHT on scroll
============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent-light)';
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));
