// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/hay.png");
ASSET_MANAGER.queueDownload("./img/smb_mountain.png"); // temporary background image for testing
ASSET_MANAGER.queueDownload("./img/spaz_frames.png"); // temporary entity sprites for testing

ASSET_MANAGER.downloadAll(function () {

    /* === Game Engine === */
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    /* === Game Logistics === */
    var roundNumber = document.getElementById('roundNumber');
    gameEngine.roundNumber = roundNumber;
    var pg = new PlayGame(gameEngine, 320, 250);
    gameEngine.addEntity(pg);

    /* === Background === */
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);
    gameEngine.addEntity(bg);

    /* === Platforms === */
    /* Creates platforms */
    var platforms = [];
    var plats = function(x, y) {                                                        //w, h
        var pf = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay.png"), x, y, 85, 55);
        gameEngine.addEntity(pf);
        platforms.push(pf);
    }
    /* bottom row */
    plats(202, 480);
    plats(560, 480);
    /* second row */
    plats(283, 427);
    plats(357, 427);
    plats(428, 427);
    plats(500, 427);
    /* top row */
    plats(400, 373);

    gameEngine.platforms = platforms;

    /* === Goats === */
    var goat = new Goat(gameEngine);
    gameEngine.addEntity(goat);

    /* === START GAME === */
    gameEngine.start();
    
});


