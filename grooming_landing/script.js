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
  const dikidiUrl = window.CONFIG?.DIKIDI_URL || 'https://dikidi.net/1877299';
  window.open(dikidiUrl, '_blank', 'noopener');
});

// Yandex Maps initialization
function initYandexMap() {
  if (!window.CONFIG?.YANDEX_MAPS_API_KEY || window.CONFIG.YANDEX_MAPS_API_KEY === 'YOUR_YANDEX_MAPS_API_KEY_HERE') {
    console.warn('Yandex Maps API key not configured. Please update config.js');
    document.getElementById('yandex-map').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666; border-radius: 12px;">Карта недоступна. Настройте API ключ в config.js</div>';
    return;
  }

  // Load Yandex Maps API
  const script = document.createElement('script');
  script.src = `https://api-maps.yandex.ru/2.1/?apikey=${window.CONFIG.YANDEX_MAPS_API_KEY}&lang=ru_RU`;
  script.onload = () => {
    ymaps.ready(() => {
      const map = new ymaps.Map('yandex-map', {
        center: window.CONFIG.MAP_CENTER || [37.620070, 55.753630],
        zoom: window.CONFIG.MAP_ZOOM || 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // Add marker
      const marker = new ymaps.Placemark(window.CONFIG.MAP_CENTER || [37.620070, 55.753630], {
        balloonContent: 'Груминг-салон «Лапочки»'
      }, {
        preset: 'islands#redDotIcon'
      });

      map.geoObjects.add(marker);
    });
  };
  script.onerror = () => {
    document.getElementById('yandex-map').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666; border-radius: 12px;">Ошибка загрузки карты</div>';
  };
  document.head.appendChild(script);
}

// Initialize map when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initYandexMap);
} else {
  initYandexMap();
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());


