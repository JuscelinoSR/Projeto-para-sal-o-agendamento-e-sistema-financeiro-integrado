const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const header = document.querySelector('[data-elevate]');
const pageScreens = document.querySelectorAll('[data-page]');
const pageLinks = document.querySelectorAll('a[href^="#"]');
const visualTabButtons = document.querySelectorAll('[data-site-tab]');

const chavesArmazenadas = {
  services: 'beautyjsr.services',
  professionals: 'beautyjsr.professionals',
  demands: 'beautyjsr.demands',
  siteSettings: 'beautyjsr.siteSettings',
  serviceCatalogVersion: 'beautyjsr.serviceCatalogVersion',
};

const nomeDoSalaoPadrao = 'Salão Larissa';

const configuracoesPadraoDoSite = {
  brandName: nomeDoSalaoPadrao,
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

function lerObjeto(key, fallback) {
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

function normalizarWhatsapp(value) {
  return String(value || '').replace(/\D/g, '') || '5564999625616';
}

function normalizeWhatsapp(value) {
  return normalizarWhatsapp(value);
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

function obterInicials(name) {
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

  atualizarDadosEditaveis();

  showcase.innerHTML = profissionais.map((professional) => `
    <article class="professional-card">
      <span class="professional-avatar">${escapeHtml(obterInicials(professional.name))}</span>
      <div>
        <h3>${escapeHtml(professional.name)}</h3>
        <p>${escapeHtml(professional.specialty || 'Atendimento especializado')}</p>
        ${professional.linkUrl ? `<a class="professional-link" href="${escapeHtml(professional.linkUrl)}" target="_blank" rel="noreferrer">Ver perfil</a>` : ''}
      </div>
    </article>
  `).join('');
}

function atualizarMetadadosDoSite(settings) {
  const brandName = settings.brandName || nomeDoSalaoPadrao;
  const pageTitle = `${brandName} | ${settings.heroTitle || 'Seu momento de cuidado.'}`;
  const pageDescription = `${brandName}: ${settings.heroSubtitle || 'Cabelos, beleza e autoestima em um ambiente acolhedor.'}`;

  document.title = pageTitle;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', pageDescription);
  }
}

function aplicarConfiguracoesDoSite() {
  const settings = lerObjeto(chavesArmazenadas.siteSettings, configuracoesPadraoDoSite);
  setText('[data-site-brand]', settings.brandName);
  setText('[data-site-brand-footer]', settings.brandName);
  setText('[data-hero-badge]', settings.heroBadge);
  setText('[data-hero-title]', settings.heroTitle);
  setText('[data-hero-subtitle]', settings.heroSubtitle);
  setText('[data-site-cta]', settings.ctaText);

  atualizarMetadadosDoSite(settings);
  document.querySelector('[data-site-brand]')?.setAttribute('aria-label', `${settings.brandName} início`);
  document.documentElement.style.setProperty('--site-background-image', `url("${settings.backgroundImage}")`);
  renderSocialLinks(settings);
  renderWorkGallery(settings);
  renderProfessionalShowcase();
}
const servicosPadrao = [
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

const profissionaisPadrao = [
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

const combosPadrao = [
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

let servicos = lerColecao(chavesArmazenadas.services, servicosPadrao);
let profissionais = lerColecao(chavesArmazenadas.professionals, profissionaisPadrao);

let telefoneWhatsApp = normalizarWhatsapp(lerObjeto(chavesArmazenadas.siteSettings, configuracoesPadraoDoSite).whatsappNumber);
const serviceOptions = document.querySelector('[data-service-options]');
const bookingTypeOptions = document.querySelector('[data-booking-type-options]');
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
const clientPhoneInput = document.querySelector('[data-client-phone]');
const clientNotesInput = document.querySelector('[data-client-notes]');

const hoje = new Date();
hoje.setHours(0, 0, 0, 0);
let dataSelecionada = converterDataParaChave(hoje);
let mesDoCalendario = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

function lerColecao(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function salvarColecao(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mesclarItensFaltantes(itensAtuais, itensPadrao) {
  const idsExistentes = new Set(itensAtuais.map((item) => item.id));
  const faltantes = itensPadrao.filter((item) => !idsExistentes.has(item.id));
  return [...itensAtuais, ...faltantes];
}
function garantirDadosIniciais() {
  const catalogVersion = '2026-06-salao-completo';

  if (!localStorage.getItem(chavesArmazenadas.services)) {
    salvarColecao(chavesArmazenadas.services, servicosPadrao);
    localStorage.setItem(chavesArmazenadas.serviceCatalogVersion, catalogVersion);
  } else if (localStorage.getItem(chavesArmazenadas.serviceCatalogVersion) !== catalogVersion) {
    const servicosMesclados = mesclarItensFaltantes(lerColecao(chavesArmazenadas.services, []), servicosPadrao);
    salvarColecao(chavesArmazenadas.services, servicosMesclados);
    localStorage.setItem(chavesArmazenadas.serviceCatalogVersion, catalogVersion);
  }

  if (!localStorage.getItem(chavesArmazenadas.professionals)) {
    salvarColecao(chavesArmazenadas.professionals, profissionaisPadrao);
  }
}

function atualizarDadosEditaveis() {
  servicos = lerColecao(chavesArmazenadas.services, servicosPadrao);
  profissionais = lerColecao(chavesArmazenadas.professionals, profissionaisPadrao);
}

function obterPaginaPorHash(hash) {
  const page = String(hash || '#produto').replace('#', '');
  return document.querySelector(`[data-page="${page}"]`) ? page : 'produto';
}

function mostrarPaginaPrincipal(pageName, updateHash = true) {
  const nextPage = obterPaginaPorHash(`#${pageName}`);

  pageScreens.forEach((screen) => {
    screen.classList.toggle('is-page-active', screen.dataset.page === nextPage);
  });

  pageLinks.forEach((link) => {
    const linkPage = obterPaginaPorHash(link.getAttribute('href'));
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
  fecharMenu();
}
function fecharMenu() {
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
    mostrarPaginaPrincipal(obterPaginaPorHash(href));
  });
});

visualTabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    mostrarPaginaPrincipal(button.dataset.siteTab);
  });
});

window.addEventListener('hashchange', () => {
  mostrarPaginaPrincipal(obterPaginaPorHash(window.location.hash), false);
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

function renderizarOpcao({ type, name, value, checked, title, details, compact = false }) {
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

function renderizarOpcoes() {
  atualizarDadosEditaveis();

  if (serviceOptions) {
    serviceOptions.innerHTML = servicos
      .map((service, index) => renderizarOpcao({
        type: 'checkbox',
        name: 'service',
        value: service.id,
        checked: index === 0,
        title: service.name,
        details: `${service.duration} • ${service.price}`,
      }))
      .join('');
  }

  if (bookingTypeOptions) {
    bookingTypeOptions.innerHTML = [
      {
        value: 'custom',
        title: 'Montar meu combo',
        details: 'Escolha um ou mais serviços',
      },
      {
        value: 'combo',
        title: 'Escolher combo pronto',
        details: 'Opções sugeridas pelo salão',
      },
    ]
      .map(({ value, title, details }, index) => renderizarOpcao({
        type: 'radio',
        name: 'bookingType',
        value,
        checked: index === 0,
        title,
        details,
      }))
      .join('');
  }

  if (comboOptions) {
    comboOptions.innerHTML = combosPadrao
      .map((combo, index) => renderizarOpcao({
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
    customServiceOptions.innerHTML = servicos
      .map((service, index) => renderizarOpcao({
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
    professionalOptions.innerHTML = profissionais
      .map((professional, index) => renderizarOpcao({
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

function obterValorSelecionado(name) {
  return bookingForm?.querySelector(`input[name="${name}"]:checked`)?.value;
}

function obterValoresSelecionados(name) {
  return Array.from(bookingForm?.querySelectorAll(`input[name="${name}"]:checked`) ?? []).map((input) => input.value);
}

function converterPrecoParaNumero(preco) {
  const numeric = String(preco).replace(/[^\d,]/g, '').replace(',', '.');
  return Number.parseFloat(numeric) || 0;
}

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function converterDataParaChave(data) {
  return data.toISOString().slice(0, 10);
}

function converterChaveParaData(chaveData) {
  const [year, month, day] = chaveData.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatarDataCompleta(chaveData) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(converterChaveParaData(chaveData));
}

function formatarDataCurta(chaveData) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(converterChaveParaData(chaveData));
}

function renderizarCalendario() {
  if (!bookingCalendar) {
    return;
  }

  const monthStart = new Date(mesDoCalendario.getFullYear(), mesDoCalendario.getMonth(), 1);
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(mesDoCalendario.getFullYear(), mesDoCalendario.getMonth() + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(monthStart);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const canGoBack = monthStart > new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const blanks = Array.from({ length: firstWeekday }, () => '<span class="calendar-empty" aria-hidden="true"></span>');
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(mesDoCalendario.getFullYear(), mesDoCalendario.getMonth(), day);
    const dateKey = converterDataParaChave(date);
    const isPast = date < hoje;
    const isSelected = dateKey === dataSelecionada;
    const isToday = dateKey === converterDataParaChave(hoje);

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
    <p class="calendar-selected">Selecionado: <strong>${escapeHtml(formatarDataCompleta(dataSelecionada))}</strong></p>
  `;

  if (appointmentDateInput) {
    appointmentDateInput.value = dataSelecionada;
  }
}
function obterTipoDeAgendamento() {
  const explicitType = bookingForm?.querySelector('input[name="bookingType"]:checked')?.value;
  if (explicitType === 'combo' || explicitType === 'custom') {
    return explicitType;
  }

  const possuiComboSelecionado = Boolean(bookingForm?.querySelector('input[name="combo"]:checked'));
  return possuiComboSelecionado ? 'combo' : 'custom';
}

function obterPacoteSelecionado() {
  atualizarDadosEditaveis();
  const tipoAgendamento = obterTipoDeAgendamento();

  if (tipoAgendamento === 'combo') {
    const comboSelecionado = combosPadrao.find((combo) => combo.id === obterValorSelecionado('combo')) ?? combosPadrao[0];
    return {
      bookingType: tipoAgendamento,
      id: comboSelecionado.id,
      name: comboSelecionado.name,
      duration: comboSelecionado.duration,
      price: comboSelecionado.price,
      items: comboSelecionado.items,
    };
  }

  const idsSelecionados = obterValoresSelecionados('customServices');
  const servicosSelecionados = servicos.filter((service) => idsSelecionados.includes(service.id));
  const servicosSeguros = servicosSelecionados.length ? servicosSelecionados : servicos.slice(0, 1);
  const total = servicosSeguros.reduce((sum, service) => sum + converterPrecoParaNumero(service.price), 0);

  return {
    bookingType: 'custom',
    id: 'combo-personalizado',
    name: 'Combo personalizado',
    duration: `${servicosSeguros.length} serviços`,
    price: formatarPreco(total),
    items: servicosSeguros.map((service) => service.name),
  };
}

function atualizarPaineisDeAgendamento() {
  const tipoAgendamento = obterTipoDeAgendamento();
  bookingPanels.forEach((panel) => {
    const isActive = panel.dataset.bookingPanel === tipoAgendamento;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });

  if (screenTitle) {
    screenTitle.textContent = tipoAgendamento === 'combo' ? 'Escolha um combo pronto' : 'Escolha seu atendimento';
  }
}

function mostrarTelaDeAgendamento(nomeTela) {
  bookingScreens.forEach((screen) => {
    screen.classList.toggle('is-active', screen.dataset.bookingScreen === nomeTela);
  });

  const ordem = ['details', 'schedule', 'contact'];
  const indiceAtivo = ordem.indexOf(nomeTela);
  progressSteps.forEach((step) => {
    const passoAtual = ordem.indexOf(step.dataset.progressStep);
    step.classList.toggle('is-active', passoAtual === indiceAtivo);
    step.classList.toggle('is-complete', passoAtual >= 0 && passoAtual < indiceAtivo);
  });

  summaryNextButton?.classList.toggle('is-visible', nomeTela === 'details');
}

function obterEstadoDoAgendamento() {
  atualizarDadosEditaveis();
  const pacoteSelecionado = obterPacoteSelecionado();
  const profissionalSelecionado = profissionais.find((professional) => professional.id === obterValorSelecionado('professional')) ?? profissionais[0] ?? profissionaisPadrao[0];
  const dataAgendamento = appointmentDateInput?.value || dataSelecionada;
  const periodo = obterValorSelecionado('period') ?? '09:00';
  const nomeCliente = clientNameInput?.value.trim() || '';
  const telefoneCliente = clientPhoneInput?.value.trim() || '';
  const observacoes = clientNotesInput?.value.trim();

  return {
    pacoteSelecionado,
    profissionalSelecionado,
    dataAgendamento,
    periodo,
    nomeCliente,
    telefoneCliente,
    observacoes,
  };
}

function obterTituloTipoDeAgendamento(tipo) {
  const labels = {
    combo: 'Combo pronto',
    custom: 'Combo personalizado',
  };

  return labels[tipo] ?? labels.combo;
}

function montarMensagemWhatsApp() {
  const { pacoteSelecionado, profissionalSelecionado, dataAgendamento, periodo, nomeCliente, telefoneCliente, observacoes } = obterEstadoDoAgendamento();
  const settings = lerObjeto(chavesArmazenadas.siteSettings, configuracoesPadraoDoSite);
  const nomeParaMensagem = nomeCliente || 'Cliente';
  const tipoAtendimento = pacoteSelecionado.bookingType === 'combo' ? 'Combo pronto' : 'Combo personalizado';
  const linhas = [
    `Olá, ${nomeParaMensagem}! Quero agendar um atendimento no ${settings.brandName}.`,
    '',
    `Tipo: ${tipoAtendimento}`,
    `Serviço: ${pacoteSelecionado.name}`,
    `Detalhes: ${pacoteSelecionado.items.join(', ')}`,
    `Profissional: ${profissionalSelecionado.name}`,
    `Data: ${formatarDataCurta(dataAgendamento)}`,
    `Horário: ${periodo}`,
    `WhatsApp: ${telefoneCliente || 'não informado'}`,
  ];

  if (observacoes) {
    linhas.push(`Observações: ${observacoes}`);
  }

  linhas.push('', 'Obrigado!');
  return linhas.join('\n');
}

function validarSelecaoDoAgendamento() {
  const { pacoteSelecionado, profissionalSelecionado, dataAgendamento, nomeCliente, telefoneCliente } = obterEstadoDoAgendamento();
  const tipoAgendamento = obterTipoDeAgendamento();
  const erros = [];

  if (tipoAgendamento === 'custom') {
    const idsSelecionados = obterValoresSelecionados('customServices');
    if (!idsSelecionados.length) {
      erros.push('Selecione pelo menos um serviço.');
    }
  }

  if (tipoAgendamento === 'combo') {
    const comboSelecionado = bookingForm?.querySelector('input[name="combo"]:checked');
    if (!comboSelecionado) {
      erros.push('Escolha um combo disponível.');
    }
  }

  if (!pacoteSelecionado?.items?.length) {
    erros.push('Selecione pelo menos um serviço.');
  }

  if (!profissionalSelecionado?.id) {
    erros.push('Selecione um profissional.');
  }

  if (!dataAgendamento || new Date(`${dataAgendamento}T00:00:00`) < hoje) {
    erros.push('Selecione uma data válida.');
  }

  if (!nomeCliente.trim()) {
    erros.push('Informe seu nome.');
  }

  if (!telefoneCliente.trim()) {
    erros.push('Informe seu WhatsApp.');
  }

  return { valid: erros.length === 0, errors: erros };
}

function atualizarResumo() {
  atualizarPaineisDeAgendamento();

  if (!summaryTitle || !summaryCopy || !messagePreview) {
    return;
  }

  const { pacoteSelecionado, profissionalSelecionado, dataAgendamento, periodo, nomeCliente } = obterEstadoDoAgendamento();
  const validacao = validarSelecaoDoAgendamento();

  const isValid = validacao.valid;
  const nomeExibicao = nomeCliente || 'Cliente';
  summaryTitle.textContent = isValid ? `${pacoteSelecionado.name} com ${profissionalSelecionado.name}` : 'Faltam dados para continuar';
  summaryCopy.textContent = isValid
    ? `${pacoteSelecionado.price} • ${formatarDataCurta(dataAgendamento)} • ${periodo}`
    : `Olá, ${nomeExibicao}! ${validacao.errors[0]}`;
  messagePreview.classList.toggle('is-error', !isValid);

  if (!isValid) {
    messagePreview.textContent = validacao.errors.join('\n');
    return;
  }

  messagePreview.textContent = montarMensagemWhatsApp();
}

async function salvarPedido() {
  const validacao = validarSelecaoDoAgendamento();
  if (!validacao.valid) {
    summaryTitle.textContent = 'Faltam dados do agendamento';
    summaryCopy.textContent = validacao.errors[0];
    messagePreview.textContent = validacao.errors.join('\n');
    return false;
  }

  const { pacoteSelecionado, profissionalSelecionado, dataAgendamento, periodo, nomeCliente, telefoneCliente, observacoes } = obterEstadoDoAgendamento();
  const demandas = lerColecao(chavesArmazenadas.demands, []);
  const now = new Date().toISOString();

  const pedido = {
    id: `demand-${Date.now()}`,
    clientName: nomeCliente,
    clientPhone: telefoneCliente,
    serviceId: pacoteSelecionado.id,
    serviceName: pacoteSelecionado.name,
    serviceDuration: pacoteSelecionado.duration,
    servicePrice: pacoteSelecionado.price,
    serviceItems: pacoteSelecionado.items,
    bookingType: pacoteSelecionado.bookingType,
    professionalId: profissionalSelecionado.id,
    professionalName: profissionalSelecionado.name,
    appointmentDate: dataAgendamento,
    period: periodo,
    notes: observacoes,
    status: 'novo',
    adminNote: '',
    createdAt: now,
    updatedAt: now,
  };

  if (window.BeautyData?.configured) {
    try {
      const pedidoSalvo = await window.BeautyData.createAppointment(pedido);
      demandas.push({ ...pedido, ...pedidoSalvo });
      salvarColecao(chavesArmazenadas.demands, demandas);
      return true;
    } catch (error) {
      console.error('Não foi possível salvar o agendamento no Supabase:', error);
    }
  }

  demandas.push(pedido);
  salvarColecao(chavesArmazenadas.demands, demandas);
  return true;
}

function abrirWhatsApp() {
  const validacao = validarSelecaoDoAgendamento();
  if (!validacao.valid) {
    summaryTitle.textContent = 'Faltam dados do agendamento';
    summaryCopy.textContent = validacao.errors[0];
    messagePreview.textContent = validacao.errors.join('\n');
    return;
  }

  telefoneWhatsApp = normalizarWhatsapp(lerObjeto(chavesArmazenadas.siteSettings, configuracoesPadraoDoSite).whatsappNumber);
  const message = encodeURIComponent(montarMensagemWhatsApp());
  const url = `https://wa.me/${telefoneWhatsApp}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function inicializarSitePublico() {
  garantirDadosIniciais();

  if (window.BeautyData?.configured) {
    try {
      const data = await window.BeautyData.loadPublicData();
      if (data.services.length) salvarColecao(chavesArmazenadas.services, data.services);
      if (data.professionals.length) salvarColecao(chavesArmazenadas.professionals, data.professionals);
      if (data.siteSettings) {
        localStorage.setItem(chavesArmazenadas.siteSettings, JSON.stringify({
          ...configuracoesPadraoDoSite,
          ...data.siteSettings,
        }));
      }
    } catch (error) {
      console.error('Supabase indisponível; usando dados locais:', error);
    }
  }

  aplicarConfiguracoesDoSite();
  renderizarOpcoes();
  renderizarCalendario();
  mostrarTelaDeAgendamento('details');
  mostrarPaginaPrincipal(obterPaginaPorHash(window.location.hash), false);
  atualizarResumo();
}

inicializarSitePublico();

bookingForm?.addEventListener('input', atualizarResumo);
bookingForm?.addEventListener('change', () => {
  atualizarResumo();
});

scheduler?.addEventListener('click', (event) => {
  const nextButton = event.target.closest('[data-next-screen]');
  const prevButton = event.target.closest('[data-prev-screen]');
  const calendarDateButton = event.target.closest('[data-calendar-date]');
  const calendarPrevButton = event.target.closest('[data-calendar-prev]');
  const calendarNextButton = event.target.closest('[data-calendar-next]');

  if (calendarDateButton) {
    dataSelecionada = calendarDateButton.dataset.calendarDate;
    renderizarCalendario();
    atualizarResumo();
  }

  if (calendarPrevButton && !calendarPrevButton.disabled) {
    mesDoCalendario = new Date(mesDoCalendario.getFullYear(), mesDoCalendario.getMonth() - 1, 1);
    renderizarCalendario();
  }

  if (calendarNextButton) {
    mesDoCalendario = new Date(mesDoCalendario.getFullYear(), mesDoCalendario.getMonth() + 1, 1);
    renderizarCalendario();
  }

  if (nextButton) {
    mostrarTelaDeAgendamento(nextButton.dataset.nextScreen);
  }

  if (prevButton) {
    mostrarTelaDeAgendamento(prevButton.dataset.prevScreen);
  }
});
bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  atualizarResumo();

  const isSaved = await salvarPedido();
  if (!isSaved) {
    return;
  }

  abrirWhatsApp();
});

window.addEventListener('storage', () => {
  aplicarConfiguracoesDoSite();
  renderizarOpcoes();
  renderProfessionalShowcase();
  atualizarResumo();
});

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    fecharMenu();
  }
});
