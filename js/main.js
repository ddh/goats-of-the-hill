// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// TODO: queue downloads

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    // TODO: initialize entities
    // TODO: add entities to game engine

    gameEngine.init(ctx);
    gameEngine.start();
});
