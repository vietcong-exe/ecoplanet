/*
 * =============================================================================
 * climate.js — Algoritmos Climáticos para "Cidade Sustentável 2050"
 * =============================================================================
 *
 * DESCRIÇÃO DO ARQUIVO:
 *   Núcleo algorítmico do jogo. Contém lógica de simulação climática,
 *   sistema de eventos aleatórios e metas anuais progressivas.
 *
 * FUNÇÕES PURAS (SEM DEPENDÊNCIA DO PHASER):
 *   Todas as funções recebem dados como entrada e retornam novos dados
 *   sem modificar o estado original (princípio de imutabilidade).
 *
 * NOTA EDUCACIONAL — RELAÇÃO CO₂ E TEMPERATURA:
 *   Fórmula simplificada (modelo linear educacional do IPCC):
 *       temperatura = 1.2 + (co2 - 420) × 0.003
 *   Na realidade a relação é logarítmica, mas esta linearização
 *   permite compreensão intuitiva para fins pedagógicos.
 *
 * Disciplina: Lógica de Programação — UNINASSAU
 * Tema: ODS 13 — Ação Contra a Mudança Global do Clima
 * =============================================================================
 */

// =============================================================================
// DADOS GLOBAIS: EVENTOS CLIMÁTICOS
// Lista de eventos que podem ocorrer aleatoriamente durante a simulação.
// =============================================================================
var EVENTOS = [
    {
        id:        'onda_calor',
        nome:      'Onda de Calor',
        descricao: 'Temperaturas extremas elevam consumo de energia e emissões.',
        efeito:    'CO₂ +25 ppm',
        co2Extra:  25,
        budgetExtra: 0,
        destroiEdificio: false,
        cor:       0xe74c3c,
        corHex:    '#e74c3c'
    },
    {
        id:        'seca',
        nome:      'Grande Seca',
        descricao: 'Seca severa reduz qualidade de vida e aumenta incêndios.',
        efeito:    'CO₂ +15 ppm | QV -20',
        co2Extra:  15,
        budgetExtra: 0,
        qvPenalidade: 20,
        destroiEdificio: false,
        cor:       0xe67e22,
        corHex:    '#e67e22'
    },
    {
        id:        'enchente',
        nome:      'Enchente Extrema',
        descricao: 'Chuvas intensas danificam infraestrutura urbana.',
        efeito:    'R$ -150k | Destrói 1 edifício',
        co2Extra:  0,
        budgetExtra: -150000,
        destroiEdificio: true,
        cor:       0x2980b9,
        corHex:    '#2980b9'
    },
    {
        id:        'crise_energetica',
        nome:      'Crise Energética',
        descricao: 'Escassez de combustíveis eleva emissões e custos.',
        efeito:    'CO₂ +20 ppm | R$ -100k',
        co2Extra:  20,
        budgetExtra: -100000,
        destroiEdificio: false,
        cor:       0x8e44ad,
        corHex:    '#8e44ad'
    }
];

// =============================================================================
// DADOS GLOBAIS: METAS ANUAIS PROGRESSIVAS
// Checkpoints de CO₂ e qualidade de vida que o jogador deve atingir.
// Baseadas nas metas reais do Acordo de Paris e da Agenda 2030 da ONU.
// =============================================================================
var METAS = [
    {
        ano:      2030,
        co2Max:   460,
        qvMin:    0,
        descricao: 'CO₂ abaixo de 460 ppm',
        penalidade: 600
    },
    {
        ano:      2035,
        co2Max:   440,
        qvMin:    25,
        descricao: 'CO₂ < 440 ppm e QV > 25%',
        penalidade: 800
    },
    {
        ano:      2040,
        co2Max:   420,
        qvMin:    35,
        descricao: 'CO₂ < 420 ppm e QV > 35%',
        penalidade: 1000
    },
    {
        ano:      2045,
        co2Max:   390,
        qvMin:    50,
        descricao: 'CO₂ < 390 ppm e QV > 50%',
        penalidade: 1200
    }
];

