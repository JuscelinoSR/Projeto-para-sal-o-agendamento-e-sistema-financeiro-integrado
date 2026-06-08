const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const header = document.querySelector('[data-elevate]');

const storageKeys = {
  services: 'beautyjsr.services',
  professionals: 'beautyjsr.professionals',
  demands: 'beautyjsr.demands',
};

const defaultServices = [
  {
    id: 'corte-escova',
    name: 'Corte + escova',
    duration: '60 min',
    price: 'R$ 120',
  },
  {
    id: 'design-unhas',
    name: 'Design de unhas',
    duration: '90 min',
    price: 'R$ 95',
  },
  {
    id: 'hidratacao',
    name: 'Hidratação capilar',
    duration: '75 min',
    price: 'R$ 140',
  },
];

const defaultProfessionals = [
  {
    id: 'ana-souza',
    name: 'Ana Souza',
    specialty: 'Cabelos e finalização',
  },
  {
    id: 'beatriz-lima',
    name: 'Beatriz Lima',
    specialty: 'Unhas e spa das mãos',
  },
  {
    id: 'clara-mendes',
    name: 'Clara Mendes',
    specialty: 'Tratamentos capilares',
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

const whatsappPhone = '5564999625616';
const serviceOptions = document.querySelector('[data-service-options]');
const comboOptions = document.querySelector('[data-combo-options]');
const customServiceOptions = document.querySelector('[data-custom-service-options]');
const bookingPanels = document.querySelectorAll('[data-booking-panel]');
const bookingScreens = document.querySelectorAll('[data-booking-screen]');
const screenTitle = document.querySelector('[data-screen-title]');
const bookingForm = document.querySelector('[data-booking-form]');
const summaryTitle = document.querySelector('[data-summary-title]');
const summaryCopy = document.querySelector('[data-summary-copy]');
const messagePreview = document.querySelector('[data-message-preview]');
const professionalOptions = document.querySelector('[data-professional-options]');
const clientNameInput = document.querySelector('[data-client-name]');
const clientNotesInput = document.querySelector('[data-client-notes]');

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

function ensureSeedData() {
  if (!localStorage.getItem(storageKeys.services)) {
    writeCollection(storageKeys.services, defaultServices);
  }

  if (!localStorage.getItem(storageKeys.professionals)) {
    writeCollection(storageKeys.professionals, defaultProfessionals);
  }
}

function refreshEditableData() {
  services = readCollection(storageKeys.services, defaultServices);
  professionals = readCollection(storageKeys.professionals, defaultProfessionals);
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

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
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
        type: 'radio',
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

function getBookingType() {
  return getSelectedValue('bookingType') ?? 'individual';
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

  const selectedService = services.find((service) => service.id === getSelectedValue('service')) ?? services[0] ?? defaultServices[0];
  return {
    bookingType,
    id: selectedService.id,
    name: selectedService.name,
    duration: selectedService.duration,
    price: selectedService.price,
    items: [selectedService.name],
  };
}

function updateBookingPanels() {
  const bookingType = getBookingType();
  bookingPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.bookingPanel === bookingType);
  });

  if (screenTitle) {
    screenTitle.textContent = {
      individual: 'Serviços disponíveis',
      combo: 'Combos prontos',
      custom: 'Monte seu combo',
    }[bookingType] ?? 'Serviços disponíveis';
  }
}

function showBookingScreen(screenName) {
  bookingScreens.forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.bookingScreen === screenName);
  });
}

function getBookingState() {
  refreshEditableData();
  const selectedPackage = getSelectedPackage();
  const selectedProfessional = professionals.find((professional) => professional.id === getSelectedValue('professional')) ?? professionals[0] ?? defaultProfessionals[0];
  const period = getSelectedValue('period') ?? 'Manhã';
  const clientName = clientNameInput?.value.trim() || 'Cliente';
  const notes = clientNotesInput?.value.trim();

  return {
    selectedPackage,
    selectedProfessional,
    period,
    clientName,
    notes,
  };
}

function getBookingTypeLabel(type) {
  const labels = {
    individual: 'Serviço individual',
    combo: 'Combo pronto',
    custom: 'Combo personalizado',
  };

  return labels[type] ?? labels.individual;
}

function buildMessage() {
  const { selectedPackage, selectedProfessional, period, clientName, notes } = getBookingState();
  const lines = [
    `Olá, sou ${clientName}. Quero agendar pelo BeautyJSR Agenda.`,
    `Tipo: ${getBookingTypeLabel(selectedPackage.bookingType)}.`,
    `Escolha: ${selectedPackage.name} (${selectedPackage.duration}, ${selectedPackage.price}).`,
    `Itens: ${selectedPackage.items.join(' + ')}.`,
    `Profissional: ${selectedProfessional.name}.`,
    `Período preferido: ${period}.`,
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

  const { selectedPackage, selectedProfessional, period } = getBookingState();
  summaryTitle.textContent = `${selectedPackage.name} com ${selectedProfessional.name}`;
  summaryCopy.textContent = `${getBookingTypeLabel(selectedPackage.bookingType)} • ${selectedPackage.price} • ${period}`;
  messagePreview.textContent = buildMessage();
}

function saveDemand() {
  const { selectedPackage, selectedProfessional, period, clientName, notes } = getBookingState();
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
  const message = encodeURIComponent(buildMessage());
  const url = `https://wa.me/${whatsappPhone}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

ensureSeedData();
renderOptions();
updateSummary();

bookingForm?.addEventListener('input', updateSummary);
bookingForm?.addEventListener('change', (event) => {
  updateSummary();

  if (event.target.matches('input[name="bookingType"]')) {
    showBookingScreen('details');
  }
});

bookingForm?.addEventListener('click', (event) => {
  const typeTab = event.target.closest('.booking-tab');
  const nextButton = event.target.closest('[data-next-screen]');
  const prevButton = event.target.closest('[data-prev-screen]');

  if (typeTab) {
    const input = typeTab.querySelector('input[name="bookingType"]');
    if (input) {
      input.checked = true;
      updateSummary();
      showBookingScreen('details');
    }
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
  renderOptions();
  updateSummary();
});

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});