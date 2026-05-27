class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.vitoria   = data.vitoria;
    this.coletados = data.coletados;
    this.total     = data.total;
  }

  create() {
    this._criarFundo();
    this._criarCard();
    this._criarBotoes();

    if (this.vitoria) {
      this._concederFolha();
    }
  }

  _criarFundo() {
    var g = this.add.graphics();
    if (this.vitoria) {
      g.fillGradientStyle(0x0288d1, 0x0288d1, 0x1565c0, 0x1565c0, 1, 1, 1, 1);
    } else {
      g.fillGradientStyle(0x0d2040, 0x0d2040, 0x1a3560, 0x1a3560, 1, 1, 1, 1);
    }
    g.fillRect(0, 0, 1200, 700);

    // ondas decorativas
    var gO = this.add.graphics();
    gO.fillStyle(0xffffff, 0.06);
    for (var i = 0; i < 6; i++) {
      gO.fillEllipse(i * 220, 600 + (i % 2) * 20, 260, 40);
    }
  }

  _criarCard() {
    var card = this.add.graphics();
    card.fillStyle(0xffffff, 1);
    card.fillRoundedRect(350, 140, 500, 380, 24);
    card.lineStyle(3, this.vitoria ? 0x29b6f6 : 0x546e7a, 1);
    card.strokeRoundedRect(350, 140, 500, 380, 24);

    // Icone topo
    if (this.vitoria) {
      var circulo = this.add.graphics();
      circulo.fillStyle(0x29b6f6, 1);
      circulo.fillCircle(600, 148, 48);
      this.add.text(600, 148, '♥', {
        fontSize: '36px', color: '#ffffff'
      }).setOrigin(0.5, 0.5);
    } else {
      var circulo2 = this.add.graphics();
      circulo2.fillStyle(0x546e7a, 1);
      circulo2.fillCircle(600, 148, 48);
      this.add.text(600, 148, '☠', {
        fontSize: '36px', color: '#ffffff'
      }).setOrigin(0.5, 0.5);
    }

    var titulo = this.vitoria ? 'Oceano Salvo!' : 'Tente de novo!';
    var corTitulo = this.vitoria ? '#0288d1' : '#546e7a';

    this.add.text(600, 210, titulo, {
      fontSize: '38px',
      color: corTitulo,
      fontStyle: 'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0.5);

    var subtitulo = this.vitoria
      ? 'Voce coletou ' + this.coletados + ' lixos\ne salvou a vida marinha!'
      : 'Voce coletou ' + this.coletados + ' de ' + this.total + ' lixos.\nPrecisa de ' + this.total + ' para vencer.';

    this.add.text(600, 278, subtitulo, {
      fontSize: '17px',
      color: '#455a64',
      fontFamily: 'Nunito, Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    if (this.vitoria) {
      var recompensaBg = this.add.graphics();
      recompensaBg.fillStyle(0xe3f2fd, 1);
      recompensaBg.fillRoundedRect(390, 320, 420, 80, 14);

      this.add.text(600, 345, 'Recompensa desbloqueada!', {
        fontSize: '15px',
        color: '#0288d1',
        fontFamily: 'Nunito, Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0.5);

      this.txtFolha = this.add.text(600, 374, 'Conquistando uma Folha Verde...', {
        fontSize: '18px',
        color: '#43a047',
        fontFamily: 'Nunito, Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0.5);
    } else {
      this.add.text(600, 358, 'Seja rapido — o oceano precisa de voce!', {
        fontSize: '15px',
        color: '#78909c',
        fontFamily: 'Nunito, Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0.5);
    }
  }

  _criarBotoes() {
    var self = this;
    var yBtn = this.vitoria ? 460 : 430;

    // Botão jogar de novo
    var bgNovo = this.add.graphics();
    bgNovo.fillStyle(0x1565c0, 1);
    bgNovo.fillRoundedRect(380, yBtn, 220, 52, 28);

    var txtNovo = this.add.text(490, yBtn + 26, 'Jogar Novamente', {
      fontSize: '17px', color: '#ffffff',
      fontFamily: 'Nunito, Arial', fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    var hitNovo = this.add.rectangle(490, yBtn + 26, 220, 52, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    hitNovo.on('pointerdown', function () {
      self.scene.start('MenuScene');
    });

    // Botão hub
    var bgHub = this.add.graphics();
    bgHub.fillStyle(0xeceff1, 1);
    bgHub.fillRoundedRect(620, yBtn, 200, 52, 28);

    var txtHub = this.add.text(720, yBtn + 26, 'Sair', {
      fontSize: '17px', color: '#546e7a',
      fontFamily: 'Nunito, Arial', fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    var hitHub = this.add.rectangle(720, yBtn + 26, 200, 52, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    hitHub.on('pointerdown', function () {
      window.location.href = '../../index.html';
    });
  }

  _concederFolha() {
    var self = this;

    if (!window._supabase) {
      if (self.txtFolha) self.txtFolha.setText('+1 Folha Verde conquistada!');
      return;
    }

    window._supabase.auth.getSession().then(function (result) {
      if (!result.data || !result.data.session) {
        if (self.txtFolha) self.txtFolha.setText('+1 Folha Verde conquistada!');
        return;
      }

      var userId = result.data.session.user.id;

      window._supabase
        .from('profiles')
        .select('folhas')
        .eq('user_id', userId)
        .single()
        .then(function (res) {
          var folhasAtual = (res.data && res.data.folhas) ? res.data.folhas : 0;

          return window._supabase
            .from('profiles')
            .update({ folhas: folhasAtual + 1 })
            .eq('user_id', userId);
        })
        .then(function () {
          if (self.txtFolha) self.txtFolha.setText('+1 Folha Verde conquistada!');
        })
        .catch(function () {
          if (self.txtFolha) self.txtFolha.setText('+1 Folha Verde conquistada!');
        });
    }).catch(function () {
      if (self.txtFolha) self.txtFolha.setText('+1 Folha Verde conquistada!');
    });
  }
}
