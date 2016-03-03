// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// Use asset manager to download images

// Background Images
ASSET_MANAGER.queueDownload("./img/titleScreen.png");
ASSET_MANAGER.queueDownload("./img/farm-gradient.png");
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/scoreBoard.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/space.png");

// Platform Sprites
ASSET_MANAGER.queueDownload("./img/hay.png");
ASSET_MANAGER.queueDownload("./img/hay2.png");
ASSET_MANAGER.queueDownload("./img/hay3.png");
ASSET_MANAGER.queueDownload("./img/spaceTile.png");
ASSET_MANAGER.queueDownload("./img/spaceTile2.png");
ASSET_MANAGER.queueDownload("./img/spaceTile3.png");
ASSET_MANAGER.queueDownload("./img/millenniumFalcon.png");

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
ASSET_MANAGER.queueDownload("./img/collectible-speedUp.png");
ASSET_MANAGER.queueDownload("./img/collectible-invincibility.png");
ASSET_MANAGER.queueDownload("./img/collectible-attackUp.png");
ASSET_MANAGER.queueDownload("./img/collectible-doubleJump.png");
ASSET_MANAGER.queueDownload("./img/collectible-highJump.png");
ASSET_MANAGER.queueDownload("./img/collectible-maxCharge.png");

// Collectible Icons
ASSET_MANAGER.queueDownload("./img/icon-speedUp.png");
ASSET_MANAGER.queueDownload("./img/icon-invincibility.png");
ASSET_MANAGER.queueDownload("./img/icon-attackUp.png");
ASSET_MANAGER.queueDownload("./img/icon-doubleJump.png");
ASSET_MANAGER.queueDownload("./img/icon-highJump.png");
ASSET_MANAGER.queueDownload("./img/icon-maxCharge.png");

// Other
ASSET_MANAGER.queueDownload("./img/hill-arrow.png");
ASSET_MANAGER.queueDownload("./img/transparent_pixel.png");
ASSET_MANAGER.queueDownload("./img/simple-crown-animated.png");
ASSET_MANAGER.queueDownload("./img/crown.png");


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

    /* === NEW Game Logistics === */
    var sm = makeSceneManager(gameEngine);
    gameEngine.sceneManager = sm;
    gameEngine.entities.push(sm);

    /* === START GAME === */
    gameEngine.start(); // starts infinite game loop
});

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var HILL_SPEED = 8;

// TODO: need to set next pointers for all Scenes
var makeSceneManager = function (gameEngine) {
    // 1. Create all Scenes necessary for game
    // ---
    var titleScene = new Title(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/titleScreen.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    // TODO: need to add Tutorial Scene (will need to change links section below too)
    var r1 = createFirstRound(gameEngine); // first round
    var sb1 = new Scoreboard(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var r2 = createSecondRound(gameEngine); // second round
    var sb2 = new Scoreboard(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var r3 = createThirdRound(gameEngine); // third round
    var sb3 = new Scoreboard(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    // TODO: need to add in EndGame Scene (will need to change links section below too)

    // 2. Link up all Scenes in correct sequence before returning SceneManager with a reference to the title Scene
    // ---
    titleScene.next = r1;   // TODO: link will change once Tutorial Scene added
    r1.next = sb1;
    sb1.next = r2;
    r2.next = sb2;
    sb2.next = r3;
    r3.next = sb3;
    sb3.next = titleScene;  // TODO: link will change once EndGame Scene added

    return new SceneManager(gameEngine, titleScene);
};

var createFirstRound = function (gameEngine) {
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

    return new Round(gameEngine, background, platforms, true, HILL_SPEED);
};

var createSecondRound = function (gameEngine) {
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

    return new Round(gameEngine, background, platforms, true, HILL_SPEED);
};

var createThirdRound = function (gameEngine) {
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

    return new Round(gameEngine, background, platforms, true, HILL_SPEED);
};

var makePlatform = function (gameEngine, size, x, y, movement, platType, isHill) {
    var pf = null;
    pf = new Platform(gameEngine, size, x, y, movement, platType, isHill);
    pf.oneWayCollision = true; // indicates top down collision but not bottom up
    return pf;
};
