class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this._criarOceano();
    this._criarOndasDecorativas();
    this._criarSol();
    this._criarNuvens();
    this._criarBarcoDecorativo();
    this._criarUI();
    this._criarBotaoJogar();
    this._criarAnimacoes();
  }

  _criarOceano() {
    var g = this.add.graphics();
    // céu
    g.fillGradientStyle(0x0288d1, 0x0288d1, 0x29b6f6, 0x29b6f6, 1, 1, 1, 1);
    g.fillRect(0, 0, 1200, 380);
    // oceano
    g.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x1565c0, 0x1565c0, 1, 1, 1, 1);
    g.fillRect(0, 360, 1200, 340);
    // horizonte
    g.fillStyle(0x29b6f6, 0.4);
    g.fillRect(0, 355, 1200, 18);
  }

  _criarOndasDecorativas() {
    var g = this.add.graphics();
    g.fillStyle(0x1976d2, 0.5);
    for (var i = 0; i < 6; i++) {
      g.fillEllipse(i * 220 - 60, 385 + (i % 2) * 18, 180, 28);
    }
    g.fillStyle(0x1565c0, 0.35);
    for (var j = 0; j < 5; j++) {
      g.fillEllipse(j * 240 + 40, 440 + (j % 2) * 22, 200, 24);
    }
  }

  _criarSol() {
    var g = this.add.graphics();
    g.fillStyle(0xffd600, 0.12);
    g.fillCircle(1060, 80, 80);
    g.fillStyle(0xffd600, 0.22);
    g.fillCircle(1060, 80, 60);
    g.fillStyle(0xffd600, 1);
    g.fillCircle(1060, 80, 44);
  }

  _criarNuvens() {
    var g = this.add.graphics();
    this._nuvem(g, 160, 95, 1.0);
    this._nuvem(g, 820, 70, 0.80);
    this._nuvem(g, 530, 125, 0.65);
  }

  _nuvem(g, cx, cy, alpha) {
    g.fillStyle(0xffffff, alpha);
    g.fillRoundedRect(cx - 60, cy, 120, 32, 16);
    g.fillCircle(cx - 22, cy, 24);
    g.fillCircle(cx + 10, cy - 8, 30);
    g.fillCircle(cx + 40, cy, 20);
  }

  _criarBarcoDecorativo() {
    // Barco decorativo à esquerda
    var barco = this.add.image(220, 348, 'barco');
    barco.setScale(1.8).setAlpha(0.85);

    // Lixo flutuando
    this.add.image(480, 375, 'garrafa').setScale(0.9).setAlpha(0.7);
    this.add.image(760, 390, 'lata').setScale(0.9).setAlpha(0.7);
    this.add.image(620, 382, 'saco').setScale(0.9).setAlpha(0.7);
  }

  _criarUI() {
    // Badge ODS 14
    var badge = this.add.graphics();
    badge.fillStyle(0x0288d1, 1);
    badge.fillRoundedRect(472, 88, 256, 40, 20);
    this.add.text(600, 108, 'ODS 14 — VIDA NA AGUA', {
      fontSize: '13px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Título
    this.tituloA = this.add.text(600, 192, 'OCEANO', {
      fontSize: '80px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial',
      stroke: '#0d47a1',
      strokeThickness: 6
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.tituloB = this.add.text(600, 262, 'LIMPO', {
      fontSize: '56px',
      color: '#ffd600',
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial',
      stroke: '#e65100',
      strokeThickness: 4
    }).setOrigin(0.5, 0.5).setAlpha(0);

    this.add.text(600, 306, 'Limpe o oceano e salve a vida marinha!', {
      fontSize: '16px',
      color: '#e3f2fd',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Painel de instruções
    var panel = this.add.graphics();
    panel.fillStyle(0xffffff, 0.15);
    panel.fillRoundedRect(330, 324, 540, 80, 14);

    this.add.text(600, 345, 'Use as setas ou WASD para mover o barco.', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 366, 'Colete 20 de 25 lixos em 2 minutos para vencer!', {
      fontSize: '14px',
      color: '#fff9c4',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    this.add.text(600, 387, 'Cada lixo coletado salva um animal marinho.', {
      fontSize: '13px',
      color: '#b3e5fc',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Footer
    this.add.text(600, 668, 'UNINASSAU — Logica de Programacao — 2026', {
      fontSize: '11px',
      color: '#b3e5fc',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0.5);
  }

  _criarBotaoJogar() {
    var self = this;

    this.add.graphics()
      .fillStyle(0x0d47a1, 1)
      .fillRoundedRect(470, 432, 260, 58, 30);

    this.botaoFundo = this.add.graphics();
    this.botaoFundo.fillStyle(0x1565c0, 1);
    this.botaoFundo.fillRoundedRect(470, 426, 260, 58, 30);

    this.botaoTexto = this.add.text(600, 455, 'JOGAR', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0.5);

    var hitArea = this.add.rectangle(600, 455, 260, 58, 0x000000, 0)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    hitArea.on('pointerover', function () {
      self.botaoFundo.clear();
      self.botaoFundo.fillStyle(0x1976d2, 1);
      self.botaoFundo.fillRoundedRect(470, 423, 260, 58, 30);
    });

    hitArea.on('pointerout', function () {
      self.botaoFundo.clear();
      self.botaoFundo.fillStyle(0x1565c0, 1);
      self.botaoFundo.fillRoundedRect(470, 426, 260, 58, 30);
    });

    hitArea.on('pointerdown', function () {
      self.scene.start('GameScene');
    });
  }

  _criarAnimacoes() {
    this.tweens.add({
      targets: this.tituloA,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    this.tweens.add({
      targets: this.tituloB,
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
