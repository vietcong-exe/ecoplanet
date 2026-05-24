# EcoPlanet — Login + Sistema de Folhas — Design Spec
**Data:** 2026-05-24
**Projeto:** EcoPlanet — UNINASSAU, Lógica de Programação
**Escopo:** Sistema de autenticação (email+senha e Google OAuth) com moeda "Folhas" concedida ao vencer jogos

---

## 1. Visão Geral

Adiciona contas de usuário ao portal EcoPlanet usando **Supabase** como backend (auth + banco de dados).
Cada vitória em qualquer jogo concede **1 Folha** ao jogador logado.
O sistema é **opcional**: jogos continuam 100% funcionais para usuários não logados.

### Restrição de Ambiente

Supabase Auth exige `http://` ou `https://` (não funciona em `file://`).
O projeto deve ser servido via **VS Code Live Server** (porta 5500) para desenvolvimento,
ou via **GitHub Pages / Netlify** para deploy.

---

## 2. Stack Técnica

| Componente | Tecnologia |
|---|---|
| Auth provider | Supabase Auth (email+senha + Google OAuth) |
| Banco de dados | Supabase Postgres (tabela `profiles`) |
| SDK | `@supabase/supabase-js` v2 via CDN |
| Frontend | HTML/CSS/JS puro (sem bundler) |
| Armazenamento de sessão | Supabase gerencia via `localStorage` automaticamente |

---

## 3. Estrutura de Arquivos

### Arquivos Novos
```
auth/
└── supabase.js         ← inicializa e exporta o client Supabase (URL + anon key)
```

### Arquivos Modificados
```
index.html                                    ← login button, modal, profile widget
games/cidade-sustentavel-2050/index.html      ← carrega auth/supabase.js (caminho: ../../auth/supabase.js)
games/cidade-sustentavel-2050/src/scenes/EndScene.js  ← award Folha on victory
```

---

## 4. Banco de Dados (Supabase)

### Tabela `profiles`

```sql
create table public.profiles (
  user_id      uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  folhas       integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Usuário lê próprio perfil"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Usuário insere próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = user_id);
```

### Trigger — criar perfil automático no cadastro

