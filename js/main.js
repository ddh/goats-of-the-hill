// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// TODO: queue downloads
ASSET_MANAGER.queueDownload("./img/smb_mountain.png"); // temporary background image for testing

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var roundNumber = document.getElementById('roundNumber');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.roundNumber = roundNumber;

    // TODO: initialize entities
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/smb_mountain.png"));
    var pg = new PlayGame(gameEngine, 320, 350);

    // TODO: add entities to game engine
    gameEngine.addEntity(bg);
    gameEngine.addEntity(pg);

    gameEngine.init(ctx);
    gameEngine.start();
});


