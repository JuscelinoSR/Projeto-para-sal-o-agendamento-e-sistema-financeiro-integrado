const storageKeys = {
  services: 'beautyjsr.services',
  professionals: 'beautyjsr.professionals',
  demands: 'beautyjsr.demands',
  siteSettings: 'beautyjsr.siteSettings',
  serviceCatalogVersion: 'beautyjsr.serviceCatalogVersion',
  transactions: 'beautyjsr.transactions',
  siteSync: 'beautyjsr.siteSync',
};

const defaultServices = [
  { id: 'corte-feminino', name: 'Corte feminino', duration: '50 min', price: 'R$ 90' },
  { id: 'escova-modelada', name: 'Escova modelada', duration: '45 min', price: 'R$ 75' },
  { id: 'corte-escova', name: 'Corte + escova', duration: '80 min', price: 'R$ 140' },
  { id: 'hidratacao-capilar', name: 'Hidratação capilar', duration: '60 min', price: 'R$ 120' },
  { id: 'reconstrucao-capilar', name: 'Reconstrução capilar', duration: '90 min', price: 'R$ 180' },
  { id: 'coloracao-raiz', name: 'Coloração de raiz', duration: '120 min', price: 'R$ 190' },
  { id: 'mechas-iluminadas', name: 'Mechas iluminadas', duration: '210 min', price: 'R$ 420' },
  { id: 'tonalizacao', name: 'Tonalização', duration: '75 min', price: 'R$ 150' },
  { id: 'penteado-evento', name: 'Penteado para evento', duration: '90 min', price: 'R$ 180' },
  { id: 'manicure', name: 'Manicure', duration: '45 min', price: 'R$ 45' },
  { id: 'pedicure', name: 'Pedicure', duration: '50 min', price: 'R$ 55' },
  { id: 'manicure-pedicure', name: 'Manicure + pedicure', duration: '90 min', price: 'R$ 95' },
  { id: 'alongamento-unhas', name: 'Alongamento de unhas', duration: '150 min', price: 'R$ 180' },
  { id: 'design-sobrancelhas', name: 'Design de sobrancelhas', duration: '35 min', price: 'R$ 55' },
  { id: 'maquiagem-social', name: 'Maquiagem social', duration: '75 min', price: 'R$ 160' },
  { id: 'depilacao-facial', name: 'Depilação facial', duration: '30 min', price: 'R$ 60' },
  { id: 'limpeza-pele', name: 'Limpeza de pele', duration: '90 min', price: 'R$ 170' },
];

const defaultProfessionals = [
  { id: 'ana-souza', name: 'Ana Souza', specialty: 'Cabelos e finalização', linkUrl: '' },
  { id: 'beatriz-lima', name: 'Beatriz Lima', specialty: 'Unhas e spa das mãos', linkUrl: '' },
  { id: 'clara-mendes', name: 'Clara Mendes', specialty: 'Tratamentos capilares', linkUrl: '' },
];

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

const statusLabels = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const demandList = document.querySelector('[data-demand-list]');
const serviceList = document.querySelector('[data-service-list]');
const professionalList = document.querySelector('[data-professional-list]');
const transactionList = document.querySelector('[data-transaction-list]');
const serviceForm = document.querySelector('[data-service-form]');
const professionalForm = document.querySelector('[data-professional-form]');
const professionalLinkField = document.querySelector('[data-professional-link-field]');
const addProfessionalLinkButton = document.querySelector('[data-add-professional-link]');
const manualBookingForm = document.querySelector('[data-manual-booking-form]');
const transactionForm = document.querySelector('[data-transaction-form]');
const statusFilter = document.querySelector('[data-status-filter]');
const professionalFilter = document.querySelector('[data-professional-filter]');
const searchFilter = document.querySelector('[data-search-filter]');
const exportButton = document.querySelector('[data-export]');
const clearButton = document.querySelector('[data-clear-demo]');
const syncSiteButton = document.querySelector('[data-sync-site]');
const syncMessage = document.querySelector('[data-sync-message]');
const siteSettingsForm = document.querySelector('[data-site-settings-form]');
const siteImageInput = document.querySelector('[data-site-image-input]');
const galleryInput = document.querySelector('[data-gallery-input]');
const galleryPreview = document.querySelector('[data-gallery-preview]');
const siteResetButton = document.querySelector('[data-site-reset]');
const siteSettingsMessage = document.querySelector('[data-site-settings-message]');
const sitePreview = document.querySelector('[data-site-preview]');
const previewBadge = document.querySelector('[data-preview-badge]');
const previewTitle = document.querySelector('[data-preview-title]');
const previewSubtitle = document.querySelector('[data-preview-subtitle]');
const manualServiceSelect = document.querySelector('[data-manual-service]');
const manualProfessionalSelect = document.querySelector('[data-manual-professional]');
const tabButtons = document.querySelectorAll('[data-admin-tab]');
const tabPanels = document.querySelectorAll('[data-tab-panel]');
const tabTitle = document.querySelector('[data-tab-title]');