```sql
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

---

## 5. `auth/supabase.js`

Inicializa o client Supabase e expõe como variável global `window.supabase`:

```js
// auth/supabase.js
// Substitua SUPABASE_URL e SUPABASE_ANON_KEY pelas suas credenciais do projeto.
(function () {
  var SUPABASE_URL      = 'https://SEU-PROJETO.supabase.co';
  var SUPABASE_ANON_KEY = 'SUA-ANON-KEY';

  // SDK carregado via <script> antes deste arquivo
  window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
```

> O SDK do Supabase é carregado via CDN antes deste script.
> `window._supabase` é o nome do client para não conflitar com o namespace `supabase` do próprio SDK.

---

## 6. Hub (`index.html`) — Mudanças

### 6.1 Scripts adicionados (antes de `</body>`)

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="auth/supabase.js"></script>
<script src="auth/hub-auth.js"></script>
```

> `hub-auth.js` é um novo arquivo que contém toda a lógica de UI do modal e do widget de perfil.

### 6.2 Novo arquivo: `auth/hub-auth.js`

Responsabilidade única: gerenciar o estado de login no hub (botão, modal, widget).

**Funções expostas internamente:**
- `initAuth()` — chama `getSession()`, exibe estado correto (logado/deslogado)
- `abrirModal(aba)` — exibe modal com aba "login" ou "cadastro"
- `fecharModal()` — remove o overlay
- `handleLogin(email, senha)` — chama `signInWithPassword`, trata erros
- `handleCadastro(nome, email, senha)` — chama `signUp`, trata erros
- `handleGoogle()` — chama `signInWithOAuth({ provider: 'google' })`
- `handleLogout()` — chama `signOut`, volta ao estado deslogado
- `renderLogado(user, perfil)` — substitui botão por widget com nome + folhas
- `renderDeslogado()` — exibe botão "Entrar"

### 6.3 Botão "Entrar" no hero

Adicionado no canto superior direito do `<header class="hero">`:

```html
<!-- Estado deslogado -->
<button id="btn-entrar" onclick="abrirModal('login')">Entrar</button>

<!-- Estado logado (gerado por JS) -->
<div id="widget-perfil">
  <div id="avatar">A</div>
  <span id="nome-usuario">Alexandre</span>
  <span id="folhas-count">🌿 3</span>
  <button id="btn-sair" onclick="handleLogout()">Sair</button>
</div>
```

### 6.4 Modal de login

Overlay gerado dinamicamente por `hub-auth.js` via `innerHTML` no `<body>`.
Estrutura:
- Fundo escuro semi-transparente (clique fecha)
- Card central com título "EcoPlanet"
- Abas: Entrar | Cadastrar
- Campos: Nome (só cadastro), Email, Senha
- Botão principal (ENTRAR ou CRIAR CONTA)
- Divisor "ou"
- Botão Google
- Área de mensagem de erro

---

## 7. Jogo — Mudanças

### 7.1 `games/cidade-sustentavel-2050/index.html`

Adiciona SDK + client antes dos scripts do jogo:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="../../auth/supabase.js"></script>
```

### 7.2 `EndScene.js` — Award Folha on Victory

No método `create(data)`, após `criarBotaoJogarNovamente(vitoria)`, adicionar chamada:

```js
if (vitoria) {
  this.concederFolha();
}
```

Novo método `concederFolha()`:

```js
concederFolha: function() {
  var self = this;
  if (!window._supabase) { return; } // SDK não carregado (file://)

  window._supabase.auth.getSession().then(function(res) {
    var session = res.data && res.data.session;
    if (!session) { return; } // não logado

    var userId = session.user.id;

    // Busca folhas atuais e incrementa
    window._supabase
      .from('profiles')
      .select('folhas')
      .eq('user_id', userId)
      .single()
      .then(function(res) {
        if (res.error || !res.data) { return; }
        var novasFolhas = (res.data.folhas || 0) + 1;

        window._supabase
          .from('profiles')
          .update({ folhas: novasFolhas })
          .eq('user_id', userId)
          .then(function() {
            self.mostrarToastFolha(novasFolhas);
          });
      });
  });
},

mostrarToastFolha: function(total) {
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
    onComplete: function() {
      this.tweens.add({
        targets:  toast,
        alpha:    0,
        duration: 400,
        delay:    2600,
        onComplete: function() { toast.destroy(); }
      }, this);
    },
    callbackScope: this
  });
}
```

---

## 8. Setup Manual (Supabase)

Passos que o desenvolvedor executa uma vez:

1. Criar projeto em [supabase.com](https://supabase.com) (plano grátis)
2. Menu **Settings → API**: copiar `Project URL` e `anon public` key → colar em `auth/supabase.js`
3. Menu **SQL Editor**: executar os SQLs da tabela `profiles` e do trigger (Seção 4)
4. Menu **Authentication → Providers → Google**: ativar e inserir Client ID + Secret do Google Cloud Console
5. Menu **Authentication → URL Configuration**: adicionar `http://localhost:5500` como Site URL e redirect URL
6. Instalar extensão **Live Server** no VS Code e clicar "Go Live" para servir o projeto

---

## 9. Fluxo Completo

```
Hub (deslogado)
  └── clica "Entrar"
      └── modal abre (aba Login)
          ├── email+senha → signInWithPassword → modal fecha → widget logado
          ├── aba Cadastrar → signUp → modal fecha → widget logado
          └── Google → signInWithOAuth → redirect → volta ao hub logado

Hub (logado)
  └── "Alexandre  🌿 3"
  └── clica "JOGAR AGORA"
      └── game carrega (com Supabase SDK)
          └── jogo termina em VITÓRIA
              └── concederFolha() → DB: folhas = 4
                  └── toast "Folha conquistada! (total: 4)"
  └── volta ao hub (reload)
      └── widget exibe "Alexandre  🌿 4"
```

---

## 10. Critérios de Sucesso

- [ ] Servido via Live Server em `http://localhost:5500`
- [ ] Cadastro com email+senha cria perfil com folhas = 0
- [ ] Login com Google redireciona e autentica corretamente
- [ ] Widget exibe nome e folhas do usuário logado
- [ ] Logout volta ao botão "Entrar"
- [ ] Vencer jogo (logado) → folhas incrementa no DB → toast exibido
- [ ] Vencer jogo (não logado) → nenhuma mudança no EndScene
- [ ] Usuário não logado pode jogar normalmente (sem erros JS)

---

## 11. Fora de Escopo

- Recuperação de senha (link de reset por email)
- Ranking público de Folhas
- Uso futuro das Folhas (loja, recompensas) — arquitetura preparada mas não implementada
- Animação do ícone de Folha no widget do hub
- Segundo jogo integrado ao sistema de Folhas
