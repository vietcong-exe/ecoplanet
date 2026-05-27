var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    backgroundColor: '#29b6f6',
    scene: [BootScene, MenuScene, GameScene, EndScene],
    parent: document.body,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config);
