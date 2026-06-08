const storageKeys = {
  services: 'beautyjsr.services',
  professionals: 'beautyjsr.professionals',
  demands: 'beautyjsr.demands',
  siteSettings: 'beautyjsr.siteSettings',
  serviceCatalogVersion: 'beautyjsr.serviceCatalogVersion',
};

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
  { id: 'ana-souza', name: 'Ana Souza', specialty: 'Cabelos e finalização' },
  { id: 'beatriz-lima', name: 'Beatriz Lima', specialty: 'Unhas e spa das mãos' },
  { id: 'clara-mendes', name: 'Clara Mendes', specialty: 'Tratamentos capilares' },
];

const statusLabels = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const demandList = document.querySelector('[data-demand-list]');
const serviceList = document.querySelector('[data-service-list]');
const professionalList = document.querySelector('[data-professional-list]');
const serviceForm = document.querySelector('[data-service-form]');
const professionalForm = document.querySelector('[data-professional-form]');
const statusFilter = document.querySelector('[data-status-filter]');
const exportButton = document.querySelector('[data-export]');
const clearButton = document.querySelector('[data-clear-demo]');
const siteSettingsForm = document.querySelector('[data-site-settings-form]');
const siteImageInput = document.querySelector('[data-site-image-input]');
const siteResetButton = document.querySelector('[data-site-reset]');
const siteSettingsMessage = document.querySelector('[data-site-settings-message]');
const sitePreview = document.querySelector('[data-site-preview]');
const previewBadge = document.querySelector('[data-preview-badge]');
const previewTitle = document.querySelector('[data-preview-title]');
const previewSubtitle = document.querySelector('[data-preview-subtitle]');

const defaultSiteSettings = {
  brandName: 'Salão Larissa',
  heroBadge: 'Salão feminino',
  heroTitle: 'Seu momento de cuidado.',
  heroSubtitle: 'Cabelos, beleza e autoestima em um ambiente acolhedor, elegante e preparado para transformar sua rotina.',
  ctaText: 'Agendar com Ana',
  backgroundImage: 'assets/salao-cores.jpeg',
};

