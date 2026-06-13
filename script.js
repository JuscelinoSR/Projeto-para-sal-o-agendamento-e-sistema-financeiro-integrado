const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const header = document.querySelector('[data-elevate]');
const pageScreens = document.querySelectorAll('[data-page]');
const pageLinks = document.querySelectorAll('a[href^="#"]');
const visualTabButtons = document.querySelectorAll('[data-site-tab]');

const storageKeys = {
  services: 'beautyjsr.services',
  professionals: 'beautyjsr.professionals',
  demands: 'beautyjsr.demands',
  siteSettings: 'beautyjsr.siteSettings',
  serviceCatalogVersion: 'beautyjsr.serviceCatalogVersion',
};

const defaultSiteSettings = {
  brandName: 'Salão Larissa',
  heroBadge: 'Salão feminino',
  heroTitle: 'Seu momento de cuidado.',
  heroSubtitle: 'Cabelos, beleza e autoestima em um ambiente acolhedor, elegante e preparado para transformar sua rotina.',
  ctaText: 'Agendar com Ana',
  instagramUrl: 'https://www.instagram.com/liasouzaoliveira/',
  facebookUrl: '',
  tiktokUrl: '',
  whatsappNumber: '5564999625616',
  galleryImages: [],
  backgroundImage: 'assets/salao-cores.jpeg',
};

function readObject(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    return value && typeof value === 'object' && !Array.isArray(value) ? { ...fallback, ...value } : fallback;
  } catch {
    return fallback;
  }
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function normalizeWhatsapp(value) {
  return String(value || '').replace(/\D/g, '') || '5564999625616';
}

