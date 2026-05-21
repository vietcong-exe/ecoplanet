/*
 * =============================================================================
 * climate.js — Algoritmos Climáticos para "Cidade Sustentável 2050"
 * =============================================================================
 *
 * DESCRIÇÃO DO ARQUIVO:
 *   Este arquivo contém o núcleo algorítmico do jogo educacional "Cidade
 *   Sustentável 2050", desenvolvido como trabalho de Programação Lógica para
 *   ilustrar os conceitos da ODS 13 (Ação Contra a Mudança Global do Clima)
 *   da ONU (Organização das Nações Unidas).
 *
 * FUNÇÕES PURAS (SEM DEPENDÊNCIA DO PHASER):
 *   Todas as funções aqui definidas são funções puras, ou seja, não dependem
 *   do framework Phaser nem de qualquer estado global externo. Elas recebem
 *   dados como entrada e retornam novos dados como saída, sem efeitos
 *   colaterais. Isso facilita testes, depuração e apresentação acadêmica.
 *
 * NOTA EDUCACIONAL — RELAÇÃO CO₂ E TEMPERATURA:
 *   A concentração de dióxido de carbono (CO₂) na atmosfera é medida em ppm
 *   (partes por milhão). No período pré-industrial (antes de 1850), essa
 *   concentração era de aproximadamente 280 ppm. Em 2024, já ultrapassou
 *   420 ppm — o nível mais alto em 800.000 anos.
 *
 *   O aquecimento global é diretamente relacionado a esse aumento: cada
 *   acréscimo de CO₂ intensifica o efeito estufa. O modelo simplificado
 *   utilizado neste jogo é:
 *
 *       temperatura = 1.2 + (co2 - 420) × 0.003
 *
 *   Esse modelo é uma linearização educacional baseada nos dados do IPCC
 *   (Painel Intergovernamental sobre Mudanças Climáticas). Na realidade,
 *   a relação é logarítmica, mas a linearização permite compreensão
 *   intuitiva para fins pedagógicos.
 *
 * RELAÇÃO COM A ODS 13:
 *   A ODS 13 exige "Ação Climática" urgente para limitar o aquecimento global
 *   a 1,5°C acima dos níveis pré-industriais (Acordo de Paris, 2015).
 *   Neste jogo, o jogador gerencia uma cidade até 2050, tomando decisões de
 *   infraestrutura (energia solar, transporte público, parques, etc.) para
 *   reduzir emissões de CO₂ e melhorar a qualidade de vida, alcançando
 *   exatamente a meta estabelecida pela ODS 13.
 *
 * ESTRUTURA DO OBJETO DE ESTADO:
 *   O jogo utiliza um único objeto de estado imutável que é recriado a cada
 *   turno (ano), garantindo rastreabilidade e transparência algorítmica.
 *
 * Autores: Trabalho acadêmico — Programação Lógica
 * Disciplina: Lógica de Programação
 * Tema: ODS 13 — Ação Contra a Mudança Global do Clima
 * =============================================================================
 */

