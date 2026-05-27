class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this._criarTexturaBarco();
    this._criarTexturaGarrafa();
    this._criarTexturaLata();
    this._criarTexturaSaco();
    this._criarTexturaOleoNegro();
    this.scene.start('MenuScene');
  }

  _criarTexturaBarco() {
    var g = this.make.graphics({ x: 0, y: 0, add: false });
    // casco
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(0, 20, 64, 22, 6);
    g.fillStyle(0xe53935, 1);
    g.fillRect(0, 36, 64, 6);
    // cabine
    g.fillStyle(0xfff9c4, 1);
    g.fillRect(14, 8, 28, 16);
    // janela
    g.fillStyle(0x29b6f6, 1);
    g.fillRect(18, 11, 8, 8);
    g.fillRect(30, 11, 8, 8);
    // chaminé
    g.fillStyle(0x616161, 1);
    g.fillRect(38, 2, 6, 10);
    g.generateTexture('barco', 64, 42);
    g.destroy();
  }

  _criarTexturaGarrafa() {
    var g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x66bb6a, 1);
    g.fillRoundedRect(9, 0, 10, 20, 3);
    g.fillStyle(0x43a047, 1);
    g.fillRoundedRect(5, 16, 18, 10, 4);
    g.fillStyle(0x81c784, 0.5);
    g.fillRect(11, 3, 3, 10);
    g.generateTexture('garrafa', 28, 28);
    g.destroy();
  }

  _criarTexturaLata() {
    var g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xef5350, 1);
    g.fillRoundedRect(5, 4, 18, 20, 3);
    g.fillStyle(0xbdbdbd, 1);
    g.fillRect(5, 4, 18, 3);
    g.fillRect(5, 21, 18, 3);
    g.fillStyle(0xffffff, 0.3);
    g.fillRect(8, 7, 4, 14);
    g.generateTexture('lata', 28, 28);
    g.destroy();
  }

  _criarTexturaSaco() {
    var g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffd54f, 1);
    g.fillRoundedRect(4, 8, 20, 18, 5);
    g.fillStyle(0xffb300, 1);
    g.fillRect(4, 14, 20, 4);
    // nó
    g.fillStyle(0xffb300, 1);
    g.fillCircle(14, 9, 4);
    g.fillStyle(0x795548, 1);
    g.fillRect(12, 2, 4, 8);
    g.generateTexture('saco', 28, 28);
    g.destroy();
  }

  _criarTexturaOleoNegro() {
    var g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x212121, 0.85);
    g.fillEllipse(14, 16, 24, 16);
    g.fillStyle(0x424242, 0.6);
    g.fillEllipse(14, 14, 14, 8);
    g.generateTexture('oleo', 28, 28);
    g.destroy();
  }
}
