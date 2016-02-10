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
ASSET_MANAGER.queueDownload("./img/WhiteGoatLeft1.png");
ASSET_MANAGER.queueDownload("./img/WhiteGoatRight1.png");
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
    gameEngine.addEntity(bg);

    /* === Platforms === */
    var platforms = [];

    /* ground */
    var groundPlatform = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_pixel.png"), 0, 530, 800, 70, 'stationary');
    groundPlatform.oneWayCollision = false;
    gameEngine.addEntity(groundPlatform);
    platforms.push(groundPlatform);

    var plats = function (size, x, y) {
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
        gameEngine.addEntity(pf);
        platforms.push(pf);
    };
    /*** Rows in Bottom-up fashion ***/
    /* row 1 */
    plats('l', -2, 480);
    /* row 2 */
    plats('m', 300, 375);
    /* row 3 */
    plats('m', -2, 300);
    plats('l', 562, 300);
    /* row 4 */
    plats('m', 325, 130)
    /* row 5 */
    plats('s', 100, 400);
    plats('s', 400, 200);
    /* row 6 */
    var bouncePF = new Platform(gameEngine, ASSET_MANAGER.getAsset("./img/hay.png"), 200, 200, 85, 50, 'bouncing');
    bouncePF.oneWayCollision = true;
    gameEngine.addEntity(bouncePF);
    platforms.push(bouncePF);

    gameEngine.platforms = platforms;

    /* === Goats === */
    var goat = new Goat(gameEngine, 0);
    gameEngine.addEntity(goat);

    var goat2 = new Goat(gameEngine, 1);
    gameEngine.addEntity(goat2);

    /* === START GAME === */
    gameEngine.start();

});


