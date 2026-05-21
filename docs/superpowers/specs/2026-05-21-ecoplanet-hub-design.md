# EcoPlanet Hub — Design Spec
**Data:** 2026-05-21  
**Projeto:** Cidade Sustentável 2050 — UNINASSAU, Lógica de Programação  
**Escopo:** Criação do hub EcoPlanet que hospeda o jogo atual e acomoda jogos futuros

---

## 1. Visão Geral

O EcoPlanet é um portal estático de jogos educativos sobre clima e sustentabilidade, inspirado em plataformas como Friv/CoolMathGames. Funciona 100% offline (duplo-clique no `index.html`), sem servidor, sem bundler, sem dependências externas além da CDN do Phaser (usada apenas nos jogos).

O hub é a nova página inicial do projeto. O jogo "Cidade Sustentável 2050" é relocado para uma subpasta e acessado a partir do hub.

---

## 2. Estrutura de Arquivos

### Antes (estrutura atual)
```
PROJETO_ALAMY/
├── index.html          ← entry point do jogo
├── src/
│   ├── main.js
│   ├── structures.js
│   ├── climate.js
│   └── scenes/
│       ├── BootScene.js
│       ├── MenuScene.js
│       ├── GameScene.js
│       └── EndScene.js
└── docs/
```

### Depois (estrutura nova)
```
PROJETO_ALAMY/
├── index.html                           ← EcoPlanet hub (NOVO)
├── games/
│   └── cidade-sustentavel-2050/
│       ├── index.html                   ← jogo (MOVIDO de raiz)
│       └── src/                         ← pasta src/ (MOVIDA de raiz)
│           ├── main.js
│           ├── structures.js
│           ├── climate.js
│           └── scenes/
│               ├── BootScene.js
│               ├── MenuScene.js
│               ├── GameScene.js
│               └── EndScene.js
└── docs/
    └── superpowers/
        └── specs/
```

Todos os caminhos relativos dentro do jogo (`src/...`) continuam funcionando porque `index.html` e `src/` ficam na mesma pasta após a movimentação.

---

## 3. EcoPlanet Hub (`index.html`)

### 3.1 Identidade Visual

| Atributo        | Valor                          |
|-----------------|-------------------------------|
| Estilo          | Earthy & Natural               |
| Fundo principal | `#111d11`                      |
| Fundo hero      | Gradiente `#0d1a0d → #1a2a1a` |
| Acento primário | `#27ae60` (verde)              |
| Acento secundário | `#e67e22` (laranja terra)    |
| Tipografia      | Inter (Google Fonts, mesma do jogo) |
| Sem emojis      | Shapes geométricos CSS para ícones |

### 3.2 Seções (top → bottom)

#### Hero
- Logo EcoPlanet: círculo gradiente verde/laranja + texto "EcoPlanet" em branco
- Tagline: *"Jogos que conscientizam. Planeta que agradece."*
- Barra de stats estática: **1 jogo disponível · ODS 13 · 2026**

#### Grid de Jogos
- 3 cards em grid responsivo (1 ativo + 2 "em breve")
- **Card ativo** — Cidade Sustentável 2050:
  - Thumbnail gerada com CSS (mini-grid de tiles coloridos, sem imagem externa)
  - Badge verde "DISPONÍVEL"
  - Título, descrição curta ("City builder climático · ODS 13")
  - Botão "JOGAR AGORA" → `window.location.href = 'games/cidade-sustentavel-2050/index.html'`
  - Hover: borda verde mais intensa + leve elevação (`box-shadow`)
- **Cards "em breve"** — opacidade 0.5, borda tracejada, sem clique

#### Bloco ODS 13
- Fundo levemente diferenciado (`#141f14`), borda esquerda laranja
- Título "ODS 13 — Ação Climática" em laranja
- Texto explicativo curto (~3 linhas)

#### Footer
- Linha única: `EcoPlanet · Lógica de Programação · UNINASSAU 2026`
- Alinhado à esquerda; à direita: `ODS 13 — Agenda 2030`

### 3.3 Tecnologia do Hub

- HTML5 + CSS3 puro (sem frameworks, sem JavaScript externo)
- JavaScript mínimo: apenas o handler de clique no card (`window.location.href`)
- Google Fonts: Inter (mesmo link já usado no jogo)
- Funciona abrindo `index.html` diretamente no browser (file://)

---

## 4. Botão "Voltar ao Hub" no Jogo

Para que o jogador possa retornar ao hub sem fechar e reabrir o arquivo:

- Um `<div>` HTML absolutamente posicionado sobre o canvas Phaser, no canto superior esquerdo do `<body>` do `games/cidade-sustentavel-2050/index.html`
- Texto: `← EcoPlanet`
- Estilo: pequeno, discreto, canto superior esquerdo, `position: fixed; top: 12px; left: 12px; z-index: 9999`
- Cor alinhada ao estilo earthy (verde escuro, texto verde claro)
- Clique: `window.location.href = '../../index.html'`

---

## 5. O Que NÃO Muda

- Todo o código do jogo (`climate.js`, `GameScene.js`, etc.) permanece idêntico
- Nenhuma lógica de gameplay é alterada
- O jogo continua funcionando standalone se aberto diretamente por `games/cidade-sustentavel-2050/index.html`

---

## 6. Critérios de Sucesso

- [ ] Abrir `PROJETO_ALAMY/index.html` mostra o hub EcoPlanet
- [ ] Clicar "JOGAR AGORA" no hub abre o jogo na mesma aba
- [ ] O jogo funciona normalmente (nenhuma regressão)
- [ ] Botão "← EcoPlanet" no jogo retorna ao hub
- [ ] Funciona 100% offline via `file://` (sem servidor local)
- [ ] Visual consistente com estilo Earthy & Natural aprovado

---

## 7. Fora de Escopo

- Backend, banco de dados, autenticação
- Versão mobile responsiva (desktop-first, igual ao jogo)
- Segundo jogo real (apenas slots "em breve")
- Deploy / hospedagem online
