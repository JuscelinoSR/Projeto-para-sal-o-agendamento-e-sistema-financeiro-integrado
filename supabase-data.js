(function setupBeautyData() {
  const config = window.BEAUTYJSR_SUPABASE ?? {};
  const configured = Boolean(
    window.supabase
    && config.url
    && config.anonKey
    && !config.url.includes('SEU-PROJETO')
    && !config.anonKey.includes('SUA_SUPABASE'),
  );
  const existingClient = typeof supabaseClient !== 'undefined' ? supabaseClient : null;
  const client = configured ? (existingClient || window.supabase.createClient(config.url, config.anonKey)) : null;

  function assertClient() {
    if (!client) throw new Error('Supabase não está configurado.');
    return client;
  }

  function mapService(row) {
    return {
      id: row.id,
      name: row.name,
      duration: row.duration,
      price: row.price,
    };
  }

  function mapProfessional(row) {
    return {
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      linkUrl: row.link_url || '',
    };
  }

  function mapSettings(row) {
    if (!row) return null;
    return {
      brandName: row.brand_name,
      heroBadge: row.hero_badge,
      heroTitle: row.hero_title,
      heroSubtitle: row.hero_subtitle,
      ctaText: row.cta_text,
      backgroundImage: row.background_image_url,
      instagramUrl: row.instagram_url || '',
      facebookUrl: row.facebook_url || '',
      tiktokUrl: row.tiktok_url || '',
      whatsappNumber: row.whatsapp_number || '',
    };
  }

  function statusFromDatabase(status) {
    return {
      pendente: 'novo',
      aprovado: 'confirmado',
      recusado: 'cancelado',
      cancelado: 'cancelado',
      reagendado: 'em_atendimento',
      concluido: 'concluido',
      faltou: 'cancelado',
    }[status] || 'novo';
  }

  function statusToDatabase(status) {
    return {
      novo: 'pendente',
      em_atendimento: 'reagendado',
      confirmado: 'aprovado',
      concluido: 'concluido',
      cancelado: 'cancelado',
    }[status] || 'pendente';
  }

  function mapAppointment(row) {
    const price = Number(row.value) || 0;
    return {
      id: row.id,
      clientName: row.client_name,
      serviceId: '',
      serviceName: row.service,
      serviceDuration: '',
      servicePrice: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      serviceItems: [],
      bookingType: 'manual',
      professionalId: '',
      professionalName: row.professional,
      appointmentDate: row.appointment_date,
      period: String(row.appointment_time || '').slice(0, 5),
      notes: '',
      adminNote: '',
      status: statusFromDatabase(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function mapTransaction(row) {
    return {
      id: row.id,
      type: row.type,
      description: row.description,
      amount: Number(row.amount) || 0,
      date: row.transaction_date,
      createdAt: row.created_at,
    };
  }

  async function loadPublicData() {
    const db = assertClient();
    const [servicesResult, professionalsResult, settingsResult, galleryResult] = await Promise.all([
      db.from('service_catalog').select('*').eq('active', true).order('sort_order'),
      db.from('salon_professionals').select('*').eq('active', true).order('sort_order'),
      db.from('site_settings').select('*').eq('id', 'default').maybeSingle(),
      db.from('work_gallery_images').select('*').eq('active', true).order('sort_order'),
    ]);
    const error = servicesResult.error || professionalsResult.error || settingsResult.error || galleryResult.error;
    if (error) throw error;

    const settings = mapSettings(settingsResult.data);
    if (settings) {
      settings.galleryImages = (galleryResult.data || []).map((item) => item.image_url);
    }

    return {
      services: (servicesResult.data || []).map(mapService),
      professionals: (professionalsResult.data || []).map(mapProfessional),
      siteSettings: settings,
    };
  }

  async function loadAdminData() {
    const db = assertClient();
    const publicData = await loadPublicData();
    const [appointmentsResult, transactionsResult] = await Promise.all([
      db.from('appointments').select('*').order('appointment_date'),
      db.from('financial_transactions').select('*').order('transaction_date', { ascending: false }),
    ]);
    const error = appointmentsResult.error || transactionsResult.error;
    if (error) throw error;

    return {
      ...publicData,
      demands: (appointmentsResult.data || []).map(mapAppointment),
      transactions: (transactionsResult.data || []).map(mapTransaction),
    };
  }

  async function saveService(service) {
    const priceAmount = Number(String(service.price).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || null;
    const { error } = await assertClient().from('service_catalog').upsert({
      id: service.id,
      name: service.name,
      duration: service.duration,
      price: service.price,
      price_amount: priceAmount,
      active: true,
    });
    if (error) throw error;
  }

  async function saveProfessional(professional) {
    const { error } = await assertClient().from('salon_professionals').upsert({
      id: professional.id,
      name: professional.name,
      specialty: professional.specialty,
      link_url: professional.linkUrl || null,
      active: true,
    });
    if (error) throw error;
  }

  async function archive(table, id) {
    const { error } = await assertClient().from(table).update({ active: false }).eq('id', id);
    if (error) throw error;
  }

  function appointmentPayload(demand) {
    const time = /^\d{2}:\d{2}/.test(demand.period || '') ? demand.period.slice(0, 5) : '09:00';
    const value = Number(String(demand.servicePrice || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
    return {
      client_name: demand.clientName,
      service: demand.serviceName,
      professional: demand.professionalName,
      appointment_date: demand.appointmentDate,
      appointment_time: time,
      client_phone: demand.clientPhone || 'não informado',
      value,
      status: statusToDatabase(demand.status),
    };
  }

  async function createAppointment(demand) {
    const { data, error } = await assertClient()
      .from('appointments')
      .insert(appointmentPayload(demand))
      .select()
      .single();
    if (error) throw error;
    return mapAppointment(data);
  }

  async function updateAppointment(id, status) {
    const { error } = await assertClient()
      .from('appointments')
      .update({ status: statusToDatabase(status) })
      .eq('id', id);
    if (error) throw error;
  }

  async function deleteAppointment(id) {
    const { error } = await assertClient().from('appointments').delete().eq('id', id);
    if (error) throw error;
  }

  async function saveTransaction(transaction) {
    const payload = {
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      transaction_date: transaction.date,
    };
    const { data, error } = await assertClient().from('financial_transactions').insert(payload).select().single();
    if (error) throw error;
    return mapTransaction(data);
  }

  async function deleteTransaction(id) {
    const { error } = await assertClient().from('financial_transactions').delete().eq('id', id);
    if (error) throw error;
  }

  async function saveSettings(settings) {
    const { error } = await assertClient().from('site_settings').upsert({
      id: 'default',
      brand_name: settings.brandName,
      hero_badge: settings.heroBadge,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      cta_text: settings.ctaText,
      background_image_url: settings.backgroundImage,
      instagram_url: settings.instagramUrl || '',
      facebook_url: settings.facebookUrl || '',
      tiktok_url: settings.tiktokUrl || '',
      whatsapp_number: settings.whatsappNumber || '',
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  window.BeautyData = {
    configured,
    client,
    loadPublicData,
    loadAdminData,
    saveService,
    saveProfessional,
    archiveService: (id) => archive('service_catalog', id),
    archiveProfessional: (id) => archive('salon_professionals', id),
    createAppointment,
    updateAppointment,
    deleteAppointment,
    saveTransaction,
    deleteTransaction,
    saveSettings,
  };
}());