function renderSocialLinks(settings) {
  const profiles = [
    ['Instagram', settings.instagramUrl],
    ['Facebook', settings.facebookUrl],
    ['TikTok', settings.tiktokUrl],
  ].filter(([, url]) => url);

  const socialLinks = document.querySelector('[data-social-links]');
  if (socialLinks) {
    socialLinks.innerHTML = profiles
      .map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`)
      .join('');
  }

  const footerInstagram = document.querySelector('[data-footer-instagram]');
  if (footerInstagram) {
    if (settings.instagramUrl) {
      footerInstagram.href = settings.instagramUrl;
      footerInstagram.hidden = false;
    } else {
      footerInstagram.hidden = true;
    }
  }

  const instagramProfile = document.querySelector('[data-instagram-profile]');
  if (instagramProfile && settings.instagramUrl) {
    instagramProfile.href = settings.instagramUrl;
    instagramProfile.textContent = settings.instagramUrl
      .replace('https://www.instagram.com/', '@')
      .replace(/\/$/, '');
  }
}

function renderWorkGallery(settings) {
  const gallery = document.querySelector('[data-work-gallery]');
  if (!gallery) return;

  const images = Array.isArray(settings.galleryImages) ? settings.galleryImages : [];

  if (!images.length) {
    gallery.innerHTML = '';
    return;
  }

  gallery.innerHTML = images.slice(0, 6).map((src, index) => `
    <article class="work-card">
      <img src="${escapeHtml(src)}" alt="Trabalho do salão ${index + 1}">
      <span>Trabalho ${index + 1}</span>
    </article>
  `).join('');
}

function getInitials(name) {
  return String(name || 'Profissional')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function renderProfessionalShowcase() {
  const showcase = document.querySelector('[data-professional-showcase]');
  if (!showcase) return;

  refreshEditableData();

  showcase.innerHTML = professionals.map((professional) => `
    <article class="professional-card">
      <span class="professional-avatar">${escapeHtml(getInitials(professional.name))}</span>
      <div>
        <h3>${escapeHtml(professional.name)}</h3>
        <p>${escapeHtml(professional.specialty || 'Atendimento especializado')}</p>
        ${professional.linkUrl ? `<a class="professional-link" href="${escapeHtml(professional.linkUrl)}" target="_blank" rel="noreferrer">Ver perfil</a>` : ''}
      </div>
    </article>
  `).join('');
}

function applySiteSettings() {
  const settings = readObject(storageKeys.siteSettings, defaultSiteSettings);
  setText('[data-site-brand]', settings.brandName);
  setText('[data-site-brand-footer]', settings.brandName);
  setText('[data-hero-badge]', settings.heroBadge);
  setText('[data-hero-title]', settings.heroTitle);
  setText('[data-hero-subtitle]', settings.heroSubtitle);
  setText('[data-site-cta]', settings.ctaText);

  document.querySelector('[data-site-brand]')?.setAttribute('aria-label', `${settings.brandName} início`);
  document.documentElement.style.setProperty('--site-background-image', `url("${settings.backgroundImage}")`);
  renderSocialLinks(settings);
  renderWorkGallery(settings);
  renderProfessionalShowcase();
}
const defaultServices = [
  {
    id: 'corte-feminino',
    name: 'Corte feminino',
    duration: '50 min',
    price: 'R$ 90',
  },
  {
    id: 'escova-modelada',
    name: 'Escova modelada',
    duration: '45 min',
    price: 'R$ 75',
  },
  {
    id: 'corte-escova',
    name: 'Corte + escova',
    duration: '80 min',
    price: 'R$ 140',
  },
  {
    id: 'hidratacao-capilar',
    name: 'Hidratação capilar',
    duration: '60 min',
    price: 'R$ 120',
  },
  {
    id: 'reconstrucao-capilar',
    name: 'Reconstrução capilar',
    duration: '90 min',
    price: 'R$ 180',
  },
  {
    id: 'coloracao-raiz',
    name: 'Coloração de raiz',
    duration: '120 min',
    price: 'R$ 190',
  },
  {
    id: 'mechas-iluminadas',
    name: 'Mechas iluminadas',
    duration: '210 min',
    price: 'R$ 420',
  },
  {
    id: 'tonalizacao',
    name: 'Tonalização',
    duration: '75 min',
    price: 'R$ 150',
  },
  {
    id: 'penteado-evento',
    name: 'Penteado para evento',
    duration: '90 min',
    price: 'R$ 180',
  },
  {
    id: 'manicure',
    name: 'Manicure',
    duration: '45 min',
    price: 'R$ 45',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    duration: '50 min',
    price: 'R$ 55',
  },
  {
    id: 'manicure-pedicure',
    name: 'Manicure + pedicure',
    duration: '90 min',
    price: 'R$ 95',
  },
  {
    id: 'alongamento-unhas',
    name: 'Alongamento de unhas',
    duration: '150 min',
    price: 'R$ 180',
  },
  {
    id: 'design-sobrancelhas',
    name: 'Design de sobrancelhas',
    duration: '35 min',
    price: 'R$ 55',
  },
  {
    id: 'maquiagem-social',
    name: 'Maquiagem social',
    duration: '75 min',
    price: 'R$ 160',
  },
  {
    id: 'depilacao-facial',
    name: 'Depilação facial',
    duration: '30 min',
    price: 'R$ 60',
  },
  {
    id: 'limpeza-pele',
    name: 'Limpeza de pele',
    duration: '90 min',
    price: 'R$ 170',
  },
];

const defaultProfessionals = [
  {
    id: 'ana-souza',
    name: 'Ana Souza',
    specialty: 'Cabelos e finalização',
    linkUrl: '',
  },
  {
    id: 'beatriz-lima',
    name: 'Beatriz Lima',
    specialty: 'Unhas e spa das mãos',
    linkUrl: '',
  },
  {
    id: 'clara-mendes',
    name: 'Clara Mendes',
    specialty: 'Tratamentos capilares',
    linkUrl: '',
  },
];

const defaultCombos = [
  {
    id: 'combo-brilho',
    name: 'Combo Brilho Essencial',
    items: ['Corte + escova', 'Hidratação capilar'],
    duration: '120 min',
    price: 'R$ 230',
  },
  {
    id: 'combo-maos-cabelo',
    name: 'Combo Mãos + Cabelo',
    items: ['Design de unhas', 'Escova modelada'],
    duration: '135 min',
    price: 'R$ 180',
  },
  {
    id: 'combo-dia-beleza',
    name: 'Combo Dia de Beleza',
    items: ['Corte + escova', 'Hidratação capilar', 'Design de unhas'],
    duration: '210 min',
    price: 'R$ 320',
  },
];

let services = readCollection(storageKeys.services, defaultServices);
let professionals = readCollection(storageKeys.professionals, defaultProfessionals);

let whatsappPhone = normalizeWhatsapp(readObject(storageKeys.siteSettings, defaultSiteSettings).whatsappNumber);
const serviceOptions = document.querySelector('[data-service-options]');
const comboOptions = document.querySelector('[data-combo-options]');
const customServiceOptions = document.querySelector('[data-custom-service-options]');
const bookingPanels = document.querySelectorAll('[data-booking-panel]');
const bookingScreens = document.querySelectorAll('[data-booking-screen]');
const screenTitle = document.querySelector('[data-screen-title]');
const progressSteps = document.querySelectorAll('[data-progress-step]');
const bookingForm = document.querySelector('[data-booking-form]');
const scheduler = document.querySelector('[data-scheduler]');
const summaryTitle = document.querySelector('[data-summary-title]');
const summaryCopy = document.querySelector('[data-summary-copy]');
const messagePreview = document.querySelector('[data-message-preview]');
const summaryNextButton = document.querySelector('[data-summary-next]');
const professionalOptions = document.querySelector('[data-professional-options]');
const bookingCalendar = document.querySelector('[data-booking-calendar]');
const appointmentDateInput = document.querySelector('[data-appointment-date]');
const clientNameInput = document.querySelector('[data-client-name]');
const clientNotesInput = document.querySelector('[data-client-notes]');

const today = new Date();
today.setHours(0, 0, 0, 0);
let selectedAppointmentDate = toDateKey(today);
let calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);

function readCollection(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeCollection(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mergeMissingItems(currentItems, defaults) {
  const existingIds = new Set(currentItems.map((item) => item.id));
  const missing = defaults.filter((item) => !existingIds.has(item.id));
  return [...currentItems, ...missing];
}
function ensureSeedData() {
  const catalogVersion = '2026-06-salao-completo';

  if (!localStorage.getItem(storageKeys.services)) {
    writeCollection(storageKeys.services, defaultServices);
    localStorage.setItem(storageKeys.serviceCatalogVersion, catalogVersion);
  } else if (localStorage.getItem(storageKeys.serviceCatalogVersion) !== catalogVersion) {
    const mergedServices = mergeMissingItems(readCollection(storageKeys.services, []), defaultServices);
    writeCollection(storageKeys.services, mergedServices);
    localStorage.setItem(storageKeys.serviceCatalogVersion, catalogVersion);
  }

  if (!localStorage.getItem(storageKeys.professionals)) {
    writeCollection(storageKeys.professionals, defaultProfessionals);
  }
}

function refreshEditableData() {
  services = readCollection(storageKeys.services, defaultServices);
  professionals = readCollection(storageKeys.professionals, defaultProfessionals);
}

function getPageFromHash(hash) {
  const page = String(hash || '#produto').replace('#', '');
  return document.querySelector(`[data-page="${page}"]`) ? page : 'produto';
}

function showMainPage(pageName, updateHash = true) {
  const nextPage = getPageFromHash(`#${pageName}`);

  pageScreens.forEach((screen) => {
    screen.classList.toggle('is-page-active', screen.dataset.page === nextPage);
  });

  pageLinks.forEach((link) => {
    const linkPage = getPageFromHash(link.getAttribute('href'));
    link.classList.toggle('is-active', linkPage === nextPage);
  });

  visualTabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.siteTab === nextPage);
    button.setAttribute('aria-selected', button.dataset.siteTab === nextPage ? 'true' : 'false');
  });

  if (updateHash) {
    history.replaceState(null, '', `#${nextPage}`);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  closeMenu();
}
function closeMenu() {
  document.body.classList.remove('menu-open');
  mobileNav?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const isOpen = mobileNav?.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', Boolean(isOpen));
  menuButton.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) {
      return;
    }

    event.preventDefault();
    showMainPage(getPageFromHash(href));
  });
});

visualTabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showMainPage(button.dataset.siteTab);
  });
});

window.addEventListener('hashchange', () => {
  showMainPage(getPageFromHash(window.location.hash), false);
});

function updateHeader() {
  header?.classList.toggle('is-elevated', window.scrollY > 8);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderChoice({ type, name, value, checked, title, details, compact = false }) {
  return `
    <label class="choice-card${compact ? ' compact' : ''}">
      <input type="${type}" name="${name}" value="${escapeHtml(value)}" ${checked ? 'checked' : ''}>
      <span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(details)}</small>
      </span>
    </label>
  `;
}

function renderOptions() {
  refreshEditableData();

  if (serviceOptions) {
    serviceOptions.innerHTML = services
      .map((service, index) => renderChoice({
        type: 'checkbox',
        name: 'service',
        value: service.id,
        checked: index === 0,
        title: service.name,
        details: `${service.duration} • ${service.price}`,
      }))
      .join('');
  }

  if (comboOptions) {
    comboOptions.innerHTML = defaultCombos
      .map((combo, index) => renderChoice({
        type: 'radio',
        name: 'combo',
        value: combo.id,
        checked: index === 0,
        title: combo.name,
        details: `${combo.items.join(' + ')} • ${combo.price}`,
      }))
      .join('');
  }

  if (customServiceOptions) {
    customServiceOptions.innerHTML = services
      .map((service, index) => renderChoice({
        type: 'checkbox',
        name: 'customServices',
        value: service.id,
        checked: index < 2,
        title: service.name,
        details: `${service.duration} • ${service.price}`,
      }))
      .join('');
  }

  if (professionalOptions) {
    professionalOptions.innerHTML = professionals
      .map((professional, index) => renderChoice({
        type: 'radio',
        name: 'professional',
        value: professional.id,
        checked: index === 0,
        title: professional.name,
        details: professional.specialty,
      }))
      .join('');
  }
}

function getSelectedValue(name) {
  return bookingForm?.querySelector(`input[name="${name}"]:checked`)?.value;
}

function getSelectedValues(name) {
  return Array.from(bookingForm?.querySelectorAll(`input[name="${name}"]:checked`) ?? []).map((input) => input.value);
}

function parsePrice(price) {
  const numeric = String(price).replace(/[^\d,]/g, '').replace(',', '.');
  return Number.parseFloat(numeric) || 0;
}

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(dateKey) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(parseDateKey(dateKey));
}

