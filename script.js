// ===== Mobile menu =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasGSAP) {
  gsap.registerPlugin(ScrollTrigger);

  // ===== Lenis smooth scroll, synced with ScrollTrigger =====
  // Skipped on touch/small screens: fights with mobile Safari's dynamic
  // toolbar and causes a ghosting/duplicate-frame artifact while scrolling.
  const isTouchOrSmall = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900;
  if (!reduceMotion && !isTouchOrSmall && typeof window.Lenis !== 'undefined') {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ===== Hero: entrance choreography =====
  const heroWords = gsap.utils.toArray('#heroTitle .word');
  const heroFadeEls = gsap.utils.toArray('.hero .reveal-fade');
  const floaties = gsap.utils.toArray('.floaty');

  if (reduceMotion) {
    gsap.set([...heroWords, ...heroFadeEls, ...floaties], { opacity: 1, clearProps: 'transform' });
    heroWords.forEach((w) => (w.style.color = 'var(--text)'));
  } else {
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
      .to(heroWords, {
        color: '#F5F1E8',
        duration: 0.5,
        ease: 'power1.out',
        stagger: 0.12,
      })
      .to('.hero__tagline', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .to('.hero__subtitle', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to('.hero__highlights', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to('.hero .btn', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to(
        floaties,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          stagger: 0.1,
        },
        '-=0.4'
      )
      .add(() => {
        // idle floating loop once entrance settles
        floaties.forEach((el, i) => {
          gsap.to(el, {
            y: '+=10',
            duration: 2.4 + (i % 3) * 0.4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.15,
          });
        });
      });
  }

  // ===== Background color hand-off between every section =====
  if (!reduceMotion) {
    const sectionFlow = [
      { el: '.hero', color: '#170F2E' },
      { el: '#o-que-faco', color: '#170F2E' },
      { el: '.path', color: '#1F1444' },
      { el: '.bento-section', color: '#0F0919' },
      { el: '.automations', color: '#0E2429' },
      { el: '.packages', color: '#170F2E' },
      { el: '.trust', color: '#1F1444' },
      { el: '#sobre', color: '#170F2E' },
      { el: '#portfolio', color: '#170F2E' },
      { el: '.footer', color: '#0F0919' },
    ];

    for (let i = 1; i < sectionFlow.length; i++) {
      const prev = document.querySelector(sectionFlow[i - 1].el);
      const next = document.querySelector(sectionFlow[i].el);
      if (!prev || !next) continue;
      gsap.to(prev, {
        backgroundColor: sectionFlow[i].color,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });
    }
  }

  // ===== Path section: title reveal + phone entrance =====
  const pathWords = gsap.utils.toArray('#pathTitle .word');
  const pathPhone = document.getElementById('phonePath');

  if (reduceMotion) {
    gsap.set([...pathWords, pathPhone], { opacity: 1, clearProps: 'transform' });
    pathWords.forEach((w) => (w.style.color = 'var(--text)'));
  } else {
    gsap.set(pathPhone, { opacity: 0, y: 60 });

    ScrollTrigger.create({
      trigger: '.path',
      start: 'top 75%',
      end: 'top 25%',
      scrub: true,
      onUpdate: (self) => {
        const n = pathWords.length;
        pathWords.forEach((w, i) => {
          const threshold = i / n;
          w.style.color = self.progress > threshold ? '#F5F1E8' : '#443C5C';
        });
      },
    });

    ScrollTrigger.create({
      trigger: '.path',
      start: 'top 70%',
      once: true,
      onEnter: () => gsap.to(pathPhone, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }),
    });
  }

  // ===== Generic scroll reveals (bento cards, packages, testimonials, footer cards...) =====
  const revealUpEls = gsap.utils.toArray('.reveal-up');
  const genericFadeEls = gsap.utils.toArray('.reveal-fade').filter((el) => !el.closest('.hero'));

  if (reduceMotion) {
    gsap.set(revealUpEls, { opacity: 1, y: 0 });
    gsap.set(genericFadeEls, { opacity: 1 });
  } else {
    gsap.set(revealUpEls, { y: 20, rotateX: -10, transformPerspective: 1000, transformOrigin: '50% 100%' });
    ScrollTrigger.batch(revealUpEls, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: true,
          clearProps: 'transform',
        }),
    });

    ScrollTrigger.batch(genericFadeEls, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 }),
    });
  }

  // ===== Animated counter (bento card) =====
  const counterEl = document.querySelector('.counter');
  if (counterEl) {
    const target = parseInt(counterEl.dataset.target, 10);
    if (reduceMotion) {
      counterEl.textContent = target;
    } else {
      const counterProxy = { value: 0 };
      ScrollTrigger.create({
        trigger: counterEl,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(counterProxy, {
            value: target,
            duration: 1.2,
            ease: 'power1.out',
            onUpdate: () => { counterEl.textContent = Math.round(counterProxy.value); },
          }),
      });
    }
  }

  // ===== Automações: phone + floating notification pills =====
  const autoPhone = document.getElementById('phoneAutomation');
  const pills = gsap.utils.toArray('.pill');

  if (autoPhone) {
    const floatPills = () => {
      pills.forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.to(el, {
          y: `+=${10 + (i % 3) * 4}`,
          x: `+=${dir * (6 + (i % 2) * 4)}`,
          rotation: dir * (2 + (i % 3)),
          duration: 2.2 + (i % 3) * 0.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 0.6 + i * 0.1,
        });
      });
    };

    if (reduceMotion) {
      gsap.set(pills, { opacity: 1, scale: 1 });
    } else if (window.innerWidth <= 700) {
      // Mobile: show immediately instead of relying on a scroll-triggered
      // fade-in (which could get stuck at opacity:0 if the trigger's math
      // is thrown off by dynamic mobile viewport height), but keep the
      // floating idle motion so the pills read the same as on desktop.
      gsap.set(pills, { opacity: 1, scale: 1 });
      floatPills();
    } else {
      gsap.set(pills, { opacity: 0, scale: 0.8 });
      ScrollTrigger.create({
        trigger: '.automations',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(pills, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.12 });
          floatPills();
        },
      });
    }
  }

  // ===== Quem confia: avatars scatter from center =====
  const trustContainer = document.getElementById('trustAvatars');
  if (trustContainer) {
    const avatars = gsap.utils.toArray('.trust-avatar');
    if (reduceMotion) {
      gsap.set(avatars, { x: 0, y: 0, opacity: 1, scale: 1 });
    } else {
      const containerRect = trustContainer.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      avatars.forEach((el) => {
        const r = el.getBoundingClientRect();
        const elX = r.left - containerRect.left + r.width / 2;
        const elY = r.top - containerRect.top + r.height / 2;
        const dx = centerX - elX;
        const dy = centerY - elY;

        gsap.fromTo(
          el,
          { x: dx, y: dy, scale: 0.5, opacity: 0.5 },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: trustContainer,
              start: 'top 80%',
              end: 'top 15%',
              scrub: true,
            },
          }
        );
      });
    }
  }

  // ===== Word-by-word reveal for photo+text sections =====
  function setupWordReveal(el) {
    const text = el.textContent.trim();
    el.innerHTML = text
      .split(/\s+/)
      .map((w) => `<span class="word">${w}</span>`)
      .join(' ');
    const words = [...el.querySelectorAll('.word')];

    if (reduceMotion) {
      words.forEach((w) => (w.style.color = '#F5F1E8'));
      return;
    }

    gsap.set(words, { color: '#443C5C' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      end: 'top 48%',
      scrub: true,
      onUpdate: (self) => {
        const n = words.length;
        words.forEach((w, i) => {
          w.style.color = self.progress > i / n ? '#F5F1E8' : '#443C5C';
        });
      },
    });
  }
  document.querySelectorAll('.word-reveal').forEach(setupWordReveal);

  // ===== Footer ribbon: draw on scroll =====
  const ribbonPath = document.getElementById('ribbonPath');
  if (ribbonPath) {
    const length = ribbonPath.getTotalLength();
    if (reduceMotion) {
      gsap.set(ribbonPath, { strokeDasharray: length, strokeDashoffset: 0 });
    } else {
      gsap.set(ribbonPath, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(ribbonPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: true },
      });
    }
  }

  // ===== Floating WhatsApp button: appears after scrolling a bit =====
  const waFloat = document.getElementById('whatsappFloat');
  if (waFloat) {
    ScrollTrigger.create({
      start: 400,
      onEnter: () => waFloat.classList.add('is-visible'),
      onLeaveBack: () => waFloat.classList.remove('is-visible'),
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
} else {
  // Fallback if a CDN failed to load: show everything, no animation.
  document.querySelectorAll('.word-reveal').forEach((el) => {
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="word">${w}</span>`)
      .join(' ');
  });
  document.querySelectorAll('.word').forEach((w) => (w.style.color = '#F5F1E8'));
  document.querySelectorAll('.reveal-fade, .reveal-up, .floaty, .phone, .pill').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.trust-avatar').forEach((el) => {
    el.style.transform = 'none';
  });
  const counterElFallback = document.querySelector('.counter');
  if (counterElFallback) counterElFallback.textContent = counterElFallback.dataset.target;
  const waFloatFallback = document.getElementById('whatsappFloat');
  if (waFloatFallback) waFloatFallback.classList.add('is-visible');
}
