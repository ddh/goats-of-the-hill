// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)


//ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
//ASSET_MANAGER.queueDownload("./img/black.png");
//ASSET_MANAGER.queueDownload("./img/white.png");
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/canvas-meadow.png"); // temporary background image for testing

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
    
    var gameEngine = new GameEngine();

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

    // TODO: here, initialize entities & add entities to game engine
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 1000, 500);
    gameEngine.addEntity(bg);

    // TODO: in loop for all goats to be created in game, call initEngineWithGoatCirclePair
    //initEngineWithGoatCirclePair(); // just creating one goat and bounding circle for now

    gameEngine.init(ctx);
    gameEngine.start();
    
    // var background = new Image();
    // background.src = ASSET_MANAGER.getAsset('./js/img/farm.png').src;
    // background.onload = function() {
    //     console.log("Set background");
    //     ctx.drawImage(background, 30, 0, 1000, 500);
    // }
});