// =============================================================================
// OBJETO PRINCIPAL: ClimateAlgorithm
// =============================================================================
var ClimateAlgorithm = {

    // =========================================================================
    // FUNÇÃO 1: criarEstadoInicial()
    // Cria o estado de início do jogo.
    // ATENÇÃO: A cidade começa em CRISE — CO₂ já em 475 ppm (zona de perigo)!
    // O jogador deve agir imediatamente para evitar o colapso climático.
    // =========================================================================
    criarEstadoInicial: function () {
        return {
            ano:           2024,

            // CO₂ começa em 475 ppm — cidade industrial já em zona de alerta.
            // (Nível pré-industrial: 280 ppm | Limite crítico do jogo: 560 ppm)
            co2:           475,

            // Temperatura inicial já elevada: 1.365°C acima do pré-industrial.
            // A borda vermelha pulsante já estará ativa desde o início!
            temperatura:   parseFloat((1.2 + (475 - 420) * 0.003).toFixed(2)),

            // Qualidade de vida baixa — cidade suja e congestionada.
            qualidadeVida: 20,

            // Orçamento inicial reduzido — obriga decisões estratégicas.
            orcamento:     600000,

            // Grade 6×6 = 36 tiles. Será pré-populada com 3 fábricas pelo GameScene.
            grade:         new Array(36).fill(null),

            // Acumula penalidades por metas anuais perdidas (descontado na pontuação).
            penalidades:   0,

            jogoAtivo:     true
        };
    },

    // =========================================================================
    // FUNÇÃO 2: avancarAno(estado)
    // ALGORITMO PRINCIPAL DA SIMULAÇÃO CLIMÁTICA.
    //
    // Novidades vs. versão anterior:
    //   - Emissão base ESCALA com os anos (crescimento populacional)
    //   - Custo anual de manutenção da cidade (R$15k/ano)
    //   - Receita base removida (apenas estruturas geram renda)
    // =========================================================================
    avancarAno: function (estado) {

        // ---- Passo 0: Criar cópia do estado (imutabilidade) ----
        var novo = Object.assign({}, estado);
        novo.grade = estado.grade.slice();

        // ---- Passo 1: Inicializar variáveis do turno ----

        // Emissão de fundo ESCALA com o tempo:
        // Em 2024: +4 ppm/ano | Em 2050: ~7 ppm/ano
        // Representa crescimento populacional e industrial global.
        var emissaoBase = 4 + Math.floor((novo.ano - 2024) * 0.12);

        var deltaCO2 = emissaoBase; // começa com emissão de fundo
        var totalQV  = 0;
        var receita  = 0;           // sem receita base — só estruturas geram renda

        // ---- Passo 2: Percorre todas as 36 células da grade ----
        for (var i = 0; i < novo.grade.length; i++) {
            var tipoEstrutura = novo.grade[i];

            if (tipoEstrutura !== null && STRUCTURES[tipoEstrutura]) {
                var estrutura = STRUCTURES[tipoEstrutura];

                // Acumula variação de CO₂ (negativo = absorve, positivo = emite)
                deltaCO2 += estrutura.co2PorTurno;

                // Acumula impacto na qualidade de vida
                totalQV  += estrutura.qvPorTurno;

                // Acumula receita gerada (impostos, tarifas, energia)
                receita  += estrutura.receitaPorTurno;
            }
        }

        // ---- Passo 3: Custo de manutenção da cidade ----
        // A cidade tem custo fixo anual independente das estruturas.
        // Se a receita não cobrir este custo, o orçamento diminui.
        var manutencao = 15000;

        // ---- Passo 4: Atualizar CO₂ ----
        novo.co2 = Math.max(280, novo.co2 + deltaCO2);

        // ---- Passo 5: Calcular temperatura ----
        novo.temperatura = parseFloat((1.2 + (novo.co2 - 420) * 0.003).toFixed(2));

        // ---- Passo 6: Calcular qualidade de vida (0–100) ----
        novo.qualidadeVida = Math.min(100, Math.max(0, totalQV * 2));

        // ---- Passo 7: Atualizar orçamento ----
        novo.orcamento = novo.orcamento + receita - manutencao;

        // ---- Passo 8: Avançar o ano ----
        novo.ano = novo.ano + 1;

        return novo;
    },

    // =========================================================================
    // FUNÇÃO 3: verificarCondicoes(estado)
    // Verifica condições de fim de jogo.
    // Condição extra: falência municipal (orçamento < 0).
    // =========================================================================
    verificarCondicoes: function (estado) {

        // Derrota: colapso climático por temperatura
        if (estado.temperatura >= 2.0) {
            return { fim: true, vitoria: false, motivo: 'temperatura' };
        }

        // Derrota: CO₂ atingiu ponto de não retorno
        if (estado.co2 >= 560) {
            return { fim: true, vitoria: false, motivo: 'co2' };
        }

        // Derrota: falência municipal
        if (estado.orcamento < 0) {
            return { fim: true, vitoria: false, motivo: 'falencia' };
        }

        // Fim de prazo: 2050
        if (estado.ano > 2050) {
            var venceu = estado.temperatura <= 1.5 && estado.qualidadeVida >= 60;
            return {
                fim:     true,
                vitoria: venceu,
                motivo:  venceu ? 'meta_atingida' : 'meta_nao_atingida'
            };
        }

        return { fim: false };
    },

    // =========================================================================
    // FUNÇÃO 4: gerarEvento(ano)
    // Determina aleatoriamente se um evento climático ocorre neste ano.
    //
    // Probabilidade: 30% por ano (a partir de 2026, para dar tempo ao jogador).
    // Retorna o evento sorteado ou null se não houve evento.
    // =========================================================================
    gerarEvento: function (ano) {

        // Sem eventos nos primeiros 2 anos (jogador precisa se adaptar)
        if (ano <= 2025) { return null; }

        // 30% de chance de evento por turno
        if (Math.random() > 0.30) { return null; }

        // Sorteia um evento da lista (probabilidade uniforme)
        var indice = Math.floor(Math.random() * EVENTOS.length);
        return EVENTOS[indice];
    },

    // =========================================================================
    // FUNÇÃO 5: aplicarEvento(estado, evento, gradeModificavel)
    // Aplica os efeitos de um evento climático ao estado do jogo.
    //
    // Parâmetros:
    //   estado            — estado atual do jogo
    //   evento            — objeto do evento a aplicar
    //   gradeModificavel  — array da grade (para o caso de enchente)
    //
    // Retorna: { novoEstado, tileDestruido }
    //   (tileDestruido = índice do tile destruído pela enchente, ou -1)
    // =========================================================================
    aplicarEvento: function (estado, evento, gradeModificavel) {

        var novo = Object.assign({}, estado);
        novo.grade = estado.grade.slice();
        var tileDestruido = -1;

        // Aplica variação de CO₂ do evento
        if (evento.co2Extra) {
            novo.co2 = Math.max(280, novo.co2 + evento.co2Extra);
            novo.temperatura = parseFloat((1.2 + (novo.co2 - 420) * 0.003).toFixed(2));
        }

        // Aplica variação no orçamento
        if (evento.budgetExtra) {
            novo.orcamento = novo.orcamento + evento.budgetExtra;
        }

        // Penalidade de qualidade de vida (seca)
        if (evento.qvPenalidade) {
            novo.qualidadeVida = Math.max(0, novo.qualidadeVida - evento.qvPenalidade);
        }

        // Enchente: destrói 1 edifício aleatório (exclui fábricas)
        if (evento.destroiEdificio) {
            // Coleta indices de tiles com estruturas destruíveis (não-fábrica)
            var candidatos = [];
            for (var i = 0; i < novo.grade.length; i++) {
                if (novo.grade[i] !== null && novo.grade[i] !== 'fabrica') {
                    candidatos.push(i);
                }
            }

            if (candidatos.length > 0) {
                // Sorteia qual edifício será destruído
                var idx = candidatos[Math.floor(Math.random() * candidatos.length)];
                novo.grade[idx] = null;
                tileDestruido = idx;
            }
        }

        return { novoEstado: novo, tileDestruido: tileDestruido };
    },

    // =========================================================================
    // FUNÇÃO 6: verificarMetaAnual(estado)
    // Verifica se o ano atual tem uma meta progressiva e se foi atingida.
    //
    // Retorna: null (sem meta este ano) ou objeto com info da meta.
    // =========================================================================
    verificarMetaAnual: function (estado) {

        // Percorre as metas para encontrar a do ano atual
        for (var i = 0; i < METAS.length; i++) {
            var meta = METAS[i];

            if (estado.ano === meta.ano) {
                // Verifica se o jogador atingiu os requisitos
                var passou = estado.co2 < meta.co2Max && estado.qualidadeVida >= meta.qvMin;

                return {
                    meta:      meta,
                    passou:    passou,
                    penalidade: passou ? 0 : meta.penalidade
                };
            }
        }

        return null; // nenhuma meta neste ano
    },

    // =========================================================================
    // FUNÇÃO 7: calcularPontuacao(estado)
    // Pontuação final com desconto por penalidades acumuladas.
    // =========================================================================
    calcularPontuacao: function (estado) {

        // Bônus por temperatura controlada
        var bonusTemp = Math.max(0, Math.round((2.0 - estado.temperatura) * 2000));

        // Bônus por CO₂ baixo
        var bonusCO2  = Math.max(0, Math.round((500 - estado.co2) * 2));

        // Bônus por qualidade de vida
        var bonusQV   = estado.qualidadeVida * 20;

        // Bônus por orçamento restante
        var bonusOrc  = Math.max(0, Math.floor(estado.orcamento / 10000));

        // Soma bruta
        var bruto = bonusTemp + bonusCO2 + bonusQV + bonusOrc;

        // Desconto das penalidades por metas perdidas
        var liquido = bruto - (estado.penalidades || 0);

        return Math.max(0, liquido);
    }

};
// =============================================================================
// Fim do arquivo climate.js
// =============================================================================
