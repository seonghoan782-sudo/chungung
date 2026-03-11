/* ============================================
   천궁신녀 - 메인 JavaScript
============================================ */

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
const floatingCta = document.getElementById('floating-cta');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  floatingCta.classList.toggle('visible', window.scrollY > 400);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  hamburger.querySelectorAll('span').forEach((span, i) => {
    if (isOpen) {
      if (i === 0) span.style.transform = 'translateY(7px) rotate(45deg)';
      if (i === 1) span.style.opacity = '0';
      if (i === 2) span.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      span.style.transform = '';
      span.style.opacity = '';
    }
  });
});

// Close nav when link clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(span => {
      span.style.transform = '';
      span.style.opacity = '';
    });
  });
});

// ===== HERO SLIDER =====
const slideDots = document.querySelectorAll('.slide-dot');
const heroBgImg = document.getElementById('hero-bg-img');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slideDots[currentSlide].classList.remove('active');
  currentSlide = index;
  heroBgImg.style.opacity = '0';
  setTimeout(() => {
    heroBgImg.src = slideDots[currentSlide].dataset.img;
    heroBgImg.style.opacity = '1';
  }, 400);
  slideDots[currentSlide].classList.add('active');
}

function startSlideAuto() {
  slideInterval = setInterval(() => {
    const next = (currentSlide + 1) % slideDots.length;
    goToSlide(next);
  }, 5000);
}

slideDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(i);
    startSlideAuto();
  });
});

startSlideAuto();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.about-grid, .ritual-card, .gallery-item, .testi-card, .contact-grid, .strip-item, .saju-grid, .section-header'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stagger children if multiple
      const children = entry.target.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 100);
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ===== SAJU FORM =====
function handleSajuSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('saju-submit-btn');
  const btnText = document.getElementById('saju-btn-text');
  const form = document.getElementById('saju-form');
  const result = document.getElementById('saju-result');

  const name = document.getElementById('saju-name').value;
  if (!name.trim()) return;

  // Loading state
  btnText.textContent = '✨ 분석 중...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    form.style.display = 'none';
    result.style.display = 'block';
    showToast(`${name}님의 사주 분석이 완료되었습니다 ✨`);
  }, 2200);
}

// ===== CONTACT FORM =====
function handleContactSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const name = document.getElementById('c-name').value;

  showToast(`${name}님의 예약 신청이 접수되었습니다. 곧 연락드리겠습니다 🙏`);
  form.reset();
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--gold-light)';
    }
  });
});

// ===== GALLERY LIGHTBOX (simple) =====
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.92);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; animation:fadeIn 0.3s ease;
    `;
    lightbox.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" style="max-width:90vw; max-height:90vh; object-fit:contain; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,0.8);" />
      <button style="position:absolute; top:24px; right:32px; font-size:2rem; color:white; background:none; border:none; cursor:pointer; line-height:1;" aria-label="닫기">✕</button>
    `;
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    const close = () => {
      lightbox.remove();
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', close);
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); }, { once: true });
  });
});

// Add fadeIn keyframe dynamically
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`;
document.head.appendChild(styleEl);

console.log('%c🌸 천궁신녀 웹사이트 로드 완료', 'color:#C8932A; font-size:14px; font-weight:bold;');
