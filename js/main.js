// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// TODO: queue downloads
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
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/canvas-meadow.png"));
    gameEngine.addEntity(bg);

    // TODO: in loop for all goats to be created in game, call initEngineWithGoatCirclePair
    //initEngineWithGoatCirclePair(); // just creating one goat and bounding circle for now

    gameEngine.init(ctx);
    gameEngine.start();
});