function formatShortDate(dateKey) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parseDateKey(dateKey));
}

function renderCalendar() {
  if (!bookingCalendar) {
    return;
  }

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(monthStart);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const canGoBack = monthStart > new Date(today.getFullYear(), today.getMonth(), 1);

  const blanks = Array.from({ length: firstWeekday }, () => '<span class="calendar-empty" aria-hidden="true"></span>');
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const dateKey = toDateKey(date);
    const isPast = date < today;
    const isSelected = dateKey === selectedAppointmentDate;
    const isToday = dateKey === toDateKey(today);

    return `
      <button class="calendar-day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}" type="button" data-calendar-date="${dateKey}" ${isPast ? 'disabled' : ''}>
        <span>${day}</span>
      </button>
    `;
  });

  bookingCalendar.innerHTML = `
    <div class="calendar-header">
      <button class="calendar-nav" type="button" data-calendar-prev ${canGoBack ? '' : 'disabled'} aria-label="Mês anterior">‹</button>
      <strong>${escapeHtml(monthLabel)}</strong>
      <button class="calendar-nav" type="button" data-calendar-next aria-label="Próximo mês">›</button>
    </div>
    <div class="calendar-weekdays">
      ${weekDays.map((day) => `<span>${day}</span>`).join('')}
    </div>
    <div class="calendar-grid">
      ${[...blanks, ...days].join('')}
    </div>
    <p class="calendar-selected">Selecionado: <strong>${escapeHtml(formatDisplayDate(selectedAppointmentDate))}</strong></p>
  `;

  if (appointmentDateInput) {
    appointmentDateInput.value = selectedAppointmentDate;
  }
}
function getBookingType() {
  return 'custom';
}

