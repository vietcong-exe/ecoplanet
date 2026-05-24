# Login + Sistema de Folhas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar autenticação Supabase (email+senha e Google OAuth) ao hub EcoPlanet com sistema de moeda "Folhas" concedida a cada vitória no jogo.

**Architecture:** Supabase JS SDK v2 carregado via CDN. `auth/supabase.js` inicializa o client global `window._supabase`. `auth/hub-auth.js` gerencia toda a UI de login no hub (modal, widget de perfil). `EndScene.js` chama Supabase ao detectar vitória com sessão ativa — sem afetar o fluxo quando o usuário não está logado.

**Tech Stack:** Supabase JS SDK v2 (CDN), HTML/CSS/JS puro, Supabase Auth (email+senha + Google OAuth), Supabase Postgres (tabela `profiles`).

---

## Pré-requisito Manual (fazer ANTES de executar as tasks)

O desenvolvedor precisa criar o projeto Supabase e configurar o banco antes de rodar o código.

**1. Criar projeto Supabase**
- Acesse [supabase.com](https://supabase.com) → New Project (grátis)
- Anote: **Project URL** (ex: `https://xyzabc.supabase.co`) e **anon public key**

**2. Criar tabela `profiles` e trigger (SQL Editor no painel Supabase)**

```sql
-- Tabela profiles
create table public.profiles (
  user_id      uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  folhas       integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Lê próprio perfil"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Atualiza próprio perfil"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Insere próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Trigger: cria perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**3. Ativar Google OAuth**
- Painel Supabase → Authentication → Providers → Google → Enable
- Insira Client ID e Client Secret do Google Cloud Console
- Em Authentication → URL Configuration → adicione `http://localhost:5500` como Site URL e Redirect URL

**4. Instalar Live Server no VS Code**
- Extensão "Live Server" (Ritwick Dey)
- Abrir `PROJETO_ALAMY/` no VS Code → clicar "Go Live" na barra inferior
- O hub abre em `http://localhost:5500`

---

## Mapa de Arquivos

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| CRIAR | `auth/supabase.js` | Inicializa `window._supabase` |
| CRIAR | `auth/hub-auth.js` | UI do modal, widget de perfil, handlers de auth |
| MODIFICAR | `index.html` | CSS de auth, div `#auth-zone`, tags `<script>` |
| MODIFICAR | `games/cidade-sustentavel-2050/index.html` | Tags `<script>` do SDK e client |
| MODIFICAR | `games/cidade-sustentavel-2050/src/scenes/EndScene.js` | Award Folha on victory |

---

## Task 1: Criar `auth/supabase.js`

**Files:**
- Create: `auth/supabase.js`

- [ ] **Step 1: Criar a pasta `auth/` e o arquivo**

Crie `C:\Users\dimi\Downloads\PROJETO_ALAMY\auth\supabase.js` com este conteúdo exato.
Substitua os placeholders com suas credenciais do painel Supabase → Settings → API.

```js
// auth/supabase.js
// Inicializa o client Supabase e expõe como window._supabase.
// Depende: SDK @supabase/supabase-js carregado via <script> CDN antes deste arquivo.
//
// COMO CONFIGURAR:
//   1. Acesse seu projeto em https://supabase.com
//   2. Settings → API → copie Project URL e anon public key
//   3. Substitua SUPABASE_URL e SUPABASE_ANON_KEY abaixo

(function () {
  var SUPABASE_URL      = 'https://SEU-PROJETO.supabase.co';
  var SUPABASE_ANON_KEY = 'SUA-ANON-KEY-AQUI';

  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.warn('[EcoPlanet] SDK Supabase não carregado. Auth desabilitado.');
    return;
  }

  window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
```

- [ ] **Step 2: Verificar criação**

```powershell
Test-Path "C:\Users\dimi\Downloads\PROJETO_ALAMY\auth\supabase.js"
```
Esperado: `True`

- [ ] **Step 3: Commit**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git add auth/supabase.js
git commit -m "feat: adiciona client Supabase (auth/supabase.js)"
```

---

## Task 2: Criar `auth/hub-auth.js`

**Files:**
- Create: `auth/hub-auth.js`

- [ ] **Step 1: Criar o arquivo**

Crie `C:\Users\dimi\Downloads\PROJETO_ALAMY\auth\hub-auth.js` com este conteúdo:

```js
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
```

- [ ] **Step 2: Verificar criação**

```powershell
Test-Path "C:\Users\dimi\Downloads\PROJETO_ALAMY\auth\hub-auth.js"
```
Esperado: `True`

- [ ] **Step 3: Commit**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git add auth/hub-auth.js
git commit -m "feat: adiciona logica de auth do hub (hub-auth.js)"
```

---

## Task 3: Atualizar `index.html` (hub)

**Files:**
- Modify: `index.html`

Três edições no arquivo `C:\Users\dimi\Downloads\PROJETO_ALAMY\index.html`.

- [ ] **Step 1: Adicionar CSS de autenticação**

Localize o final do bloco `<style>`, imediatamente antes de `  </style>`, e insira o bloco de CSS abaixo.

Encontre a string exata:
```
    footer span {
      font-size: 10px; color: #2d4a2d;
      letter-spacing: 0.5px;
    }
  </style>
```

Substitua por:
```
    footer span {
      font-size: 10px; color: #2d4a2d;
      letter-spacing: 0.5px;
    }

    /* ── AUTH ZONE ────────────────────────────────────── */
    #auth-zone {
      position: absolute;
      top: 20px;
      right: 40px;
      z-index: 10;
    }

    .btn-entrar {
      background: transparent;
      border: 1px solid #27ae60;
      color: #27ae60;
      font-family: 'Inter', sans-serif;
      font-size: 12px; font-weight: 600;
      padding: 7px 16px;
      border-radius: 4px;
      cursor: pointer;
      letter-spacing: 0.5px;
      transition: background 0.15s;
    }

    .btn-entrar:hover { background: #1a3a1a; }

    .widget-perfil {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: #27ae60;
      color: #0d1a0d;
      font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Inter', sans-serif;
    }

    .nome-usuario {
      font-size: 12px; color: #a9dfbf;
      font-family: 'Inter', sans-serif;
    }

    .folhas-count {
      font-size: 11px; color: #27ae60;
      font-family: 'Inter', sans-serif;
      background: #1a3a1a;
      border: 1px solid #2d6a3a;
      padding: 3px 8px;
      border-radius: 10px;
    }

    .btn-sair {
      background: transparent;
      border: none;
      color: #5a8a5a;
      font-size: 11px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      padding: 0;
    }

    .btn-sair:hover { color: #e74c3c; }

    /* ── MODAL ────────────────────────────────────────── */
    #modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      background: #0d1a0d;
      border: 1px solid #2d6a3a;
      border-radius: 10px;
      padding: 32px 36px;
      width: 340px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .modal-titulo {
      font-size: 20px; font-weight: 700;
      color: #e8f5e9;
      font-family: 'Inter', sans-serif;
      text-align: center;
      margin-bottom: 4px;
    }

    .modal-abas {
      display: flex;
      border-bottom: 1px solid #2d4a2d;
    }

    .aba {
      flex: 1;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #5a8a5a;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      padding: 8px;
      cursor: pointer;
      margin-bottom: -1px;
      transition: color 0.15s, border-color 0.15s;
    }

    .aba.ativa {
      color: #27ae60;
      border-bottom-color: #27ae60;
    }

    .campo {
      width: 100%;
      background: #1a2a1a;
      border: 1px solid #2d4a2d;
      border-radius: 5px;
      color: #e8f5e9;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      padding: 10px 12px;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }

    .campo:focus { border-color: #27ae60; }

    .btn-principal {
      width: 100%;
      background: #27ae60;
      border: none;
      border-radius: 5px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 13px; font-weight: 700;
      padding: 11px;
      cursor: pointer;
      letter-spacing: 0.5px;
      transition: background 0.15s;
    }

    .btn-principal:hover { background: #2ecc71; }

    .modal-separador {
      text-align: center;
      position: relative;
      color: #3a5a3a;
      font-size: 11px;
      font-family: 'Inter', sans-serif;
    }

    .modal-separador::before,
    .modal-separador::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #2d4a2d;
    }

    .modal-separador::before { left: 0; }
    .modal-separador::after  { right: 0; }

    .btn-google {
      width: 100%;
      background: #1a2a1a;
      border: 1px solid #2d4a2d;
      border-radius: 5px;
      color: #a9dfbf;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      padding: 10px;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .btn-google:hover { border-color: #27ae60; }

    .modal-erro {
      font-size: 12px;
      color: #e74c3c;
      font-family: 'Inter', sans-serif;
      min-height: 16px;
      text-align: center;
    }
  </style>
```

- [ ] **Step 2: Adicionar `#auth-zone` no hero**

Localize o final do `<header class="hero">`, imediatamente antes de `  </header>`:

Encontre:
```
    </div>
  </header>
```
(É o `</div>` que fecha `<div class="stats">`)

Substitua por:
```
    </div>
    <div id="auth-zone"></div>
  </header>
```

- [ ] **Step 3: Adicionar tags `<script>` antes de `</body>`**

Encontre:
```
</body>
</html>
```

Substitua por:
```
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="auth/supabase.js"></script>
  <script src="auth/hub-auth.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verificar no browser**

Abra o projeto com **Live Server** (`http://localhost:5500`). Verifique:
- Botão "Entrar" aparece no canto superior direito do hero
- Clicar em "Entrar" abre o modal com abas "Entrar" / "Cadastrar"
- Clicar fora do modal fecha ele
- Aba "Cadastrar" mostra campo extra "Nome"
- Console do browser não mostra erros (exceto o aviso de SDK se as credenciais ainda forem placeholder)

- [ ] **Step 5: Commit**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git add index.html
git commit -m "feat: adiciona UI de login ao hub (botao, modal, widget)"
```

---

## Task 4: Atualizar `games/cidade-sustentavel-2050/index.html`

**Files:**
- Modify: `games/cidade-sustentavel-2050/index.html`

- [ ] **Step 1: Adicionar SDK Supabase antes dos scripts do jogo**

No arquivo `games/cidade-sustentavel-2050/index.html`, localize:

```
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
```

Substitua por:

```
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
    <script src="../../auth/supabase.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
```

> O caminho `../../auth/supabase.js` é correto: o jogo está em `games/cidade-sustentavel-2050/`, portanto `../../` sobe dois níveis até a raiz do projeto.

- [ ] **Step 2: Verificar**

Abra `http://localhost:5500/games/cidade-sustentavel-2050/index.html`. O jogo deve carregar normalmente (menu, gameplay). No console do browser não deve haver erros de 404 para `supabase.min.js` ou `supabase.js`.

- [ ] **Step 3: Commit**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git add games/cidade-sustentavel-2050/index.html
git commit -m "feat: carrega Supabase SDK no jogo"
```

---

## Task 5: Atualizar `EndScene.js` — Award Folha on Victory

**Files:**
- Modify: `games/cidade-sustentavel-2050/src/scenes/EndScene.js`

- [ ] **Step 1: Chamar `concederFolha()` no `create()`**

Localize o final do método `create(data)` em `EndScene.js`:

```
    this.criarBotaoJogarNovamente(vitoria);
  }
