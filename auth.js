const authConfig = window.BEAUTYJSR_SUPABASE ?? {};
const isConfigured = authConfig.url && authConfig.anonKey && !authConfig.url.includes('SEU-PROJETO') && !authConfig.anonKey.includes('SUA_SUPABASE');
const supabaseClient = isConfigured ? window.supabase.createClient(authConfig.url, authConfig.anonKey) : null;
const isLocalPreview = ['file:', 'http:'].includes(window.location.protocol)
  && ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

const localAdminCredentials = {
  username: 'admin',
  password: 'admin123',
};
const localAdminSessionKey = 'beautyjsr.localAdminSession';
const localAdminSessionDuration = 1000 * 60 * 30;

function setAuthMessage(message, type = 'info') {
  const element = document.querySelector('[data-auth-message]');
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

async function getSession() {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) return null;
  return data.session;
}

async function isAdminUser(userId) {
  if (!supabaseClient || !userId) return false;
  const { data, error } = await supabaseClient
    .from('admin_profiles')
    .select('id, active')
    .eq('id', userId)
    .eq('active', true)
    .maybeSingle();

  return !error && Boolean(data?.active);
}

function hasLocalAdminSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(localAdminSessionKey) ?? 'null');
    if (!session || session.user !== localAdminCredentials.username || Date.now() > session.expiresAt) {
      clearLocalAdminSession();
      return false;
    }
    return true;
  } catch {
    clearLocalAdminSession();
    return false;
  }
}

function startLocalAdminSession() {
  sessionStorage.setItem(localAdminSessionKey, JSON.stringify({
    user: localAdminCredentials.username,
    expiresAt: Date.now() + localAdminSessionDuration,
  }));
}

function clearLocalAdminSession() {
  sessionStorage.removeItem(localAdminSessionKey);
}

async function requireAdminSession() {
  const guard = document.querySelector('[data-auth-guard]');

  if (!isConfigured) {
    if (isLocalPreview) {
      if (!hasLocalAdminSession()) {
        window.location.href = authConfig.loginRedirect || 'login.html';
        return;
      }

      if (guard) {
        guard.innerHTML = 'Login local ativo. Em producao, configure <strong>supabase-config.js</strong> para proteger o admin com Supabase Auth.';
        guard.hidden = false;
      }
      document.body.classList.remove('auth-loading');
      document.querySelector('[data-admin-email]').textContent = localAdminCredentials.username;
      return;
    }

    if (guard) {
      guard.innerHTML = 'Supabase Auth ainda nao foi configurado. Edite <strong>supabase-config.js</strong> com URL e anon key do projeto.';
      guard.hidden = false;
    }
    document.body.classList.add('auth-blocked');
    return;
  }

  const session = await getSession();
  if (!session) {
    window.location.href = authConfig.loginRedirect || 'login.html';
    return;
  }

  const allowed = await isAdminUser(session.user.id);
  if (!allowed) {
    await supabaseClient.auth.signOut();
    window.location.href = `${authConfig.loginRedirect || 'login.html'}?error=not-admin`;
    return;
  }

  document.body.classList.remove('auth-loading');
  document.querySelector('[data-admin-email]').textContent = session.user.email ?? 'Admin';
}

async function setupLogin() {
  const form = document.querySelector('[data-login-form]');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get('error') === 'not-admin') {
    setAuthMessage('Este usuario nao esta autorizado como admin.', 'error');
  }

  if (!isConfigured) {
    if (!isLocalPreview) {
      setAuthMessage('Configure supabase-config.js antes de usar o login em producao.', 'error');
      form.querySelector('button').disabled = true;
      return;
    }

    if (hasLocalAdminSession()) {
      window.location.href = authConfig.adminRedirect || 'admin.html';
      return;
    }

    setAuthMessage('Modo local: use usuario admin e senha admin123.', 'info');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const username = String(formData.get('username') || formData.get('email')).trim();
      const password = String(formData.get('password'));

      if (username === localAdminCredentials.username && password === localAdminCredentials.password) {
        startLocalAdminSession();
        window.location.href = authConfig.adminRedirect || 'admin.html';
        return;
      }

      setAuthMessage('Nome de usuario ou senha invalidos.', 'error');
    });
    return;
  }

  const session = await getSession();
  if (session && await isAdminUser(session.user.id)) {
    window.location.href = authConfig.adminRedirect || 'admin.html';
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('username') || formData.get('email')).trim();
    const password = String(formData.get('password'));
    const button = form.querySelector('button');

    button.disabled = true;
    setAuthMessage('Entrando...', 'info');

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthMessage('E-mail ou senha invalidos.', 'error');
      button.disabled = false;
      return;
    }

    if (!await isAdminUser(data.user.id)) {
      await supabaseClient.auth.signOut();
      setAuthMessage('Login valido, mas este usuario nao esta liberado como admin.', 'error');
      button.disabled = false;
      return;
    }

    window.location.href = authConfig.adminRedirect || 'admin.html';
  });
}

async function setupLogout() {
  document.querySelector('[data-logout]')?.addEventListener('click', async () => {
    clearLocalAdminSession();
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    window.location.href = authConfig.loginRedirect || 'login.html';
  });
}

if (document.querySelector('[data-login-form]')) {
  setupLogin();
}

if (document.querySelector('[data-auth-required]')) {
  document.body.classList.add('auth-loading');
  requireAdminSession();
  setupLogout();
}
