// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)


//ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
//ASSET_MANAGER.queueDownload("./img/black.png");
//ASSET_MANAGER.queueDownload("./img/white.png");
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/hay.png");
ASSET_MANAGER.queueDownload("./img/canvas-meadow.png"); // temporary background image for testing
ASSET_MANAGER.queueDownload("./img/smb_mountain.png"); // temporary background image for testing

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var roundNumber = document.getElementById('roundNumber');
    var ctx = canvas.getContext('2d');
    
    
    var gameEngine = new GameEngine();
    var platforms = [];
    gameEngine.roundNumber = roundNumber;

    // TODO: here, initialize entities & add entities to game engine
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 1000, 500);
    gameEngine.addEntity(bg);
    
    var pf = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay.png"), 500, 500, 100, 100);
    gameEngine.addEntity(pf);
    platforms.push(pf);
    
    gameEngine.platforms = platforms;

    // // TODO: initialize entities
    // var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/smb_mountain.png"));
    var pg = new PlayGame(gameEngine, 320, 250);

    // TODO: add entities to game engine
    gameEngine.addEntity(bg);
    gameEngine.addEntity(pg);

    gameEngine.init(ctx);
    gameEngine.start();
    
    // var background = new Image();
    // background.src = ASSET_MANAGER.getAsset('./js/img/farm.png').src;
    // background.onload = function() {
    //     console.log("Set background");
    //     ctx.drawImage(background, 30, 0, 1000, 500);
    // }
});