let pendingBackgroundImage = '';

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

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `item-${Date.now()}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatAppointmentDate(value) {
  if (!value) {
    return 'Não informada';
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(date);
}

function getServices() {
  return readCollection(storageKeys.services, defaultServices);
}

function getProfessionals() {
  return readCollection(storageKeys.professionals, defaultProfessionals);
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

function getSiteSettings() {
  return readObject(storageKeys.siteSettings, defaultSiteSettings);
}

function setSiteMessage(message, type = 'success') {
  if (!siteSettingsMessage) {
    return;
  }

  siteSettingsMessage.textContent = message;
  siteSettingsMessage.dataset.type = type;
}

function applyPreview(settings) {
  if (siteSettingsForm) {
    siteSettingsForm.elements.brandName.value = settings.brandName;
    siteSettingsForm.elements.heroBadge.value = settings.heroBadge;
    siteSettingsForm.elements.heroTitle.value = settings.heroTitle;
    siteSettingsForm.elements.heroSubtitle.value = settings.heroSubtitle;
    siteSettingsForm.elements.ctaText.value = settings.ctaText;
  }

  if (sitePreview) {
    sitePreview.style.backgroundImage = `linear-gradient(90deg, rgba(47, 37, 32, 0.58), rgba(47, 37, 32, 0.08)), url("${settings.backgroundImage}")`;
  }

  if (previewBadge) previewBadge.textContent = settings.heroBadge;
  if (previewTitle) previewTitle.textContent = settings.heroTitle;
  if (previewSubtitle) previewSubtitle.textContent = settings.heroSubtitle;
}

function loadSiteSettingsEditor() {
  const settings = getSiteSettings();
  pendingBackgroundImage = settings.backgroundImage;
  applyPreview(settings);
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
function getDemands() {
  return readCollection(storageKeys.demands, []);
}

function updateMetrics() {
  const demands = getDemands();
  document.querySelector('[data-metric-total]').textContent = demands.length;
  document.querySelector('[data-metric-new]').textContent = demands.filter((item) => item.status === 'novo').length;
  document.querySelector('[data-metric-confirmed]').textContent = demands.filter((item) => item.status === 'confirmado').length;
  document.querySelector('[data-metric-completed]').textContent = demands.filter((item) => item.status === 'concluido').length;
}

function getBookingTypeLabel(type) {
  const labels = {
    combo: 'Combo pronto',
    custom: 'Combo personalizado',
  };

  return labels[type] ?? labels.combo;
}

function renderDemandItems(demand) {
  if (!Array.isArray(demand.serviceItems) || !demand.serviceItems.length) {
    return '';
  }

  return `<p><strong>Itens:</strong> ${escapeHtml(demand.serviceItems.join(' + '))}</p>`;
}
function renderDemands() {
  const selectedStatus = statusFilter?.value ?? 'todos';
  const demands = getDemands()
    .filter((demand) => selectedStatus === 'todos' || demand.status === selectedStatus)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!demandList) {
    return;
  }

  if (!demands.length) {
    demandList.innerHTML = '<div class="empty-state">Nenhuma demanda encontrada. Use o fluxo de agendamento no site para criar a primeira.</div>';
    return;
  }

  demandList.innerHTML = demands.map((demand) => `
    <article class="demand-card" data-demand-id="${escapeHtml(demand.id)}">
      <div class="demand-top">
        <div>
          <h3>${escapeHtml(demand.clientName)}</h3>
          <small>${formatDate(demand.createdAt)}</small>
        </div>
        <span class="status-pill ${escapeHtml(demand.status)}">${statusLabels[demand.status] ?? demand.status}</span>
      </div>
      <p><strong>Tipo:</strong> ${escapeHtml(getBookingTypeLabel(demand.bookingType))}</p>
      <p><strong>Serviço:</strong> ${escapeHtml(demand.serviceName)} • ${escapeHtml(demand.servicePrice)} • ${escapeHtml(demand.serviceDuration)}</p>
      ${renderDemandItems(demand)}
      <p><strong>Profissional:</strong> ${escapeHtml(demand.professionalName)}</p>
      <p><strong>Data:</strong> ${escapeHtml(formatAppointmentDate(demand.appointmentDate))}</p>
      <p><strong>Período:</strong> ${escapeHtml(demand.period)}</p>
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
        <button class="button primary small" type="button" data-demand-save>Salvar demanda</button>
        <button class="button danger small" type="button" data-demand-delete>Excluir</button>
      </div>
    </article>
  `).join('');
}

function renderEditableList(listElement, items, type) {
  if (!listElement) {
    return;
  }

  if (!items.length) {
    listElement.innerHTML = '<div class="empty-state">Nenhum item cadastrado.</div>';
    return;
  }

  listElement.innerHTML = items.map((item) => `
    <article class="admin-item" data-item-id="${escapeHtml(item.id)}">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${type === 'service' ? `${escapeHtml(item.duration)} • ${escapeHtml(item.price)}` : escapeHtml(item.specialty)}</small>
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
}

function renderProfessionals() {
  renderEditableList(professionalList, getProfessionals(), 'professional');
}

function renderAll() {
  updateMetrics();
  renderDemands();
  renderServices();
  renderProfessionals();
  loadSiteSettingsEditor();
}

function upsertItem(key, item) {
  const items = readCollection(key, []);
  const index = items.findIndex((current) => current.id === item.id);

  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }

  writeCollection(key, items);
}

function deleteItem(key, id) {
  const items = readCollection(key, []).filter((item) => item.id !== id);
  writeCollection(key, items);
}

function resetForm(form) {
  form.reset();
  form.elements.id.value = '';
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
  renderServices();
});

professionalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(professionalForm);
  const name = data.get('name').trim();
  const id = data.get('id') || slugify(name);

  upsertItem(storageKeys.professionals, {
    id,
    name,
    specialty: data.get('specialty').trim(),
  });

  resetForm(professionalForm);
  renderProfessionals();
  loadSiteSettingsEditor();
});

