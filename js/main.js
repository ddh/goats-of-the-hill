// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// Use asset manager to download images
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/hay.png");
ASSET_MANAGER.queueDownload("./img/hay2.png");
ASSET_MANAGER.queueDownload("./img/hay3.png");
ASSET_MANAGER.queueDownload("./img/sparkles.png"); 
ASSET_MANAGER.queueDownload("./img/blue-goat-left.png");
ASSET_MANAGER.queueDownload("./img/blue-goat-right.png");
ASSET_MANAGER.queueDownload("./img/green-goat-left.png");
ASSET_MANAGER.queueDownload("./img/green-goat-right.png");
ASSET_MANAGER.queueDownload("./img/yellow-goat-left.png");
ASSET_MANAGER.queueDownload("./img/yellow-goat-right.png");
ASSET_MANAGER.queueDownload("./img/red-goat-left.png");
ASSET_MANAGER.queueDownload("./img/red-goat-right.png");
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

    gameEngine.loadFirstScene();

    /* === START GAME === */
    gameEngine.start();
});

// TODO: add more scenes in once first scene is working correctly
var makeSceneSelector = function(background, gameEngine) {
    var scenes = [];
    var platforms = [];
    var goats = [];

    /* === FOR SCENE #1 ONLY === */

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform);
    
    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    //platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', true));
    /* row 2 */
    //platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    //platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    //platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    //platforms.push(makePlatform(gameEngine, 's', 100, 400, 'horizontal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 's', 400, 200, 'horizontal', 'hay', false));
    /* row 6 */
    //platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    /* === Goats === */
    var playerOneControls = {jump: 38, left: 37, right: 39};
    goats.push(new Goat(gameEngine, 0, playerOneControls, "blue-goat"));

    var playerTwoControls = {jump: 87, left: 65, right: 68};
    goats.push(new Goat(gameEngine, 1, playerTwoControls, "green-goat"));

    scenes.push(new Scene(platforms, background, goats));

    /* === /END FOR SCENE #1 ONLY === */

    var ss = new SceneSelector();
    ss.addScene(scenes[0]);

    return ss;
};

var makePlatform = function (gameEngine, size, x, y, movement, platType, isHill) {
    var pf = null;
    pf = new Platform(gameEngine, size, x, y, movement, platType, isHill);
    pf.oneWayCollision = true; // indicates top down collision but not bottom up
    return pf;
};
