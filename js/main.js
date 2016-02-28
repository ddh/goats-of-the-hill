// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// Use asset manager to download images

// Background Images
ASSET_MANAGER.queueDownload("./img/titleScreen.png");
ASSET_MANAGER.queueDownload("./img/farm-gradient.png");
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");

// Platform Sprites
ASSET_MANAGER.queueDownload("./img/hay.png");
ASSET_MANAGER.queueDownload("./img/hay2.png");
ASSET_MANAGER.queueDownload("./img/hay3.png");

// Goat Sprites
ASSET_MANAGER.queueDownload("./img/blue-goat-left.png");
ASSET_MANAGER.queueDownload("./img/blue-goat-right.png");
ASSET_MANAGER.queueDownload("./img/green-goat-left.png");
ASSET_MANAGER.queueDownload("./img/green-goat-right.png");
ASSET_MANAGER.queueDownload("./img/yellow-goat-left.png");
ASSET_MANAGER.queueDownload("./img/yellow-goat-right.png");
ASSET_MANAGER.queueDownload("./img/red-goat-left.png");
ASSET_MANAGER.queueDownload("./img/red-goat-right.png");
ASSET_MANAGER.queueDownload("./img/auras.png");
ASSET_MANAGER.queueDownload("./img/blue-goat-attackAuraLeft.png");
ASSET_MANAGER.queueDownload("./img/blue-goat-attackAuraRight.png");
ASSET_MANAGER.queueDownload("./img/green-goat-attackAuraLeft.png");
ASSET_MANAGER.queueDownload("./img/green-goat-attackAuraRight.png");
ASSET_MANAGER.queueDownload("./img/yellow-goat-attackAuraLeft.png");
ASSET_MANAGER.queueDownload("./img/yellow-goat-attackAuraRight.png");
ASSET_MANAGER.queueDownload("./img/red-goat-attackAuraLeft.png");
ASSET_MANAGER.queueDownload("./img/red-goat-attackAuraRight.png");

// Collectible Sprites
ASSET_MANAGER.queueDownload("./img/speedUp-collectible.png");
ASSET_MANAGER.queueDownload("./img/coin-collectible.png");
ASSET_MANAGER.queueDownload("./img/invincibility-collectible.png");
ASSET_MANAGER.queueDownload("./img/attackUp-collectible.png");
ASSET_MANAGER.queueDownload("./img/doubleJump-collectible.png");
ASSET_MANAGER.queueDownload("./img/highJump-collectible.png");
ASSET_MANAGER.queueDownload("./img/maxCharge-collectible.png");

// Other
ASSET_MANAGER.queueDownload("./img/hill-arrow.png");
ASSET_MANAGER.queueDownload("./img/transparent_pixel.png");
ASSET_MANAGER.queueDownload("./img/simple-crown-animated.png");


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
    var pg = new PlayGame(gameEngine, 320, 300, true, true, 8);
    pg.sceneSelector = makeSceneSelector(gameEngine); // also initializes Scenes
    pg.initFirstScene();
    gameEngine.loadScene(pg.scene);
    gameEngine.addEntity(pg);

    /* === START GAME === */
    gameEngine.start();
});

var makeSceneSelector = function(gameEngine) {
    var scenes = [];
    
    scenes.push(new Scene([], new Background(gameEngine, ASSET_MANAGER.getAsset("./img/titleScreen.png"), 800, 600))); // Title screen
    
   // scenes.push(createTransitionScene(gameEngine)); // first scene
    scenes.push(createSecondScene(gameEngine)); // first round

    scenes.push(createTransitionScene(gameEngine)); // third scene
    scenes.push(createFourthScene(gameEngine)); // second round

    scenes.push(createTransitionScene(gameEngine)); // fifth scene
    scenes.push(createSixthScene(gameEngine)); // third round

    scenes.push(createTransitionScene(gameEngine)); // seventh scene
    scenes.push(createEighthScene(gameEngine)); // fourth round

    scenes.push(createTransitionScene(gameEngine)); // ninth scene
    scenes.push(createTenthScene(gameEngine)); // fifth round

    scenes.push(createTransitionScene(gameEngine)); // eleventh scene
    scenes.push(createTwelvethScene(gameEngine)); // sixth round

    return new SceneSelector(scenes);
};

