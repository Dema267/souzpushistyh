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

// Portfolio Modal
const portfolioModal = document.getElementById('portfolio-modal');
const modalTitle = document.getElementById('modal-title');
const modalGallery = document.getElementById('modal-gallery');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Данные для галерей
const portfolioData = {
  works: {
    title: 'Фото работ',
    images: [
      { src: 'assets/portfolio-1.jpg', alt: 'До и после: Лайка Боня' },
      { src: 'assets/portfolio-2.jpg', alt: 'Персидская кошка' },
      { src: 'assets/portfolio-3.jpg', alt: 'Йоркширский терьер' },
      { src: 'assets/portfolio-4.jpg', alt: 'Золотистый ретривер' },
      { src: 'assets/portfolio-5.jpg', alt: 'Мопс' },
      { src: 'assets/portfolio-6.jpg', alt: 'Шпиц' },
      { src: 'assets/portfolio-7.jpg', alt: 'Бигль' },
      { src: 'assets/portfolio-8.jpg', alt: 'Такса' },
      { src: 'assets/portfolio-9.jpg', alt: 'Хаски' },
      { src: 'assets/portfolio-10.jpg', alt: 'Лабрадор' },
    ]
  },
  salon: {
    title: 'Фото салона',
    images: [
      { src: 'assets/salon-1.jpg', alt: 'Вход в салон' },
      { src: 'assets/salon-2.jpg', alt: 'Зал ожидания' },
      { src: 'assets/salon-3.jpg', alt: 'Рабочее место грумера' },
      { src: 'assets/salon-4.jpg', alt: 'Зона стрижки' },
      { src: 'assets/salon-5.jpg', alt: 'Зона мытья' },
      { src: 'assets/salon-6.jpg', alt: 'Интерьер салона' },
      { src: 'assets/salon-7.jpg', alt: 'Ресепшн' },
      { src: 'assets/salon-8.jpg', alt: 'Внешний вид салона' }
    ]
  },
  cosmetics: {
    title: 'Наша косметика',
    images: [
      { src: 'assets/cosmetics-1.jpg', alt: 'Шампуни для собак' },
      { src: 'assets/cosmetics-2.jpg', alt: 'Шампуни для кошек' },
      { src: 'assets/cosmetics-3.jpg', alt: 'Кондиционеры' },
      { src: 'assets/cosmetics-4.jpg', alt: 'Спреи для ухода' },
    ]
  }
};

// Открытие модального окна
function openPortfolioModal(category) {
  const data = portfolioData[category];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalGallery.innerHTML = '';

  data.images.forEach((image, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
    `;

    galleryItem.addEventListener('click', () => {
      openImageLightbox(image.src, image.alt);
    });

    modalGallery.appendChild(galleryItem);
  });

  portfolioModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closePortfolioModal() {
  portfolioModal.hidden = true;
  document.body.style.overflow = '';
}

// Обработчики событий
document.querySelectorAll('.portfolio-category').forEach(category => {
  category.addEventListener('click', () => {
    const categoryType = category.getAttribute('data-category');
    openPortfolioModal(categoryType);
  });
});

modalClose?.addEventListener('click', closePortfolioModal);
modalOverlay?.addEventListener('click', closePortfolioModal);

// Закрытие по клавише Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !portfolioModal.hidden) {
    closePortfolioModal();
  }
});

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

// Image Lightbox functionality
function openImageLightbox(imageSrc, imageAlt) {
  // Создаем lightbox элемент
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Закрыть">×</button>
      <img class="lightbox-image" src="${imageSrc}" alt="${imageAlt}" />
      <div class="lightbox-caption">${imageAlt}</div>
    </div>
  `;

  // Добавляем в DOM
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  // Обработчики событий
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const closeLightbox = () => {
    document.body.removeChild(lightbox);
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Закрытие по клавише Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}


