// GameScene.js - Cidade Sustentável 2050
// Main gameplay scene

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    var self = this;

    // --- Pixel constants ---
    this.TILE = 84;
    this.COLS = 6;
    this.GX   = 15;
    this.GY   = 112;
    this.PX   = 545;

    // --- Instance state ---
    this.estado               = ClimateAlgorithm.criarEstadoInicial();
    this.estruturaSelecionada = null;
    this.modoDestrucao        = false;
    this.tileImages           = [];
    this.buildingImages       = [];
    this.highlightImage       = null;
    this.botoesEstrutura      = [];
    this.btnSelecionado       = null;
    this.textoPanelInfo       = null;
    this.btnAvançar           = null;
    this.btnDestruir          = null;

    // HUD text nodes (populated in criarHUD)
    this.hudTextos = {
      ano:       null,
      co2Val:    null,
      tempVal:   null,
      qvVal:     null,
      orcamento: null
    };

    // Bar fill Graphics (populated in criarHUD)
    this.barrasCO2  = null;
    this.barrasTemp = null;
    this.barrasQV   = null;

    // Tracked current bar pixel widths for tween interpolation
    this.barValuesCO2  = { val: 0 };
    this.barValuesTemp = { val: 0 };
    this.barValuesQV   = { val: 0 };

    // Bar pixel layout constants (set in criarHUD, used in atualizarHUD)
    this.barLayout = {
      x:  22,
      w:  490,
      h:  14,
      co2Y:  60,
      tmpY:  78,
      qvY:   96
    };

    // Overlay de perigo (pisca vermelho quando temp > 1.7)
    this.dangerOverlay = null;
    this.dangerTween   = null;

    // Guard para evitar múltiplos avanços simultâneos
    this.avancando = false;

    // Flag para popup em exibição (bloqueia avanço de ano)
    this.popupAtivo = false;

    // Build the scene
    this.criarFundo();
    this.criarHUD();
    this.criarGrade();
    this.criarPainel();

    // Pré-polui a cidade com 3 fábricas (Sistema 1 — Start sujo)
    this.prePoluirCidade();

    // Initial HUD sync
    this.atualizarHUD();
  }

  // -----------------------------------------------------------------------
  // criarFundo
  // -----------------------------------------------------------------------
  criarFundo() {
    // Left area background (light green)
    this.add.rectangle(267, 350, 534, 700, 0xe8f5e9).setOrigin(0.5);

    // Right panel background (near white)
    this.add.rectangle(870, 350, 655, 700, 0xf5f5f5).setOrigin(0.5);

    // Separator line
    var sep = this.add.graphics();
    sep.lineStyle(2, 0xc8e6c9, 1.0);
    sep.lineBetween(540, 0, 540, 700);
  }

  // -----------------------------------------------------------------------
  // criarHUD
  // -----------------------------------------------------------------------
  criarHUD() {
    var bl = this.barLayout;

    // --- Small coloured circle as game icon ---
    var icon = this.add.graphics();
    icon.fillStyle(0x43a047, 1);
    icon.fillCircle(16, 18, 8);

    // --- Title ---
    this.add.text(32, 12, 'CIDADE SUSTENTAVEL 2050', {
      color:      '#2e7d32',
      fontSize:   '15px',
      fontStyle:  'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0, 0);

    // --- Year ---
    this.hudTextos.ano = this.add.text(267, 30, 'Ano: 2024', {
      color:      '#33691e',
      fontSize:   '20px',
      fontStyle:  'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0);

    // --- Bar backgrounds ---
    var barBg = this.add.graphics();
    barBg.fillStyle(0xdcedc8, 1);
    barBg.fillRect(bl.x, bl.co2Y, bl.w, bl.h);
    barBg.fillRect(bl.x, bl.tmpY, bl.w, bl.h);
    barBg.fillRect(bl.x, bl.qvY,  bl.w, bl.h);

    // --- Bar fill Graphics ---
    this.barrasCO2  = this.add.graphics();
    this.barrasTemp = this.add.graphics();
    this.barrasQV   = this.add.graphics();

    // --- Bar labels ---
    var labelStyle = { color: '#558b2f', fontSize: '11px', fontStyle: 'bold', fontFamily: 'Nunito, Arial' };
    this.add.text(bl.x, bl.co2Y - 13, 'CO2',  labelStyle);
    this.add.text(bl.x, bl.tmpY - 13, 'TEMP', labelStyle);
    this.add.text(bl.x, bl.qvY  - 13, 'VIDA', labelStyle);

    // --- Bar value texts ---
    var valStyle = { color: '#33691e', fontSize: '11px', fontFamily: 'Nunito, Arial' };
    this.hudTextos.co2Val  = this.add.text(bl.x + bl.w, bl.co2Y + 1, '---', valStyle).setOrigin(1, 0);
    this.hudTextos.tempVal = this.add.text(bl.x + bl.w, bl.tmpY + 1, '---', valStyle).setOrigin(1, 0);
    this.hudTextos.qvVal   = this.add.text(bl.x + bl.w, bl.qvY  + 1, '---', valStyle).setOrigin(1, 0);

    // Thin divider below HUD
    var div = this.add.graphics();
    div.lineStyle(1, 0xc8e6c9, 1.0);
    div.lineBetween(0, 108, 534, 108);
  }

  // -----------------------------------------------------------------------
  // criarGrade
  // -----------------------------------------------------------------------
  criarGrade() {
    var self = this;

    for (var row = 0; row < 6; row++) {
      for (var col = 0; col < 6; col++) {
        var i  = row * 6 + col;
        var tx = this.GX + col * this.TILE + this.TILE / 2;
        var ty = this.GY + row * this.TILE + this.TILE / 2;

        // Base tile image
        var img = this.add.image(tx, ty, 'tile_base');
        this.tileImages.push(img);

        // Building slot (empty)
        this.buildingImages.push(null);

        // Interactive zone
        var zone = this.add.zone(tx, ty, this.TILE, this.TILE).setInteractive();
        zone.tileIndex = i;

        // Use IIFE to capture correct i and self
        (function(scene, idx) {
          zone.on('pointerover', function() {
            scene.onTileHover(idx);
          });
          zone.on('pointerout', function() {
            scene.onTileOut();
          });
          zone.on('pointerdown', function() {
            scene.onTileClick(idx);
          });
        })(self, i);
      }
    }

    // Shared highlight image (sits on top of all tiles)
    this.highlightImage = this.add.image(0, 0, 'tile_highlight')
      .setVisible(false)
      .setDepth(10);
  }

  // -----------------------------------------------------------------------
  // onTileHover / onTileOut
  // -----------------------------------------------------------------------
  onTileHover(index) {
    var col = index % this.COLS;
    var row = Math.floor(index / this.COLS);
    var tx  = this.GX + col * this.TILE + this.TILE / 2;
    var ty  = this.GY + row * this.TILE + this.TILE / 2;
    this.highlightImage.setPosition(tx, ty).setVisible(true);
  }

  onTileOut() {
    this.highlightImage.setVisible(false);
  }

  // -----------------------------------------------------------------------
  // prePoluirCidade — Sistema 1: Start Sujo
  // Coloca 3 fábricas pré-existentes na grade antes do jogador agir.
  // -----------------------------------------------------------------------
  prePoluirCidade() {
    var posicoes = [0, 3, 5]; // tiles do canto superior esquerdo, meio e direito
    var self = this;

    for (var k = 0; k < posicoes.length; k++) {
      (function(idx) {
        var col = idx % self.COLS;
        var row = Math.floor(idx / self.COLS);
        var bx  = self.GX + col * self.TILE + self.TILE / 2;
        var by  = self.GY + row * self.TILE + self.TILE / 2;

        var img = self.add.image(bx, by, 'tex_fabrica').setDepth(5);
        self.buildingImages[idx]  = img;
        self.estado.grade[idx]    = 'fabrica';
      })(posicoes[k]);
    }
  }

  // -----------------------------------------------------------------------
  // onTileClick
  // -----------------------------------------------------------------------
  onTileClick(index) {
    if (!this.estado.jogoAtivo) return;

    if (this.modoDestrucao) {
      var tipoAtual = this.estado.grade[index];
      if (!this.buildingImages[index] || !tipoAtual) return; // tile vazio

      // Demolição custa 20% do valor de construção (Sistema 1)
      var custoDemolicao = Math.round(STRUCTURES[tipoAtual].custo * 0.20);

      if (this.estado.orcamento < custoDemolicao) {
        // Sem dinheiro para demolir — pisca orçamento
        this.tweens.add({ targets: this.hudTextos.orcamento, alpha: 0.3, duration: 150, yoyo: true, repeat: 2 });
        // Texto informativo
        var sem = this.add.text(267, 350, 'Sem $ para demolir!', {
          fontSize: '16px', color: '#e53935', fontStyle: 'bold', fontFamily: 'Nunito, Arial'
        }).setOrigin(0.5).setDepth(55);
        this.tweens.add({ targets: sem, alpha: 0, y: 300, duration: 1000, onComplete: function() { sem.destroy(); } });
        return;
      }

      this.buildingImages[index].destroy();
      this.buildingImages[index] = null;
      this.estado.grade[index]   = null;
      this.estado.orcamento     -= custoDemolicao;

      // Texto flutuante mostrando custo da demolição
      var col   = index % this.COLS;
      var row   = Math.floor(index / this.COLS);
      var dx    = this.GX + col * this.TILE + this.TILE / 2;
      var dy    = this.GY + row * this.TILE + this.TILE / 2;
      var dtxt  = this.add.text(dx, dy, '-R$' + (custoDemolicao/1000) + 'k demolido', {
        fontSize: '12px', color: '#e65100', fontFamily: 'Nunito, Arial'
      }).setOrigin(0.5).setDepth(20);
      this.tweens.add({ targets: dtxt, y: dy - 40, alpha: 0, duration: 900,
        onComplete: function() { dtxt.destroy(); } });

      this.atualizarHUD();
      return;
    }

    if (!this.estruturaSelecionada) return;

    var s = STRUCTURES[this.estruturaSelecionada];

    if (this.estado.orcamento < s.custo) {
      // Flash budget red
      this.tweens.add({
        targets:  this.hudTextos.orcamento,
        alpha:    0.3,
        duration: 150,
        yoyo:     true,
        repeat:   1
      });
      return;
    }

    // Replace existing building sprite if present
    if (this.buildingImages[index]) {
      this.buildingImages[index].destroy();
    }

    var col      = index % this.COLS;
    var row      = Math.floor(index / this.COLS);
    var bx       = this.GX + col * this.TILE + this.TILE / 2;
    var by       = this.GY + row * this.TILE + this.TILE / 2;
    var buildImg = this.add.image(bx, by, s.textureKey).setDepth(5).setScale(0);
    this.buildingImages[index]  = buildImg;
    this.estado.grade[index]    = this.estruturaSelecionada;
    this.estado.orcamento      -= s.custo;

    // Animação de entrada: bounce scale
    this.tweens.add({
      targets:  buildImg,
      scale:    1.0,
      duration: 250,
      ease:     'Back.out'
    });

    // Texto flutuante com custo
    var floatTxt = this.add.text(bx, by - 10, '-R$' + (s.custo/1000) + 'k', {
      fontSize: '13px', color: '#e53935', fontStyle: 'bold', fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: floatTxt, y: by - 50, alpha: 0,
      duration: 900, ease: 'Power2',
      onComplete: function() { floatTxt.destroy(); }
    });

    this.atualizarHUD();
  }

  // -----------------------------------------------------------------------
  // criarPainel
  // -----------------------------------------------------------------------
  criarPainel() {
    var self  = this;
    var PX    = this.PX;   // 545
    var CX    = 870;       // panel centre X

    // Panel title
    this.add.text(CX, 8, 'ESTRUTURAS', {
      color:      '#2e7d32',
      fontSize:   '18px',
      fontStyle:  'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5, 0);

    // ---- Building buttons ----
    var ids  = ['fabrica', 'casaComum', 'casaVerde', 'parque', 'solar', 'eolica', 'ciclovia'];
    var btnH = 56;
    var btnW = 636;
    var gap  = 4;
    var startY = 36;

    for (var bi = 0; bi < ids.length; bi++) {
      var id  = ids[bi];
      var s   = STRUCTURES[id];
      var by  = startY + bi * (btnH + gap);
      var cY  = by + btnH / 2;  // vertical centre of button

      // Button background rectangle
      var bg = this.add.rectangle(CX, cY, btnW, btnH, 0xffffff)
        .setOrigin(0.5)
        .setInteractive()
        .setStrokeStyle(1, 0xc8e6c9, 1);

      // Building preview image
      var preview = this.add.image(PX + 20, cY, s.textureKey)
        .setScale(0.55)
        .setOrigin(0, 0.5);

      // Building name
      var nameText = this.add.text(PX + 72, by + 8, s.nome, {
        color:      '#33691e',
        fontSize:   '13px',
        fontStyle:  'bold',
        fontFamily: 'Nunito, Arial'
      });

      // CO2 impact
      var co2Val  = s.co2PorTurno;
      var co2Str  = (co2Val >= 0 ? '+' : '') + co2Val + ' ppm/ano';
      var co2Col  = (co2Val <= 0) ? '#43a047' : '#e53935';
      var co2Text = this.add.text(PX + 72, by + 26, co2Str, {
        color:      co2Col,
        fontSize:   '11px',
        fontFamily: 'Nunito, Arial'
      });

      // Cost
      var costText = this.add.text(PX + 72, by + 40, 'R$ ' + (s.custo / 1000) + 'k', {
        color:      '#ff8f00',
        fontSize:   '11px',
        fontFamily: 'Nunito, Arial'
      });

      // Store button data
      var btnData = { bg: bg, id: id, index: bi };
      this.botoesEstrutura.push(btnData);

      // Events — use IIFE to capture id and bi
      (function(scene, btnId, btnIndex) {
        bg.on('pointerover', function() {
          if (!scene.estruturaSelecionada || scene.estruturaSelecionada !== btnId) {
            bg.setFillStyle(0xf1f8e9);
          }
        });
        bg.on('pointerout', function() {
          if (!scene.estruturaSelecionada || scene.estruturaSelecionada !== btnId) {
            bg.setFillStyle(0xffffff);
          }
        });
        bg.on('pointerdown', function() {
          scene.selecionarEstrutura(btnId);
        });
      })(self, id, bi);
    }

    // ---- Demolish button ----
    var demolishY  = startY + ids.length * (btnH + gap) + 8;
    var demolishBg = this.add.rectangle(CX, demolishY + 20, 300, 40, 0xffebee)
      .setOrigin(0.5)
      .setInteractive()
      .setStrokeStyle(1, 0xef9a9a, 1);

    var demolishText = this.add.text(CX, demolishY + 20, 'DEMOLIR', {
      color:      '#e53935',
      fontSize:   '15px',
      fontStyle:  'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5);

    this.btnDestruir = demolishBg;

    demolishBg.on('pointerover', function() {
      demolishBg.setFillStyle(0xffcdd2);
    });
    demolishBg.on('pointerout', function() {
      demolishBg.setFillStyle(self.modoDestrucao ? 0xef9a9a : 0xffebee);
    });
    demolishBg.on('pointerdown', function() {
      self.modoDestrucao = !self.modoDestrucao;
      if (self.modoDestrucao) {
        // Deselect building
        self.estruturaSelecionada = null;
        for (var k = 0; k < self.botoesEstrutura.length; k++) {
          self.botoesEstrutura[k].bg.setFillStyle(0xffffff);
        }
        demolishBg.setFillStyle(0xef9a9a);
        demolishBg.setStrokeStyle(2, 0xe53935, 1);
        demolishText.setStyle({ color: '#e53935', fontStyle: 'bold', fontSize: '15px', fontFamily: 'Nunito, Arial' });
        self.textoPanelInfo.setText('Modo demolir ativo — clique em uma estrutura para remover');
      } else {
        demolishBg.setFillStyle(0xffebee);
        demolishBg.setStrokeStyle(1, 0xef9a9a, 1);
        demolishText.setStyle({ color: '#e53935', fontStyle: 'bold', fontSize: '15px', fontFamily: 'Nunito, Arial' });
        self.textoPanelInfo.setText('Selecione uma estrutura para construir');
      }
    });

    // ---- Budget display ----
    var budgetY = demolishY + 58;
    this.add.text(CX, budgetY, 'ORCAMENTO', {
      color:      '#558b2f',
      fontSize:   '12px',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5);

    this.hudTextos.orcamento = this.add.text(CX, budgetY + 18, 'R$ 800.000', {
      color:      '#e65100',
      fontSize:   '22px',
      fontStyle:  'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5);

    // ---- Advance year button ----
    var advY  = budgetY + 60;
    var advBg = this.add.rectangle(CX, advY + 30, 600, 60, 0x43a047)
      .setOrigin(0.5)
      .setInteractive();

    var advBorder = this.add.graphics();
    advBorder.lineStyle(3, 0x2e7d32, 1);
    advBorder.strokeRect(CX - 300, advY, 600, 60);

    var advText = this.add.text(CX, advY + 30, 'AVANCAR 1 ANO  ->', {
      color:      '#ffffff',
      fontSize:   '20px',
      fontStyle:  'bold',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5);

    this.btnAvançar = advBg;

    advBg.on('pointerover', function() {
      if (self.estado.jogoAtivo) {
        self.tweens.add({ targets: advBg,  scaleX: 1.02, scaleY: 1.02, duration: 80 });
        self.tweens.add({ targets: advText, scaleX: 1.02, scaleY: 1.02, duration: 80 });
      }
    });
    advBg.on('pointerout', function() {
      self.tweens.add({ targets: advBg,  scaleX: 1.0, scaleY: 1.0, duration: 80 });
      self.tweens.add({ targets: advText, scaleX: 1.0, scaleY: 1.0, duration: 80 });
    });
    advBg.on('pointerdown', function() {
      self.avancarAno();
    });

    // ---- Info text ----
    this.textoPanelInfo = this.add.text(CX, 680, 'Selecione uma estrutura para construir', {
      color:      '#558b2f',
      fontSize:   '12px',
      fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5);
  }

  // -----------------------------------------------------------------------
  // selecionarEstrutura
  // -----------------------------------------------------------------------
  selecionarEstrutura(id) {
    this.estruturaSelecionada = id;
    this.modoDestrucao        = false;

    // Reset demolish button visuals
    if (this.btnDestruir) {
      this.btnDestruir.setFillStyle(0xffebee);
      this.btnDestruir.setStrokeStyle(1, 0xef9a9a, 1);
    }

    // Reset all button backgrounds
    for (var i = 0; i < this.botoesEstrutura.length; i++) {
      this.botoesEstrutura[i].bg.setFillStyle(0xffffff);
      this.botoesEstrutura[i].bg.setStrokeStyle(1, 0xc8e6c9, 1);
    }

    // Highlight selected button
    for (var j = 0; j < this.botoesEstrutura.length; j++) {
      if (this.botoesEstrutura[j].id === id) {
        this.botoesEstrutura[j].bg.setFillStyle(0xe8f5e9);
        this.botoesEstrutura[j].bg.setStrokeStyle(2, 0x43a047, 1);
        break;
      }
    }

    // Update info text
    var s = STRUCTURES[id];
    this.textoPanelInfo.setText(
      'Construindo: ' + s.nome + ' | Custo: R$ ' + (s.custo / 1000) + 'k'
    );
  }

  // -----------------------------------------------------------------------
  // avancarAno
  // -----------------------------------------------------------------------
  avancarAno() {
    if (!this.estado.jogoAtivo) return;
    if (this.avancando)  return;
    if (this.popupAtivo) return;  // aguarda popup de evento/meta fechar
    this.avancando = true;
    this.time.delayedCall(800, function() { this.avancando = false; }, [], this);

    var co2Antes = this.estado.co2;
    var self     = this;

    // ---- 1. Avança o ano (algoritmo climático) ----
    this.estado = ClimateAlgorithm.avancarAno(this.estado);

    // ---- 2. Sistema 2: Gera e aplica evento aleatório ----
    var evento = ClimateAlgorithm.gerarEvento(this.estado.ano);
    if (evento) {
      var result = ClimateAlgorithm.aplicarEvento(this.estado, evento);
      this.estado = result.novoEstado;

      // Se enchente destruiu um edifício, remove o sprite
      if (result.tileDestruido >= 0) {
        var td = result.tileDestruido;
        if (this.buildingImages[td]) {
          this.buildingImages[td].destroy();
          this.buildingImages[td] = null;
        }
      }
    }

    // ---- 3. Sistema 3: Verifica meta anual ----
    var metaInfo = ClimateAlgorithm.verificarMetaAnual(this.estado);
    if (metaInfo) {
      this.estado.penalidades = (this.estado.penalidades || 0) + metaInfo.penalidade;
    }

    // ---- 4. Verifica condições de fim de jogo ----
    var resultado = ClimateAlgorithm.verificarCondicoes(this.estado);

    // ---- 5. Flash e texto flutuante de CO₂ ----
    var deltaCO2 = this.estado.co2 - co2Antes;
    var flash    = this.add.rectangle(267, 350, 534, 700, 0xffffff, 0.25).setDepth(50);
    this.tweens.add({ targets: flash, alpha: 0, duration: 300, onComplete: function() { flash.destroy(); } });

    var co2Str = (deltaCO2 >= 0 ? '+' : '') + deltaCO2 + ' ppm';
    var co2Cor = deltaCO2 <= 0 ? '#43a047' : '#e53935';
    var co2Txt = this.add.text(267, 370, co2Str, {
      fontSize: '22px', fontStyle: 'bold', color: co2Cor, fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(55).setAlpha(0);
    this.tweens.add({
      targets: co2Txt, alpha: 1, y: 310, duration: 300, ease: 'Power2',
      onComplete: function() {
        self.tweens.add({
          targets: co2Txt, alpha: 0, y: 260, duration: 600, delay: 300,
          onComplete: function() { co2Txt.destroy(); }
        });
      }
    });

    this.atualizarHUD();

    // ---- 6. Exibe popup de evento ou meta (com delay para não sobrepor efeitos) ----
    var temPopup = evento || metaInfo;
    if (temPopup && !resultado.fim) {
      this.time.delayedCall(500, function() {
        if (evento) {
          self.mostrarPopupEvento(evento, function() {
            if (metaInfo) {
              self.mostrarPopupMeta(metaInfo);
            }
          });
        } else if (metaInfo) {
          self.mostrarPopupMeta(metaInfo);
        }
      }, [], this);
    }

    // ---- 7. Fim de jogo ----
    if (resultado.fim) {
      this.estado.jogoAtivo = false;
      if (this.btnAvançar) {
        this.btnAvançar.setFillStyle(0xa5d6a7);
        this.btnAvançar.disableInteractive();
      }
      this.textoPanelInfo.setText('Simulação encerrada...');

      this.time.delayedCall(800, function() {
        var cor = resultado.vitoria ? 0x43a047 : 0xe53935;
        var overlay = self.add.rectangle(600, 350, 1200, 700, cor, 0).setDepth(100);
        self.tweens.add({
          targets: overlay, alpha: 0.55, duration: 450, yoyo: true, hold: 200,
          onComplete: function() {
            overlay.destroy();
            self.scene.start('EndScene', { estado: self.estado, resultado: resultado });
          }
        });
        if (!resultado.vitoria) { self.cameras.main.shake(400, 0.012); }
      }, [], this);
    }
  }

  // -----------------------------------------------------------------------
  // mostrarPopupEvento — Sistema 2: Eventos Aleatórios
  // -----------------------------------------------------------------------
  mostrarPopupEvento(evento, callback) {
    var self = this;
    this.popupAtivo = true;

    var cx = 267, cy = 400, pw = 500, ph = 160;

    // Fundo do popup
    var bg = this.add.graphics().setDepth(200);
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(cx - pw/2, cy - ph/2, pw, ph, 14);
    bg.lineStyle(3, evento.cor, 1.0);
    bg.strokeRoundedRect(cx - pw/2, cy - ph/2, pw, ph, 14);

    // Ícone colorido
    var ico = this.add.graphics().setDepth(201);
    ico.fillStyle(evento.cor, 1);
    ico.fillCircle(cx - pw/2 + 30, cy, 14);

    // Textos
    var t1 = this.add.text(cx - pw/2 + 55, cy - 45, 'EVENTO: ' + evento.nome.toUpperCase(), {
      fontSize: '16px', fontStyle: 'bold', color: evento.corHex, fontFamily: 'Nunito, Arial'
    }).setDepth(201);

    var t2 = this.add.text(cx - pw/2 + 55, cy - 20, evento.descricao, {
      fontSize: '13px', color: '#558b2f', fontFamily: 'Nunito, Arial'
    }).setDepth(201);

    var t3 = this.add.text(cx, cy + 25, evento.efeito, {
      fontSize: '18px', fontStyle: 'bold', color: evento.corHex, fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(201);

    var t4 = this.add.text(cx, cy + 60, 'Clique para continuar...', {
      fontSize: '11px', color: '#a5d6a7', fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(201);

    var elementos = [bg, ico, t1, t2, t3, t4];

    // Animação de entrada
    elementos.forEach(function(el) { el.setAlpha(0); });
    this.tweens.add({ targets: elementos, alpha: 1, duration: 300 });

    // Fechar ao clicar
    var zone = this.add.zone(cx, cy, pw, ph).setInteractive().setDepth(202);
    zone.on('pointerdown', function() {
      self.tweens.add({
        targets: elementos, alpha: 0, duration: 200,
        onComplete: function() {
          elementos.forEach(function(el) { el.destroy(); });
          zone.destroy();
          self.popupAtivo = false;
          if (callback) { callback(); }
        }
      });
    });

    // Auto-fechar após 5 segundos
    this.time.delayedCall(5000, function() {
      if (self.popupAtivo) { zone.emit('pointerdown'); }
    }, [], this);
  }

  // -----------------------------------------------------------------------
  // mostrarPopupMeta — Sistema 3: Metas Anuais
  // -----------------------------------------------------------------------
  mostrarPopupMeta(metaInfo) {
    var self  = this;
    var meta  = metaInfo.meta;
    var passou = metaInfo.passou;
    this.popupAtivo = true;

    var cx = 267, cy = 400, pw = 500, ph = 160;
    var cor    = passou ? 0x43a047 : 0xe53935;
    var corHex = passou ? '#43a047' : '#e53935';

    var bg = this.add.graphics().setDepth(200);
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(cx - pw/2, cy - ph/2, pw, ph, 14);
    bg.lineStyle(3, cor, 1.0);
    bg.strokeRoundedRect(cx - pw/2, cy - ph/2, pw, ph, 14);

    var titulo  = passou ? 'META ' + meta.ano + ' ATINGIDA!' : 'META ' + meta.ano + ' PERDIDA!';
    var sub1    = meta.descricao;
    var sub2    = passou
      ? '+0 penalidade — bom trabalho!'
      : '-' + meta.penalidade + ' pontos de penalidade';

    var t1 = this.add.text(cx, cy - 45, titulo, {
      fontSize: '20px', fontStyle: 'bold', color: corHex, fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(201);

    var t2 = this.add.text(cx, cy - 10, 'Meta: ' + sub1, {
      fontSize: '14px', color: '#558b2f', fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(201);

    var t3 = this.add.text(cx, cy + 25, sub2, {
      fontSize: '16px', fontStyle: 'bold', color: corHex, fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(201);

    var t4 = this.add.text(cx, cy + 60, 'Clique para continuar...', {
      fontSize: '11px', color: '#a5d6a7', fontFamily: 'Nunito, Arial'
    }).setOrigin(0.5).setDepth(201);

    var elementos = [bg, t1, t2, t3, t4];
    elementos.forEach(function(el) { el.setAlpha(0); });
    this.tweens.add({ targets: elementos, alpha: 1, duration: 300 });

    var zone = this.add.zone(cx, cy, pw, ph).setInteractive().setDepth(202);
    zone.on('pointerdown', function() {
      self.tweens.add({
        targets: elementos, alpha: 0, duration: 200,
        onComplete: function() {
          elementos.forEach(function(el) { el.destroy(); });
          zone.destroy();
          self.popupAtivo = false;
        }
      });
    });

    this.time.delayedCall(5000, function() {
      if (self.popupAtivo) { zone.emit('pointerdown'); }
    }, [], this);
  }

  // -----------------------------------------------------------------------
  // atualizarHUD
  // -----------------------------------------------------------------------
  atualizarHUD() {
    var self = this;
    var bl   = this.barLayout;
    var BAR_W = bl.w;

    // Year
    this.hudTextos.ano.setText('Ano: ' + this.estado.ano);

    // Budget
    this.hudTextos.orcamento.setText(this.formatarDinheiro(this.estado.orcamento));

    // --- CO2 bar ---
    var co2Pct = Phaser.Math.Clamp((this.estado.co2 - 280) / (560 - 280), 0, 1);
    var co2Col = (co2Pct < 0.4) ? 0x43a047 : (co2Pct < 0.7 ? 0xf39c12 : 0xe53935);
    var co2Target = co2Pct * BAR_W;
    this.hudTextos.co2Val.setText(this.estado.co2 + ' ppm');

    (function(pct, color, target) {
      self.tweens.add({
        targets:  self.barValuesCO2,
        val:      target,
        duration: 600,
        ease:     'Power2',
        onUpdate: function() {
          self.barrasCO2.clear();
          self.barrasCO2.fillStyle(color, 1);
          self.barrasCO2.fillRect(bl.x, bl.co2Y, Math.round(self.barValuesCO2.val), bl.h);
        }
      });
    })(co2Pct, co2Col, co2Target);

    // --- Temperature bar ---
    var tmpPct = Phaser.Math.Clamp((this.estado.temperatura - 1.0) / (2.0 - 1.0), 0, 1);
    var tmpCol = (tmpPct < 0.4) ? 0x43a047 : (tmpPct < 0.7 ? 0xf39c12 : 0xe53935);
    var tmpTarget = tmpPct * BAR_W;
    this.hudTextos.tempVal.setText('+' + this.estado.temperatura.toFixed(1) + 'C');

    (function(pct, color, target) {
      self.tweens.add({
        targets:  self.barValuesTemp,
        val:      target,
        duration: 600,
        ease:     'Power2',
        onUpdate: function() {
          self.barrasTemp.clear();
          self.barrasTemp.fillStyle(color, 1);
          self.barrasTemp.fillRect(bl.x, bl.tmpY, Math.round(self.barValuesTemp.val), bl.h);
        }
      });
    })(tmpPct, tmpCol, tmpTarget);

    // --- Quality of Life bar ---
    var qvPct    = Phaser.Math.Clamp(this.estado.qualidadeVida / 100, 0, 1);
    var qvCol    = (qvPct > 0.6) ? 0x43a047 : (qvPct > 0.3 ? 0xf39c12 : 0xe53935);
    var qvTarget = qvPct * BAR_W;
    this.hudTextos.qvVal.setText(Math.round(this.estado.qualidadeVida) + '%');

    (function(pct, color, target) {
      self.tweens.add({
        targets:  self.barValuesQV,
        val:      target,
        duration: 600,
        ease:     'Power2',
        onUpdate: function() {
          self.barrasQV.clear();
          self.barrasQV.fillStyle(color, 1);
          self.barrasQV.fillRect(bl.x, bl.qvY, Math.round(self.barValuesQV.val), bl.h);
        }
      });
    })(qvPct, qvCol, qvTarget);

    // --- Danger pulse: pisca borda vermelha quando temperatura >= 1.7°C ---
    if (this.estado.temperatura >= 1.7 && this.estado.jogoAtivo) {
      if (!this.dangerOverlay) {
        this.dangerOverlay = this.add.graphics().setDepth(90);
        this.dangerOverlay.lineStyle(6, 0xe53935, 0.9);
        this.dangerOverlay.strokeRect(3, 3, 528, 694);
      }
      if (!this.dangerTween) {
        this.dangerTween = this.tweens.add({
          targets:  this.dangerOverlay,
          alpha:    0,
          duration: 700,
          yoyo:     true,
          repeat:   -1,
          ease:     'Sine.inOut'
        });
      }
    } else if (this.dangerOverlay && this.estado.temperatura < 1.7) {
      this.dangerOverlay.destroy();
      this.dangerOverlay = null;
      this.dangerTween   = null;
    }
  }

  // -----------------------------------------------------------------------
  // formatarDinheiro
  // -----------------------------------------------------------------------
  formatarDinheiro(valor) {
    // Manual thousands separator for broad browser compatibility
    var inteiro = Math.round(valor);
    var neg     = inteiro < 0;
    var abs     = Math.abs(inteiro).toString();
    var result  = '';
    var count   = 0;
    for (var k = abs.length - 1; k >= 0; k--) {
      if (count > 0 && count % 3 === 0) result = '.' + result;
      result = abs[k] + result;
      count++;
    }
    return 'R$ ' + (neg ? '-' : '') + result;
  }

  // -----------------------------------------------------------------------
  // update — logic is event-driven
  // -----------------------------------------------------------------------
  update() { }
}
