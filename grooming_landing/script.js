// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.getAttribute('data-open') === 'true';
    primaryNav.setAttribute('data-open', String(!isOpen));
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Slider
function initSlider(root) {
  const slides = Array.from(root.querySelectorAll('.slide'));
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  let index = slides.findIndex((s) => s.classList.contains('is-active'));
  if (index < 0) index = 0;

  function show(i) {
    slides.forEach((s, si) => s.classList.toggle('is-active', si === i));
  }
  prev?.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  });
  next?.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    show(index);
  });

  // auto-advance
  setInterval(() => {
    index = (index + 1) % slides.length;
    show(index);
  }, 6000);
}
document.querySelectorAll('.slider').forEach(initSlider);

// Booking form
const form = document.querySelector('.booking-form');
const toast = document.getElementById('toast');
function showToast(message) {
  if (!toast) return;
  const text = toast.querySelector('.toast-text');
  if (text) text.textContent = message;
  toast.hidden = false;
  setTimeout(() => (toast.hidden = true), 3000);
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  // Minimal front-end validation
  if (!payload.name || !payload.phone || !payload.pet || !payload.service || !payload.date || !payload.time || !form.querySelector('input[name="consent"]').checked) {
    showToast('Проверьте обязательные поля и согласие.');
    return;
  }

  try {
    // Example: send to your backend endpoint
    // await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    showToast('Спасибо! Мы свяжемся с вами в ближайшее время.');
    form.reset();
  } catch (err) {
    showToast('Не удалось отправить форму. Попробуйте позже.');
  }
});

// DIKIDI integration hook
document.querySelector('[data-dikidi]')?.addEventListener('click', (e) => {
  e.preventDefault();
  // Replace with your real DIKIDI URL
  window.open('https://dikidi.net/', '_blank', 'noopener');
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());


