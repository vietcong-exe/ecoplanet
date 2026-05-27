class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.criarCeu();
    this.criarSol();
    this.criarNuvens();
    this.criarCidade();
    this.criarGrama();
    this.criarUI();
    this.criarBotaoJogar();
    this.criarAnimacoes();
  }

  criarCeu() {
    var sky = this.add.graphics();
    // Gradiente: azul escuro no topo → azul claro no horizonte
    sky.fillGradientStyle(0x1565c0, 0x1565c0, 0x81d4fa, 0x81d4fa, 1, 1, 1, 1);
    sky.fillRect(0, 0, 1200, 700);
  }

  criarSol() {
    var g = this.add.graphics();
    // Brilho externo
    g.fillStyle(0xffd600, 0.12);
    g.fillCircle(1055, 78, 80);
    // Brilho médio
    g.fillStyle(0xffd600, 0.20);
    g.fillCircle(1055, 78, 62);
    // Sol
    g.fillStyle(0xffd600, 1);
    g.fillCircle(1055, 78, 46);
  }

  criarNuvens() {
    var g = this.add.graphics();
    this._nuvem(g, 170, 100, 1.0);
    this._nuvem(g, 860, 75,  0.75);
    this._nuvem(g, 575, 130, 0.60);
  }

  _nuvem(g, cx, cy, alpha) {
    g.fillStyle(0xffffff, alpha);
    g.fillRoundedRect(cx - 58, cy, 116, 30, 15);
    g.fillCircle(cx - 22, cy,  22);
    g.fillCircle(cx +  8, cy - 6, 28);
    g.fillCircle(cx + 38, cy,  18);
  }

  criarCidade() {
    var cores = [
      0xe65100, 0x43a047, 0x1565c0, 0x6a1b9a,
      0xc62828, 0x00838f, 0xf57f17, 0x2e7d32,
      0x283593, 0x558b2f, 0xe65100, 0x43a047,
      0x1565c0, 0x6a1b9a, 0x00838f
    ];

    var predios = [
      [20,  490, 65,  210],
      [95,  468, 55,  232],
      [160, 502, 78,  198],
      [248, 448, 52,  252],
      [308, 478, 88,  222],
      [404, 458, 60,  242],
      [472, 498, 72,  202],
      [552, 438, 82,  262],
      [642, 468, 56,  232],
      [706, 452, 88,  248],
      [802, 490, 66,  210],
      [876, 462, 52,  238],
      [936, 498, 76,  202],
      [1020,472, 62,  228],
      [1090,484, 82,  216]
    ];

    var g = this.add.graphics();

    for (var i = 0; i < predios.length; i++) {
      var p = predios[i];
      var px = p[0], py = p[1], pw = p[2], ph = p[3];
      var cor = cores[i % cores.length];

      // Corpo do prédio
      g.fillStyle(cor, 1);
      g.fillRect(px, py, pw, ph);

      // Sombra lateral direita
      g.fillStyle(0x000000, 0.15);
      g.fillRect(px + pw - 6, py, 6, ph);

      // Janelas
      g.fillStyle(0xffffff, 0.55);
      for (var wy = py + 10; wy < py + ph - 8; wy += 20) {
        for (var wx = px + 7; wx < px + pw - 7; wx += 14) {
          if (Math.random() > 0.35) {
            g.fillRect(wx, wy, 5, 7);
          }
        }
      }

      // Topo do prédio (detalhe)
      g.fillStyle(0xffffff, 0.20);
      g.fillRect(px, py, pw, 5);
    }
  }

  criarGrama() {
    var g = this.add.graphics();
    g.fillStyle(0x2e7d32, 1);
    g.fillRect(0, 648, 1200, 52);
    g.fillStyle(0x4caf50, 1);
    g.fillRect(0, 638, 1200, 16);
    g.fillStyle(0x66bb6a, 1);
    g.fillRect(0, 634, 1200, 8);
  }

  criarUI() {
    // Badge ODS
    var badge = this.add.graphics();
    badge.fillStyle(0xff8f00, 1);
    badge.fillRoundedRect(486, 92, 228, 40, 20);
    this.add.text(600, 112, 'ODS 13 — AÇÃO CLIMÁTICA', {
      fontSize: '13px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Título "CIDADE"
    this.tituloCidade = this.add.text(600, 196, 'CIDADE', {
      fontSize: '74px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial',
      stroke: '#0d47a1',
      strokeThickness: 5
    }).setOrigin(0.5, 0.5).setAlpha(0);

    // Título "SUSTENTÁVEL 2050"
    this.tituloSustentavel = this.add.text(600, 265, 'SUSTENTÁVEL 2050', {
      fontSize: '48px',
      color: '#ffd600',
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial',
      stroke: '#e65100',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5).setAlpha(0);

    // Subtítulo
    this.add.text(600, 308, 'Um jogo sobre mudanças climáticas', {
      fontSize: '16px',
      color: '#e3f2fd',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Painel semi-transparente para as linhas de info
    var panel = this.add.graphics();
    panel.fillStyle(0xffffff, 0.15);
    panel.fillRoundedRect(340, 324, 520, 90, 14);

    this.add.text(600, 345, 'Você é o prefeito de uma cidade em 2024.', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 368, 'Construa com sabedoria. Salve o clima até 2050.', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 391, 'Meta: temperatura ≤ +1.5°C | CO₂ ≤ 350 ppm', {
      fontSize: '14px',
      color: '#fff9c4',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Footer
    this.add.text(600, 668, 'UNINASSAU — Lógica de Programação — 2026', {
      fontSize: '11px',
      color: '#a5d6a7',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0.5);
  }

  criarBotaoJogar() {
    var self = this;

    // Sombra do botão
    this.add.graphics()
      .fillStyle(0x2e7d32, 1)
      .fillRoundedRect(470, 432, 260, 58, 30);

    // Fundo do botão
    this.botaoFundo = this.add.graphics();
    this.botaoFundo.fillStyle(0x43a047, 1);
    this.botaoFundo.fillRoundedRect(470, 426, 260, 58, 30);

    // Texto do botão
    this.botaoTexto = this.add.text(600, 455, '▶  JOGAR', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0.5);

    // Área de clique invisível
    var hitArea = this.add.rectangle(600, 455, 260, 58, 0x000000, 0)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', function () {
      self.botaoFundo.clear();
      self.botaoFundo.fillStyle(0x66bb6a, 1);
      self.botaoFundo.fillRoundedRect(470, 423, 260, 58, 30);
    });

    hitArea.on('pointerout', function () {
      self.botaoFundo.clear();
      self.botaoFundo.fillStyle(0x43a047, 1);
      self.botaoFundo.fillRoundedRect(470, 426, 260, 58, 30);
    });

    hitArea.on('pointerdown', function () {
      self.scene.start('GameScene');
    });
  }

  criarAnimacoes() {
    this.tweens.add({
      targets: this.tituloCidade,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    this.tweens.add({
      targets: this.tituloSustentavel,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      delay: 400
    });

    this.tweens.add({
      targets: this.botaoTexto,
      alpha: 0.75,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
}
