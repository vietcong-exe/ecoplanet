# Redesign Infantil do Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar o visual do hub EcoPlanet (`index.html`) para um público infantojuvenil com céu azul, nuvens CSS, fonte arredondada e cards coloridos, sem alterar nenhum arquivo de lógica.

**Architecture:** Apenas `index.html` é modificado. O `<head>` ganha Nunito + Font Awesome 6. O `<style>` é reescrito completamente (tema claro, natureza). O `<body>` tem o hero reestruturado com decorações CSS puras (nuvens, sol, grama) e os cards ganham ícones FA. Os scripts de auth (`auth/supabase.js`, `auth/hub-auth.js`) e os arquivos do jogo não são tocados.

**Tech Stack:** HTML/CSS puro, Nunito (Google Fonts CDN), Font Awesome 6 Free (cdnjs CDN).

---

## Mapa de Arquivos

| Ação | Arquivo |
|------|---------|
| MODIFICAR | `index.html` |

---

## Task 1: Atualizar `<head>` — dependências e título

**Files:**
- Modify: `index.html` (linhas 1–8)

- [ ] **Step 1: Substituir o `<head>` completo**

Encontre o bloco atual do `<head>` (linhas 1–8):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoPlanet — Jogos pelo Clima</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
```

Substitua por:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoPlanet — Jogos pelo Clima</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
```

- [ ] **Step 2: Verificar**

Abra `index.html` num editor e confirme que:
- `Inter` não aparece mais no `<head>`
- `Nunito` está presente no link do Google Fonts
- O link do Font Awesome (`cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0`) está presente

---

## Task 2: Reescrever o bloco `<style>` completo

**Files:**
- Modify: `index.html` (bloco `<style>` inteiro, da linha 8 até `</style>`)

- [ ] **Step 1: Localizar e substituir o bloco `<style>` inteiro**

Encontre tudo entre `<style>` e `</style>` (inclusive) e substitua pelo CSS abaixo:

```html
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Nunito', 'Arial Rounded MT Bold', sans-serif;
      background: #f1f8e9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: #33691e;
    }

    /* ── HERO ─────────────────────────────────────────── */
    .hero {
      background: linear-gradient(180deg, #29b6f6 0%, #81d4fa 60%, #b3e5fc 100%);
      position: relative;
      overflow: hidden;
      min-height: 220px;
    }

    /* nuvens */
    .cloud {
      position: absolute;
      background: #fff;
      border-radius: 50px;
      opacity: 0.85;
    }
    .cloud::before, .cloud::after {
      content: '';
      position: absolute;
      background: #fff;
      border-radius: 50%;
    }
    .cloud-1 { width: 100px; height: 30px; top: 30px; left: 60px; }
    .cloud-1::before { width: 50px; height: 50px; top: -25px; left: 15px; }
    .cloud-1::after  { width: 35px; height: 35px; top: -18px; left: 45px; }
    .cloud-2 { width: 70px; height: 22px; top: 20px; right: 120px; }
    .cloud-2::before { width: 35px; height: 35px; top: -18px; left: 10px; }
    .cloud-2::after  { width: 25px; height: 25px; top: -12px; left: 35px; }
    .cloud-3 { width: 85px; height: 26px; top: 55px; right: 260px; opacity: 0.6; }
    .cloud-3::before { width: 42px; height: 42px; top: -21px; left: 12px; }
    .cloud-3::after  { width: 30px; height: 30px; top: -15px; left: 42px; }

    /* sol */
    .sun {
      position: absolute;
      top: 18px; right: 40px;
      width: 60px; height: 60px;
      background: #ffd600;
      border-radius: 50%;
      box-shadow: 0 0 0 8px #ffd60033, 0 0 0 16px #ffd60018;
    }

    /* grama */
    .grass {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 48px;
      background: #4caf50;
      border-radius: 60% 60% 0 0 / 30px 30px 0 0;
    }
    .grass::before {
      content: '';
      position: absolute;
      bottom: 100%; left: 0; right: 0;
      height: 18px;
      background: #66bb6a;
      border-radius: 60% 60% 0 0 / 18px 18px 0 0;
    }

    /* nav */
    .nav {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 28px 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fff;
      border-radius: 50px;
      padding: 8px 18px 8px 10px;
      box-shadow: 0 4px 0 #00000018;
    }
    .logo-icon {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #43a047, #66bb6a);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 0 #2e7d3244;
    }
    .logo-icon i { color: #fff; font-size: 17px; }
    .logo-name { font-size: 18px; font-weight: 900; color: #2e7d32; }

    /* headline hero */
    .hero-content {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 18px 20px 70px;
    }
    .hero-title {
      font-size: 30px; font-weight: 900;
      color: #fff;
      text-shadow: 0 3px 0 #00000022;
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .hero-title span { color: #ffd600; }
    .hero-sub { font-size: 15px; color: #e3f2fd; font-weight: 700; }

    /* ── MAIN ─────────────────────────────────────────── */
    .main {
      flex: 1;
      background: #f1f8e9;
      padding: 28px 24px;
      max-width: 860px;
      margin: 0 auto;
      width: 100%;
    }

    .section-label {
      font-size: 13px; font-weight: 900;
      color: #558b2f;
      text-transform: uppercase; letter-spacing: 2px;
      margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }
    .section-label i { color: #8bc34a; }

    /* ── GAME CARDS ───────────────────────────────────── */
    .games-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .game-card {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 6px 0 #c8e6c9, 0 8px 16px #00000012;
      transition: transform 0.15s;
      cursor: pointer;
      border: none;
    }
    .game-card:hover { transform: translateY(-4px); }
    .game-card.coming-soon {
      opacity: 0.55;
      cursor: default;
      pointer-events: none;
    }

    .card-thumbnail {
      height: 110px;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .card-thumbnail.city { background: linear-gradient(135deg, #ff8f00, #ffca28); }
    .card-thumbnail.empty { background: #f5f5f5; }

    .card-thumb-icon {
      width: 56px; height: 56px;
      border-radius: 16px;
      background: #fff3;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 0 #00000015;
    }
    .card-thumb-icon i { font-size: 28px; color: #fff; }
    .card-thumbnail.empty .card-thumb-icon { background: #eee; box-shadow: none; }
    .card-thumbnail.empty .card-thumb-icon i { color: #ccc; }

    .badge {
      position: absolute; top: 10px; right: 10px;
      background: #43a047; color: #fff;
      font-size: 9px; font-weight: 900;
      padding: 3px 10px; border-radius: 50px;
      letter-spacing: 0.5px; text-transform: uppercase;
    }

    .card-body { padding: 14px; }

    .card-title {
      font-size: 13px; font-weight: 900;
      color: #33691e; margin-bottom: 3px;
    }
    .card-title.muted { color: #bdbdbd; }

    .card-sub {
      font-size: 10px; color: #a5d6a7;
      font-weight: 700; margin-bottom: 10px;
    }
    .card-sub.muted { color: #e0e0e0; }

    .btn-play {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      width: 100%;
      background: linear-gradient(180deg, #66bb6a, #43a047);
      border: none; border-radius: 50px;
      padding: 10px;
      font-family: 'Nunito', sans-serif;
      font-size: 12px; font-weight: 900;
      color: #fff; cursor: pointer;
      box-shadow: 0 4px 0 #2e7d32;
      text-transform: uppercase; letter-spacing: 0.5px;
      transition: transform 0.1s;
    }
    .btn-play:hover { background: linear-gradient(180deg, #81c784, #66bb6a); }
    .btn-play:active { transform: translateY(2px); box-shadow: 0 2px 0 #2e7d32; }

    .btn-coming {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      background: #f5f5f5;
      border: 2px dashed #e0e0e0;
      border-radius: 50px;
      padding: 9px;
      font-family: 'Nunito', sans-serif;
      font-size: 11px; font-weight: 800;
      color: #bdbdbd;
      text-transform: uppercase; letter-spacing: 0.5px;
    }

    /* ── ODS BLOCK ────────────────────────────────────── */
    .ods-block {
      background: #fff;
      border-radius: 20px;
      padding: 20px 24px;
      box-shadow: 0 6px 0 #c8e6c9, 0 8px 16px #00000010;
      display: flex; gap: 16px; align-items: flex-start;
      margin-bottom: 28px;
    }
    .ods-icon-wrap {
      width: 52px; height: 52px;
      border-radius: 16px;
      background: linear-gradient(135deg, #ff8f00, #ffca28);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 0 #e65100;
    }
    .ods-icon-wrap i { color: #fff; font-size: 24px; }
    .ods-title {
      font-size: 12px; font-weight: 900;
      color: #e65100;
      text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .ods-text { font-size: 13px; color: #558b2f; font-weight: 700; line-height: 1.6; }

    /* ── FOOTER ───────────────────────────────────────── */
    footer {
      background: #4caf50;
      padding: 14px 28px;
      display: flex; justify-content: space-between; align-items: center;
    }
    footer span {
      font-size: 11px; color: #e8f5e9;
      font-weight: 700; opacity: 0.85; letter-spacing: 0.5px;
    }

    /* ── AUTH ZONE ────────────────────────────────────── */
    #auth-zone {
      position: absolute;
      top: 18px; right: 28px;
      z-index: 10;
    }

    .btn-entrar {
      background: #fff;
      border: none; border-radius: 50px;
      padding: 9px 20px;
      font-family: 'Nunito', sans-serif;
      font-size: 13px; font-weight: 800;
      color: #1565c0; cursor: pointer;
      box-shadow: 0 4px 0 #00000018;
      display: flex; align-items: center; gap: 7px;
      transition: transform 0.1s;
    }
    .btn-entrar:hover { transform: translateY(-2px); }

    .widget-perfil {
      display: flex; align-items: center; gap: 8px;
      background: #fff;
      border-radius: 50px;
      padding: 6px 14px 6px 6px;
      box-shadow: 0 4px 0 #00000018;
    }

    .avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: #43a047; color: #fff;
      font-size: 13px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Nunito', sans-serif;
    }

    .nome-usuario {
      font-size: 12px; color: #33691e; font-weight: 800;
      font-family: 'Nunito', sans-serif;
    }

    .folhas-count {
      font-size: 11px; color: #2e7d32; font-weight: 800;
      font-family: 'Nunito', sans-serif;
      background: #e8f5e9;
      border: 1px solid #a5d6a7;
      padding: 3px 8px; border-radius: 10px;
    }

    .btn-sair {
      background: transparent; border: none;
      color: #ef9a9a;
      font-size: 11px; font-weight: 800;
      font-family: 'Nunito', sans-serif;
      cursor: pointer; padding: 0;
    }
    .btn-sair:hover { color: #e53935; }

    /* ── MODAL ────────────────────────────────────────── */
    #modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      background: #fff;
      border: 2px solid #a5d6a7;
      border-radius: 20px;
      padding: 32px 36px;
      width: 340px;
      display: flex; flex-direction: column; gap: 14px;
      box-shadow: 0 8px 0 #c8e6c9;
    }

    .modal-titulo {
      font-size: 22px; font-weight: 900;
      color: #2e7d32;
      font-family: 'Nunito', sans-serif;
      text-align: center; margin-bottom: 4px;
    }

    .modal-abas {
      display: flex;
      border-bottom: 2px solid #e8f5e9;
    }

    .aba {
      flex: 1; background: transparent; border: none;
      border-bottom: 2px solid transparent;
      color: #a5d6a7;
      font-family: 'Nunito', sans-serif;
      font-size: 13px; font-weight: 800;
      padding: 8px; cursor: pointer;
      margin-bottom: -2px;
      transition: color 0.15s, border-color 0.15s;
    }
    .aba.ativa { color: #43a047; border-bottom-color: #43a047; }

    .campo {
      width: 100%;
      background: #f9fbe7;
      border: 2px solid #c8e6c9;
      border-radius: 10px;
      color: #33691e;
      font-family: 'Nunito', sans-serif;
      font-size: 13px; font-weight: 700;
      padding: 10px 12px; outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    .campo:focus { border-color: #43a047; }
    .campo::placeholder { color: #a5d6a7; }

    .btn-principal {
      width: 100%;
      background: linear-gradient(180deg, #66bb6a, #43a047);
      border: none; border-radius: 50px;
      color: #fff;
      font-family: 'Nunito', sans-serif;
      font-size: 14px; font-weight: 900;
      padding: 12px; cursor: pointer;
      box-shadow: 0 4px 0 #2e7d32;
      transition: transform 0.1s;
    }
    .btn-principal:hover { transform: translateY(-2px); }
    .btn-principal:active { transform: translateY(2px); box-shadow: 0 2px 0 #2e7d32; }

    .modal-separador {
      text-align: center; position: relative;
      color: #a5d6a7; font-size: 11px; font-weight: 700;
      font-family: 'Nunito', sans-serif;
    }
    .modal-separador::before, .modal-separador::after {
      content: ''; position: absolute; top: 50%;
      width: 40%; height: 1px; background: #e8f5e9;
    }
    .modal-separador::before { left: 0; }
    .modal-separador::after  { right: 0; }

    .btn-google {
      width: 100%;
      background: #f5f5f5; border: 2px solid #e0e0e0;
      border-radius: 50px; color: #555;
      font-family: 'Nunito', sans-serif;
      font-size: 13px; font-weight: 800;
      padding: 10px; cursor: pointer;
      transition: border-color 0.15s;
    }
    .btn-google:hover { border-color: #43a047; }

    .modal-erro {
      font-size: 12px; color: #e53935; font-weight: 700;
      font-family: 'Nunito', sans-serif;
      min-height: 16px; text-align: center;
    }
  </style>
```

