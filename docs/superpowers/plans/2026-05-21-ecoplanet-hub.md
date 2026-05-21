# EcoPlanet Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o hub EcoPlanet que hospeda "Cidade Sustentável 2050" e slots para jogos futuros, reestruturando o projeto para que `index.html` na raiz seja o portal e o jogo fique em `games/cidade-sustentavel-2050/`.

**Architecture:** O hub é HTML/CSS/JS puro, sem frameworks. O jogo é movido para uma subpasta via `git mv` (mantendo o histórico git). Um botão fixo "← EcoPlanet" no jogo permite retornar ao hub. Nenhum código de gameplay é alterado.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla, Google Fonts (Inter). O jogo continua usando Phaser 3 via CDN.

---

## Mapa de Arquivos

| Ação | Caminho original | Caminho final |
|------|-----------------|---------------|
| MOVER | `index.html` | `games/cidade-sustentavel-2050/index.html` |
| MOVER | `src/` | `games/cidade-sustentavel-2050/src/` |
| CRIAR | — | `index.html` (hub EcoPlanet) |
| MODIFICAR | `games/cidade-sustentavel-2050/index.html` | Adiciona botão "← EcoPlanet" |

---

## Task 1: Mover o jogo para subpasta

**Files:**
- Move: `index.html` → `games/cidade-sustentavel-2050/index.html`
- Move: `src/` → `games/cidade-sustentavel-2050/src/`

> Usamos `git mv` para preservar o histórico. Todos os `src/` relativos dentro do `index.html` do jogo continuam corretos porque `index.html` e `src/` ficam na mesma pasta depois da movimentação.

- [ ] **Step 1: Criar a pasta destino**

```powershell
New-Item -ItemType Directory -Force -Path "games\cidade-sustentavel-2050"
```

Esperado: pasta criada sem erro (ou já existia).

- [ ] **Step 2: Mover index.html do jogo**

```powershell
git mv index.html games/cidade-sustentavel-2050/index.html
```

Esperado: sem erros.