var createTransitionScene = function (gameEngine) {
    return new Scene([], new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm-gradient.png"), 800, 600));
};

var createSecondScene = function (gameEngine) {
    var platforms = [];

    // handle scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform); // ground platform is always the first platform added to a scene

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    //platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', true));
    /* row 2 */
    //platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    //platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    //platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    //platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    platforms.push(makePlatform(gameEngine, 'l', 100, 400, 'horizontal', 'hay', false));
    //platforms.push(makePlatform(gameEngine, 's', 400, 200, 'horizontal', 'hay', false));
    /* row 6 */
    //platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    return new Scene(platforms, background);
};

var createFourthScene = function (gameEngine) {
    var platforms = [];

    // handle scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform); // ground platform is always the first platform added to a scene

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', false));
    /* row 2 */
    platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    //platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    //platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    //platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    //platforms.push(makePlatform(gameEngine, 's', 100, 400, 'horizontal', 'hay', false));
    //platforms.push(makePlatform(gameEngine, 's', 400, 200, 'horizontal', 'hay', false));
    /* row 6 */
    //platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    return new Scene(platforms, background);
};

var createSixthScene = function (gameEngine) {
    var platforms = [];

    // handle scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform); // ground platform is always the first platform added to a scene

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', false));
    /* row 2 */
    platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    //platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    //platforms.push(makePlatform(gameEngine, 's', 100, 400, 'horizontal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 's', 400, 270, 'horizontal', 'hay', false));
    /* row 6 */
    //platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    return new Scene(platforms, background);
};

var createEighthScene = function (gameEngine) {
    var platforms = [];

    // handle scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform); // ground platform is always the first platform added to a scene

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', false));
    /* row 2 */
    platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    //platforms.push(makePlatform(gameEngine, 's', 100, 400, 'horizontal', 'hay', false));
    //platforms.push(makePlatform(gameEngine, 's', 400, 200, 'horizontal', 'hay', false));
    /* row 6 */
    //platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    return new Scene(platforms, background);
};

var createTenthScene = function (gameEngine) {
    var platforms = [];

    // handle scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform); // ground platform is always the first platform added to a scene

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', false));
    /* row 2 */
    platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    platforms.push(makePlatform(gameEngine, 's', 100, 400, 'horizontal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 's', 400, 200, 'horizontal', 'hay', false));
    /* row 6 */
    //platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    return new Scene(platforms, background);
};

var createTwelvethScene = function (gameEngine) {
    var platforms = [];

    // handle scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // handle ground platform
    var groundPlatform = new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay', false);
    groundPlatform.oneWayCollision = false;
    platforms.push(groundPlatform); // ground platform is always the first platform added to a scene

    // handle all other platforms (use existing platforms below to build other scenes' platforms later)

    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    platforms.push(makePlatform(gameEngine, 'l', -2, 480, 'vertical', 'hay', false));
    /* row 2 */
    platforms.push(makePlatform(gameEngine, 'm', 300, 375, 'diagonal', 'hay', false));
    /* row 3 */
    platforms.push(makePlatform(gameEngine, 'm', -2, 300, 'diagonal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 'l', 562, 300, 'vertical', 'hay', false));
    /* row 4 */
    platforms.push(makePlatform(gameEngine, 'm', 325, 130, 'diagonal', 'hay', false));
    /* row 5 */
    platforms.push(makePlatform(gameEngine, 's', 100, 400, 'horizontal', 'hay', false));
    platforms.push(makePlatform(gameEngine, 's', 400, 200, 'horizontal', 'hay', false));
    /* row 6 */
    platforms.push(makePlatform(gameEngine, 's', 200, 200, 'bouncing', 'hay', false));

    return new Scene(platforms, background);
};

var makePlatform = function (gameEngine, size, x, y, movement, platType, isHill) {
    var pf = null;
    pf = new Platform(gameEngine, size, x, y, movement, platType, isHill);
    pf.oneWayCollision = true; // indicates top down collision but not bottom up
    return pf;
};
