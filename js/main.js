// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)


// Use asset manager to download images
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/hay.png");
ASSET_MANAGER.queueDownload("./img/hay2.png");
ASSET_MANAGER.queueDownload("./img/hay3.png");
ASSET_MANAGER.queueDownload("./img/smb_mountain.png"); // temporary background image for testing
ASSET_MANAGER.queueDownload("./img/spaz_frames.png"); // temporary entity sprites for testing
ASSET_MANAGER.queueDownload("./img/WhiteGoatLeft.png");
ASSET_MANAGER.queueDownload("./img/WhiteGoatRight.png");
ASSET_MANAGER.queueDownload("./img/transparent_pixel.png");
ASSET_MANAGER.queueDownload("./img/smallest-king-crown.png");

ASSET_MANAGER.downloadAll(function () {

    /* === Game Engine === */
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    /* === Game Audio ===*/
    // bgMusic sourced from http://www.bensound.com/
    var bgMusic = new Howl({
        urls: ['./audio/bensound-jazzyfrenchy.mp3'],
        loop: true,
        volume: 0.5
    }).play();

    /* === Game Logistics === */
    var roundNumber = document.getElementById('roundNumber');
    gameEngine.roundNumber = roundNumber;
    var pg = new PlayGame(gameEngine, 320, 250);
    gameEngine.addEntity(pg);

    /* === Background === */
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    gameEngine.sceneSelector = makeSceneSelector(bg, gameEngine); // also initializes Scenes

    // TODO: perhaps figure out whether we need to move the line below elsewhere...
    gameEngine.platforms = gameEngine.sceneSelector.getFirstScene().platforms;

    /* === Goats === */
    var goat1 = new Goat(gameEngine);
    var goat2 = new Goat(gameEngine);
    gameEngine.addEntity(goat1);
    gameEngine.addEntity(goat2);

    /* === START GAME === */
    gameEngine.start();
});

// TODO: add more scenes in once first scene is working correctly
var makeSceneSelector = function(background, gameEngine) {
    var scenes = [];

    var platforms = [];

    /* === FOR SCENE #1 ONLY === */

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_pixel.png"), 0, 530, 800, 70, 'stationary');
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform);

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    platforms.push(makePlatform('l', -2, 480, gameEngine));
    /* row 2 */
    platforms.push(makePlatform('m', 300, 375, gameEngine));
    /* row 3 */
    platforms.push(makePlatform('m', -2, 300, gameEngine));
    platforms.push(makePlatform('l', 562, 300, gameEngine));
    /* row 4 */
    platforms.push(makePlatform('m', 325, 130, gameEngine));
    /* row 5 */
    platforms.push(makePlatform('s', 100, 400, gameEngine));
    platforms.push(makePlatform('s', 400, 200, gameEngine));
    /* row 6 */
    var bouncePF = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay.png"), 200, 200, 85, 50, 'bouncing');
    bouncePF.oneWayCollision = true;
    platforms.push(bouncePF);

    return new SceneSelector(scenes);
};

var makePlatform = function (size, x, y, gameEngine) {
    var pf = null;
    if (size == 's') {
        //one-hay                                                                       //w, h
        var pf = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay.png"), x, y, 85, 50, 'horizontal');
    } else if (size == 'm') {
        //two-hay
        var pf = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay2.png"), x, y, 155, 50, 'diagonal');
    } else if (size == 'l') {
        //three-hay
        var pf = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay3.png"), x, y, 240, 50, 'vertical');
    }
    pf.oneWayCollision = true; // indicates top down collision but not bottom up
    return pf;
};