const tabTitles = {
  dashboard: 'Dashboard do salão',
  agenda: 'Agenda de atendimentos',
  catalogo: 'Catálogo e equipe',
  financeiro: 'Financeiro',
  personalizar: 'Personalização do site',
};

let pendingBackgroundImage = '';
let pendingGalleryImages = [];

function readCollection(key, fallback = []) {
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

function readObject(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    return value && typeof value === 'object' && !Array.isArray(value) ? { ...fallback, ...value } : fallback;
  } catch {
    return fallback;
  }
}

function writeObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getServices() {
  return readCollection(storageKeys.services, defaultServices);
}

function getProfessionals() {
  return readCollection(storageKeys.professionals, defaultProfessionals);
}

function getDemands() {
  return readCollection(storageKeys.demands, []);
}

function getTransactions() {
  return readCollection(storageKeys.transactions, []);
}

function getSiteSettings() {
  return readObject(storageKeys.siteSettings, defaultSiteSettings);
}

function mergeMissingItems(currentItems, defaults) {
  const existingIds = new Set(currentItems.map((item) => item.id));
  return [...currentItems, ...defaults.filter((item) => !existingIds.has(item.id))];
}

function ensureSeedData() {
  const catalogVersion = '2026-06-salao-completo';
  const storedServices = readCollection(storageKeys.services, []);
  const storedProfessionals = readCollection(storageKeys.professionals, []);
  const shouldRefreshServices = !storedServices.length || localStorage.getItem(storageKeys.serviceCatalogVersion) !== catalogVersion;

  if (shouldRefreshServices) {
    writeCollection(storageKeys.services, mergeMissingItems(storedServices, defaultServices));
    localStorage.setItem(storageKeys.serviceCatalogVersion, catalogVersion);
  }

  if (!storedProfessionals.length) {
    writeCollection(storageKeys.professionals, defaultProfessionals);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `item-${Date.now()}`;
}

function createUniqueId(value, items) {
  const baseId = slugify(value);
  const existingIds = new Set(items.map((item) => item.id));
  if (!existingIds.has(baseId)) return baseId;

  let index = 2;
  let nextId = `${baseId}-${index}`;
  while (existingIds.has(nextId)) {
    index += 1;
    nextId = `${baseId}-${index}`;
  }
  return nextId;
}

function normalizeProfessionalLink(value) {
  const link = String(value ?? '').trim();
  if (!link) return '';

  if (link.startsWith('@')) {
    return `https://www.instagram.com/${link.slice(1).replace(/^\/+|\/+$/g, '')}/`;
  }

  const phone = link.replace(/\D/g, '');
  if (phone.length >= 10 && phone.length <= 14 && !/[a-z]/i.test(link)) {
    return `https://wa.me/${phone}`;
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(link)) return link;
  return `https://${link.replace(/^\/+/, '')}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMoney(value) {
  const normalized = String(value ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return currency.format(value || 0);
}

function formatDate(value) {
  if (!value) return 'Sem data';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function formatAppointmentDate(value) {
  if (!value) return 'Não informada';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(year, month - 1, day));
}

function getBookingTypeLabel(type) {
  return { combo: 'Combo pronto', custom: 'Combo personalizado', manual: 'Cadastro manual' }[type] ?? 'Combo pronto';
}

function updateMetrics() {
  const demands = getDemands();
  const revenue = demands
    .filter((item) => ['confirmado', 'concluido'].includes(item.status))
    .reduce((sum, item) => sum + parseMoney(item.servicePrice), 0);

  document.querySelector('[data-metric-total]').textContent = demands.length;
  document.querySelector('[data-metric-new]').textContent = demands.filter((item) => item.status === 'novo').length;
  document.querySelector('[data-metric-confirmed]').textContent = demands.filter((item) => item.status === 'confirmado').length;
  document.querySelector('[data-metric-revenue]').textContent = formatMoney(revenue);
}

function renderProfessionalFilters() {
  const options = ['<option value="todos">Todos</option>']
    .concat(getProfessionals().map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join('');

  if (professionalFilter) professionalFilter.innerHTML = options;
  if (manualProfessionalSelect) {
    manualProfessionalSelect.innerHTML = getProfessionals()
      .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} - ${escapeHtml(item.specialty)}</option>`)
      .join('');
  }
}

