/* ═══════════════════════════════════════════
   DINA ASSEM — PORTFOLIO JS
   ═══════════════════════════════════════════ */

// ── Initialize Lenis Smooth Scroll ──
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.mobile-menu');

// Scroll detection for nav background
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (burger) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ══════════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════════
const cursor = document.querySelector('.custom-cursor');

if (cursor && window.matchMedia('(pointer: fine)').matches) {
  let cursorX = 0, cursorY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    currentX += (cursorX - currentX) * 0.15;
    currentY += (cursorY - currentY) * 0.15;
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .work-card, .project-block__gallery img');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

// ══════════════════════════════════════════
// HERO ANIMATION
// ══════════════════════════════════════════
function initHero() {
  const heroGreeting = document.querySelector('.hero__greeting');
  const heroTitle = document.querySelector('.hero__title');
  const heroSubtitle = document.querySelector('.hero__subtitle');
  const heroCta = document.querySelector('.hero__cta-group');
  const heroScroll = document.querySelector('.hero__scroll-hint');

  if (!heroTitle) return;

  const tl = gsap.timeline({ delay: 0.3 });

  tl.from(heroGreeting, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .from(heroTitle.querySelectorAll('.word'), {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.4')
  .from(heroSubtitle, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .from(heroCta, {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3')
  .from(heroScroll, {
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.2');
}

// ══════════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════════
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            const current = this.targets()[0].val;
            counter.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
          }
        });
      }
    });
  });
}

// ══════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS
// ══════════════════════════════════════════
function initReveals() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
      ease: 'power3.out',
      onComplete: () => el.classList.add('revealed')
    });
  });

  // Stagger children reveals
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  staggerGroups.forEach(group => {
    const children = group.children;
    gsap.from(children, {
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out'
    });
  });
}

// ══════════════════════════════════════════
// WORK CARDS PARALLAX
// ══════════════════════════════════════════
function initCardParallax() {
  const cards = document.querySelectorAll('.work-card');
  
  cards.forEach(card => {
    const bg = card.querySelector('.work-card__bg');
    if (!bg) return;
    
    gsap.to(bg, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: -40,
      ease: 'none'
    });
  });
}

// ══════════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════════
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const galleryImages = document.querySelectorAll('.project-block__gallery img');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      lenis.stop();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lenis.start();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ══════════════════════════════════════════
// SEE MORE TOGGLE
// ══════════════════════════════════════════
function initSeeMore() {
  const buttons = document.querySelectorAll('.see-more-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const gallery = btn.previousElementSibling;
      const hiddenImages = gallery.querySelectorAll('.hidden-image');
      
      hiddenImages.forEach(img => {
        img.classList.remove('hidden-image');
        gsap.from(img, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: 'power3.out'
        });
      });
      
      btn.style.display = 'none';
    });
  });
}

// ══════════════════════════════════════════
// CLOCK IN FOOTER
// ══════════════════════════════════════════
function initClock() {
  const clockEl = document.querySelector('.footer__clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockEl.textContent = 'Cairo → ' + now.toLocaleTimeString('en-US', options);
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

// ══════════════════════════════════════════
// MAGNETIC BUTTONS
// ══════════════════════════════════════════
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  
  const magnetics = document.querySelectorAll('.btn, .work-card__arrow');
  
  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

// ══════════════════════════════════════════
// PAGE TITLE ANIMATION (for inner pages)
// ══════════════════════════════════════════
function initPageTitle() {
  const pageTitle = document.querySelector('.page-hero__title');
  if (!pageTitle) return;

  gsap.from(pageTitle, {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  });
}

// ══════════════════════════════════════════
// TIMELINE ANIMATION
// ══════════════════════════════════════════
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        once: true,
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });
}

// ══════════════════════════════════════════
// SPLIT TEXT HELPER
// ══════════════════════════════════════════
function splitIntoWords(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  
  const text = el.textContent;
  const words = text.split(' ');
  el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
}

// ══════════════════════════════════════════
// INIT ALL
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Split hero title text
  splitIntoWords('.hero__title');
  
  // Init all modules
  initHero();
  animateCounters();
  initReveals();
  initCardParallax();
  initLightbox();
  initSeeMore();
  initClock();
  initMagneticButtons();
  initPageTitle();
  initTimeline();
  
  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
