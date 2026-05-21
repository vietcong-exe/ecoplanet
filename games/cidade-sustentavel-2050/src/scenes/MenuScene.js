class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.criarFundo();
    this.criarSilhuetaCidade();
    this.criarEstrelas();
    this.criarParticulas();
    this.criarUI();
    this.criarBotaoJogar();
    this.criarAnimacoes();
  }

  criarFundo() {
    // Sky gradient strips (back to front)
    this.add.rectangle(600, 120, 1200, 240, 0x0f0f1a).setOrigin(0.5, 0.5);
    this.add.rectangle(600, 360, 1200, 240, 0x0d1a2a).setOrigin(0.5, 0.5);
    this.add.rectangle(600, 590, 1200, 220, 0x0a1a15).setOrigin(0.5, 0.5);
  }

  criarSilhuetaCidade() {
    // Building definitions: [x, y_top, width, height]
    var buildings = [
      [30,  580, 60,  120],
      [110, 560, 50,  140],
      [175, 590, 70,   90],
      [255, 540, 45,  160],
      [320, 570, 80,  130],
      [420, 550, 55,  150],
      [495, 580, 65,   90],
      [590, 530, 75,  170],
      [685, 560, 50,  140],
      [755, 545, 80,  155],
      [855, 575, 60,  125],
      [935, 555, 45,  145],
      [1000,580, 70,  100],
      [1085,560, 55,  140],
      [1150,575, 60,  125]
    ];

    var buildingGraphics = this.add.graphics();

    for (var i = 0; i < buildings.length; i++) {
      var b = buildings[i];
      var bx = b[0];
      var by = b[1];
      var bw = b[2];
      var bh = b[3];

      // Building body
      buildingGraphics.fillStyle(0x0d1f12, 1);
      buildingGraphics.fillRect(bx, by, bw, bh);

      // Scatter windows on this building
      var numWindows = Math.floor(bw / 12) * Math.floor(bh / 14);
      numWindows = Math.min(numWindows, 12);

      for (var w = 0; w < numWindows; w++) {
        var wx = bx + 4 + Math.random() * (bw - 10);
        var wy = by + 6 + Math.random() * (bh - 14);
        var alpha = 0.3 + Math.random() * 0.3; // 0.3 to 0.6, some dim
        if (Math.random() > 0.45) {
          // Lit window
          buildingGraphics.fillStyle(0x1abc9c, alpha);
          buildingGraphics.fillRect(wx, wy, 3, 4);
        }
        // else: dark window (not drawn)
      }
    }

    // Ground fill below buildings
    buildingGraphics.fillStyle(0x0a1a10, 1);
    buildingGraphics.fillRect(0, 700 - 40, 1200, 40);
  }

  criarEstrelas() {
    this.estrelas = [];

    for (var i = 0; i < 35; i++) {
      var sx = Math.random() * 1200;
      var sy = Math.random() * 290;
      var alpha = 0.3 + Math.random() * 0.5;

      var star = this.add.circle(sx, sy, 1, 0xffffff, alpha);
      this.estrelas.push(star);
    }
  }

  criarParticulas() {
    // Static atmospheric green particles
    for (var i = 0; i < 20; i++) {
      var px = 50 + Math.random() * 1100;
      var py = 300 + Math.random() * 200;
      var pr = 2 + Math.random() * 2;
      var palpha = 0.1 + Math.random() * 0.2;

      this.add.circle(px, py, pr, 0x2ecc71, palpha);
    }
  }

  criarUI() {
    // ODS Badge background
    this.add.rectangle(600, 120, 220, 45, 0x1a472a).setOrigin(0.5, 0.5);
    this.add.text(600, 120, 'ODS 13 — AÇÃO CLIMÁTICA', {
      fontSize: '13px',
      color: '#2ecc71',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);

    // Main title — "CIDADE"
    this.tituloCidade = this.add.text(600, 205, 'CIDADE', {
      fontSize: '72px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5).setAlpha(0);

    // Main title — "SUSTENTÁVEL 2050"
    this.tituloSustentavel = this.add.text(600, 270, 'SUSTENTÁVEL 2050', {
      fontSize: '52px',
      color: '#2ecc71',
      fontStyle: 'bold',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5).setAlpha(0);

    // Subtitle
    this.add.text(600, 320, 'Um jogo sobre mudanças climáticas', {
      fontSize: '18px',
      color: '#95a5a6',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);

    // Divider line
    var divider = this.add.graphics();
    divider.lineStyle(1, 0x2ecc71, 0.4);
    divider.lineBetween(400, 345, 800, 345);

    // Info text block
    this.add.text(600, 370, 'Você é o prefeito de uma cidade em 2024.', {
      fontSize: '15px',
      color: '#bdc3c7',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 393, 'Construa com sabedoria. Salve o clima até 2050.', {
      fontSize: '15px',
      color: '#bdc3c7',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 416, 'Meta: temperatura ≤ +1.5°C | CO₂ ≤ 350 ppm', {
      fontSize: '15px',
      color: '#bdc3c7',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);

    // Footer
    this.add.text(600, 650, 'UNINASSAU — Lógica de Programação — 2026', {
      fontSize: '11px',
      color: '#4a4a5a',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);
  }

  criarBotaoJogar() {
    // Button background rectangle
    this.botaoRect = this.add.rectangle(600, 510, 260, 62, 0x1a472a)
      .setOrigin(0.5, 0.5)
      .setInteractive();

    // Button border
    this.botaoBorda = this.add.graphics();
    this.botaoBorda.lineStyle(2, 0x2ecc71, 1.0);
    this.botaoBorda.strokeRect(600 - 130, 510 - 31, 260, 62);

    // Button text
    this.botaoTexto = this.add.text(600, 510, '▶  JOGAR', {
      fontSize: '26px',
      color: '#2ecc71',
      fontStyle: 'bold',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5, 0.5);

    // Hover interactions
    var self = this;

    this.botaoRect.on('pointerover', function () {
      self.tweens.add({
        targets: [self.botaoRect, self.botaoTexto],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Power2'
      });
      self.botaoRect.setFillStyle(0x27ae60);
      self.botaoBorda.clear();
      self.botaoBorda.lineStyle(2, 0x2ecc71, 1.0);
      self.botaoBorda.strokeRect((600 - 130) * 1, (510 - 31) * 1, 260, 62);
    });

    this.botaoRect.on('pointerout', function () {
      self.tweens.add({
        targets: [self.botaoRect, self.botaoTexto],
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 150,
        ease: 'Power2'
      });
      self.botaoRect.setFillStyle(0x1a472a);
    });

    this.botaoRect.on('pointerdown', function () {
      self.scene.start('GameScene');
    });
  }

  criarAnimacoes() {
    // Title "CIDADE" fade in
    this.tweens.add({
      targets: this.tituloCidade,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    // Title "SUSTENTÁVEL 2050" fade in with delay
    this.tweens.add({
      targets: this.tituloSustentavel,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      delay: 400
    });

    // Button text pulse (yoyo infinite)
    this.tweens.add({
      targets: this.botaoTexto,
      alpha: 0.7,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Twinkling stars — pick 5 random stars
    var twinkling = Phaser.Utils.Array.Shuffle(this.estrelas.slice()).slice(0, 5);

    for (var i = 0; i < twinkling.length; i++) {
      this.tweens.add({
        targets: twinkling[i],
        alpha: 0.9,
        duration: 1500 + Math.random() * 1500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1000
      });
    }
  }
}
