# Design Spec — Cidade Sustentável 2050

**Data:** 2026-05-21  
**Disciplina:** Lógica de Programação — UNINASSAU, 1º Período  
**ODS:** 13 — Ação Contra a Mudança Global do Clima  
**Prazo de entrega:** 02/06/2026  
**Desenvolvedor:** Individual  
**Stack:** Phaser 3 + JavaScript + Kenney.nl free assets

---

## 1. Narrativa do Problema e da Solução

### Problema
As mudanças climáticas são uma das maiores ameaças globais do século XXI. O aumento das emissões de CO₂ causado por escolhas humanas — energia não-renovável, transporte poluente, desmatamento — eleva a temperatura global com consequências catastróficas: eventos climáticos extremos, aumento do nível do mar, extinção de espécies e crises alimentares. A população em geral tem dificuldade de entender como **suas próprias decisões cotidianas** contribuem para esse cenário.

### Solução
Um **jogo de construção de cidade (City Builder)** desenvolvido com Phaser.js, onde o jogador assume o papel de prefeito de uma cidade fictícia em 2024 e tem até 2050 para transformá-la em um modelo sustentável. Cada estrutura construída afeta indicadores climáticos reais calculados em tempo real (CO₂, temperatura, qualidade de vida). O visual usa assets profissionais gratuitos do Kenney.nl, resultando numa experiência visualmente polida.

### Relação com ODS 13
O jogo cobre diretamente os 4 requisitos da ODS 13 estabelecidos no PDF do seminário:
- ✅ **Simulação ambiental:** Grid de cidade com impacto climático calculado dinamicamente
- ✅ **Decisões sustentáveis:** Jogador escolhe entre estruturas poluentes e limpas
- ✅ **Indicadores climáticos:** CO₂ (ppm), temperatura global (°C), qualidade de vida (%)
- ✅ **Sistema de pontuação:** Score calculado ao final baseado nos 3 indicadores

### Público-alvo
Estudantes do ensino médio e universitários, e qualquer pessoa interessada em entender o impacto das escolhas humanas no clima de forma interativa e didática.