// =============================================================================
// OBJETO PRINCIPAL: ClimateAlgorithm
// Agrupa todas as funções algorítmicas do sistema climático do jogo.
// =============================================================================
var ClimateAlgorithm = {

    // =========================================================================
    // FUNÇÃO 1: criarEstadoInicial()
    // =========================================================================
    // Cria e retorna um objeto representando o estado inicial do jogo.
    // Cada propriedade corresponde a uma variável do sistema climático/urbano
    // que será monitorada e modificada ao longo da simulação.
    // =========================================================================
    criarEstadoInicial: function () {

        // Retorna um novo objeto com todos os atributos do jogo no ano de início
        return {
            // Ano atual da simulação (começa em 2024, termina em 2050)
            ano: 2024,

            // Concentração de CO₂ atmosférico em ppm (Partes Por Milhão).
            // Valor atual real: ~420 ppm (nível pré-industrial era 280 ppm)
            co2: 420,

            // Aquecimento global em °C acima do nível pré-industrial (1850).
            // O Acordo de Paris estabelece o limite crítico de 1,5°C.
            temperatura: 1.2,

            // Índice de qualidade de vida da cidade, numa escala de 0 a 100.
            // Representa bem-estar, saúde, mobilidade e sustentabilidade urbana.
            qualidadeVida: 30,

            // Orçamento municipal disponível em Reais (R$).
            // O jogador usa esse recurso para construir estruturas na cidade.
            orcamento: 800000,

            // Grade da cidade: array de 36 posições representando uma malha 6x6.
            // Cada posição pode ser null (terreno vazio) ou uma string com o
            // tipo da estrutura construída (ex: 'solar', 'parque', 'bus').
            grade: new Array(36).fill(null),

            // Flag que indica se o jogo está em andamento.
            // Torna-se false quando uma condição de fim de jogo é atingida.
            jogoAtivo: true
        };
    },

    // =========================================================================
    // FUNÇÃO 2: avancarAno(estado)
    // =========================================================================
    // ALGORITMO PRINCIPAL DA SIMULAÇÃO CLIMÁTICA.
    //
    // Recebe o estado atual do jogo e calcula o novo estado após um ano
    // de simulação. Considera as estruturas construídas pelo jogador na
    // grade da cidade e aplica as fórmulas climáticas e econômicas.
    //
    // IMPORTANTE: Esta função NÃO modifica o objeto 'estado' original.
    // Em vez disso, cria uma cópia (padrão de imutabilidade), processa os
    // cálculos na cópia e retorna o novo objeto atualizado.
    //
    // Parâmetros:
    //   estado (Object) — o estado atual do jogo (não será alterado)
    //
    // Retorna:
    //   (Object) — novo objeto de estado com os valores atualizados
    // =========================================================================
    avancarAno: function (estado) {

        // ---- Passo 0: Criar cópia do estado (imutabilidade) ----
        // Copiamos o objeto para não modificar o original.
        // O array 'grade' precisa de cópia separada pois Object.assign
        // faz cópia rasa (shallow copy) — o array seria compartilhado.
        var novo = Object.assign({}, estado);
        novo.grade = estado.grade.slice(); // cópia independente do array

        // ---- Passo 1: Inicializar variáveis do turno ----

        // deltaCO2: variação de CO₂ neste turno.
        // Começa em +2 ppm, representando as emissões globais de fundo
        // que o jogador não controla (indústria global, desmatamento, etc.)
        var deltaCO2 = 2;

        // totalQV: acumulador da qualidade de vida vinda das estruturas.
        // Será somado ao longo do loop e normalizado depois.
        var totalQV = 0;

        // receita: receita municipal gerada neste turno.
        // Começa em R$50.000 como receita base da prefeitura (impostos, etc.)
        var receita = 50000;

        // ---- Passo 2: Percorre todas as células da grade ----
        // Para cada uma das 36 posições da grade 6x6:
        for (var i = 0; i < novo.grade.length; i++) {

            // Obtém o tipo de estrutura presente neste tile da grade
            var tipoEstrutura = novo.grade[i];

            // Ignora tiles vazios (null) e tipos não reconhecidos pelo sistema
            if (tipoEstrutura !== null && STRUCTURES[tipoEstrutura]) {

                // Recupera os dados da estrutura a partir do catálogo global
                var estrutura = STRUCTURES[tipoEstrutura];

                // Acumula o impacto no CO₂:
                // Valores negativos = estrutura absorve/reduz CO₂ (ex: parques, solar)
                // Valores positivos = estrutura emite CO₂ (ex: fábricas, tráfego)
                deltaCO2 += estrutura.co2PorTurno;

                // Acumula o impacto na qualidade de vida dos cidadãos
                totalQV += estrutura.qvPorTurno;

                // Acumula a receita gerada pela estrutura
                // (impostos, tarifas, economia de energia, etc.)
                receita += estrutura.receitaPorTurno;
            }
        }
        // Ao final do loop, deltaCO2, totalQV e receita refletem
        // o efeito combinado de TODAS as estruturas da cidade.

        // ---- Passo 3: Atualizar concentração de CO₂ ----
        // Aplica a variação calculada ao CO₂ atual.
        // O valor mínimo é 280 ppm (nível pré-industrial — limite científico):
        // seria impossível cair abaixo desse valor sem tecnologia futurista.
        var novoCO2 = Math.max(280, novo.co2 + deltaCO2);
        novo.co2 = novoCO2;

        // ---- Passo 4: Calcular nova temperatura global ----
        // Utiliza o modelo climático simplificado (linearização educacional):
        //
        //   T = 1.2 + (CO₂ - 420) × 0.003
        //
        // Onde:
        //   1.2  = aquecimento atual em 2024 (°C acima do pré-industrial)
        //   420  = concentração de CO₂ de referência em 2024 (ppm)
        //   0.003 = sensibilidade climática simplificada (°C por ppm)
        //
        // parseFloat + toFixed(2) garante que a temperatura tenha
        // exatamente 2 casas decimais (ex: 1.35, não 1.3500000001)
        var novaTemperatura = parseFloat((1.2 + (novoCO2 - 420) * 0.003).toFixed(2));
        novo.temperatura = novaTemperatura;

        // ---- Passo 5: Calcular qualidade de vida normalizada ----
        // O totalQV acumulado no loop é multiplicado por 2 para escalar
        // o impacto das estruturas no índice geral.
        // Math.max(0, ...) impede valores negativos (piso em 0).
        // Math.min(100, ...) impede valores acima do máximo (teto em 100).
        var novaQV = Math.min(100, Math.max(0, totalQV * 2));
        novo.qualidadeVida = novaQV;

        // ---- Passo 6: Adicionar receita ao orçamento municipal ----
        // A receita gerada pelas estruturas e a receita base são somadas
        // ao orçamento disponível para o próximo turno.
        novo.orcamento = novo.orcamento + receita;

        // ---- Passo 7: Avançar o ano da simulação ----
        // Incrementa o marcador temporal em 1 unidade (1 ano por turno).
        novo.ano = novo.ano + 1;

        // Retorna o novo estado calculado (o estado original permanece intacto)
        return novo;
    },

    // =========================================================================
    // FUNÇÃO 3: verificarCondicoes(estado)
    // =========================================================================
    // Avalia as condições de fim de jogo com base no estado atual.
    //
    // O jogo pode terminar de 4 formas:
    //   1. Derrota por temperatura crítica (≥ 2.0°C) — colapso climático
    //   2. Derrota por CO₂ crítico (≥ 560 ppm) — ponto de não retorno
    //   3. Vitória em 2050 — metas da ODS 13 atingidas
    //   4. Derrota em 2050 — metas não atingidas ao fim do prazo
    //
    // Parâmetros:
    //   estado (Object) — estado atual do jogo a ser avaliado
    //
    // Retorna:
    //   (Object) — objeto com propriedades:
    //              fim (boolean): true se o jogo deve encerrar
    //              vitoria (boolean): true se o jogador venceu
    //              motivo (string): identificador da condição atingida
    // =========================================================================
    verificarCondicoes: function (estado) {

        // ---- Condição de derrota 1: Temperatura crítica ----
        // Se o aquecimento global atingir ou superar 2.0°C acima do nível
        // pré-industrial, os efeitos são irreversíveis (inundações, secas
        // extremas, colapso de ecossistemas). O jogo encerra imediatamente.
        if (estado.temperatura >= 2.0) {
            return {
                fim: true,
                vitoria: false,
                motivo: 'temperatura'  // aquecimento ultrapassou o limite crítico
            };
        }

        // ---- Condição de derrota 2: Concentração de CO₂ crítica ----
        // 560 ppm representa o dobro do nível pré-industrial — um marco
        // científico associado a consequências climáticas catastróficas.
        // Se atingido, o jogo encerra independentemente do ano.
        if (estado.co2 >= 560) {
            return {
                fim: true,
                vitoria: false,
                motivo: 'co2'  // concentração de CO₂ atingiu patamar catastrófico
            };
        }

        // ---- Condições de fim de prazo (ano 2050) ----
        // O Acordo de Paris e a Agenda 2030 da ONU definem 2050 como prazo
        // para neutralidade de carbono. Verificamos se o jogador chegou lá.
        if (estado.ano > 2050) {

            // Verifica se TODAS as metas da ODS 13 foram cumpridas:
            // - Temperatura contida em até 1.5°C (meta do Acordo de Paris)
            // - Qualidade de vida acima de 60 (cidade sustentável e próspera)
            if (estado.temperatura <= 1.5 && estado.qualidadeVida >= 60) {
                return {
                    fim: true,
                    vitoria: true,
                    motivo: 'meta_atingida'  // parabéns: ODS 13 cumprida!
                };
            } else {
                // 2050 chegou, mas as metas não foram alcançadas.
                // Representa o cenário real de inação climática.
                return {
                    fim: true,
                    vitoria: false,
                    motivo: 'meta_nao_atingida'  // prazo esgotado sem atingir as metas
                };
            }
        }

        // ---- Jogo continua ----
        // Nenhuma condição de fim foi ativada; a simulação prossegue.
        return {
            fim: false
        };
    },

    // =========================================================================
    // FUNÇÃO 4: calcularPontuacao(estado)
    // =========================================================================
    // Calcula a pontuação final do jogador com base no estado do jogo.
    //
    // A pontuação é composta por 4 bônus que incentivam as metas da ODS 13:
    //   1. Bônus de temperatura — recompensa manter o clima controlado
    //   2. Bônus de CO₂ — recompensa reduzir as emissões atmosféricas
    //   3. Bônus de qualidade de vida — recompensa cidades sustentáveis
    //   4. Bônus de orçamento — recompensa gestão financeira responsável
    //
    // Parâmetros:
    //   estado (Object) — estado final do jogo a ser avaliado
    //
    // Retorna:
    //   (number) — pontuação total inteira, mínimo 0
    // =========================================================================
    calcularPontuacao: function (estado) {

        // ---- Componente 1: Bônus por temperatura baixa ----
        // Fórmula: (2.0 - temperatura) × 2000
        // Se a temperatura estiver em 1.2°C → bônus de 1600 pontos
        // Se a temperatura estiver em 2.0°C → bônus de 0 pontos
        // Math.max(0, ...) garante que temperaturas acima de 2.0°C não
        // subtraiam pontos nesta componente.
        var bonusTemperatura = Math.max(0, Math.round((2.0 - estado.temperatura) * 2000));

        // ---- Componente 2: Bônus por CO₂ baixo ----
        // Fórmula: (500 - co2) × 2
        // Se o CO₂ estiver em 420 ppm → bônus de 160 pontos
        // Se o CO₂ estiver em 280 ppm → bônus de 440 pontos (máximo real)
        // Math.max(0, ...) evita penalidade nesta componente.
        var bonusCO2 = Math.max(0, Math.round((500 - estado.co2) * 2));

        // ---- Componente 3: Bônus por qualidade de vida ----
        // Cada ponto no índice de qualidade de vida vale 20 pontos na pontuação.
        // Máximo possível: 100 × 20 = 2000 pontos.
        var bonusQualidadeVida = estado.qualidadeVida * 20;

        // ---- Componente 4: Bônus por orçamento restante ----
        // Cada R$10.000 restantes no orçamento valem 1 ponto.
        // Incentiva gestão fiscal prudente sem desperdício de recursos.
        var bonusOrcamento = Math.floor(estado.orcamento / 10000);

        // ---- Somar todos os componentes ----
        var total = bonusTemperatura + bonusCO2 + bonusQualidadeVida + bonusOrcamento;

        // Garante que a pontuação nunca seja negativa (mínimo absoluto: 0)
        return Math.max(0, total);
    }

};
// =============================================================================
// Fim do arquivo climate.js
// ClimateAlgorithm está disponível globalmente para uso pelo Phaser e pela
// interface do jogo através da variável 'ClimateAlgorithm'.
// =============================================================================