function renderManualServiceOptions() {
  if (!manualServiceSelect) return;
  manualServiceSelect.innerHTML = getServices()
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} - ${escapeHtml(item.price)}</option>`)
    .join('');
}

function renderDemandItems(demand) {
  if (!Array.isArray(demand.serviceItems) || !demand.serviceItems.length) return '';
  return `<p><strong>Itens:</strong> ${escapeHtml(demand.serviceItems.join(' + '))}</p>`;
}

function getFilteredDemands() {
  const selectedStatus = statusFilter?.value ?? 'todos';
  const selectedProfessional = professionalFilter?.value ?? 'todos';
  const query = (searchFilter?.value ?? '').trim().toLowerCase();

  return getDemands()
    .filter((demand) => selectedStatus === 'todos' || demand.status === selectedStatus)
    .filter((demand) => selectedProfessional === 'todos' || demand.professionalId === selectedProfessional)
    .filter((demand) => {
      if (!query) return true;
      return [demand.clientName, demand.serviceName, demand.professionalName, demand.notes]
        .join(' ')
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => new Date(a.appointmentDate || a.createdAt) - new Date(b.appointmentDate || b.createdAt));
}

function renderDemands() {
  if (!demandList) return;

  const demands = getFilteredDemands();
  if (!demands.length) {
    demandList.innerHTML = '<div class="empty-state">Nenhum agendamento encontrado. Crie um agendamento manual ou use o fluxo do site.</div>';
    return;
  }

  demandList.innerHTML = demands.map((demand) => `
    <article class="demand-card" data-demand-id="${escapeHtml(demand.id)}">
      <div class="demand-top">
        <div>
          <h3>${escapeHtml(demand.clientName || 'Cliente sem nome')}</h3>
          <small>Criado em ${escapeHtml(formatDate(demand.createdAt))}</small>
        </div>
        <span class="status-pill ${escapeHtml(demand.status)}">${statusLabels[demand.status] ?? demand.status}</span>
      </div>
      <div class="demand-meta">
        <p><strong>Tipo:</strong> ${escapeHtml(getBookingTypeLabel(demand.bookingType))}</p>
        <p><strong>Serviço:</strong> ${escapeHtml(demand.serviceName)} - ${escapeHtml(demand.servicePrice)}</p>
        <p><strong>Profissional:</strong> ${escapeHtml(demand.professionalName)}</p>
        <p><strong>Data:</strong> ${escapeHtml(formatAppointmentDate(demand.appointmentDate))}</p>
        <p><strong>Período:</strong> ${escapeHtml(demand.period)}</p>
        <p><strong>Duração:</strong> ${escapeHtml(demand.serviceDuration || 'Não informada')}</p>
      </div>
      ${renderDemandItems(demand)}
      <p><strong>Observação:</strong> ${escapeHtml(demand.notes || 'Sem observação')}</p>
      <div class="demand-controls">
        <label>Status
          <select data-demand-status>
            ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${demand.status === value ? 'selected' : ''}>${label}</option>`).join('')}
          </select>
        </label>
        <label>Nota interna
          <textarea data-demand-admin-note placeholder="Ex.: cliente prefere sábado">${escapeHtml(demand.adminNote || '')}</textarea>
        </label>
      </div>
      <div class="card-actions">
        <button class="button primary small" type="button" data-demand-save>Salvar</button>
        <button class="button secondary small" type="button" data-demand-confirm>Confirmar</button>
        <button class="button danger small" type="button" data-demand-delete>Excluir</button>
      </div>
    </article>
  `).join('');
}

