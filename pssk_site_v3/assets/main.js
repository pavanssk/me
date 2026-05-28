/* assets/main.js — Pavan Kanwar */

(function () {

  // ── PARALLAX (hero only) ──────────────────────────────────
  const parallaxEls = document.querySelectorAll('[data-speed]');
  if (parallaxEls.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          parallaxEls.forEach(el => {
            el.style.transform = `translateY(${y * parseFloat(el.dataset.speed)}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  // ── NAV DROPDOWN & MOBILE ─────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-mobile-drawer');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }

  overlay.addEventListener('click', closeDrawer);

  // Close drawer on link click
  document.querySelectorAll('.nav-mobile-links a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });

  // Dropdown — open on click for touch devices
  document.querySelectorAll('.nav-has-dropdown').forEach(item => {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', e => {
        const isMobile = window.innerWidth <= 900;
        if (isMobile) return; // mobile uses drawer
        e.preventDefault();
        item.classList.toggle('open');
      });
    }
    // Close on outside click
    document.addEventListener('click', e => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });

  // Close dropdown on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.querySelectorAll('.nav-has-dropdown').forEach(i => i.classList.remove('open'));
    }
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal, .case-section');
  if (reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  // ── CUSTOM CURSOR ─────────────────────────────────────────
  const dot = document.createElement('div');
  dot.style.cssText = [
    'position:fixed', 'width:8px', 'height:8px',
    'background:#C8402A', 'border-radius:50%',
    'pointer-events:none', 'z-index:10000',
    'transform:translate(-50%,-50%)',
    'transition:width .15s,height .15s',
    'mix-blend-mode:difference',
  ].join(';');

  const ring = document.createElement('div');
  ring.style.cssText = [
    'position:fixed', 'width:32px', 'height:32px',
    'border:1px solid rgba(200,64,42,0.4)',
    'border-radius:50%', 'pointer-events:none',
    'z-index:9999', 'transform:translate(-50%,-50%)',
    'transition:width .15s,height .15s,border-color .15s',
  ].join(';');

  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .work-item, .exp-item, .stack-cell').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = dot.style.height = '12px';
      ring.style.width = ring.style.height = '48px';
      ring.style.borderColor = 'rgba(200,64,42,0.65)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = dot.style.height = '8px';
      ring.style.width = ring.style.height = '32px';
      ring.style.borderColor = 'rgba(200,64,42,0.4)';
    });
  });

  // ── CONTACT FORM FEEDBACK ─────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const note = form.querySelector('.form-note');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          btn.textContent = 'Sent ✓';
          note.textContent = 'Thanks — I\'ll be in touch shortly.';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        note.textContent = 'Something went wrong. Please email directly.';
      }
    });
  }

})();
