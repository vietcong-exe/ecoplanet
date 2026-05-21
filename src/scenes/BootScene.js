// BootScene.js — Cidade Sustentável 2050
// Generates all building textures programmatically (84×84px each)

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // External Kenney assets can be loaded here later:
    // this.load.image('parque', 'assets/sprites/tree_large.png');
    // For now, all textures are generated in create()
  }

  create() {
    this.gerarTexturaTileBase();
    this.gerarTexturaParque();
    this.gerarTexturaFabrica();
    this.gerarTexturaCasaComum();
    this.gerarTexturaCasaVerde();
    this.gerarTexturaSolar();
    this.gerarTexturaEolica();
    this.gerarTexturaCiclovia();
    this.gerarTexturaTileHighlight();

    this.scene.start('MenuScene');
  }

  // ─── 1. tile_base — Empty grass tile ────────────────────────────────────────
  gerarTexturaTileBase() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Fill entire tile: dark forest green
    g.fillStyle(0x1a3a2a, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Grass blade highlights — small scattered rectangles
    g.fillStyle(0x2d5a3d, 1);
    g.fillRect(10, 14, 2, 3);
    g.fillRect(28, 52, 2, 3);
    g.fillRect(55, 22, 2, 3);
    g.fillRect(68, 60, 2, 3);
    g.fillRect(40, 38, 2, 3);

    // Thin subtle border
    g.lineStyle(1, 0x2ecc71, 0.15);
    g.strokeRect(0, 0, SIZE, SIZE);

    g.generateTexture('tile_base', SIZE, SIZE);
    g.destroy();
  }

  // ─── 2. tex_parque — Park ───────────────────────────────────────────────────
  gerarTexturaParque() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Background: deep green
    g.fillStyle(0x145a32, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Tree trunks (brown)
    g.fillStyle(0x6d4c41, 1);
    g.fillRect(17, 56, 6, 14);
    g.fillRect(56, 56, 6, 14);
    g.fillRect(38, 50, 6, 16);

    // Tree canopies — base layer (dark green)
    g.fillStyle(0x1e8449, 1);
    g.fillCircle(20, 46, 16);
    g.fillCircle(59, 46, 16);
    g.fillCircle(41, 38, 19);

    // Mid layer
    g.fillStyle(0x27ae60, 1);
    g.fillCircle(20, 42, 11);
    g.fillCircle(59, 42, 11);
    g.fillCircle(41, 34, 13);

    // Highlight dots
    g.fillStyle(0x52be80, 1);
    g.fillCircle(16, 38, 5);
    g.fillCircle(55, 38, 5);
    g.fillCircle(37, 30, 6);

    // Small flowers at bottom
    g.fillStyle(0xf9e79f, 1);
    g.fillCircle(12, 76, 3);
    g.fillCircle(42, 78, 3);
    g.fillCircle(70, 75, 3);

    g.generateTexture('tex_parque', SIZE, SIZE);
    g.destroy();
  }

  // ─── 3. tex_fabrica — Factory ───────────────────────────────────────────────
  gerarTexturaFabrica() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Background: very dark blue-gray
    g.fillStyle(0x1c2833, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Smokestacks — draw behind building
    g.fillStyle(0x95a5a6, 1);
    g.fillRect(14, 15, 9, 24);
    g.fillRect(31, 9, 9, 30);
    g.fillRect(48, 18, 9, 21);

    // Stack caps (slightly wider, darker)
    g.fillStyle(0x7f8c8d, 1);
    g.fillRect(12, 11, 13, 4);
    g.fillRect(29, 5, 13, 4);
    g.fillRect(46, 14, 13, 4);

    // Smoke puffs (translucent)
    g.fillStyle(0xbdc3c7, 0.4);
    g.fillCircle(18, 9, 7);
    g.fillCircle(35, 3, 8);
    g.fillCircle(52, 12, 6);

    // Main building body
    g.fillStyle(0x7f8c8d, 1);
    g.fillRect(6, 38, 56, 36);

    // Windows glowing orange
    g.fillStyle(0xf39c12, 0.9);
    g.fillRect(12, 46, 10, 10);
    g.fillRect(29, 46, 10, 10);
    g.fillRect(46, 46, 10, 10);

    // Window frames
    g.lineStyle(1, 0x2c3e50, 1);
    g.strokeRect(12, 46, 10, 10);
    g.strokeRect(29, 46, 10, 10);
    g.strokeRect(46, 46, 10, 10);

    g.generateTexture('tex_fabrica', SIZE, SIZE);
    g.destroy();
  }

  // ─── 4. tex_casaComum — Common Neighborhood ────────────────────────────────
  gerarTexturaCasaComum() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Night sky background
    g.fillStyle(0x1a1a2a, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Back house (depth effect)
    g.fillStyle(0xc0392b, 1);
    g.fillRect(36, 30, 36, 30);

    // Back house roof
    g.fillStyle(0x922b21, 1);
    g.fillTriangle(34, 30, 74, 30, 54, 12);

    // Main house walls (warm beige)
    g.fillStyle(0xf0d9b5, 1);
    g.fillRect(12, 35, 40, 30);

    // Main house roof (red)
    g.fillStyle(0xe74c3c, 1);
    g.fillTriangle(8, 35, 56, 35, 32, 14);

    // Door (brown)
    g.fillStyle(0x6d4c41, 1);
    g.fillRect(24, 49, 10, 16);

    // Door arch
    g.fillStyle(0x6d4c41, 1);
    g.fillCircle(29, 49, 5);

    // Window left (light blue)
    g.fillStyle(0x85c1e9, 1);
    g.fillRect(14, 39, 9, 9);

    // Window cross lines left
    g.lineStyle(1, 0x2471a3, 1);
    g.lineBetween(18, 39, 18, 48);
    g.lineBetween(14, 43, 23, 43);

    // Window right
    g.fillStyle(0x85c1e9, 1);
    g.fillRect(36, 39, 9, 9);

    // Window cross lines right
    g.lineStyle(1, 0x2471a3, 1);
    g.lineBetween(40, 39, 40, 48);
    g.lineBetween(36, 43, 45, 43);

    // Ground line
    g.fillStyle(0x27ae60, 1);
    g.fillRect(0, 66, SIZE, 6);

    g.generateTexture('tex_casaComum', SIZE, SIZE);
    g.destroy();
  }

  // ─── 5. tex_casaVerde — Eco Neighborhood ───────────────────────────────────
  gerarTexturaCasaVerde() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Dark eco background
    g.fillStyle(0x0d2818, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Walls (white)
    g.fillStyle(0xecf0f1, 1);
    g.fillRect(12, 38, 42, 28);

    // Green living roof (trapezoid as triangle)
    g.fillStyle(0x27ae60, 1);
    g.fillTriangle(8, 38, 58, 38, 33, 14);

    // Plants on roof
    g.fillStyle(0x1e8449, 1);
    g.fillCircle(20, 31, 4);
    g.fillCircle(33, 24, 5);
    g.fillCircle(46, 30, 4);

    // Solar panel on roof
    g.fillStyle(0x2471a3, 1);
    g.fillRect(34, 27, 10, 8);

    // Solar panel grid lines
    g.lineStyle(1, 0x5dade2, 1);
    g.lineBetween(39, 27, 39, 35);
    g.lineBetween(34, 31, 44, 31);

    // Door (green)
    g.fillStyle(0x27ae60, 1);
    g.fillRect(26, 51, 10, 15);

    // Window
    g.fillStyle(0x85c1e9, 1);
    g.fillRect(14, 44, 10, 10);

    // Window cross
    g.lineStyle(1, 0x2471a3, 1);
    g.lineBetween(19, 44, 19, 54);
    g.lineBetween(14, 49, 24, 49);

    // Ground with plants
    g.fillStyle(0x27ae60, 1);
    g.fillRect(0, 66, SIZE, 6);

    g.fillStyle(0x52be80, 1);
    g.fillCircle(8, 65, 3);
    g.fillCircle(22, 64, 2);
    g.fillCircle(60, 65, 3);
    g.fillCircle(76, 64, 2);

    g.generateTexture('tex_casaVerde', SIZE, SIZE);
    g.destroy();
  }

  // ─── 6. tex_solar — Solar Panel Farm ───────────────────────────────────────
  gerarTexturaSolar() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Dark concrete background
    g.fillStyle(0x212f3c, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Concrete base
    g.fillStyle(0x34495e, 1);
    g.fillRect(0, 55, SIZE, 29);

    // Central support pole
    g.fillStyle(0x7f8c8d, 1);
    g.fillRect(37, 40, 10, 16);

    // Horizontal mount bar
    g.fillStyle(0x95a5a6, 1);
    g.fillRect(15, 38, 54, 5);

    // Solar panel frames
    g.fillStyle(0x1a5276, 1);
    g.fillRect(12, 18, 16, 18);
    g.fillRect(34, 18, 16, 18);
    g.fillRect(56, 18, 16, 18);

    // Panel surfaces (slightly inset)
    g.fillStyle(0x1f618d, 1);
    g.fillRect(14, 20, 12, 14);
    g.fillRect(36, 20, 12, 14);
    g.fillRect(58, 20, 12, 14);

    // Shine highlights on each panel
    g.fillStyle(0x5dade2, 0.6);
    g.fillRect(14, 20, 5, 5);
    g.fillRect(36, 20, 5, 5);
    g.fillRect(58, 20, 5, 5);

    // Grid lines inside panels
    g.lineStyle(1, 0x85c1e9, 0.7);
    // Panel 1
    g.lineBetween(20, 20, 20, 34);
    g.lineBetween(14, 27, 26, 27);
    // Panel 2
    g.lineBetween(42, 20, 42, 34);
    g.lineBetween(36, 27, 48, 27);
    // Panel 3
    g.lineBetween(64, 20, 64, 34);
    g.lineBetween(58, 27, 70, 27);

    // Small sun icon
    g.fillStyle(0xf39c12, 1);
    g.fillCircle(72, 10, 6);

    // Sun rays
    g.lineStyle(1, 0xf39c12, 0.8);
    g.lineBetween(72, 2, 72, 0);
    g.lineBetween(80, 10, 83, 10);
    g.lineBetween(78, 4, 80, 2);
    g.lineBetween(78, 16, 80, 18);
    g.lineBetween(66, 4, 64, 2);

    g.generateTexture('tex_solar', SIZE, SIZE);
    g.destroy();
  }

  // ─── 7. tex_eolica — Wind Turbine ──────────────────────────────────────────
  gerarTexturaEolica() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Sky — three horizontal bands
    g.fillStyle(0x1a6fa8, 1);
    g.fillRect(0, 0, SIZE, 28);
    g.fillStyle(0x1f7ec0, 1);
    g.fillRect(0, 28, SIZE, 16);
    g.fillStyle(0x2490d0, 1);
    g.fillRect(0, 44, SIZE, 16);

    // Green ground
    g.fillStyle(0x27ae60, 1);
    g.fillRect(0, 60, SIZE, 24);

    // Tower base (wider)
    g.fillStyle(0xecf0f1, 1);
    g.fillRect(36, 24, 12, 38);

    // Tower narrow top
    g.fillStyle(0xecf0f1, 1);
    g.fillRect(38, 18, 8, 10);

    // Tower shadow detail
    g.lineStyle(1, 0x95a5a6, 0.7);
    g.lineBetween(44, 24, 46, 62);

    // Hub circle
    g.fillStyle(0xbdc3c7, 1);
    g.fillCircle(42, 22, 7);

    // Turbine blades (white, 3 directions)
    g.fillStyle(0xffffff, 1);

    // Blade 1 — pointing up
    g.fillTriangle(42, 0, 36, 20, 48, 20);

    // Blade 2 — pointing down-left
    g.fillTriangle(42, 22, 20, 36, 30, 22);

    // Blade 3 — pointing down-right
    g.fillTriangle(42, 22, 54, 36, 64, 26);

    // Hub overlay (on top of blades)
    g.fillStyle(0xbdc3c7, 1);
    g.fillCircle(42, 22, 5);

    // Hub center dot
    g.fillStyle(0x7f8c8d, 1);
    g.fillCircle(42, 22, 2);

    g.generateTexture('tex_eolica', SIZE, SIZE);
    g.destroy();
  }

  // ─── 8. tex_ciclovia — Bike Lane ───────────────────────────────────────────
  gerarTexturaCiclovia() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Asphalt base
    g.fillStyle(0x1a2025, 1);
    g.fillRect(0, 0, SIZE, SIZE);

    // Green bike lane strip
    g.fillStyle(0x1e8449, 0.7);
    g.fillRect(0, 22, SIZE, 40);

    // Lane border lines
    g.lineStyle(2, 0xa9cce3, 0.8);
    g.lineBetween(0, 22, SIZE, 22);
    g.lineBetween(0, 62, SIZE, 62);

    // Center dashed line
    g.lineStyle(2, 0xf9e79f, 0.7);
    g.lineBetween(0,  42, 14, 42);
    g.lineBetween(20, 42, 34, 42);
    g.lineBetween(40, 42, 54, 42);
    g.lineBetween(60, 42, 74, 42);
    g.lineBetween(80, 42, SIZE, 42);

    // Bicycle — wheels
    g.lineStyle(2, 0xf9e79f, 1);
    g.strokeCircle(22, 42, 10);
    g.strokeCircle(62, 42, 10);

    // Frame — rear triangle
    g.lineStyle(2, 0xf9e79f, 1);
    g.lineBetween(22, 42, 42, 32); // rear to top tube
    g.lineBetween(42, 32, 62, 42); // top tube to front
    g.lineBetween(42, 32, 42, 46); // seat post down
    g.lineBetween(42, 46, 22, 42); // chainstay
    g.lineBetween(42, 46, 62, 42); // chainstay front

    // Handlebars
    g.lineStyle(2, 0xf9e79f, 1);
    g.lineBetween(62, 32, 68, 30);
    g.lineBetween(62, 32, 68, 36);

    // Saddle
    g.lineStyle(2, 0xf9e79f, 1);
    g.lineBetween(38, 32, 46, 32);

    g.generateTexture('tex_ciclovia', SIZE, SIZE);
    g.destroy();
  }

  // ─── 9. tile_highlight — Hover overlay ─────────────────────────────────────
  gerarTexturaTileHighlight() {
    var SIZE = 84;
    var g = this.make.graphics({ x: 0, y: 0, add: false });

    // Semi-transparent white fill
    g.fillStyle(0xffffff, 0.12);
    g.fillRect(0, 0, SIZE, SIZE);

    // Bright white border
    g.lineStyle(2, 0xffffff, 0.9);
    g.strokeRect(1, 1, SIZE - 2, SIZE - 2);

    // Corner accents — green L-shapes
    var c = 0x2ecc71;
    var a = 1;

    // Top-left
    g.lineStyle(2, c, a);
    g.lineBetween(1, 1, 7, 1);
    g.lineBetween(1, 1, 1, 7);

    // Top-right
    g.lineBetween(SIZE - 1, 1, SIZE - 7, 1);
    g.lineBetween(SIZE - 1, 1, SIZE - 1, 7);

    // Bottom-left
    g.lineBetween(1, SIZE - 1, 7, SIZE - 1);
    g.lineBetween(1, SIZE - 1, 1, SIZE - 7);

    // Bottom-right
    g.lineBetween(SIZE - 1, SIZE - 1, SIZE - 7, SIZE - 1);
    g.lineBetween(SIZE - 1, SIZE - 1, SIZE - 1, SIZE - 7);

    g.generateTexture('tile_highlight', SIZE, SIZE);
    g.destroy();
  }
}
