var EndScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:
  function EndScene() {
    Phaser.Scene.call(this, { key: 'EndScene' });
  },

  create: function(data) {
    var estado = data.estado;
    var resultado = data.resultado;
    var vitoria = resultado.vitoria;
    var motivo = resultado.motivo;
    var pontuacao = ClimateAlgorithm.calcularPontuacao(estado);

    this.criarFundo(vitoria);
    this.criarTitulo(vitoria, motivo);
    this.criarCards(estado, vitoria);
    this.criarPontuacao(pontuacao, vitoria);
    this.criarBotaoJogarNovamente(vitoria);
    this.criarRodape(estado, vitoria);
  },

  criarFundo: function(vitoria) {
    var corFundo = vitoria ? 0x071a0f : 0x1a0707;
    var corGlow = vitoria ? 0x2ecc71 : 0xe74c3c;

    this.add.rectangle(600, 350, 1200, 700, corFundo).setOrigin(0.5);
    this.add.rectangle(600, 0, 1200, 120, corGlow, 0.12).setOrigin(0.5, 0);
  },

  criarTitulo: function(vitoria, motivo) {
    var titulo, subtitulo, corTitulo, corSubtitulo;

    if (vitoria) {
      titulo = 'VITÓRIA!';
      subtitulo = 'Você salvou o clima até 2050!';
      corTitulo = '#2ecc71';
      corSubtitulo = '#a9dfbf';
    } else {
      titulo = 'GAME OVER';
      corTitulo = '#e74c3c';

      if (motivo === 'temperatura') {
        subtitulo = 'A temperatura global ultrapassou +2.0°C';
      } else if (motivo === 'co2') {
        subtitulo = 'O CO2 atmosférico atingiu nível crítico (560 ppm)';
      } else if (motivo === 'meta_nao_atingida') {
        subtitulo = '2050 chegou, mas as metas climáticas não foram atingidas';
      } else {
        subtitulo = 'A simulação chegou ao fim';
      }

      corSubtitulo = '#f1948a';
    }

    var tituloText = this.add.text(600, 120, titulo, {
      fontSize: '80px',
      fontStyle: 'bold',
      color: corTitulo,
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    tituloText.setAlpha(0);
    tituloText.setScale(0.8);

    this.tweens.add({
      targets: tituloText,
      alpha: 1,
      scale: 1.0,
      duration: 700,
      ease: 'Power2.out'
    });

    this.add.text(600, 210, subtitulo, {
      fontSize: '24px',
      color: corSubtitulo,
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  },

  criarCards: function(estado, vitoria) {
    var corFundoCard = vitoria ? 0x0d2a15 : 0x2a0d0d;
    var corBorda = vitoria ? 0x2ecc71 : 0xe74c3c;

    var posicoes = [240, 600, 960];
    var labels = ['TEMPERATURA FINAL', 'CO2 FINAL', 'QUALIDADE DE VIDA'];
    var valores = [
      '+' + estado.temperatura.toFixed(1) + '°C',
      estado.co2 + ' ppm',
      estado.qualidadeVida + '%'
    ];

    var corValores = [
      estado.temperatura <= 1.5 ? '#2ecc71' : '#e74c3c',
      estado.co2 <= 350 ? '#2ecc71' : estado.co2 <= 420 ? '#f39c12' : '#e74c3c',
      estado.qualidadeVida >= 60 ? '#2ecc71' : estado.qualidadeVida >= 30 ? '#f39c12' : '#e74c3c'
    ];

    var delayStagger = [0, 150, 300];

    for (var i = 0; i < 3; i++) {
      (function(index) {
        var graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(corFundoCard, 1);
        graphics.fillRect(posicoes[index] - 130, 270, 260, 100);
        graphics.strokeStyle(corBorda, 0.6, 1.5);
        graphics.strokeRect(posicoes[index] - 130, 270, 260, 100);
        graphics.generateTexture('card_' + index, 260, 100);
        graphics.destroy();

        var cardImage = this.add.image(posicoes[index], 320, 'card_' + index);
        cardImage.setAlpha(0);

        this.tweens.add({
          targets: cardImage,
          alpha: 1,
          duration: 600,
          delay: delayStagger[index],
          ease: 'Power2.out'
        });

        var labelText = this.add.text(posicoes[index], 285, labels[index], {
          fontSize: '12px',
          color: '#7f8c8d',
          fontFamily: 'Arial'
        }).setOrigin(0.5);

        labelText.setAlpha(0);
        this.tweens.add({
          targets: labelText,
          alpha: 1,
          duration: 600,
          delay: delayStagger[index],
          ease: 'Power2.out'
        });

        var valorText = this.add.text(posicoes[index], 330, valores[index], {
          fontSize: '28px',
          fontStyle: 'bold',
          color: corValores[index],
          fontFamily: 'Arial'
        }).setOrigin(0.5);

        valorText.setAlpha(0);
        this.tweens.add({
          targets: valorText,
          alpha: 1,
          duration: 600,
          delay: delayStagger[index],
          ease: 'Power2.out'
        });
      }).call(this, i);
    }
  },

  criarPontuacao: function(pontuacao, vitoria) {
    var corPontuacao = vitoria ? '#f9e79f' : '#e59866';

    this.add.text(600, 390, 'PONTUAÇÃO FINAL', {
      fontSize: '14px',
      color: '#7f8c8d',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    var scoreText = this.add.text(600, 445, '0', {
      fontSize: '56px',
      fontStyle: 'bold',
      color: corPontuacao,
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    var scoreObj = { val: 0 };
    this.tweens.add({
      targets: scoreObj,
      val: pontuacao,
      duration: 1500,
      ease: 'Power2',
      onUpdate: function() {
        scoreText.setText(Math.round(scoreObj.val).toString());
      },
      onUpdateScope: this
    });
  },

  criarRodape: function(estado, vitoria) {
    var anoText = 'Simulação encerrada em ' + estado.ano;
    this.add.text(600, 495, anoText, {
      fontSize: '15px',
      color: '#5d6d7e',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    var msgMotivacional;
    var corMsg;

    if (vitoria) {
      msgMotivacional = 'Parabéns! Suas decisões sustentáveis fizeram a diferença.';
      corMsg = '#a9dfbf';
    } else {
      msgMotivacional = 'Tente novamente! Foque em energias limpas e parques.';
      corMsg = '#f1948a';
    }

    this.add.text(600, 535, msgMotivacional, {
      fontSize: '16px',
      color: corMsg,
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(600, 655, 'ODS 13 — Ação Contra a Mudança Global do Clima | UNINASSAU 2026', {
      fontSize: '11px',
      color: '#2c3e50',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  },

  criarBotaoJogarNovamente: function(vitoria) {
    var corFundo = vitoria ? 0x1a472a : 0x4a1515;
    var corBorda = vitoria ? 0x2ecc71 : 0xe74c3c;
    var corTexto = vitoria ? '#2ecc71' : '#e74c3c';

    var graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(corFundo, 1);
    graphics.fillRect(260, 572, 280, 52);
    graphics.generateTexture('btn_background', 280, 52);
    graphics.destroy();

    var botaoImage = this.add.image(600, 598, 'btn_background');
    botaoImage.setInteractive();

    var botaoGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    botaoGraphics.strokeStyle(corBorda, 1.5);
    botaoGraphics.strokeRect(260, 572, 280, 52);
    botaoGraphics.generateTexture('btn_border', 280, 52);
    botaoGraphics.destroy();

    var botaoBorder = this.add.image(600, 598, 'btn_border');

    var botaoText = this.add.text(600, 598, 'JOGAR NOVAMENTE', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: corTexto,
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    botaoImage.on('pointerdown', function() {
      this.scene.start('MenuScene');
    }, this);

    botaoImage.on('pointerover', function() {
      this.tweens.add({
        targets: [botaoImage, botaoBorder, botaoText],
        scale: 1.05,
        duration: 200,
        ease: 'Power2.out'
      });
    }, this);

    botaoImage.on('pointerout', function() {
      this.tweens.add({
        targets: [botaoImage, botaoBorder, botaoText],
        scale: 1.0,
        duration: 200,
        ease: 'Power2.out'
      });
    }, this);
  }
});