function getSelectedPackage() {
  refreshEditableData();
  const bookingType = getBookingType();

  if (bookingType === 'combo') {
    const selectedCombo = defaultCombos.find((combo) => combo.id === getSelectedValue('combo')) ?? defaultCombos[0];
    return {
      bookingType,
      id: selectedCombo.id,
      name: selectedCombo.name,
      duration: selectedCombo.duration,
      price: selectedCombo.price,
      items: selectedCombo.items,
    };
  }

  if (bookingType === 'custom') {
    const selectedIds = getSelectedValues('customServices');
    const selectedServices = services.filter((service) => selectedIds.includes(service.id));
    const safeServices = selectedServices.length ? selectedServices : services.slice(0, 1);
    const total = safeServices.reduce((sum, service) => sum + parsePrice(service.price), 0);

    return {
      bookingType,
      id: 'combo-personalizado',
      name: 'Combo personalizado',
      duration: `${safeServices.length} serviços`,
      price: formatPrice(total),
      items: safeServices.map((service) => service.name),
    };
  }

  const fallbackCombo = combos[0] ?? defaultCombos[0];

  return {
    bookingType: 'combo',
    id: fallbackCombo.id,
    name: fallbackCombo.name,
    duration: fallbackCombo.duration,
    price: fallbackCombo.price,
    items: fallbackCombo.items,
  };
}

function updateBookingPanels() {
  const bookingType = getBookingType();
  bookingPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.bookingPanel === bookingType);
  });

  if (screenTitle) {
    screenTitle.textContent = 'Escolha seu atendimento';
  }
}

function showBookingScreen(screenName) {
  bookingScreens.forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.bookingScreen === screenName);
  });

  const order = ['details', 'schedule', 'contact'];
  const activeIndex = order.indexOf(screenName);
  progressSteps.forEach((step) => {
    const stepIndex = order.indexOf(step.dataset.progressStep);
    step.classList.toggle('is-active', stepIndex === activeIndex);
    step.classList.toggle('is-complete', stepIndex >= 0 && stepIndex < activeIndex);
  });

  summaryNextButton?.classList.toggle('is-visible', screenName === 'details');
}

function getBookingState() {
  refreshEditableData();
  const selectedPackage = getSelectedPackage();
  const selectedProfessional = professionals.find((professional) => professional.id === getSelectedValue('professional')) ?? professionals[0] ?? defaultProfessionals[0];
  const appointmentDate = appointmentDateInput?.value || selectedAppointmentDate;
  const period = getSelectedValue('period') ?? '09:00';
  const clientName = clientNameInput?.value.trim() || 'Cliente';
  const notes = clientNotesInput?.value.trim();

  return {
    selectedPackage,
    selectedProfessional,
    appointmentDate,
    period,
    clientName,
    notes,
  };
}

function getBookingTypeLabel(type) {
  const labels = {
    combo: 'Combo pronto',
    custom: 'Combo personalizado',
  };

  return labels[type] ?? labels.combo;
}