document.querySelector('[data-service-cancel]')?.addEventListener('click', () => resetForm(serviceForm));
document.querySelector('[data-professional-cancel]')?.addEventListener('click', () => resetForm(professionalForm));
statusFilter?.addEventListener('change', renderDemands);

document.addEventListener('click', (event) => {
  const demandCard = event.target.closest('[data-demand-id]');

  if (event.target.matches('[data-demand-save]') && demandCard) {
    const demands = getDemands();
    const demand = demands.find((item) => item.id === demandCard.dataset.demandId);
    if (demand) {
      demand.status = demandCard.querySelector('[data-demand-status]').value;
      demand.adminNote = demandCard.querySelector('[data-demand-admin-note]').value.trim();
      demand.updatedAt = new Date().toISOString();
      writeCollection(storageKeys.demands, demands);
      renderAll();
    }
  }

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
    }
  }

  if (event.target.matches('[data-delete-service]') && serviceItem) {
    deleteItem(storageKeys.services, serviceItem.dataset.itemId);
    renderServices();
  }

  const professionalItem = event.target.closest('[data-item-id]');
  if (event.target.matches('[data-edit-professional]') && professionalItem) {
    const item = getProfessionals().find((professional) => professional.id === professionalItem.dataset.itemId);
    if (item) {
      professionalForm.elements.id.value = item.id;
      professionalForm.elements.name.value = item.name;
      professionalForm.elements.specialty.value = item.specialty;
    }
  }

  if (event.target.matches('[data-delete-professional]') && professionalItem) {
    deleteItem(storageKeys.professionals, professionalItem.dataset.itemId);
    renderProfessionals();
  loadSiteSettingsEditor();
  }
});

exportButton?.addEventListener('click', () => {
  const payload = {
    services: getServices(),
    professionals: getProfessionals(),
    demands: getDemands(),
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


siteImageInput?.addEventListener('change', async () => {
  const file = siteImageInput.files?.[0];
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    setSiteMessage('Selecione um arquivo de imagem válido.', 'error');
    return;
  }

  setSiteMessage('Preparando prévia da imagem...');

  try {
    pendingBackgroundImage = await compressImage(file);
    const settings = {
      ...getSiteSettings(),
      ...Object.fromEntries(new FormData(siteSettingsForm)),
      backgroundImage: pendingBackgroundImage,
    };
    applyPreview(settings);
    setSiteMessage('Prévia carregada. Clique em salvar para publicar no site.');
  } catch (error) {
    setSiteMessage(error.message, 'error');
  }
});

siteSettingsForm?.addEventListener('input', () => {
  const settings = {
    ...getSiteSettings(),
    ...Object.fromEntries(new FormData(siteSettingsForm)),
    backgroundImage: pendingBackgroundImage || getSiteSettings().backgroundImage,
  };
  applyPreview(settings);
});

siteSettingsForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(siteSettingsForm));
  const settings = {
    ...defaultSiteSettings,
    ...data,
    backgroundImage: pendingBackgroundImage || defaultSiteSettings.backgroundImage,
    updatedAt: new Date().toISOString(),
  };

  writeObject(storageKeys.siteSettings, settings);
  applyPreview(settings);
  setSiteMessage('Personalização salva. Abra o site para ver a atualização.');
});

siteResetButton?.addEventListener('click', () => {
  pendingBackgroundImage = defaultSiteSettings.backgroundImage;
  writeObject(storageKeys.siteSettings, defaultSiteSettings);
  if (siteImageInput) {
    siteImageInput.value = '';
  }
  applyPreview(defaultSiteSettings);
  setSiteMessage('Modelo padrão restaurado.');
});
clearButton?.addEventListener('click', () => {
  if (confirm('Deseja limpar todas as demandas salvas neste navegador?')) {
    writeCollection(storageKeys.demands, []);
    renderAll();
  }
});

window.addEventListener('storage', renderAll);

ensureSeedData();
renderAll();