### Benefícios esperados
- Conscientização sobre o efeito das decisões urbanas no clima
- Aprendizado lúdico sobre fontes de energia e emissões de CO₂
- Engajamento emocional através da mecânica de jogo (win/lose/score)

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| [Phaser 3](https://phaser.io/) | 3.80+ | Game engine: loop, sprites, tilemap, input, cenas |
| JavaScript (ES6+) | — | Lógica do jogo, algoritmos, estado |
| HTML5 / CSS3 | — | Estrutura da página, HUD externo (se necessário) |
| [Kenney.nl City Kit](https://kenney.nl/assets/city-kit-commercial) | — | Sprites de edifícios, ruas, parques (gratuito, sem crédito) |
| [Kenney.nl UI Pack](https://kenney.nl/assets/ui-pack) | — | Botões, painéis, barras de progresso |
| [Kenney.nl Nature Kit](https://kenney.nl/assets/nature-kit) | — | Árvores, parques, vegetação |

**Sem bundler necessário** — Phaser pode ser carregado via CDN (`<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js">`), tornando o projeto simples de abrir e demonstrar.

---

## 3. Arquitetura

### Estrutura de arquivos

```
PROJETO_ALAMY/
├── index.html              # Entry point, carrega Phaser via CDN
├── src/
│   ├── main.js             # Configuração do Phaser, registro de cenas
│   ├── scenes/
│   │   ├── BootScene.js    # Carrega todos os assets (preload)
│   │   ├── MenuScene.js    # Tela inicial com instruções
│   │   ├── GameScene.js    # Cena principal do jogo (grid + lógica)
│   │   └── EndScene.js     # Tela de game over / vitória + pontuação
│   ├── data/
│   │   └── structures.js   # Dados das estruturas (custo, CO₂, QV, sprite)
│   └── logic/
│       └── climate.js      # Algoritmo climático (cálculos puros, sem Phaser)
├── assets/
│   ├── sprites/            # PNGs do Kenney (edifícios, terreno, UI)
│   ├── ui/                 # Sprites de interface (botões, painéis)
│   └── audio/              # (opcional) sons ambiente
└── docs/
    └── superpowers/specs/
        └── 2026-05-21-cidade-sustentavel-2050-design.md
```

### Responsabilidades

| Arquivo/Módulo | Responsabilidade |
|----------------|-----------------|
| `BootScene.js` | `preload()` de todos os sprites e atlas |
| `MenuScene.js` | Tela de boas-vindas, instruções, botão "Jogar" |
| `GameScene.js` | Renderização da grade, painel lateral, input do jogador, chamada aos algoritmos |
| `EndScene.js` | Exibição da pontuação final, mensagem de resultado, botão "Jogar Novamente" |
| `structures.js` | Objeto `STRUCTURES` com todos os dados das estruturas |
| `climate.js` | Funções puras: `calcularImpacto()`, `calcularPontuacao()`, `verificarCondicoes()` |

---

## 4. Cenas (Fluxo de Telas)

```
BootScene (preload assets)
    ↓
MenuScene (tela inicial)
    ↓ [botão "Jogar"]
GameScene (jogo principal)
    ↓ [game over ou vitória]
EndScene (resultado + score)
    ↓ [botão "Jogar Novamente"]
MenuScene
```

---

## 5. Componentes do Jogo

### 5.1 Grade da Cidade (GameScene)
- Grid de **6×6 tiles** renderizado com Phaser TileMap ou sprites posicionados em grade
- Cada tile: 64×64px, posicionado na cena principal
- Estado da grade: array `grid[36]` — `null` (vazio) ou string com ID da estrutura
- Interação: `pointerdown` no tile → coloca estrutura selecionada (se houver saldo)
- Visual: tile base de grama/asfalto (Kenney) + sprite da estrutura por cima

### 5.2 Estruturas Disponíveis (8 tipos)

| ID | Nome | Sprite (Kenney) | CO₂/turno | QV/turno | Custo |
|----|------|-----------------|-----------|----------|-------|
| `factory` | Fábrica | `building_factory` | +15 ppm | -5 | R$ 80k |
| `house` | Bairro Comum | `building_house` | +5 ppm | +3 | R$ 40k |
| `eco_house` | Bairro Verde | `building_house_eco` | +1 ppm | +8 | R$ 60k |
| `park` | Parque | `tree_large` | -8 ppm | +10 | R$ 20k |
| `solar` | Painel Solar | `building_solar` | -5 ppm | +4 | R$ 50k |
| `wind` | Turbina Eólica | `building_windmill` | -6 ppm | +3 | R$ 70k |
| `bike_lane` | Ciclovia | `road_bike` | 0 ppm | +6 | R$ 15k |
| `empty` | Demolir | (tile vazio) | 0 ppm | 0 | grátis |

### 5.3 Indicadores Climáticos (HUD)
Painel fixo no topo da tela com barras de progresso (Phaser Graphics ou Kenney UI sprites):

| Indicador | Inicial | Crítico | Ideal | Cor da barra |
|-----------|---------|---------|-------|-------------|
| 🌡️ Temperatura | +1.2°C | ≥ +2.0°C | ≤ +1.5°C | Verde → Laranja → Vermelho |
| 💨 CO₂ | 420 ppm | ≥ 560 ppm | ≤ 350 ppm | Azul → Amarelo → Vermelho |
| 🌱 Qualidade de Vida | 30% | ≤ 10% | ≥ 70% | Cinza → Verde |
| 💰 Orçamento | R$ 500k | R$ 0 | — | Dourado |

### 5.4 Painel Lateral (Estruturas)
- Lista de estruturas disponíveis com sprite + nome + custo
- Clique na estrutura → ativa modo "construção" (cursor muda)
- Estrutura selecionada fica destacada (borda Phaser.Graphics)
- Botão "Demolir" para remover estrutura de tile

### 5.5 Controle de Turno
- Ano atual exibido no HUD (2024 → 2050)
- Botão "Avançar 1 Ano" (Kenney UI button sprite)
- Ao clicar: executa algoritmo → atualiza indicadores → verifica fim de jogo

---

## 6. Algoritmos (logic/climate.js)

### Estado global do jogo

```javascript
// src/logic/climate.js

export const estadoInicial = {
  ano: 2024,
  co2: 420,           // ppm acumulado
  temperatura: 1.2,   // °C acima do nível pré-industrial
  qualidadeVida: 30,  // 0-100
  orcamento: 500000,  // reais
  grid: new Array(36).fill(null),
  jogoAtivo: true
};
```

### Algoritmo principal — avançar um ano

```javascript
// Chamado pelo GameScene a cada clique em "Avançar 1 Ano"
export function avancarAno(estado, estruturas) {
  if (!estado.jogoAtivo) return estado;

  let deltaCO2 = 2;  // emissão base global (não zera sem esforço)
  let totalQV  = 0;

  // 1. Percorre todas as 36 células da grade
  for (let i = 0; i < estado.grid.length; i++) {
    const tipo = estado.grid[i];
    if (tipo !== null) {
      deltaCO2 += estruturas[tipo].co2PorTurno;
      totalQV  += estruturas[tipo].qvPorTurno;
    }
  }

  // 2. Atualiza indicadores
  const novoCO2    = Math.max(280, estado.co2 + deltaCO2);
  const novaTemp   = 1.2 + (novoCO2 - 420) * 0.003;
  const novaQV     = Math.min(100, Math.max(0, totalQV * 2));
  const novoAno    = estado.ano + 1;

  return {
    ...estado,
    ano: novoAno,
    co2: novoCO2,
    temperatura: parseFloat(novaTemp.toFixed(2)),
    qualidadeVida: novaQV
  };
}

// 3. Verifica condições de fim de jogo
export function verificarCondicoes(estado) {
  if (estado.temperatura >= 2.0 || estado.co2 >= 560) {
    return { fim: true, vitoria: false, motivo: 'colapso' };
  }
  if (estado.ano > 2050) {
    const venceu = estado.temperatura <= 1.5 && estado.qualidadeVida >= 60;
    return { fim: true, vitoria: venceu, motivo: venceu ? 'meta' : 'insuficiente' };
  }
  return { fim: false };
}

// 4. Pontuação final
export function calcularPontuacao(estado) {
  let pts = 0;
  pts += Math.max(0, (1.5 - estado.temperatura) * 1000); // bônus temperatura
  pts += Math.max(0, (350 - estado.co2));                 // bônus CO₂
  pts += estado.qualidadeVida * 10;                       // bônus qualidade
  pts += Math.floor(estado.orcamento / 1000);             // bônus poupança
  return Math.round(pts);
}
```

---

## 7. Fluxo Principal do Usuário

```
[BootScene] Carrega assets
    ↓
[MenuScene] "Você é o prefeito de 2024. Salve o clima até 2050."
    ↓ [Jogar]
[GameScene] Grade 6×6 vazia | HUD: 2024, CO₂=420, Temp=1.2°C, QV=30%
    ↓
[Seleciona estrutura no painel lateral]
    ↓
[Clica em tile da grade] → estrutura posicionada, orçamento decrementado
    ↓
[Clica "Avançar 1 Ano"] → algoritmo roda, HUD atualiza, animação das barras
    ↓
[Verificação de condições]
    ├── Temp ≥ 2°C ou CO₂ ≥ 560 → [EndScene: GAME OVER]
    ├── Ano > 2050 + metas atingidas → [EndScene: VITÓRIA + score]
    └── continua → [Seleciona estrutura]
[EndScene] Pontuação + mensagem + "Jogar Novamente"
```

---

## 8. Tratamento de Casos Especiais

| Situação | Comportamento |
|----------|---------------|
| Sem saldo para estrutura | Botão da estrutura fica semi-transparente; clique bloqueado |
| Grade cheia | Cursor muda para "proibido" em tiles ocupados (a não ser no modo demolir) |
| Tentativa de colocar sem selecionar estrutura | Nada acontece (prevenção de bug) |
| Jogo encerrado | Todos os inputs de jogo desabilitados; só botão "Jogar Novamente" ativo |
| Orçamento zerado sem estruturas | Jogo continua — o jogador pode demolir estruturas caras e reconstruir |

---

## 9. Assets — Downloads necessários (Kenney.nl)

Todos gratuitos, sem necessidade de conta ou crédito:

| Pack | URL | Sprites usados |
|------|-----|----------------|
| City Kit (Commercial) | kenney.nl/assets/city-kit-commercial | Prédios, fábricas, casas |
| Nature Kit | kenney.nl/assets/nature-kit | Árvores, parques |
| UI Pack | kenney.nl/assets/ui-pack | Botões, barras, painéis |
| Isometric Tiles (opcional) | kenney.nl/assets/isometric-tiles | Visual 3D alternativo |

---

## 10. Entregas do Seminário

| Entrega | Como será cumprida |
|---------|-------------------|
| Documentação | Este spec + README.md |
| Slides (Canva/Google Slides) | 10 slides conforme estrutura do PDF |
| Fluxograma | Baseado na seção 7 (draw.io ou Canva) |
| Algoritmo (comentado, testado) | `climate.js` com comentários em português |
| Código-fonte funcional | Projeto Phaser completo |

---

## 11. Critérios de Avaliação x Projeto

| Critério (2,0 pts cada) | Como é atendido |
|------------------------|-----------------|
| Criatividade da solução | City Builder com visual profissional (Phaser + Kenney), narrativa de prefeito |
| Aplicação da lógica de programação | Loop na grade, condicionais, estado imutável, funções puras em `climate.js` |
| Organização do algoritmo | `climate.js` separado da engine, funções nomeadas, comentários em pt-br |
| Relação com a ODS 13 | CO₂, temperatura, decisões sustentáveis — central ao tema do jogo |
| Apresentação e documentação | Slides + spec + fluxograma + README |
| **Bônus: interface funcional** | Phaser roda no browser, visual polido com assets reais |

---

## 12. Cronograma Sugerido (12 dias)

| Dias | Tarefa |
|------|--------|
| 21/05 | Baixar Kenney assets, configurar estrutura de pastas, `index.html` + Phaser CDN funcionando |
| 22/05 | `BootScene` carregando assets + `MenuScene` com tela inicial |
| 23/05 | `GameScene`: renderizar grade 6×6 com tiles base (grama/asfalto) |
| 24/05 | Painel lateral de estruturas + colocação de sprites na grade ao clicar |
| 25/05 | `structures.js` + `climate.js`: algoritmo completo + botão "Avançar Ano" |
| 26/05 | HUD com barras de indicadores animadas |
| 27/05 | `EndScene`: game over + vitória + pontuação |
| 28/05 | Polimento visual: cores, transições, feedback de construção |
| 29/05 | Testes completos de gameplay: balancear dificuldade |
| 30/05 | Slides (Canva) + fluxograma (draw.io) |
| 01/06 | Documentação final (README) |
| 02/06 | **Entrega** |
