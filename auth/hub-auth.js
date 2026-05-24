// auth/hub-auth.js
// Gerencia autenticação no hub EcoPlanet: modal de login, widget de perfil.
// Todas as funções são globais para uso em onclick= attributes do HTML dinâmico.
// Depende: window._supabase (de auth/supabase.js)

var _modalAberto = false;

// ── Init ─────────────────────────────────────────────────────────────────────
// Chamado no DOMContentLoaded. Verifica sessão existente e renderiza estado.
function initAuth() {
  if (!window._supabase) { return; }

  window._supabase.auth.getSession().then(function (res) {
    var session = res.data && res.data.session;
    if (session) {
      _carregarPerfil(session.user);
    } else {
      renderDeslogado();
    }
  });

  // Escuta mudanças de sessão (retorno do redirect OAuth Google)
  window._supabase.auth.onAuthStateChange(function (_event, session) {
    if (session) {
      _carregarPerfil(session.user);
    } else {
      renderDeslogado();
    }
  });
}

// ── Perfil ───────────────────────────────────────────────────────────────────
function _carregarPerfil(user) {
  window._supabase
    .from('profiles')
    .select('display_name, folhas')
    .eq('user_id', user.id)
    .single()
    .then(function (res) {
      var perfil = res.data || {
        display_name: user.email.split('@')[0],
        folhas: 0
      };
      renderLogado(user, perfil);
    });
}

// ── Render: Deslogado ─────────────────────────────────────────────────────────
function renderDeslogado() {
  var zona = document.getElementById('auth-zone');
  if (!zona) { return; }
  zona.innerHTML =
    '<button class="btn-entrar" onclick="abrirModal(\'login\')">Entrar</button>';
}

// ── Render: Logado ────────────────────────────────────────────────────────────
function renderLogado(user, perfil) {
  fecharModal();
  var zona = document.getElementById('auth-zone');
  if (!zona) { return; }
  var inicial = (perfil.display_name || 'U')[0].toUpperCase();
  zona.innerHTML =
    '<div class="widget-perfil">' +
      '<div class="avatar">' + inicial + '</div>' +
      '<span class="nome-usuario">' + _esc(perfil.display_name) + '</span>' +
      '<span class="folhas-count">Folhas: ' + (perfil.folhas || 0) + '</span>' +
      '<button class="btn-sair" onclick="handleLogout()">Sair</button>' +
    '</div>';
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function abrirModal(aba) {
  if (_modalAberto) { return; }
  _modalAberto = true;

  var overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.onclick = function (e) {
    if (e.target === overlay) { fecharModal(); }
  };

  overlay.innerHTML =
    '<div class="modal-card">' +
      '<div class="modal-titulo">EcoPlanet</div>' +
      '<div class="modal-abas">' +
        '<button class="aba" id="aba-login"    onclick="_trocarAba(\'login\')"   >Entrar</button>' +
        '<button class="aba" id="aba-cadastro" onclick="_trocarAba(\'cadastro\')">Cadastrar</button>' +
      '</div>' +
      '<div id="modal-corpo"></div>' +
      '<div class="modal-separador"><span>ou</span></div>' +
      '<button class="btn-google" onclick="handleGoogle()">G &nbsp; Continuar com Google</button>' +
      '<div class="modal-erro" id="modal-erro"></div>' +
    '</div>';

  document.body.appendChild(overlay);
  _trocarAba(aba || 'login');
}

function fecharModal() {
  var overlay = document.getElementById('modal-overlay');
  if (overlay) { overlay.remove(); }
  _modalAberto = false;
}

function _trocarAba(aba) {
  var corpo = document.getElementById('modal-corpo');
  if (!corpo) { return; }

  var btnLogin    = document.getElementById('aba-login');
  var btnCadastro = document.getElementById('aba-cadastro');
  if (btnLogin)    { btnLogin.classList.toggle('ativa',    aba === 'login'); }
  if (btnCadastro) { btnCadastro.classList.toggle('ativa', aba === 'cadastro'); }

  if (aba === 'login') {
    corpo.innerHTML =
      '<input class="campo" id="campo-email" type="email"    placeholder="Email">' +
      '<input class="campo" id="campo-senha" type="password" placeholder="Senha">' +
      '<button class="btn-principal" onclick="handleLogin()">ENTRAR</button>';
  } else {
    corpo.innerHTML =
      '<input class="campo" id="campo-nome"  type="text"     placeholder="Nome">' +
      '<input class="campo" id="campo-email" type="email"    placeholder="Email">' +
      '<input class="campo" id="campo-senha" type="password" placeholder="Senha">' +
      '<button class="btn-principal" onclick="handleCadastro()">CRIAR CONTA</button>';
  }
}

function _mostrarErro(msg) {
  var el = document.getElementById('modal-erro');
  if (el) { el.textContent = msg; }
}

// ── Handlers de Auth ──────────────────────────────────────────────────────────
function handleLogin() {
  var email = (document.getElementById('campo-email') || {}).value || '';
  var senha = (document.getElementById('campo-senha') || {}).value || '';
  if (!email || !senha) { _mostrarErro('Preencha email e senha.'); return; }

  window._supabase.auth
    .signInWithPassword({ email: email, password: senha })
    .then(function (res) {
      if (res.error) { _mostrarErro(res.error.message); }
      // Sucesso: onAuthStateChange dispara e chama _carregarPerfil automaticamente
    });
}

function handleCadastro() {
  var nome  = (document.getElementById('campo-nome')  || {}).value || '';
  var email = (document.getElementById('campo-email') || {}).value || '';
  var senha = (document.getElementById('campo-senha') || {}).value || '';
  if (!nome || !email || !senha) { _mostrarErro('Preencha todos os campos.'); return; }
  if (senha.length < 6) { _mostrarErro('Senha deve ter ao menos 6 caracteres.'); return; }

  window._supabase.auth
    .signUp({ email: email, password: senha, options: { data: { full_name: nome } } })
    .then(function (res) {
      if (res.error) {
        _mostrarErro(res.error.message);
      } else if (res.data && res.data.user && !res.data.session) {
        _mostrarErro('Verifique seu email para confirmar a conta.');
      }
      // Sucesso sem confirmação: onAuthStateChange dispara automaticamente
    });
}

function handleGoogle() {
  if (!window._supabase) { return; }
  window._supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
}

function handleLogout() {
  if (!window._supabase) { return; }
  window._supabase.auth.signOut().then(function () {
    renderDeslogado();
  });
}

// ── Util ──────────────────────────────────────────────────────────────────────
function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initAuth);
