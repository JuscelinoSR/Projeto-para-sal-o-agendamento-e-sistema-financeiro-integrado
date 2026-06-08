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

let services = readCollection(storageKeys.services, defaultServices);
let professionals = readCollection(storageKeys.professionals, defaultProfessionals);

const whatsappPhone = '5564999625616';
const serviceOptions = document.querySelector('[data-service-options]');
const professionalOptions = document.querySelector('[data-professional-options]');
const bookingForm = document.querySelector('[data-booking-form]');
const summaryTitle = document.querySelector('[data-summary-title]');
const summaryCopy = document.querySelector('[data-summary-copy]');
const messagePreview = document.querySelector('[data-message-preview]');
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

function renderOptions() {
  refreshEditableData();

  if (serviceOptions) {
    serviceOptions.innerHTML = services
      .map((service, index) => `
        <label class="choice-card">
          <input type="radio" name="service" value="${service.id}" ${index === 0 ? 'checked' : ''}>
          <span>
            <strong>${service.name}</strong>
            <small>${service.duration} • ${service.price}</small>
          </span>
        </label>
      `)
      .join('');
  }

  if (professionalOptions) {
    professionalOptions.innerHTML = professionals
      .map((professional, index) => `
        <label class="choice-card">
          <input type="radio" name="professional" value="${professional.id}" ${index === 0 ? 'checked' : ''}>
          <span>
            <strong>${professional.name}</strong>
            <small>${professional.specialty}</small>
          </span>
        </label>
      `)
      .join('');
  }
}

function getSelectedValue(name) {
  return bookingForm?.querySelector(`input[name="${name}"]:checked`)?.value;
}

function getBookingState() {
  refreshEditableData();
  const selectedService = services.find((service) => service.id === getSelectedValue('service')) ?? services[0] ?? defaultServices[0];
  const selectedProfessional = professionals.find((professional) => professional.id === getSelectedValue('professional')) ?? professionals[0] ?? defaultProfessionals[0];
  const period = getSelectedValue('period') ?? 'Manhã';
  const clientName = clientNameInput?.value.trim() || 'Cliente';
  const notes = clientNotesInput?.value.trim();

  return {
    selectedService,
    selectedProfessional,
    period,
    clientName,
    notes,
  };
}

function buildMessage() {
  const { selectedService, selectedProfessional, period, clientName, notes } = getBookingState();
  const lines = [
    `Olá, sou ${clientName}. Quero agendar pelo BeautyJSR Agenda.`,
    `Serviço: ${selectedService.name} (${selectedService.duration}, ${selectedService.price}).`,
    `Profissional: ${selectedProfessional.name}.`,
    `Período preferido: ${period}.`,
  ];

  if (notes) {
    lines.push(`Observação: ${notes}.`);
  }

  return lines.join('\n');
}

function updateSummary() {
  if (!summaryTitle || !summaryCopy || !messagePreview) {
    return;
  }

  const { selectedService, selectedProfessional, period } = getBookingState();
  summaryTitle.textContent = `${selectedService.name} com ${selectedProfessional.name}`;
  summaryCopy.textContent = `${selectedService.duration} • ${selectedService.price} • ${period}`;
  messagePreview.textContent = buildMessage();
}

function saveDemand() {
  const { selectedService, selectedProfessional, period, clientName, notes } = getBookingState();
  const demands = readCollection(storageKeys.demands, []);
  const now = new Date().toISOString();

  demands.push({
    id: `demand-${Date.now()}`,
    clientName,
    serviceId: selectedService.id,
    serviceName: selectedService.name,
    serviceDuration: selectedService.duration,
    servicePrice: selectedService.price,
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
bookingForm?.addEventListener('change', updateSummary);
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