class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.TEMPO_TOTAL   = 120;
    this.TOTAL_LIXOS   = 25;
    this.META_COLETA   = 20;
    this.VELOCIDADE    = 220;

    this.lixosColetados = 0;
    this.tempoRestante  = this.TEMPO_TOTAL;
    this.jogoAtivo      = true;

    this._criarCenario();
    this._criarOndasAnimadas();
    this._criarLixos();
    this._criarBarco();
    this._criarHUD();
    this._criarControles();
    this._iniciarTimer();
  }

  _criarCenario() {
    // Fundo oceano
    var g = this.add.graphics();
    g.fillGradientStyle(0x0d47a1, 0x0d47a1, 0x1565c0, 0x1565c0, 1, 1, 1, 1);
    g.fillRect(0, 0, 1200, 700);

    // Reflexo de luz
    for (var i = 0; i < 8; i++) {
      g.fillStyle(0x1976d2, 0.15 + (i % 3) * 0.05);
      g.fillEllipse(80 + i * 150, 300 + (i % 3) * 80, 120, 40);
    }
  }

  _criarOndasAnimadas() {
    this.ondas = [];
    for (var i = 0; i < 5; i++) {
      var g = this.add.graphics();
      g.fillStyle(0x1976d2, 0.25);
      g.fillEllipse(0, 0, 200, 30);
      g.x = Phaser.Math.Between(0, 1200);
      g.y = Phaser.Math.Between(80, 620);
      this.ondas.push(g);

      this.tweens.add({
        targets: g,
        x: g.x + 80,
        alpha: { from: 0.25, to: 0.05 },
        duration: Phaser.Math.Between(3000, 5000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
    }
  }

  _criarLixos() {
    this.grupoLixos = this.add.group();
    var tipos = ['garrafa', 'lata', 'saco', 'oleo'];

    for (var i = 0; i < this.TOTAL_LIXOS; i++) {
      var tipo = tipos[i % tipos.length];
      var x = Phaser.Math.Between(60, 1140);
      var y = Phaser.Math.Between(80, 620);

      var lixo = this.add.image(x, y, tipo);
      lixo.setInteractive(false);
      lixo.tipoLixo = tipo;

      this.grupoLixos.add(lixo);

      // bobagem suave
      this.tweens.add({
        targets: lixo,
        y: y + Phaser.Math.Between(8, 18),
        duration: Phaser.Math.Between(1400, 2400),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
    }
  }

  _criarBarco() {
    this.barco = this.add.image(600, 350, 'barco');
    this.barco.setScale(1.4);

    // trilha de onda atrás do barco
    this.trilha = this.add.graphics();
  }

  _criarHUD() {
    // Painel HUD superior
    var painelBg = this.add.graphics();
    painelBg.fillStyle(0x0a2a6a, 0.85);
    painelBg.fillRoundedRect(0, 0, 1200, 54, 0);

    // Coleta
    this.txtColeta = this.add.text(24, 16, 'Lixo: 0 / ' + this.META_COLETA, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    });

    // Timer
    this.txtTimer = this.add.text(600, 27, '2:00', {
      fontSize: '24px',
      color: '#ffd600',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // ODS badge
    var badge = this.add.graphics();
    badge.fillStyle(0x0288d1, 0.9);
    badge.fillRoundedRect(930, 12, 240, 30, 15);
    this.add.text(1050, 27, 'ODS 14 — VIDA NA AGUA', {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Barra de progresso
    this.barraFundo = this.add.graphics();
    this.barraFundo.fillStyle(0x0d47a1, 1);
    this.barraFundo.fillRoundedRect(200, 58, 800, 10, 5);

    this.barraProgresso = this.add.graphics();
    this._atualizarBarra();
  }

  _atualizarBarra() {
    this.barraProgresso.clear();
    var pct = this.lixosColetados / this.META_COLETA;
    var largura = Math.min(pct, 1) * 800;
    this.barraProgresso.fillStyle(0x4fc3f7, 1);
    this.barraProgresso.fillRoundedRect(200, 58, largura, 10, 5);
  }

  _criarControles() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  _iniciarTimer() {
    var self = this;
    this.timerEvento = this.time.addEvent({
      delay: 1000,
      repeat: this.TEMPO_TOTAL - 1,
      callback: function () {
        self.tempoRestante--;
        var min = Math.floor(self.tempoRestante / 60);
        var seg = self.tempoRestante % 60;
        self.txtTimer.setText(min + ':' + (seg < 10 ? '0' : '') + seg);

        if (self.tempoRestante <= 20) {
          self.txtTimer.setColor('#ef5350');
        }

        if (self.tempoRestante <= 0 && self.jogoAtivo) {
          self._encerrarJogo(false);
        }
      }
    });
  }

  update() {
    if (!this.jogoAtivo) return;

    var vx = 0;
    var vy = 0;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx = -this.VELOCIDADE;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx =  this.VELOCIDADE;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy = -this.VELOCIDADE;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  vy =  this.VELOCIDADE;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    var dt = this.game.loop.delta / 1000;
    this.barco.x = Phaser.Math.Clamp(this.barco.x + vx * dt, 36, 1164);
    this.barco.y = Phaser.Math.Clamp(this.barco.y + vy * dt, 80, 660);

    if (vx > 0)  this.barco.setFlipX(false);
    if (vx < 0)  this.barco.setFlipX(true);

    this._verificarColeta();
  }

  _verificarColeta() {
    var self = this;
    var itens = this.grupoLixos.getChildren();

    for (var i = itens.length - 1; i >= 0; i--) {
      var lixo = itens[i];
      if (!lixo.active) continue;

      var dx = lixo.x - this.barco.x;
      var dy = lixo.y - this.barco.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 44) {
        this._coletarLixo(lixo);
      }
    }
  }

  _coletarLixo(lixo) {
    lixo.setActive(false).setVisible(false);
    this.lixosColetados++;

    this.txtColeta.setText('Lixo: ' + this.lixosColetados + ' / ' + this.META_COLETA);
    this._atualizarBarra();

    // partícula de coleta
    var flash = this.add.circle(lixo.x, lixo.y, 18, 0x4fc3f7, 0.8);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      duration: 350,
      ease: 'Power2',
      onComplete: function () { flash.destroy(); }
    });

    if (this.lixosColetados >= this.META_COLETA) {
      this._encerrarJogo(true);
    }
  }

  _encerrarJogo(vitoria) {
    if (!this.jogoAtivo) return;
    this.jogoAtivo = false;
    this.timerEvento.remove();

    var self = this;
    this.time.delayedCall(600, function () {
      self.scene.start('EndScene', {
        vitoria: vitoria,
        coletados: self.lixosColetados,
        total: self.META_COLETA
      });
    });
  }
}