- [ ] **Step 3: Mover a pasta src/**

```powershell
git mv src games/cidade-sustentavel-2050/src
```

Esperado: sem erros.

- [ ] **Step 4: Verificar estrutura**

```powershell
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\\.superpowers\\' } | Select-Object -ExpandProperty FullName
```

Esperado: ver arquivos em `games\cidade-sustentavel-2050\index.html` e `games\cidade-sustentavel-2050\src\...`. Nenhum `index.html` ou pasta `src\` na raiz.

- [ ] **Step 5: Verificar que o jogo ainda abre corretamente**

Abra `games\cidade-sustentavel-2050\index.html` diretamente no browser (duplo-clique). O jogo deve carregar normalmente — menu, gameplay, end screen. Se algum script der 404, significa que um `src/` relativo ficou apontando errado.

- [ ] **Step 6: Commit**

```powershell
git add -A
git commit -m "refactor: move game to games/cidade-sustentavel-2050/"
```

---

## Task 2: Criar o hub EcoPlanet (`index.html` na raiz)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Criar o arquivo do hub**

Crie `index.html` na raiz do projeto com o conteúdo abaixo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoPlanet — Jogos pelo Clima</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #111d11;
      color: #e8f5e9;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
    }

    /* ── HERO ─────────────────────────────────────────── */
    .hero {
      background: linear-gradient(180deg, #0d1a0d 0%, #1a2a1a 100%);
      padding: 40px 60px 32px;
      border-bottom: 1px solid #2d4a2d;
      position: relative;
      overflow: hidden;
    }

    .hero::after {
      content: '';
      position: absolute;
      right: 80px;
      top: 0; bottom: 0;
      width: 300px;
      background: radial-gradient(ellipse at center, rgba(39,174,96,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 10px;
    }

    .logo-icon {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #27ae60, #e67e22);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .logo-icon-inner {
      width: 16px; height: 16px;
      border-radius: 50%;
      background: #0d1a0d;
    }

    .logo-name {
      font-size: 28px; font-weight: 700;
      color: #e8f5e9;
      letter-spacing: 1px;
    }

    .tagline {
      color: #81c784;
      font-size: 14px; font-style: italic;
      margin-left: 54px; margin-bottom: 24px;
    }

    .stats {
      display: flex; gap: 32px;
      margin-left: 54px;
    }

    .stat-value {
      font-size: 22px; font-weight: 700;
      color: #27ae60; line-height: 1;
    }

    .stat-value.orange { color: #e67e22; }

    .stat-label {
      font-size: 10px; color: #5a8a5a;
      text-transform: uppercase; letter-spacing: 1.5px;
      margin-top: 4px;
    }

    /* ── MAIN ─────────────────────────────────────────── */
    .main {
      max-width: 960px;
      margin: 0 auto;
      padding: 40px;
    }

    .section-label {
      font-size: 10px; color: #5a8a5a;
      text-transform: uppercase; letter-spacing: 2px;
      margin-bottom: 16px;
    }

    /* ── GAMES GRID ───────────────────────────────────── */
    .games-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin-bottom: 48px;
    }

    .game-card {
      background: #1e3a1e;
      border: 1px solid #2d6a3a;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    }

    .game-card:hover {
      border-color: #27ae60;
      box-shadow: 0 4px 20px rgba(39,174,96,0.2);
      transform: translateY(-2px);
    }

    .game-card.coming-soon {
      opacity: 0.45;
      cursor: default;
      pointer-events: none;
    }

    .card-thumbnail {
      height: 110px;
      background: linear-gradient(135deg, #1e5631, #27ae60);
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }

    .card-thumbnail .badge {
      position: absolute; top: 8px; right: 10px;
      background: #27ae60; color: #fff;
      font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
      padding: 3px 8px; border-radius: 10px;
    }

    .mini-grid {
      display: grid;
      grid-template-columns: repeat(3, 16px);
      gap: 3px;
    }

    .mini-tile { height: 16px; border-radius: 2px; }

    .card-thumbnail.empty {
      background: #1a2a1a;
      border-bottom: 1px solid #2a3a2a;
    }

    .empty-icon {
      width: 38px; height: 38px;
      border: 2px dashed #3a5a3a;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #3a5a3a;
      font-size: 20px; font-weight: bold;
    }

    .card-body { padding: 14px; }

    .card-title {
      font-size: 13px; font-weight: 700;
      color: #a9dfbf; margin-bottom: 4px;
    }

    .card-title.muted { color: #3a5a3a; }

    .card-sub {
      font-size: 10px; color: #5a8a5a;
      margin-bottom: 12px;
    }

    .card-sub.muted { color: #2a4a2a; }

    .btn-play {
      display: block;
      width: 100%;
      background: #27ae60; color: #fff;
      font-size: 11px; font-weight: 700;
      font-family: 'Inter', sans-serif;
      text-align: center; letter-spacing: 0.5px;
      padding: 8px; border-radius: 5px;
      border: none; cursor: pointer;
    }

    .btn-play:hover { background: #2ecc71; }

    .btn-coming {
      display: block;
      background: transparent;
      border: 1px solid #2a3a2a;
      color: #3a5a3a;
      font-size: 10px; text-align: center;
      padding: 7px; border-radius: 5px;
      letter-spacing: 0.5px;
    }

    /* ── ODS BLOCK ────────────────────────────────────── */
    .ods-block {
      background: #141f14;
      border-left: 3px solid #e67e22;
      padding: 20px 24px;
      border-radius: 0 8px 8px 0;
    }

    .ods-title {
      font-size: 11px; font-weight: 700;
      color: #e67e22;
      text-transform: uppercase; letter-spacing: 2px;
      margin-bottom: 8px;
    }

    .ods-text {
      font-size: 13px; color: #81c784;
      line-height: 1.7;
    }

    /* ── FOOTER ───────────────────────────────────────── */
    footer {
      background: #0d1a0d;
      border-top: 1px solid #1a2a1a;
      padding: 14px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
    }

    footer span {
      font-size: 10px; color: #2d4a2d;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>

  <!-- HERO -->
  <header class="hero">
    <div class="logo">
      <div class="logo-icon"><div class="logo-icon-inner"></div></div>
      <span class="logo-name">EcoPlanet</span>
    </div>
    <p class="tagline">Jogos que conscientizam. Planeta que agradece.</p>
    <div class="stats">
      <div class="stat">
        <div class="stat-value">1</div>
        <div class="stat-label">Jogo disponível</div>
      </div>
      <div class="stat">
        <div class="stat-value orange">ODS 13</div>
        <div class="stat-label">Em foco</div>
      </div>
      <div class="stat">
        <div class="stat-value">2026</div>
        <div class="stat-label">Lançamento</div>
      </div>
    </div>
  </header>

  <main class="main">

    <div class="section-label">Jogos</div>

    <div class="games-grid">

      <!-- ── Cidade Sustentável 2050 ── -->
      <div class="game-card"
           onclick="window.location.href='games/cidade-sustentavel-2050/index.html'">
        <div class="card-thumbnail">
          <div class="mini-grid">
            <div class="mini-tile" style="background:#e74c3c"></div>
            <div class="mini-tile" style="background:#2980b9"></div>
            <div class="mini-tile" style="background:#27ae60"></div>
            <div class="mini-tile" style="background:#f39c12"></div>
            <div class="mini-tile" style="background:#27ae60"></div>
            <div class="mini-tile" style="background:#27ae60"></div>
          </div>
          <div class="badge">DISPONÍVEL</div>
        </div>
        <div class="card-body">
          <div class="card-title">Cidade Sustentável 2050</div>
          <div class="card-sub">City builder climático · ODS 13</div>
          <button class="btn-play"
                  onclick="event.stopPropagation();
                           window.location.href='games/cidade-sustentavel-2050/index.html'">
            JOGAR AGORA
          </button>
        </div>
      </div>

      <!-- ── Em breve 1 ── -->
      <div class="game-card coming-soon">
        <div class="card-thumbnail empty">
          <div class="empty-icon">?</div>
        </div>
        <div class="card-body">
          <div class="card-title muted">Em breve...</div>
          <div class="card-sub muted">Novo jogo · ODS ???</div>
          <div class="btn-coming">EM DESENVOLVIMENTO</div>
        </div>
      </div>

      <!-- ── Em breve 2 ── -->
      <div class="game-card coming-soon">
        <div class="card-thumbnail empty">
          <div class="empty-icon">?</div>
        </div>
        <div class="card-body">
          <div class="card-title muted">Em breve...</div>
          <div class="card-sub muted">Novo jogo · ODS ???</div>
          <div class="btn-coming">EM DESENVOLVIMENTO</div>
        </div>
      </div>

    </div>

    <div class="section-label">Por que isso importa</div>
    <div class="ods-block">
      <div class="ods-title">ODS 13 — Ação Climática</div>
      <p class="ods-text">
        O Objetivo de Desenvolvimento Sustentável 13 da ONU exige ação urgente para
        combater as mudanças climáticas e seus impactos. No EcoPlanet, cada jogo simula
        decisões reais que afetam o planeta — do gerenciamento de cidades à preservação
        de ecossistemas. Aprenda jogando. Mude o mundo pensando.
      </p>
    </div>

  </main>

  <footer>
    <span>EcoPlanet · Lógica de Programação · UNINASSAU 2026</span>
    <span>ODS 13 — Agenda 2030</span>
  </footer>

</body>
</html>
```

- [ ] **Step 2: Verificar hub no browser**

Abra `index.html` na raiz (duplo-clique). Verificar:
- Hero com logo EcoPlanet e tagline visíveis
- 3 cards: 1 verde "DISPONÍVEL" + 2 esmaecidos "EM DESENVOLVIMENTO"
- Bloco ODS 13 com borda laranja
- Footer com créditos UNINASSAU

- [ ] **Step 3: Verificar navegação hub → jogo**

Clique no card "Cidade Sustentável 2050" ou no botão "JOGAR AGORA". O jogo deve abrir na mesma aba. Menu, gameplay e end screen devem funcionar normalmente (sem 404 nos scripts).

- [ ] **Step 4: Commit**

```powershell
git add index.html
git commit -m "feat: cria hub EcoPlanet (index.html)"
```

---

## Task 3: Adicionar botão "← EcoPlanet" ao jogo

**Files:**
- Modify: `games/cidade-sustentavel-2050/index.html`

- [ ] **Step 1: Adicionar o botão de retorno**

No arquivo `games/cidade-sustentavel-2050/index.html`, localize a tag de abertura `<body>` e adicione imediatamente após ela o seguinte `<div>`:

```html
<body>
  <div id="btn-hub"
       onclick="window.location.href='../../index.html'"
       style="
         position: fixed;
         top: 12px;
         left: 12px;
         z-index: 9999;
         background: #1a3a1a;
         border: 1px solid #27ae60;
         color: #27ae60;
         font-family: Inter, Arial, sans-serif;
         font-size: 12px;
         font-weight: 600;
         padding: 6px 14px;
         border-radius: 4px;
         cursor: pointer;
         user-select: none;
         letter-spacing: 0.5px;
         transition: background 0.15s;
       "
       onmouseover="this.style.background='#1e5631'"
       onmouseout="this.style.background='#1a3a1a'"
  >← EcoPlanet</div>

  <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
  <!-- ... resto dos scripts ... -->
```

> O Phaser cria um `<canvas>` e o centraliza via CSS. O botão usa `position: fixed` com `z-index: 9999`, então fica sempre visível por cima do canvas.

- [ ] **Step 2: Verificar botão no jogo**

Abra `games/cidade-sustentavel-2050/index.html`. No canto superior esquerdo deve aparecer um pequeno botão verde "← EcoPlanet". Clique — deve navegar de volta ao `index.html` da raiz (hub).

- [ ] **Step 3: Verificar que o botão não interfere no gameplay**

Inicie uma partida. O botão deve continuar visível mas não interferir com cliques na grade do jogo (a grade fica no centro/esquerda do canvas, não no canto superior esquerdo). O jogo roda normalmente.

- [ ] **Step 4: Commit**

```powershell
git add games/cidade-sustentavel-2050/index.html
git commit -m "feat: adiciona botao voltar ao hub no jogo"
```

---

## Verificação Final (Critérios de Sucesso)

Após as 3 tasks, verificar todos os itens:

- [ ] `PROJETO_ALAMY/index.html` → abre hub EcoPlanet com visual Earthy & Natural
- [ ] Clique em "JOGAR AGORA" → jogo carrega na mesma aba, sem erros de script
- [ ] Jogo completo funcionando: menu → gameplay (CO₂, eventos, metas) → end screen
- [ ] Botão "← EcoPlanet" visível e funcional dentro do jogo
- [ ] Ciclo completo: hub → jogo → hub funciona sem servidor (via `file://`)
- [ ] Nenhum arquivo de jogo na raiz (apenas `index.html` do hub, `games/`, `docs/`)
