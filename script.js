document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features, but wrap each in a try/catch so that one failing feature doesn't break the rest of the page.
  safeInit(initPageEnter);
  safeInit(initNav);
  safeInit(initMobileMenu);
  safeInit(initMarquee);
  safeInit(initReveal);
  safeInit(initProjectStack);
  safeInit(initPageTransitions);
});

function safeInit(fn) {
  try {
    fn();
  } catch (err) {
    console.error('[portfolio] ' + fn.name + ' failed:', err);
  }
}

/* Page enter animation */
function initPageEnter() {
  requestAnimationFrame(() => {
    document.body.classList.add('page-ready');
  });
}

/* Nav scroll state */
function initNav() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile hamburger menu  */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  if (!navToggle || !mobileNav) return;

  const openMenu = () => {
    mobileNav.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (overlay) overlay.classList.add('open');
  };

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (overlay) overlay.classList.remove('open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape, and if the viewport is resized back to desktop width.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/*  Marquee: duplicate content for seamless loop */
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const clone = track.innerHTML;
  track.innerHTML = clone + clone;
}

/*  Scroll reveal  */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* Sticky project stacking (Projects page only)  */
function initProjectStack() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const update = () => {
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(card).top) || 0;
      const distancePastSticky = stickyTop - rect.top;

      if (distancePastSticky > 0) {
        const progress = Math.min(distancePastSticky / 260, 1);
        const scale = 1 - progress * 0.06;
        const translateY = progress * -20;
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        card.style.opacity = String(1 - progress * 0.25);
      } else {
        card.style.transform = 'scale(1) translateY(0)';
        card.style.opacity = '1';
      }
      card.style.zIndex = String(i + 1);
    });
  };

  update();
  window.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', () => window.requestAnimationFrame(update));
}

/* Page transitions between internal pages */
function initPageTransitions() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Only intercept same-site .html navigations (skip anchors, mailto, external, target=_blank)
    const isInternalPage = /^[a-zA-Z0-9_-]+\.html(#.*)?$/.test(href) || href === '/' || href === 'index.html';
    if (!isInternalPage) return;
    if (link.target === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.remove('page-ready');
      document.body.classList.add('page-leaving');
      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
}