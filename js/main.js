// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

// Use asset manager to download images

// Background Images
ASSET_MANAGER.queueDownload("./img/titleScreen.png");
ASSET_MANAGER.queueDownload("./img/farm-gradient.png");
ASSET_MANAGER.queueDownload("./img/farm.png");
ASSET_MANAGER.queueDownload("./img/scoreBoard.png");
ASSET_MANAGER.queueDownload("./img/mountain.png");
ASSET_MANAGER.queueDownload("./img/endgame-scene.png");
ASSET_MANAGER.queueDownload("./img/bg-space.png");
ASSET_MANAGER.queueDownload("./img/bg-winter.png");
ASSET_MANAGER.queueDownload("./img/mountainforest.png");
ASSET_MANAGER.queueDownload("./img/bg-credits.png");
ASSET_MANAGER.queueDownload("./img/bg-logo.png");
ASSET_MANAGER.queueDownload("./img/bg-controller.png");

// Platform Sprites
ASSET_MANAGER.queueDownload("./img/platform-small-hay.png");
ASSET_MANAGER.queueDownload("./img/platform-medium-hay.png");
ASSET_MANAGER.queueDownload("./img/platform-large-hay.png");
ASSET_MANAGER.queueDownload("./img/platform-small-winter.png");
ASSET_MANAGER.queueDownload("./img/platform-medium-winter.png");
ASSET_MANAGER.queueDownload("./img/platform-large-winter.png");
ASSET_MANAGER.queueDownload("./img/platform-small-space.png");
ASSET_MANAGER.queueDownload("./img/platform-medium-space.png");
ASSET_MANAGER.queueDownload("./img/platform-large-space.png");
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

// Powerup Spites
ASSET_MANAGER.queueDownload("./img/powerup-doubleJump.png");
ASSET_MANAGER.queueDownload("./img/powerup-invincibility.png");
ASSET_MANAGER.queueDownload("./img/powerup-highJumpLeft.png");
ASSET_MANAGER.queueDownload("./img/powerup-highJumpRight.png");
ASSET_MANAGER.queueDownload("./img/powerup-speedUp.png");

// Controls
ASSET_MANAGER.queueDownload("./img/Keyboard_White_A.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_D.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_F.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_W.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Arrow_Up.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Arrow_Left.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Arrow_Right.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Dot.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Slash.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Shift.png");
ASSET_MANAGER.queueDownload("./img/Keyboard_White_Enter.png");


// Other
ASSET_MANAGER.queueDownload("./img/hill-arrow.png");
ASSET_MANAGER.queueDownload("./img/transparent_pixel.png");
ASSET_MANAGER.queueDownload("./img/simple-crown-animated.png");
ASSET_MANAGER.queueDownload("./img/crown.png");
ASSET_MANAGER.queueDownload("./img/back.png");
ASSET_MANAGER.queueDownload("./img/volume-muted-icon.png");
ASSET_MANAGER.queueDownload("./img/volume-on-icon.png");

/* === Game Audio ===*/
// bgMusic sourced from http://www.bensound.com/
var bgMusic = new Howl({
    urls: ['./audio/bensound-jazzyfrenchy.mp3'],
    loop: true,
    volume: 0.5
});

ASSET_MANAGER.downloadAll(function () {

    /* === Game Engine === */
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);


    /* === NEW Game Logistics === */
    var sm = makeSceneManager(gameEngine);
    gameEngine.sceneManager = sm;
    gameEngine.entities.push(sm);

    /* === Red Three Studios Logo === */
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/bg-logo.png"), 0, 0, 800, 600);

    /* === START GAME === */
    gameEngine.start(); // starts infinite game loop
});

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var HILL_SPEED = 8;
var MUTED = false;