function renderEditableList(listElement, items, type) {
  if (!listElement) return;
  if (!items.length) {
    listElement.innerHTML = '<div class="empty-state">Nenhum item cadastrado.</div>';
    return;
  }

  listElement.innerHTML = items.map((item) => `
    <article class="admin-item" data-item-id="${escapeHtml(item.id)}">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${type === 'service' ? `${escapeHtml(item.duration)} - ${escapeHtml(item.price)}` : escapeHtml(item.specialty)}</small>
        ${type === 'professional' && item.linkUrl ? `<small>${escapeHtml(item.linkUrl)}</small>` : ''}
      </div>
      <div class="item-actions">
        <button class="button secondary small" type="button" data-edit-${type}>Editar</button>
        <button class="button danger small" type="button" data-delete-${type}>Excluir</button>
      </div>
    </article>
  `).join('');
}

function renderServices() {
  renderEditableList(serviceList, getServices(), 'service');
  renderManualServiceOptions();
}

function renderProfessionals() {
  renderEditableList(professionalList, getProfessionals(), 'professional');
  renderProfessionalFilters();
}

function renderTransactions() {
  if (!transactionList) return;
  const transactions = getTransactions().sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!transactions.length) {
    transactionList.innerHTML = '<div class="empty-state">Nenhum lançamento financeiro manual cadastrado.</div>';
  } else {
    transactionList.innerHTML = transactions.map((item) => `
      <article class="admin-item" data-transaction-id="${escapeHtml(item.id)}">
        <div>
          <strong>${escapeHtml(item.description)}</strong>
          <small>${item.type === 'income' ? 'Entrada' : 'Saída'} - ${escapeHtml(item.date)}</small>
        </div>
        <div class="item-actions">
          <strong>${formatMoney(item.amount)}</strong>
          <button class="button danger small" type="button" data-delete-transaction>Excluir</button>
        </div>
      </article>
    `).join('');
  }

  const totals = transactions.reduce((acc, item) => {
    acc[item.type] += Number(item.amount) || 0;
    return acc;
  }, { income: 0, expense: 0 });

  document.querySelector('[data-finance-income]').textContent = formatMoney(totals.income);
  document.querySelector('[data-finance-expense]').textContent = formatMoney(totals.expense);
  document.querySelector('[data-finance-balance]').textContent = formatMoney(totals.income - totals.expense);
}

function setSiteMessage(message, type = 'success') {
  if (!siteSettingsMessage) return;
  siteSettingsMessage.textContent = message;
  siteSettingsMessage.dataset.type = type;
}

function setSyncMessage(message, type = 'success') {
  if (!syncMessage) return;
  syncMessage.textContent = message;
  syncMessage.dataset.type = type;
}

function applyPreview(settings) {
  if (siteSettingsForm) {
    siteSettingsForm.elements.brandName.value = settings.brandName;
    siteSettingsForm.elements.heroBadge.value = settings.heroBadge;
    siteSettingsForm.elements.heroTitle.value = settings.heroTitle;
    siteSettingsForm.elements.heroSubtitle.value = settings.heroSubtitle;
    siteSettingsForm.elements.ctaText.value = settings.ctaText;
    siteSettingsForm.elements.instagramUrl.value = settings.instagramUrl || '';
    siteSettingsForm.elements.facebookUrl.value = settings.facebookUrl || '';
    siteSettingsForm.elements.tiktokUrl.value = settings.tiktokUrl || '';
    siteSettingsForm.elements.whatsappNumber.value = settings.whatsappNumber || '';
  }

  if (sitePreview) {
    sitePreview.style.backgroundImage = `linear-gradient(90deg, rgba(47, 37, 32, 0.58), rgba(47, 37, 32, 0.08)), url("${settings.backgroundImage}")`;
  }

  pendingGalleryImages = Array.isArray(settings.galleryImages) ? settings.galleryImages : [];
  renderGalleryPreview();

  if (previewBadge) previewBadge.textContent = settings.heroBadge;
  if (previewTitle) previewTitle.textContent = settings.heroTitle;
  if (previewSubtitle) previewSubtitle.textContent = settings.heroSubtitle;
}

function loadSiteSettingsEditor() {
  const settings = getSiteSettings();
  pendingBackgroundImage = settings.backgroundImage;
  pendingGalleryImages = Array.isArray(settings.galleryImages) ? settings.galleryImages : [];
  applyPreview(settings);
}

