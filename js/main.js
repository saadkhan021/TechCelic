/* =========================================================
   TechCelic , shared interactivity
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- active nav link ---- */
  const page = (document.body.dataset.page || 'home');
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => {
    if (a.dataset.nav === page) a.classList.add('active');
  });

  /* ---- header scroll state ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- 3D tilt for cards ---- */
  const tiltEls = document.querySelectorAll('.tilt');
  const isFinePointer = window.matchMedia('(pointer:fine)').matches;
  if (isFinePointer) {
    tiltEls.forEach(el => {
      const strength = parseFloat(el.dataset.tiltStrength || '12');
      const state = { rx: 0, ry: 0, trx: 0, try_: 0, scale: 1, tScale: 1, raf: null };

      const render = () => {
        state.rx += (state.trx - state.rx) * 0.14;
        state.ry += (state.try_ - state.ry) * 0.14;
        state.scale += (state.tScale - state.scale) * 0.14;
        el.style.transform = `perspective(1000px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) translateY(${state.tScale > 1 ? -8 : 0}px) scale(${state.scale})`;
        if (Math.abs(state.trx - state.rx) > 0.01 || Math.abs(state.try_ - state.ry) > 0.01 || Math.abs(state.tScale - state.scale) > 0.001) {
          state.raf = requestAnimationFrame(render);
        } else {
          state.raf = null;
        }
      };
      const kick = () => { if (!state.raf) state.raf = requestAnimationFrame(render); };

      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        state.trx = (py - 0.5) * -strength;
        state.try_ = (px - 0.5) * strength;
        state.tScale = 1.025;
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
        kick();
      });
      el.addEventListener('mouseleave', () => {
        state.trx = 0; state.try_ = 0; state.tScale = 1;
        kick();
      });
    });
  }

  /* ---- hero art parallax tilt ---- */
  const heroArt = document.querySelector('.hero-art .weave-wrap');
  const heroZone = document.querySelector('.hero-art');
  if (heroArt && heroZone && isFinePointer) {
    heroZone.addEventListener('mousemove', (e) => {
      const r = heroZone.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroArt.style.transform = `rotateX(${py * -14}deg) rotateY(${px * 18}deg)`;
    });
    heroZone.addEventListener('mouseleave', () => {
      heroArt.style.transform = 'rotateX(0) rotateY(0)';
    });
  }

  /* ---- ambient cursor glow ---- */
  const ambient = document.querySelector('.ambient');
  if (ambient) {
    window.addEventListener('mousemove', (e) => {
      ambient.style.background = `radial-gradient(520px circle at ${e.clientX}px ${e.clientY}px, rgba(46,111,246,0.10), transparent 55%)`;
    }, { passive: true });
  }

  /* ---- smoky cursor trail ---- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isFinePointer && !prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.id = 'smoke-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const puffs = [];
    const palette = [
      [53, 216, 240],   // cyan
      [46, 111, 246],   // blue
      [127, 227, 244],  // cyan-soft
    ];
    let lastSpawn = 0;
    let mx = -999, my = -999, active = false;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      active = true;
      const now = performance.now();
      if (now - lastSpawn > 22) {
        lastSpawn = now;
        const n = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; i++) {
          const c = palette[Math.floor(Math.random() * palette.length)];
          puffs.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.35,
            vy: -0.25 - Math.random() * 0.35,
            r: 10 + Math.random() * 14,
            maxR: 48 + Math.random() * 46,
            alpha: 0.22 + Math.random() * 0.14,
            color: c,
          });
        }
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => { active = false; });

    const MAX_PUFFS = 140;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.r += (p.maxR - p.r) * 0.045;
        p.alpha *= 0.965;
        if (p.alpha < 0.012 || p.r >= p.maxR - 0.5) {
          puffs.splice(i, 1);
          continue;
        }
        const [r, g, b] = p.color;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${p.alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (puffs.length > MAX_PUFFS) puffs.splice(0, puffs.length - MAX_PUFFS);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- expandable "read more" case cards (AI SaaS / App projects) ---- */
  document.querySelectorAll('.case-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.case-card');
      if (!card) return;
      const nowExpanded = card.classList.toggle('expanded');
      const label = btn.querySelector('.txt');
      if (label) label.textContent = nowExpanded ? 'Read less' : 'Read more';
      btn.setAttribute('aria-expanded', nowExpanded ? 'true' : 'false');
    });
  });

  /* ---- domain quick-nav active state (projects page) ---- */
  const domainNavLinks = document.querySelectorAll('.domain-nav a');
  const domainSections = document.querySelectorAll('.domain-section');
  if (domainNavLinks.length && domainSections.length && 'IntersectionObserver' in window) {
    const dio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          domainNavLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
        }
      });
    }, { threshold: 0.35, rootMargin: '-140px 0px -50% 0px' });
    domainSections.forEach(sec => dio.observe(sec));
  }

  /* ---- marquee duplicate for seamless loop ---- */
  document.querySelectorAll('.marquee').forEach(m => {
    m.innerHTML += m.innerHTML;
  });

  /* ---- animated stat counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = !Number.isInteger(target);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const current = target * eased;
          const val = p >= 1 ? target : (isDecimal ? current.toFixed(1) : Math.floor(current));
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---- project filters (projects page) ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        projectCards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* ---- contact form (static demo submit) ---- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    });
  }

});