// TODO: need to set next pointers for all Scenes
var makeSceneManager = function (gameEngine) {
    // 1. Create all Scenes necessary for game
    // ---
    // var logoSplash = new Splash(gameEngine, 5, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg-logo.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var controllerSplash = new Splash(gameEngine, 5, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg-controller.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var titleScene = new Title(gameEngine);
    // TODO: need to add Tutorial Scene (will need to change links section below too)
    var tutorialScene = new Tutorial(gameEngine);
    var creditsScene = new Credits(gameEngine);
    var r1 = createFirstRound(gameEngine); // first round
    var sb1 = new Scoreboard(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var r2 = createSecondRound(gameEngine); // second round
    var sb2 = new Scoreboard(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var r3 = createThirdRound(gameEngine); // third round
    var sb3 = new Scoreboard(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var eg = new EndGame(gameEngine, new Background(gameEngine, ASSET_MANAGER.getAsset("./img/endgame-scene.png"), CANVAS_WIDTH, CANVAS_HEIGHT));

    // 2. Link up all Scenes in correct sequence before returning SceneManager with a reference to the title Scene
    // ---
    // logoSplash.next = controllerSplash;
    controllerSplash.next = titleScene;
    titleScene.roundScene = r1;
    titleScene.tutorialScene = tutorialScene;
    titleScene.creditsScene = creditsScene;
    tutorialScene.next = titleScene;
    creditsScene.next = titleScene;
    r1.next = sb1;
    sb1.next = r2;
    r2.next = sb2;
    sb2.next = r3;
    r3.next = sb3;
    sb3.next = eg;
    eg.next = titleScene;

    return new SceneManager(gameEngine, controllerSplash);
};

var createFirstRound = function (gameEngine) {

    // Create scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/farm.png"), 800, 600);

    // Create platforms
    var platforms = [];
    platforms.push(new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'hay')); // ground platform is always the first platform added to a scene
    platforms.push(new Platform(gameEngine, 'l', 100, 400, 'stationary', 'hay'));
    platforms.push(new Platform(gameEngine, 'l', 450, 400, 'stationary', 'hay'));
    platforms.push(new Platform(gameEngine, 'm', 320, 280, 'stationary', 'hay'));
    platforms.push(new Platform(gameEngine, 's', 320, 160, 'horizontal', 'hay'));
    //platforms.push(new Platform(gameEngine, 's', 320, 160, 'elliptical', 'hay')); // TODO: Elliptical path doesn't work yet
    return new Round(gameEngine, background, platforms, true, HILL_SPEED);
};

var createSecondRound = function (gameEngine) {

    // Create scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg-winter.png"), 800, 600);

    // Create platforms
    var platforms = [];
    platforms.push(new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'winter')); // ground platform is always the first platform added to a scene
    platforms.push(new Platform(gameEngine, 'm', 80, 450, 'vertical', 'winter'));
    platforms.push(new Platform(gameEngine, 's', 230, 400, 'vertical', 'winter'));
    platforms.push(new Platform(gameEngine, 'm', 310, 350, 'vertical', 'winter'));
    platforms.push(new Platform(gameEngine, 's', 470, 300, 'vertical', 'winter'));
    platforms.push(new Platform(gameEngine, 'm', 540, 250, 'vertical', 'winter'));

    return new Round(gameEngine, background, platforms, true, HILL_SPEED);
};

var createThirdRound = function (gameEngine) {

    // Create scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg-space.png"), 800, 600);

    // Create platforms
    var platforms = [];
    platforms.push(new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'space')); // ground platform is always the first platform added to a scene
    platforms.push(new Platform(gameEngine, 's', 0, 0, 'elliptical', 'space', 45)); // Last # is the angle to start at
    platforms.push(new Platform(gameEngine, 's', 0, 0, 'elliptical', 'space', 90));
    platforms.push(new Platform(gameEngine, 's', 0, 0, 'elliptical', 'space', 135));
    platforms.push(new Platform(gameEngine, 's', 0, 0, 'elliptical', 'space', 180));
    platforms.push(new Platform(gameEngine, 's', 0, 0, 'elliptical', 'space', 225));
    platforms.push(new Platform(gameEngine, 's', 0, 0, 'elliptical', 'space', 270));

    return new Round(gameEngine, background, platforms, true, HILL_SPEED);
};

var createFourthRound = function (gameEngine) {

    // Create scene's background
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset(".img/bg-forest.png"), 800, 600);

    // Create platforms
    var platforms = [];
    platforms.push(new Platform(gameEngine, 'ground', 0, 530, 'stationary', 'forest')); // ground platform is always the first platform added to a scene
    platforms.push(new Platform(gameEngine, 'm', 50, 50, 'bouncing', 'forest'));
    platforms.push(new Platform(gameEngine, 'm', 150, 150, 'bouncing', 'forest'));
    platforms.push(new Platform(gameEngine, 'm', 250, 250, 'bouncing', 'forest'));
    platforms.push(new Platform(gameEngine, 'm', 350, 350, 'bouncing', 'forest'));
    platforms.push(new Platform(gameEngine, 'm', 450, 450, 'bouncing', 'forest'));
};

