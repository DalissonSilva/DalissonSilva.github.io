/* ============================================================
   PORTFOLIO DADOS — JavaScript Principal
   ============================================================ */

(function () {
  'use strict';

  // ── Scroll Progress Bar ──
  const scrollProgress = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    updateProgress();
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    backToTop.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Back to top ──
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Dark / Light Toggle ──
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('portfolio-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  // ── Hamburger Menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Intersection Observer — animate on scroll ──
  const animItems = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  animItems.forEach(el => observer.observe(el));

  // ── Animated Counters ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.classList.contains('zero-metric')) {
            animateCounter(el);
          }
          metricObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => {
    metricObserver.observe(el);
  });

  // ── Pilares Tabs ──
  const tabs   = document.querySelectorAll('.pilar-tab');
  const panels = document.querySelectorAll('.pilar-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('pilar-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // ── Eras Timeline (click to expand) ──
  const eraItems = document.querySelectorAll('.era-item');
  eraItems.forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open') || item.classList.contains('active');
      eraItems.forEach(i => i.classList.remove('open', 'active'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Copy to Clipboard ──
  const toast = document.getElementById('toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        btn.querySelector('svg + text, svg').insertAdjacentText?.('afterend', '');
        showToast('Copiado: ' + text);
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch {
        showToast('Copie: ' + text);
      }
    });
  });

  // ── Smooth scroll for all anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Active nav link highlight on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links .nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = 'var(--accent-blue)';
            }
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach(sec => sectionObserver.observe(sec));

  // Init
  onScroll();
})();
