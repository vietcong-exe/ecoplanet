// EndScene.js — Cidade Sustentável 2050
// Tela de resultado (vitória ou derrota) com pontuação animada

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  // data: { estado, resultado }
  create(data) {
    var estado    = data.estado;
    var resultado = data.resultado;
    var vitoria   = resultado.vitoria;
    var motivo    = resultado.motivo;
    var pontuacao = ClimateAlgorithm.calcularPontuacao(estado);

    this.criarFundo(vitoria);
    this.criarTitulo(vitoria, motivo);
    this.criarCards(estado, vitoria);
    this.criarPontuacao(pontuacao, vitoria);
    this.criarRodape(estado, vitoria);
    this.criarBotaoJogarNovamente(vitoria);
  }

  // -----------------------------------------------------------------------
  criarFundo(vitoria) {
    var corFundo = vitoria ? 0x071a0f : 0x1a0707;
    var corGlow  = vitoria ? 0x2ecc71 : 0xe74c3c;

    this.add.rectangle(600, 350, 1200, 700, corFundo).setOrigin(0.5);
    this.add.rectangle(600, 0, 1200, 130, corGlow, 0.10).setOrigin(0.5, 0);

    // Linha decorativa no fundo do glow
    var line = this.add.graphics();
    line.lineStyle(1, corGlow, 0.3);
    line.lineBetween(0, 130, 1200, 130);
  }

  // -----------------------------------------------------------------------
  criarTitulo(vitoria, motivo) {
    var titulo, subtitulo, corTitulo, corSub;

    if (vitoria) {
      titulo    = 'VITÓRIA!';
      subtitulo = 'Você salvou o clima até 2050!';
      corTitulo = '#2ecc71';
      corSub    = '#a9dfbf';
    } else {
      titulo    = 'GAME OVER';
      corTitulo = '#e74c3c';
      corSub    = '#f1948a';

      if (motivo === 'temperatura')            subtitulo = 'A temperatura global ultrapassou +2.0°C';
      else if (motivo === 'co2')               subtitulo = 'O CO₂ atingiu nível crítico (560 ppm)';
      else if (motivo === 'falencia')          subtitulo = 'Falência municipal — orçamento zerado';
      else if (motivo === 'meta_nao_atingida') subtitulo = '2050 chegou, mas as metas não foram atingidas';
      else                                     subtitulo = 'Simulação encerrada';
    }

    // Título principal (animado)
    var tituloText = this.add.text(600, 55, titulo, {
      fontSize:   '74px',
      fontStyle:  'bold',
      color:      corTitulo,
      fontFamily: 'Inter, Arial Black, Arial'
    }).setOrigin(0.5).setAlpha(0).setScale(0.7);

    this.tweens.add({
      targets:  tituloText,
      alpha:    1,
      scale:    1.0,
      duration: 600,
      ease:     'Back.out'
    });

    // Subtítulo
    var subText = this.add.text(600, 155, subtitulo, {
      fontSize:   '22px',
      color:      corSub,
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets:  subText,
      alpha:    1,
      duration: 500,
      delay:    300,
      ease:     'Power2'
    });
  }

  // -----------------------------------------------------------------------
  criarCards(estado, vitoria) {
    var corFundo = vitoria ? 0x0d2a15 : 0x2a0d0d;
    var corBorda = vitoria ? 0x2ecc71 : 0xe74c3c;

    var posicoes = [240, 600, 960];
    var labels   = ['TEMPERATURA', 'CO₂ FINAL', 'QUALIDADE DE VIDA'];
    var valores  = [
      '+' + estado.temperatura.toFixed(2) + '°C',
      estado.co2 + ' ppm',
      Math.round(estado.qualidadeVida) + '%'
    ];
    var cores = [
      estado.temperatura <= 1.5 ? '#2ecc71' : '#e74c3c',
      estado.co2 <= 350 ? '#2ecc71' : (estado.co2 <= 420 ? '#f39c12' : '#e74c3c'),
      estado.qualidadeVida >= 60 ? '#2ecc71' : (estado.qualidadeVida >= 30 ? '#f39c12' : '#e74c3c')
    ];

    for (var i = 0; i < 3; i++) {
      (function(scene, idx) {
        var cx  = posicoes[idx];
        var cy  = 295;
        var w   = 260;
        var h   = 100;
        var delay = idx * 120;

        // Card background — usando Graphics direto na cena (sem generateTexture)
        var g = scene.add.graphics();
        g.fillStyle(corFundo, 1);
        g.fillRect(cx - w/2, cy - h/2, w, h);
        g.lineStyle(1.5, corBorda, 0.7);
        g.strokeRect(cx - w/2, cy - h/2, w, h);
        g.setAlpha(0);

        // Rótulo (ex: "TEMPERATURA")
        var lbl = scene.add.text(cx, cy - 28, labels[idx], {
          fontSize:   '12px',
          color:      '#95a5a6',
          fontFamily: 'Inter, Arial'
        }).setOrigin(0.5).setAlpha(0);

        // Valor (ex: "+1.8°C")
        var val = scene.add.text(cx, cy + 10, valores[idx], {
          fontSize:   '30px',
          fontStyle:  'bold',
          color:      cores[idx],
          fontFamily: 'Inter, Arial Black, Arial'
        }).setOrigin(0.5).setAlpha(0);

        // Anima entrada
        scene.tweens.add({ targets: [g, lbl, val], alpha: 1, duration: 500, delay: delay + 250 });

      })(this, i);
    }
  }

  // -----------------------------------------------------------------------
  criarPontuacao(pontuacao, vitoria) {
    var cor = vitoria ? '#f9e79f' : '#e59866';

    this.add.text(600, 380, 'PONTUAÇÃO FINAL', {
      fontSize:   '13px',
      color:      '#7f8c8d',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5);

    var scoreText = this.add.text(600, 435, '0', {
      fontSize:   '60px',
      fontStyle:  'bold',
      color:      cor,
      fontFamily: 'Inter, Arial Black, Arial'
    }).setOrigin(0.5);

    // Contador animado 0 → pontuacao
    var obj = { val: 0 };
    this.tweens.add({
      targets:  obj,
      val:      pontuacao,
      duration: 1400,
      delay:    500,
      ease:     'Power2',
      onUpdate: function() {
        scoreText.setText(Math.round(obj.val).toLocaleString('pt-BR'));
      }
    });
  }

  // -----------------------------------------------------------------------
  criarRodape(estado, vitoria) {
    this.add.text(600, 510, 'Simulação encerrada em ' + estado.ano, {
      fontSize:   '14px',
      color:      '#5d6d7e',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5);

    var msg = vitoria
      ? 'Parabéns! Suas decisões sustentáveis fizeram a diferença.'
      : 'Tente novamente! Foque em energias limpas e parques.';
    var corMsg = vitoria ? '#a9dfbf' : '#f1948a';

    this.add.text(600, 542, msg, {
      fontSize:   '15px',
      color:      corMsg,
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5);

    this.add.text(600, 665, 'ODS 13 — Ação Contra a Mudança Global do Clima | UNINASSAU 2026', {
      fontSize:   '11px',
      color:      '#2c3e50',
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5);
  }

  // -----------------------------------------------------------------------
  criarBotaoJogarNovamente(vitoria) {
    var corFundo  = vitoria ? 0x1a472a : 0x4a1515;
    var corBorda  = vitoria ? 0x2ecc71 : 0xe74c3c;
    var corTexto  = vitoria ? '#2ecc71' : '#e74c3c';
    var cx = 600, cy = 598, bw = 290, bh = 54;

    // Fundo do botão (Graphics direto)
    var bg = this.add.graphics();
    bg.fillStyle(corFundo, 1);
    bg.fillRect(cx - bw/2, cy - bh/2, bw, bh);
    bg.lineStyle(2, corBorda, 1.0);
    bg.strokeRect(cx - bw/2, cy - bh/2, bw, bh);

    // Zona interativa invisível por cima
    var zone = this.add.zone(cx, cy, bw, bh).setInteractive();

    var txt = this.add.text(cx, cy, 'JOGAR NOVAMENTE', {
      fontSize:   '19px',
      fontStyle:  'bold',
      color:      corTexto,
      fontFamily: 'Inter, Arial'
    }).setOrigin(0.5);

    var self = this;
    zone.on('pointerdown',  function() { self.scene.start('MenuScene'); });
    zone.on('pointerover',  function() {
      self.tweens.add({ targets: [bg, txt], scaleX: 1.04, scaleY: 1.04, duration: 100 });
    });
    zone.on('pointerout',   function() {
      self.tweens.add({ targets: [bg, txt], scaleX: 1.0,  scaleY: 1.0,  duration: 100 });
    });
  }
}