function getSiteSettingsFromEditor() {
  if (!siteSettingsForm) {
    return getSiteSettings();
  }

  return {
    ...defaultSiteSettings,
    ...Object.fromEntries(new FormData(siteSettingsForm)),
    backgroundImage: pendingBackgroundImage || getSiteSettings().backgroundImage || defaultSiteSettings.backgroundImage,
    galleryImages: pendingGalleryImages,
    updatedAt: new Date().toISOString(),
  };
}

function renderGalleryPreview() {
  if (!galleryPreview) return;

  if (!pendingGalleryImages.length) {
    galleryPreview.innerHTML = '<p class="form-hint">Nenhuma foto enviada ainda.</p>';
    return;
  }

  galleryPreview.innerHTML = pendingGalleryImages
    .slice(0, 6)
    .map((src) => `<img src="${src}" alt="Prévia de trabalho do salão">`)
    .join('');
}

function saveCatalogDrafts() {
  if (serviceForm) {
    const data = new FormData(serviceForm);
    const name = data.get('name')?.trim();
    const duration = data.get('duration')?.trim();
    const price = data.get('price')?.trim();

    if (name && duration && price) {
      upsertItem(storageKeys.services, {
        id: data.get('id') || slugify(name),
        name,
        duration,
        price,
      });
    }
  }

  if (professionalForm) {
    const data = new FormData(professionalForm);
    const name = data.get('name')?.trim();
    const specialty = data.get('specialty')?.trim();
    const linkUrl = normalizeProfessionalLink(data.get('linkUrl'));

    if (name && specialty) {
      const professionals = getProfessionals();
      upsertItem(storageKeys.professionals, {
        id: data.get('id') || createUniqueId(name, professionals),
        name,
        specialty,
        linkUrl,
      });
    }
  }
}

function renderAll() {
  updateMetrics();
  renderServices();
  renderProfessionals();
  renderDemands();
  renderTransactions();
  loadSiteSettingsEditor();
}

function activateTab(tabName) {
  const nextTab = tabTitles[tabName] ? tabName : 'dashboard';

  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.adminTab === nextTab);
    button.setAttribute('aria-selected', button.dataset.adminTab === nextTab ? 'true' : 'false');
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.tabPanel === nextTab);
  });

  if (tabTitle) {
    tabTitle.textContent = tabTitles[nextTab];
  }
}

function upsertItem(key, item) {
  const items = readCollection(key, []);
  const index = items.findIndex((current) => current.id === item.id);
  if (index >= 0) items[index] = item;
  else items.push(item);
  writeCollection(key, items);
}

function deleteItem(key, id) {
  writeCollection(key, readCollection(key, []).filter((item) => item.id !== id));
}

function resetForm(form) {
  form?.reset();
  if (form?.elements.id) form.elements.id.value = '';
  if (form === professionalForm) {
    professionalLinkField?.classList.add('is-hidden');
    if (addProfessionalLinkButton) addProfessionalLinkButton.textContent = 'Adicionar link';
  }
}

function saveDemandChanges(card, nextStatus) {
  const demands = getDemands();
  const demand = demands.find((item) => item.id === card.dataset.demandId);
  if (!demand) return;

  demand.status = nextStatus || card.querySelector('[data-demand-status]').value;
  demand.adminNote = card.querySelector('[data-demand-admin-note]').value.trim();
  demand.updatedAt = new Date().toISOString();
  writeCollection(storageKeys.demands, demands);
  renderAll();
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
    image.src = src;
  });
}

async function compressImage(file) {
  const dataUrl = await readImageFile(file);
  const image = await loadImage(dataUrl);
  const maxSize = 1800;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

serviceForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(serviceForm);
  const name = data.get('name').trim();
  const id = data.get('id') || slugify(name);
  upsertItem(storageKeys.services, {
    id,
    name,
    duration: data.get('duration').trim(),
    price: data.get('price').trim(),
  });
  resetForm(serviceForm);
  renderAll();
});

professionalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(professionalForm);
  const name = data.get('name').trim();
  const professionals = getProfessionals();
  const id = data.get('id') || createUniqueId(name, professionals);
  upsertItem(storageKeys.professionals, {
    id,
    name,
    specialty: data.get('specialty').trim(),
    linkUrl: normalizeProfessionalLink(data.get('linkUrl')),
  });
  resetForm(professionalForm);
  renderAll();
});

manualBookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(manualBookingForm);
  const service = getServices().find((item) => item.id === data.get('serviceId'));
  const professional = getProfessionals().find((item) => item.id === data.get('professionalId'));
  const now = new Date().toISOString();
  const demands = getDemands();

  demands.push({
    id: `demand-${Date.now()}`,
    clientName: data.get('clientName').trim(),
    serviceId: service?.id ?? '',
    serviceName: service?.name ?? 'Serviço manual',
    serviceDuration: service?.duration ?? '',
    servicePrice: service?.price ?? 'R$ 0',
    serviceItems: [],
    bookingType: 'manual',
    professionalId: professional?.id ?? '',
    professionalName: professional?.name ?? 'Profissional',
    appointmentDate: data.get('appointmentDate'),
    period: data.get('period'),
    notes: data.get('notes').trim(),
    status: 'novo',
    adminNote: '',
    createdAt: now,
    updatedAt: now,
  });

  writeCollection(storageKeys.demands, demands);
  manualBookingForm.reset();
  renderAll();
});

transactionForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(transactionForm);
  const transactions = getTransactions();
  transactions.push({
    id: `transaction-${Date.now()}`,
    type: data.get('type'),
    description: data.get('description').trim(),
    amount: Number(data.get('amount')) || 0,
    date: data.get('date'),
    createdAt: new Date().toISOString(),
  });
  writeCollection(storageKeys.transactions, transactions);
  transactionForm.reset();
  renderTransactions();
});

document.querySelector('[data-service-cancel]')?.addEventListener('click', () => resetForm(serviceForm));
document.querySelector('[data-professional-cancel]')?.addEventListener('click', () => resetForm(professionalForm));
[statusFilter, professionalFilter, searchFilter].forEach((element) => element?.addEventListener('input', renderDemands));

addProfessionalLinkButton?.addEventListener('click', () => {
  professionalLinkField?.classList.remove('is-hidden');
  addProfessionalLinkButton.textContent = 'Link liberado';
  professionalForm?.elements.linkUrl?.focus();
});