function buildMessage() {
  const { selectedPackage, selectedProfessional, appointmentDate, period, clientName, notes } = getBookingState();
  const settings = readObject(storageKeys.siteSettings, defaultSiteSettings);
  const lines = [
    `Olá, sou ${clientName}. Quero agendar pelo site do ${settings.brandName}.`,
    `Escolha: ${selectedPackage.name} (${selectedPackage.duration}, ${selectedPackage.price}).`,
    `Itens: ${selectedPackage.items.join(' + ')}.`,
    `Profissional: ${selectedProfessional.name}.`,
    `Data preferida: ${formatShortDate(appointmentDate)}.`,
    `Horário preferido: ${period}.`,
  ];

  if (notes) {
    lines.push(`Observação: ${notes}.`);
  }

  return lines.join('\n');
}

function updateSummary() {
  updateBookingPanels();

  if (!summaryTitle || !summaryCopy || !messagePreview) {
    return;
  }

  const { selectedPackage, selectedProfessional, appointmentDate, period } = getBookingState();
  summaryTitle.textContent = `${selectedPackage.name} com ${selectedProfessional.name}`;
  summaryCopy.textContent = `${selectedPackage.price} • ${formatShortDate(appointmentDate)} • ${period}`;
  messagePreview.textContent = buildMessage();
}

function saveDemand() {
  const { selectedPackage, selectedProfessional, appointmentDate, period, clientName, notes } = getBookingState();
  const demands = readCollection(storageKeys.demands, []);
  const now = new Date().toISOString();

  demands.push({
    id: `demand-${Date.now()}`,
    clientName,
    serviceId: selectedPackage.id,
    serviceName: selectedPackage.name,
    serviceDuration: selectedPackage.duration,
    servicePrice: selectedPackage.price,
    serviceItems: selectedPackage.items,
    bookingType: selectedPackage.bookingType,
    professionalId: selectedProfessional.id,
    professionalName: selectedProfessional.name,
    appointmentDate,
    period,
    notes,
    status: 'novo',
    adminNote: '',
    createdAt: now,
    updatedAt: now,
  });

  writeCollection(storageKeys.demands, demands);
}

function openWhatsApp() {
  whatsappPhone = normalizeWhatsapp(readObject(storageKeys.siteSettings, defaultSiteSettings).whatsappNumber);
  const message = encodeURIComponent(buildMessage());
  const url = `https://wa.me/${whatsappPhone}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

ensureSeedData();
applySiteSettings();
renderOptions();
renderCalendar();
showBookingScreen('details');
showMainPage(getPageFromHash(window.location.hash), false);
updateSummary();

bookingForm?.addEventListener('input', updateSummary);
bookingForm?.addEventListener('change', (event) => {
  updateSummary();
});

scheduler?.addEventListener('click', (event) => {
  const nextButton = event.target.closest('[data-next-screen]');
  const prevButton = event.target.closest('[data-prev-screen]');
  const calendarDateButton = event.target.closest('[data-calendar-date]');
  const calendarPrevButton = event.target.closest('[data-calendar-prev]');
  const calendarNextButton = event.target.closest('[data-calendar-next]');

  if (calendarDateButton) {
    selectedAppointmentDate = calendarDateButton.dataset.calendarDate;
    renderCalendar();
    updateSummary();
  }

  if (calendarPrevButton && !calendarPrevButton.disabled) {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    renderCalendar();
  }

  if (calendarNextButton) {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    renderCalendar();
  }

  if (nextButton) {
    showBookingScreen(nextButton.dataset.nextScreen);
  }

  if (prevButton) {
    showBookingScreen(prevButton.dataset.prevScreen);
  }
});
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  updateSummary();
  saveDemand();
  openWhatsApp();
});

window.addEventListener('storage', () => {
  applySiteSettings();
  renderOptions();
  renderProfessionalShowcase();
  updateSummary();
});

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});
