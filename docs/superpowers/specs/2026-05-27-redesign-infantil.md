# EcoPlanet — Redesign Infantil — Design Spec
**Data:** 2026-05-27
**Projeto:** EcoPlanet — UNINASSAU, Lógica de Programação
**Escopo:** Redesign completo do hub (`index.html`) para público infantojuvenil (6–14 anos), mantendo toda a lógica de auth e as funcionalidades existentes intactas.

---

## 1. Visão Geral

O hub atual tem visual adulto/corporativo (fundo escuro, tons terrosos apagados). O redesign transforma a aparência para um portal de jogos educativos colorido e acolhedor, inspirado em plataformas como Duolingo e Scratch, sem alterar nenhum arquivo de lógica (`auth/supabase.js`, `auth/hub-auth.js`, scripts do jogo).

**Apenas `index.html` é modificado.**

---

## 2. Paleta de Cores

| Papel | Cor | Hex |
|---|---|---|
| Céu (hero topo) | Azul céu | `#29b6f6` → `#b3e5fc` (gradiente) |
| Grama | Verde médio | `#4caf50` |
| Fundo geral | Verde muito claro | `#f1f8e9` |
| Cards | Branco | `#ffffff` |
| Sombra dos cards | Verde claro | `#c8e6c9` |
| Acento principal | Verde escuro | `#43a047` / `#66bb6a` |
| Acento laranja | Laranja | `#ff8f00` / `#ffca28` |
| Sol | Amarelo | `#ffd600` |
| Texto principal | Verde escuro | `#33691e` |
| Texto secundário | Verde médio | `#558b2f` |
| Footer | Verde | `#4caf50` |

---

## 3. Tipografia

- **Fonte:** Nunito (Google Fonts) — pesos 400, 700, 800, 900
- **Fallback:** `'Arial Rounded MT Bold', Arial, sans-serif`
- **Carregamento:** `<link>` no `<head>` via Google Fonts CDN

Nunito é arredondada e amigável — usada no Duolingo e em apps infantis. Substitui Inter em todo o hub.

---

## 4. Ícones

- **Biblioteca:** Font Awesome 6 Free via CDN (`cdnjs.cloudflare.com`)
- **Sem emojis** em nenhuma parte do layout
- Ícones usados:
  - `fa-earth-americas` — logo EcoPlanet
  - `fa-right-to-bracket` — botão Entrar
  - `fa-gamepad` — label seção Jogos
  - `fa-city` — card Cidade Sustentável 2050
  - `fa-tree` — card Em breve 1
  - `fa-water` — card Em breve 2
  - `fa-play` — botão Jogar Agora
  - `fa-clock` — botão Em desenvolvimento
  - `fa-circle-info` — label seção ODS
  - `fa-temperature-arrow-up` — bloco ODS 13

---

## 5. Estrutura de Seções

### 5.1 Hero (Header)

- **Fundo:** gradiente azul céu (`#29b6f6` → `#b3e5fc`)
- **Elementos CSS puros (sem imagens):**
  - 3 nuvens brancas posicionadas absolutamente (`.cloud` + `::before`/`::after`)
  - 1 sol amarelo com glow (`box-shadow` duplo)
  - Grama verde (`#4caf50`) como bordas arredondadas na base
- **Nav dentro do hero:**
  - Logo (ícone + nome em pill branca arredondada)
  - `#auth-zone` — botão "Entrar" ou widget de perfil (pill branca, texto azul)
- **Headline:** "Jogue e **salve o planeta!**" — branco com acento amarelo, Nunito 900
- **Subtítulo:** texto azul-claro, Nunito 700

### 5.2 Main (`<main class="main">`)

- Fundo `#f1f8e9`, max-width 860px, centralizado
- `flex: 1` para sticky footer

**Seção Jogos:**
- Label uppercase verde com ícone Font Awesome
- Grid 3 colunas com `.game-card`s

**Cada `.game-card`:**
- `border-radius: 20px`, `box-shadow: 0 6px 0 #c8e6c9`
- Thumbnail colorida (laranja/amarelo para Cidade 2050, cinza para "Em breve")
- Ícone Font Awesome centralizado na thumb
- Badge "Disponível" verde no canto da thumb (só no card ativo)
- Título + subtítulo
- Botão `btn-play` (verde com sombra, pill) ou `btn-soon` (dashed, cinza)