document.addEventListener('click', (event) => {
  const tabButton = event.target.closest('[data-admin-tab]');
  if (tabButton) {
    activateTab(tabButton.dataset.adminTab);
  }

  const openTabButton = event.target.closest('[data-open-tab]');
  if (openTabButton) {
    activateTab(openTabButton.dataset.openTab);
  }

  const demandCard = event.target.closest('[data-demand-id]');
  if (event.target.matches('[data-demand-save]') && demandCard) saveDemandChanges(demandCard);
  if (event.target.matches('[data-demand-confirm]') && demandCard) saveDemandChanges(demandCard, 'confirmado');
  if (event.target.matches('[data-demand-delete]') && demandCard) {
    writeCollection(storageKeys.demands, getDemands().filter((item) => item.id !== demandCard.dataset.demandId));
    renderAll();
  }

  const serviceItem = event.target.closest('[data-item-id]');
  if (event.target.matches('[data-edit-service]') && serviceItem) {
    const item = getServices().find((service) => service.id === serviceItem.dataset.itemId);
    if (item) {
      serviceForm.elements.id.value = item.id;
      serviceForm.elements.name.value = item.name;
      serviceForm.elements.duration.value = item.duration;
      serviceForm.elements.price.value = item.price;
      serviceForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  if (event.target.matches('[data-delete-service]') && serviceItem) {
    deleteItem(storageKeys.services, serviceItem.dataset.itemId);
    renderAll();
  }

  const professionalItem = event.target.closest('[data-item-id]');
  if (event.target.matches('[data-edit-professional]') && professionalItem) {
    const item = getProfessionals().find((professional) => professional.id === professionalItem.dataset.itemId);
    if (item) {
      professionalForm.elements.id.value = item.id;
      professionalForm.elements.name.value = item.name;
      professionalForm.elements.specialty.value = item.specialty;
      professionalForm.elements.linkUrl.value = item.linkUrl || '';
      if (item.linkUrl) {
        professionalLinkField?.classList.remove('is-hidden');
        if (addProfessionalLinkButton) addProfessionalLinkButton.textContent = 'Link liberado';
      }
      professionalForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  if (event.target.matches('[data-delete-professional]') && professionalItem) {
    deleteItem(storageKeys.professionals, professionalItem.dataset.itemId);
    renderAll();
  }

  const transactionItem = event.target.closest('[data-transaction-id]');
  if (event.target.matches('[data-delete-transaction]') && transactionItem) {
    deleteItem(storageKeys.transactions, transactionItem.dataset.transactionId);
    renderTransactions();
  }
});

exportButton?.addEventListener('click', () => {
  const payload = {
    services: getServices(),
    professionals: getProfessionals(),
    demands: getDemands(),
    transactions: getTransactions(),
    siteSettings: getSiteSettings(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'beautyjsr-admin-export.json';
  link.click();
  URL.revokeObjectURL(url);
});

syncSiteButton?.addEventListener('click', () => {
  try {
    saveCatalogDrafts();
    const settings = getSiteSettingsFromEditor();

    writeObject(storageKeys.siteSettings, settings);
    writeCollection(storageKeys.services, getServices());
    writeCollection(storageKeys.professionals, getProfessionals());
    writeObject(storageKeys.siteSync, {
      syncedAt: new Date().toISOString(),
      source: 'admin',
    });

    applyPreview(settings);
    renderAll();
    setSyncMessage('Site atualizado com sucesso.');
    setSiteMessage('Site atualizado com sucesso.');
  } catch (error) {
    setSyncMessage('Não foi possível atualizar o site. Tente novamente.', 'error');
    setSiteMessage('Não foi possível atualizar o site. Tente novamente.', 'error');
  }
});

clearButton?.addEventListener('click', () => {
  if (confirm('Deseja limpar todas as demandas salvas neste navegador?')) {
    writeCollection(storageKeys.demands, []);
    renderAll();
  }
});

siteImageInput?.addEventListener('change', async () => {
  const file = siteImageInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    setSiteMessage('Selecione um arquivo de imagem válido.', 'error');
    return;
  }

  setSiteMessage('Preparando prévia da imagem...');
  try {
    pendingBackgroundImage = await compressImage(file);
    applyPreview({
      ...getSiteSettings(),
      ...Object.fromEntries(new FormData(siteSettingsForm)),
      backgroundImage: pendingBackgroundImage,
    });
    setSiteMessage('Prévia carregada. Clique em salvar para publicar no site.');
  } catch (error) {
    setSiteMessage(error.message, 'error');
  }
});

galleryInput?.addEventListener('change', async () => {
  const files = Array.from(galleryInput.files ?? []).filter((file) => file.type.startsWith('image/'));
  if (!files.length) {
    setSiteMessage('Selecione uma ou mais imagens válidas.', 'error');
    return;
  }

  setSiteMessage('Preparando imagens dos trabalhos...');

  try {
    pendingGalleryImages = await Promise.all(files.slice(0, 6).map(compressImage));
    renderGalleryPreview();
    setSiteMessage('Imagens carregadas. Clique em Atualizar Site para publicar.');
  } catch (error) {
    setSiteMessage('Não foi possível carregar as imagens. Tente novamente.', 'error');
  }
});

siteSettingsForm?.addEventListener('input', () => {
  applyPreview({
    ...getSiteSettings(),
    ...Object.fromEntries(new FormData(siteSettingsForm)),
    backgroundImage: pendingBackgroundImage || getSiteSettings().backgroundImage,
    galleryImages: pendingGalleryImages,
  });
});

siteSettingsForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const settings = {
    ...defaultSiteSettings,
    ...Object.fromEntries(new FormData(siteSettingsForm)),
    backgroundImage: pendingBackgroundImage || defaultSiteSettings.backgroundImage,
    galleryImages: pendingGalleryImages,
    updatedAt: new Date().toISOString(),
  };
  writeObject(storageKeys.siteSettings, settings);
  applyPreview(settings);
  setSiteMessage('Personalização salva. Abra o site para ver a atualização.');
});

siteResetButton?.addEventListener('click', () => {
  pendingBackgroundImage = defaultSiteSettings.backgroundImage;
  pendingGalleryImages = [];
  writeObject(storageKeys.siteSettings, defaultSiteSettings);
  if (siteImageInput) siteImageInput.value = '';
  applyPreview(defaultSiteSettings);
  setSiteMessage('Modelo padrão restaurado.');
});

window.addEventListener('storage', renderAll);

ensureSeedData();
renderAll();
activateTab('dashboard');