- [ ] **Step 2: Verificar que não sobrou CSS antigo**

No arquivo, busque por estas strings — nenhuma deve aparecer no bloco `<style>`:
- `#111d11` (fundo escuro antigo)
- `#0d1a0d` (verde escuro antigo)
- `Inter` (fonte antiga)
- `mini-grid` (classe antiga do card)
- `empty-icon` (classe antiga do card vazio)
- `logo-icon-inner` (elemento antigo do logo)

---

## Task 3: Reescrever o `<body>` HTML

**Files:**
- Modify: `index.html` (bloco `<body>` inteiro)

- [ ] **Step 1: Substituir todo o conteúdo do `<body>` até os scripts**

Encontre tudo de `<body>` até (mas não incluindo) os três `<script>` no final, e substitua por:

```html
<body>

  <!-- HERO: céu com nuvens, sol e grama CSS -->
  <header class="hero">
    <div class="cloud cloud-1"></div>
    <div class="cloud cloud-2"></div>
    <div class="cloud cloud-3"></div>
    <div class="sun"></div>
    <div class="grass"></div>

    <nav class="nav">
      <div class="logo">
        <div class="logo-icon"><i class="fa-solid fa-earth-americas"></i></div>
        <span class="logo-name">EcoPlanet</span>
      </div>
      <div id="auth-zone"></div>
    </nav>

    <div class="hero-content">
      <div class="hero-title">Jogue e <span>salve o planeta!</span></div>
      <div class="hero-sub">Aprenda sobre o clima de um jeito divertido</div>
    </div>
  </header>

  <main class="main">

    <div class="section-label">
      <i class="fa-solid fa-gamepad"></i> Jogos
    </div>

    <div class="games-grid">

      <!-- Cidade Sustentável 2050 -->
      <div class="game-card"
           onclick="window.location.href='games/cidade-sustentavel-2050/index.html'">
        <div class="card-thumbnail city">
          <div class="card-thumb-icon"><i class="fa-solid fa-city"></i></div>
          <div class="badge">Disponível</div>
        </div>
        <div class="card-body">
          <div class="card-title">Cidade Sustentável 2050</div>
          <div class="card-sub">City builder climático · ODS 13</div>
          <button class="btn-play"
                  onclick="event.stopPropagation();
                           window.location.href='games/cidade-sustentavel-2050/index.html'">
            <i class="fa-solid fa-play"></i> Jogar Agora!
          </button>
        </div>
      </div>

      <!-- Em breve 1 -->
      <div class="game-card coming-soon">
        <div class="card-thumbnail empty">
          <div class="card-thumb-icon"><i class="fa-solid fa-tree"></i></div>
        </div>
        <div class="card-body">
          <div class="card-title muted">Em breve...</div>
          <div class="card-sub muted">Novo jogo · ODS ???</div>
          <div class="btn-coming">
            <i class="fa-solid fa-clock"></i> Em desenvolvimento
          </div>
        </div>
      </div>

      <!-- Em breve 2 -->
      <div class="game-card coming-soon">
        <div class="card-thumbnail empty">
          <div class="card-thumb-icon"><i class="fa-solid fa-water"></i></div>
        </div>
        <div class="card-body">
          <div class="card-title muted">Em breve...</div>
          <div class="card-sub muted">Novo jogo · ODS ???</div>
          <div class="btn-coming">
            <i class="fa-solid fa-clock"></i> Em desenvolvimento
          </div>
        </div>
      </div>

    </div>

    <div class="section-label">
      <i class="fa-solid fa-circle-info"></i> Por que isso importa?
    </div>
    <div class="ods-block">
      <div class="ods-icon-wrap">
        <i class="fa-solid fa-temperature-arrow-up"></i>
      </div>
      <div>
        <div class="ods-title">ODS 13 — Ação Climática</div>
        <p class="ods-text">
          O planeta precisa de heróis! No EcoPlanet, cada jogo ensina decisões reais
          que afetam o clima — do gerenciamento de cidades à preservação de ecossistemas.
          Aprenda jogando e mude o mundo pensando!
        </p>
      </div>
    </div>

  </main>

  <footer>
    <span>EcoPlanet · Lógica de Programação · UNINASSAU 2026</span>
    <span>ODS 13 — Agenda 2030</span>
  </footer>

```

