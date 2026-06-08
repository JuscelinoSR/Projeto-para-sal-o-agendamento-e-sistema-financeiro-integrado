const storageKeys = {
  services: 'beautyjsr.services',
  professionals: 'beautyjsr.professionals',
  demands: 'beautyjsr.demands',
};

const defaultServices = [
  { id: 'corte-escova', name: 'Corte + escova', duration: '60 min', price: 'R$ 120' },
  { id: 'design-unhas', name: 'Design de unhas', duration: '90 min', price: 'R$ 95' },
  { id: 'hidratacao', name: 'Hidratação capilar', duration: '75 min', price: 'R$ 140' },
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

function getServices() {
  return readCollection(storageKeys.services, defaultServices);
}

function getProfessionals() {
  return readCollection(storageKeys.professionals, defaultProfessionals);
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
    individual: 'Serviço individual',
    combo: 'Combo pronto',
    custom: 'Combo personalizado',
  };

  return labels[type] ?? labels.individual;
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
  }
});

exportButton?.addEventListener('click', () => {
  const payload = {
    services: getServices(),
    professionals: getProfessionals(),
    demands: getDemands(),
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

clearButton?.addEventListener('click', () => {
  if (confirm('Deseja limpar todas as demandas salvas neste navegador?')) {
    writeCollection(storageKeys.demands, []);
    renderAll();
  }
});

window.addEventListener('storage', renderAll);

ensureSeedData();
renderAll();