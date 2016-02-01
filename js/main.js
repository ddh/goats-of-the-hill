// the "main" code begins here

// asset manager is now constructed after class is defined (bottom of assetmanager.js)

//ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
//ASSET_MANAGER.queueDownload("./img/black.png");
//ASSET_MANAGER.queueDownload("./img/white.png");
ASSET_MANAGER.queueDownload("./js/img/farm.png");
ASSET_MANAGER.queueDownload("./js/img/mountain.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
   // var ctx = document.getCSSCanvasContext('2d', 'animation', 300, 300);
    var background = new Image();
    background.src = ASSET_MANAGER.getAsset('./js/img/farm.png').src;
    background.onload = function() {
        ctx.drawImage(background, 30, 0, 1000, 500);
    }
    
    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    circle.setIt();
    gameEngine.addEntity(circle);
    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