Os três `<script>` no final do arquivo **permanecem intactos**:
```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="auth/supabase.js"></script>
  <script src="auth/hub-auth.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificar que não sobrou HTML antigo**

Busque no arquivo — nenhum destes deve aparecer no `<body>`:
- `logo-icon-inner` (div interna antiga do logo)
- `mini-grid` (mini tiles do card antigo)
- `mini-tile` (tiles coloridos antigos)
- `empty-icon` (círculo com `?` antigo)
- `class="tagline"` (subtítulo antigo do hero)
- `class="stats"` (bloco de estatísticas antigo)

- [ ] **Step 3: Commit**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git add index.html
git commit -m "feat: redesign infantil do hub (natureza, Nunito, Font Awesome)"
```

---

## Task 4: Verificar localmente e publicar

**Files:** nenhum — apenas verificação e deploy

- [ ] **Step 1: Abrir o Live Server**

Abra a pasta `C:\Users\dimi\Downloads\PROJETO_ALAMY` no VS Code e clique em **Go Live** na barra inferior. O hub abre em `http://localhost:5500`.

Verifique visualmente:
- Hero com fundo azul céu, 3 nuvens brancas, sol amarelo e grama verde
- Logo EcoPlanet em pill branca com ícone FA
- Título "Jogue e **salve o planeta!**" em branco/amarelo
- Botão "Entrar" em pill branca no canto superior direito
- Fundo principal verde claro (`#f1f8e9`)
- Cards brancos arredondados com sombra verde
- Card "Cidade 2050" com thumbnail laranja e ícone de cidade FA
- Cards "Em breve" acinzentados com ícones de árvore e água
- Botão "Jogar Agora!" verde com sombra
- Bloco ODS com card branco e ícone de temperatura laranja
- Footer verde com texto claro
- Nenhum emoji visível

