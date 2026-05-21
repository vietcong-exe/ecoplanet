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
      h:  16,
      co2Y:  58,
      tmpY:  76,
      qvY:   94
    };

    // Build the scene
    this.criarFundo();
    this.criarHUD();
    this.criarGrade();
    this.criarPainel();

    // Initial HUD sync
    this.atualizarHUD();
  }

  // -----------------------------------------------------------------------
  // criarFundo
  // -----------------------------------------------------------------------
  criarFundo() {
    // Left area background
    this.add.rectangle(267, 350, 534, 700, 0x0d1b12).setOrigin(0.5);

    // Right panel background
    this.add.rectangle(870, 350, 655, 700, 0x070d1a).setOrigin(0.5);

    // Separator line
    var sep = this.add.graphics();
    sep.lineStyle(1, 0x2ecc71, 0.2);
    sep.lineBetween(540, 0, 540, 700);
  }

  // -----------------------------------------------------------------------
  // criarHUD
  // -----------------------------------------------------------------------
  criarHUD() {
    var bl = this.barLayout;

    // --- Small coloured circle as game icon ---
    var icon = this.add.graphics();
    icon.fillStyle(0x2ecc71, 1);
    icon.fillCircle(16, 18, 8);

    // --- Title ---
    this.add.text(32, 12, 'CIDADE SUSTENTAVEL 2050', {
      color:     '#2ecc71',
      fontSize:  '15px',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    // --- Year ---
    this.hudTextos.ano = this.add.text(267, 30, 'Ano: 2024', {
      color:     '#ecf0f1',
      fontSize:  '20px',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // --- Bar backgrounds ---
    var barBg = this.add.graphics();
    barBg.fillStyle(0x1a2a1a, 1);
    barBg.fillRect(bl.x, bl.co2Y, bl.w, bl.h);
    barBg.fillRect(bl.x, bl.tmpY, bl.w, bl.h);
    barBg.fillRect(bl.x, bl.qvY,  bl.w, bl.h);

    // --- Bar fill Graphics ---
    this.barrasCO2  = this.add.graphics();
    this.barrasTemp = this.add.graphics();
    this.barrasQV   = this.add.graphics();

    // --- Bar labels ---
    var labelStyle = { color: '#95a5a6', fontSize: '11px', fontStyle: 'bold' };
    this.add.text(bl.x, bl.co2Y - 13, 'CO2',  labelStyle);
    this.add.text(bl.x, bl.tmpY - 13, 'TEMP', labelStyle);
    this.add.text(bl.x, bl.qvY  - 13, 'VIDA', labelStyle);

    // --- Bar value texts ---
    var valStyle = { color: '#ecf0f1', fontSize: '11px' };
    this.hudTextos.co2Val  = this.add.text(bl.x + bl.w, bl.co2Y + 1, '---', valStyle).setOrigin(1, 0);
    this.hudTextos.tempVal = this.add.text(bl.x + bl.w, bl.tmpY + 1, '---', valStyle).setOrigin(1, 0);
    this.hudTextos.qvVal   = this.add.text(bl.x + bl.w, bl.qvY  + 1, '---', valStyle).setOrigin(1, 0);

    // Thin divider below HUD
    var div = this.add.graphics();
    div.lineStyle(1, 0x2ecc71, 0.15);
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
  // onTileClick
  // -----------------------------------------------------------------------
  onTileClick(index) {
    if (!this.estado.jogoAtivo) return;

    if (this.modoDestrucao) {
      if (this.buildingImages[index]) {
        this.buildingImages[index].destroy();
        this.buildingImages[index] = null;
      }
      this.estado.grade[index] = null;
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
    var buildImg = this.add.image(bx, by, s.textureKey).setDepth(5);
    this.buildingImages[index]  = buildImg;
    this.estado.grade[index]    = this.estruturaSelecionada;
    this.estado.orcamento      -= s.custo;
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
      color:     '#2ecc71',
      fontSize:  '18px',
      fontStyle: 'bold'
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
      var bg = this.add.rectangle(CX, cY, btnW, btnH, 0x0f1a0f)
        .setOrigin(0.5)
        .setInteractive()
        .setStrokeStyle(1, 0x1e4a1e, 1);

      // Building preview image
      var preview = this.add.image(PX + 20, cY, s.textureKey)
        .setScale(0.55)
        .setOrigin(0, 0.5);

      // Building name
      var nameText = this.add.text(PX + 72, by + 8, s.nome, {
        color:    '#ecf0f1',
        fontSize: '13px',
        fontStyle: 'bold'
      });

      // CO2 impact
      var co2Val  = s.co2PorTurno;
      var co2Str  = (co2Val >= 0 ? '+' : '') + co2Val + ' ppm/ano';
      var co2Col  = (co2Val <= 0) ? '#2ecc71' : '#e74c3c';
      var co2Text = this.add.text(PX + 72, by + 26, co2Str, {
        color:    co2Col,
        fontSize: '11px'
      });

      // Cost
      var costText = this.add.text(PX + 72, by + 40, 'R$ ' + (s.custo / 1000) + 'k', {
        color:    '#f9e79f',
        fontSize: '11px'
      });

      // Store button data
      var btnData = { bg: bg, id: id, index: bi };
      this.botoesEstrutura.push(btnData);

      // Events — use IIFE to capture id and bi
      (function(scene, btnId, btnIndex) {
        bg.on('pointerover', function() {
          if (!scene.estruturaSelecionada || scene.estruturaSelecionada !== btnId) {
            bg.setFillStyle(0x162816);
          }
        });
        bg.on('pointerout', function() {
          if (!scene.estruturaSelecionada || scene.estruturaSelecionada !== btnId) {
            bg.setFillStyle(0x0f1a0f);
          }
        });
        bg.on('pointerdown', function() {
          scene.selecionarEstrutura(btnId);
        });
      })(self, id, bi);
    }

    // ---- Demolish button ----
    var demolishY  = startY + ids.length * (btnH + gap) + 8;
    var demolishBg = this.add.rectangle(CX, demolishY + 20, 300, 40, 0x4a0a0a)
      .setOrigin(0.5)
      .setInteractive()
      .setStrokeStyle(1, 0x7a1a1a, 1);

    var demolishText = this.add.text(CX, demolishY + 20, 'DEMOLIR', {
      color:     '#e74c3c',
      fontSize:  '15px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.btnDestruir = demolishBg;

    demolishBg.on('pointerover', function() {
      demolishBg.setFillStyle(0x6a1a1a);
    });
    demolishBg.on('pointerout', function() {
      demolishBg.setFillStyle(self.modoDestrucao ? 0x8a0000 : 0x4a0a0a);
    });
    demolishBg.on('pointerdown', function() {
      self.modoDestrucao = !self.modoDestrucao;
      if (self.modoDestrucao) {
        // Deselect building
        self.estruturaSelecionada = null;
        for (var k = 0; k < self.botoesEstrutura.length; k++) {
          self.botoesEstrutura[k].bg.setFillStyle(0x0f1a0f);
        }
        demolishBg.setFillStyle(0x8a0000);
        demolishBg.setStrokeStyle(2, 0xe74c3c, 1);
        demolishText.setStyle({ color: '#ff6b6b', fontStyle: 'bold', fontSize: '15px' });
        self.textoPanelInfo.setText('Modo demolir ativo — clique em uma estrutura para remover');
      } else {
        demolishBg.setFillStyle(0x4a0a0a);
        demolishBg.setStrokeStyle(1, 0x7a1a1a, 1);
        demolishText.setStyle({ color: '#e74c3c', fontStyle: 'bold', fontSize: '15px' });
        self.textoPanelInfo.setText('Selecione uma estrutura para construir');
      }
    });

    // ---- Budget display ----
    var budgetY = demolishY + 58;
    this.add.text(CX, budgetY, 'ORCAMENTO', {
      color:    '#95a5a6',
      fontSize: '12px'
    }).setOrigin(0.5);

    this.hudTextos.orcamento = this.add.text(CX, budgetY + 18, 'R$ 800.000', {
      color:     '#f9e79f',
      fontSize:  '22px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // ---- Advance year button ----
    var advY  = budgetY + 60;
    var advBg = this.add.rectangle(CX, advY + 30, 600, 60, 0x1a472a)
      .setOrigin(0.5)
      .setInteractive();

    var advBorder = this.add.graphics();
    advBorder.lineStyle(2, 0x2ecc71, 1);
    advBorder.strokeRect(CX - 300, advY, 600, 60);

    var advText = this.add.text(CX, advY + 30, 'AVANCAR 1 ANO  ->', {
      color:     '#2ecc71',
      fontSize:  '20px',
      fontStyle: 'bold'
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
      color:    '#5d6d7e',
      fontSize: '12px'
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
      this.btnDestruir.setFillStyle(0x4a0a0a);
      this.btnDestruir.setStrokeStyle(1, 0x7a1a1a, 1);
    }

    // Reset all button backgrounds
    for (var i = 0; i < this.botoesEstrutura.length; i++) {
      this.botoesEstrutura[i].bg.setFillStyle(0x0f1a0f);
      this.botoesEstrutura[i].bg.setStrokeStyle(1, 0x1e4a1e, 1);
    }

    // Highlight selected button
    for (var j = 0; j < this.botoesEstrutura.length; j++) {
      if (this.botoesEstrutura[j].id === id) {
        this.botoesEstrutura[j].bg.setFillStyle(0x1a3a1a);
        this.botoesEstrutura[j].bg.setStrokeStyle(2, 0x2ecc71, 1);
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

    this.estado    = ClimateAlgorithm.avancarAno(this.estado);
    var resultado  = ClimateAlgorithm.verificarCondicoes(this.estado);

    this.atualizarHUD();

    if (resultado.fim) {
      this.estado.jogoAtivo = false;

      // Disable advance button visually
      if (this.btnAvançar) {
        this.btnAvançar.setFillStyle(0x0a1a0a);
        this.btnAvançar.disableInteractive();
      }
      this.textoPanelInfo.setText(resultado.mensagem || 'Jogo encerrado.');

      var self = this;
      this.time.delayedCall(1200, function() {
        self.scene.start('EndScene', {
          estado:    self.estado,
          resultado: resultado
        });
      }, [], this);
    }
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
    var co2Col = (co2Pct < 0.4) ? 0x2ecc71 : (co2Pct < 0.7 ? 0xf39c12 : 0xe74c3c);
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
    var tmpCol = (tmpPct < 0.4) ? 0x2ecc71 : (tmpPct < 0.7 ? 0xf39c12 : 0xe74c3c);
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
    var qvCol    = (qvPct > 0.6) ? 0x2ecc71 : (qvPct > 0.3 ? 0xf39c12 : 0xe74c3c);
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