```

Substitua por:

```
    this.criarBotaoJogarNovamente(vitoria);
    if (vitoria) { this.concederFolha(); }
  }
```

- [ ] **Step 2: Adicionar métodos `concederFolha` e `mostrarToastFolha`**

Localize o final da classe, a última chave de fechamento. O arquivo termina com:

```
  criarBotaoJogarNovamente(vitoria) {
```
... (corpo do método) ...
```
  }
}
```

Adicione os dois novos métodos antes do `}` final da classe. Encontre o último `  }` seguido de `}` (fechamento da classe) e substitua por:

```
  }

  // -----------------------------------------------------------------------
  // concederFolha — concede 1 Folha ao usuário logado ao vencer
  // -----------------------------------------------------------------------
  concederFolha() {
    if (!window._supabase) { return; } // SDK não carregado

    var self = this;

    window._supabase.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (!session) { return; } // não está logado

      var userId = session.user.id;

      window._supabase
        .from('profiles')
        .select('folhas')
        .eq('user_id', userId)
        .single()
        .then(function (res) {
          if (res.error || !res.data) { return; }
          var novasFolhas = (res.data.folhas || 0) + 1;

          window._supabase
            .from('profiles')
            .update({ folhas: novasFolhas })
            .eq('user_id', userId)
            .then(function (res) {
              if (!res.error) {
                self.mostrarToastFolha(novasFolhas);
              }
            });
        });
    });
  }

  // -----------------------------------------------------------------------
  // mostrarToastFolha — exibe toast animado com confirmação da Folha
  // -----------------------------------------------------------------------
  mostrarToastFolha(total) {
    var self = this;

    var toast = this.add.text(600, 195,
      'Folha conquistada!  (total: ' + total + ')',
      {
        fontSize:   '15px',
        fontStyle:  'bold',
        color:      '#2ecc71',
        fontFamily: 'Inter, Arial'
      }
    ).setOrigin(0.5).setAlpha(0).setDepth(50);

    this.tweens.add({
      targets:  toast,
      alpha:    1,
      duration: 400,
      ease:     'Power2',
      onComplete: function () {
        self.tweens.add({
          targets:  toast,
          alpha:    0,
          duration: 400,
          delay:    2600,
          onComplete: function () { toast.destroy(); }
        });
      }
    });
  }
}
```

> **Atenção:** o `}` final fecha a classe `EndScene`. Certifique-se de que o arquivo termina com exatamente um `}` após `mostrarToastFolha`.

- [ ] **Step 3: Verificar funcionamento**

Com as credenciais reais do Supabase configuradas em `auth/supabase.js`:

1. Abra `http://localhost:5500`
2. Clique "Entrar" → crie uma conta (email+senha)
3. Clique "JOGAR AGORA"
4. Jogue até vencer (ou use o modo de desenvolvimento — avance anos até 2050 com a cidade funcionando)
5. Na tela de vitória, o toast "Folha conquistada! (total: 1)" deve aparecer abaixo do título por ~3s
6. Volte ao hub (botão "← EcoPlanet") — o widget deve exibir "Folhas: 1"

- [ ] **Step 4: Verificar que não logado não tem erros**

1. Clique "Sair" no hub
2. Jogue e vença novamente
3. Tela de vitória deve aparecer normalmente sem o toast e sem erros no console

- [ ] **Step 5: Commit**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git add games/cidade-sustentavel-2050/src/scenes/EndScene.js
git commit -m "feat: concede Folha ao vencer (EndScene + Supabase)"
```

---

## Verificação Final

- [ ] Hub mostra botão "Entrar" no canto do hero
- [ ] Modal abre com abas Login / Cadastrar + botão Google
- [ ] Cadastro com email+senha cria conta e loga automaticamente
- [ ] Widget exibe inicial + nome + "Folhas: 0" após login
- [ ] Logout volta ao botão "Entrar"
- [ ] Vencer o jogo logado → toast + folhas incrementadas no DB
- [ ] Vencer o jogo sem login → sem toast, sem erros JS
- [ ] Widget no hub mostra contagem atualizada após retornar do jogo
