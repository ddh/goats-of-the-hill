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

    // initializes Goat and Circle objects properly, binds Circle to Goat, and adds both to GameEngine
    var initEngineWithGoatCirclePair = function () {
        var goat = new Goat(gameEngine);
        var circ = new Circle(gameEngine);
        circ.setX(goat.width);
        circ.setY(goat.height);
        circ.makeCircleBeEntity();
        circ.setRadius({x: goat.width, y: goat.height});
        goat.setBoundingCircle(circ);
        gameEngine.addEntity(goat);
        gameEngine.addEntity(circ);
    };

    /* Background */
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 1000, 500);
    gameEngine.addEntity(bg);
    
    /* Creates platforms */
    var plats = function(x, y) {                                                        //w, h
        var pf = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay.png"), x, y, 85, 55);
        gameEngine.addEntity(pf);
        platforms.push(pf);
    }
    /* bottom row */
    plats(202, 380);
    plats(560, 380);
    /* second row */
    plats(283, 327);
    plats(357, 327);
    plats(428, 327);
    plats(500, 327);
    /* top row */
    plats(400, 273);
    
    gameEngine.platforms = platforms;

    // // TODO: initialize entities
    // var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/smb_mountain.png"));
    var pg = new PlayGame(gameEngine, 320, 250);

    // TODO: add entities to game engine
    //gameEngine.addEntity(bg);
    gameEngine.addEntity(pg);

    gameEngine.init(ctx);
    gameEngine.start();
    
});


