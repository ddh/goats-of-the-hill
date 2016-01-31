// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// TODO: queue downloads
ASSET_MANAGER.queueDownload("../img/canvas-meadow.png"); // temporary background image for testing

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    // TODO: initialize entities
    var bg = new Background(game, ASSET_MANAGER.getAsset("../img/canvas-meadow.png"));
    // TODO: add entities to game engine
    gameEngine.addEntity(bg);

    gameEngine.init(ctx);
    gameEngine.start();
});
