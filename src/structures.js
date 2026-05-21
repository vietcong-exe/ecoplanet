/**
 * STRUCTURES.js
 *
 * Define global object contendo todos os 7 tipos de construção que o jogador
 * pode colocar na grade da cidade. Cada estrutura possui propriedades de impacto
 * ambiental (CO₂), qualidade de vida, receita fiscal e custo de construção.
 *
 * Usado por:
 * - GameScene: para renderizar UI de seleção e informações
 * - ClimateAlgorithm: para calcular impactos ambientais cumulativos
 * - GridSystem: para validar e colocar construções
 */

var STRUCTURES = {
  fabrica: {
    nome: 'Fábrica',
    co2PorTurno: 15,
    qvPorTurno: -5,
    receitaPorTurno: 30000,
    custo: 80000,
    cor: 0x95a5a6,
    corHex: '#95a5a6',
    descricao: 'Gera renda, polui o ar',
    textureKey: 'tex_fabrica'
  },
  casaComum: {
    nome: 'Bairro Comum',
    co2PorTurno: 5,
    qvPorTurno: 3,
    receitaPorTurno: 12000,
    custo: 45000,
    cor: 0xe67e22,
    corHex: '#e67e22',
    descricao: 'Residências tradicionais',
    textureKey: 'tex_casaComum'
  },
  casaVerde: {
    nome: 'Bairro Eco',
    co2PorTurno: 1,
    qvPorTurno: 8,
    receitaPorTurno: 8000,
    custo: 65000,
    cor: 0x2ecc71,
    corHex: '#2ecc71',
    descricao: 'Casas com energia limpa',
    textureKey: 'tex_casaVerde'
  },
  parque: {
    nome: 'Parque',
    co2PorTurno: -8,
    qvPorTurno: 10,
    receitaPorTurno: 0,
    custo: 20000,
    cor: 0x27ae60,
    corHex: '#27ae60',
    descricao: 'Absorve CO₂, melhora o ar',
    textureKey: 'tex_parque'
  },
  solar: {
    nome: 'Painel Solar',
    co2PorTurno: -5,
    qvPorTurno: 4,
    receitaPorTurno: 5000,
    custo: 55000,
    cor: 0xf39c12,
    corHex: '#f39c12',
    descricao: 'Energia limpa do sol',
    textureKey: 'tex_solar'
  },
  eolica: {
    nome: 'Turbina Eólica',
    co2PorTurno: -6,
    qvPorTurno: 3,
    receitaPorTurno: 6000,
    custo: 75000,
    cor: 0x3498db,
    corHex: '#3498db',
    descricao: 'Energia limpa do vento',
    textureKey: 'tex_eolica'
  },
  ciclovia: {
    nome: 'Ciclovia',
    co2PorTurno: 0,
    qvPorTurno: 6,
    receitaPorTurno: 0,
    custo: 18000,
    cor: 0x9b59b6,
    corHex: '#9b59b6',
    descricao: 'Transporte sustentável',
    textureKey: 'tex_ciclovia'
  }
};