- [ ] **Step 2: Testar o auth**

Com Live Server rodando (`http://localhost:5500`):
1. Clique "Entrar" → modal abre com fundo branco, bordas verdes, fonte Nunito
2. Troque para aba "Cadastrar" → campo "Nome" aparece
3. Clique fora do modal → fecha
4. Faça login com uma conta existente → widget aparece (pill branca com avatar verde + nome + folhas)
5. Clique "Sair" → volta para botão "Entrar"

- [ ] **Step 3: Push para GitHub Pages**

```powershell
cd "C:\Users\dimi\Downloads\PROJETO_ALAMY"
git push
```

Aguarde ~1 minuto e acesse `https://vietcong-exe.github.io/ecoplanet/` para confirmar o redesign no ar.

---

## Verificação Final

- [ ] Hero: céu azul + nuvens CSS + sol + grama
- [ ] Logo: pill branca + ícone FA `fa-earth-americas` + "EcoPlanet"
- [ ] Fonte Nunito aplicada em todo o hub incluindo modal
- [ ] Cards com `border-radius: 20px` e sombra `#c8e6c9`
- [ ] Nenhum emoji em nenhuma parte do layout
- [ ] Auth: btn-entrar pill branca, modal branco com bordas verdes
- [ ] Widget logado: pill branca com avatar verde
- [ ] Footer verde no rodapé (sticky)
- [ ] Deploy funcionando em `https://vietcong-exe.github.io/ecoplanet/`
