const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    backgroundColor: '#0f0f1a',
    scene: [BootScene, MenuScene, GameScene, EndScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: document.body
};

const game = new Phaser.Game(config);