**Bloco ODS:**
- Card branco arredondado com sombra
- Ícone laranja (temperatura) em box laranja à esquerda
- Texto em verde escuro, tom amigável ("O planeta precisa de heróis!")

### 5.3 Footer

- Fundo `#4caf50`, texto branco-esverdeado
- Mesmas strings do footer atual

---

## 6. Auth Zone — Adaptação Visual

O `#auth-zone` e o modal gerado por `hub-auth.js` precisam ter CSS adaptado ao novo tema claro. As classes que precisam de atualização no `index.html`:

| Classe | Antes (escuro) | Depois (infantil) |
|---|---|---|
| `.btn-entrar` | Borda verde escura, bg transparente | Pill branca, texto azul (`#1565c0`), sombra leve |
| `.widget-perfil` | Flex escuro | Flex, pill branca, texto verde escuro |
| `.avatar` | Círculo verde escuro | Círculo verde (`#43a047`), texto branco |
| `.nome-usuario` | Verde claro | Verde escuro (`#33691e`) |
| `.folhas-count` | Pill verde escura | Pill verde clara (`#e8f5e9`), texto verde (`#2e7d32`), borda verde |
| `.btn-sair` | Cinza escuro | Vermelho suave (`#ef9a9a`), hover `#e53935` |
| `#modal-overlay` | bg `rgba(0,0,0,0.75)` | bg `rgba(0,0,0,0.5)` |
| `.modal-card` | bg `#0d1a0d`, borda verde escura | bg `#fff`, borda `#a5d6a7`, border-radius 20px |
| `.modal-titulo` | Branco | Verde escuro (`#2e7d32`), Nunito 900 |
| `.aba` / `.aba.ativa` | Verde escuro | Verde médio / Verde ativo |
| `.campo` | bg `#1a2a1a` | bg `#f9fbe7`, borda `#c8e6c9`, texto `#33691e` |
| `.btn-principal` | Verde escuro | Verde (`#43a047`), pill, sombra `#2e7d32` |
| `.btn-google` | bg `#1a2a1a` | bg `#f5f5f5`, borda `#e0e0e0`, texto `#555` |
| `.modal-erro` | Vermelho | Vermelho (`#e53935`) |

---

## 7. Arquivos Modificados

| Arquivo | Tipo de mudança |
|---|---|
| `index.html` | Reescrita completa do CSS + ajuste do HTML do hero (nuvens, sol, grama) |

**Nenhum outro arquivo é alterado.**

Os arquivos `auth/supabase.js`, `auth/hub-auth.js` e todos os arquivos do jogo permanecem intactos.

---

## 8. Dependências Externas Adicionadas

```html
<!-- No <head> -->
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
```

Ambas são novas dependências no `<head>` do hub. O Font Awesome que o sistema de auth usa está no `auth/hub-auth.js` (gerado via innerHTML) — o hub em si não carregava FA antes.

---

## 9. Critérios de Sucesso

- [ ] Hero tem céu azul com nuvens, sol e grama CSS — sem imagens externas
- [ ] Logo EcoPlanet usa pill branca arredondada com ícone Font Awesome
- [ ] Fonte Nunito aplicada em todo o hub
- [ ] Cards com cantos arredondados (20px), sombra colorida, botão play com sombra
- [ ] Nenhum emoji visível no layout
- [ ] Botão "Entrar" adaptado ao tema claro (pill branca)
- [ ] Modal de auth usa cores claras (fundo branco, campos claros)
- [ ] Widget de perfil logado legível no hero claro
- [ ] Footer verde no rodapé (sticky)
- [ ] Site funciona em `https://vietcong-exe.github.io/ecoplanet/` sem quebrar o auth

---

## 10. Fora de Escopo

- Redesign das páginas do jogo (`games/`)
- Animações (nuvens se movendo, etc.)
- Versão mobile responsiva (pode ser feita em sprint separado)
- Novos jogos ou funcionalidades
