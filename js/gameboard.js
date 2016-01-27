
// GameBoard code below

function GameBoard(game) {
    Entity.call(this, game, 20, 20);
    this.grid = false;
    this.player = 1;
    this.board = [];
    for (var i = 0; i < 19; i++) {
        this.board.push([]);
        for (var j = 0; j < 19; j++) {
            this.board[i].push(0);
        }
    }
}

// TODO: Entity.call() ??? - calling superclass methods from subclass

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.update = function () {
    if (this.game.click) {
        this.board[this.game.click.x][this.game.click.y] = this.player;
        this.player = this.player === 1 ? 2 : 1;
    }
    Entity.prototype.update.call(this);
}

GameBoard.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/960px-Blank_Go_board.png"), this.x, this.y, 760, 760);

    var size = 39.55;
    var offset = 3.5 + size/2;

    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            //ctx.strokeStyle = "Green";
            //ctx.strokeRect(i * size + offset, j * size + offset, size, size);

            if (this.board[i][j] === 1) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./img/black.png"), i * size + offset, j * size + offset, 40, 40);
            }
            if (this.board[i][j] === 2) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./img/white.png"), i * size + offset, j * size + offset, 40, 40);
            }
        }
    }

    // draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        if(this.player === 1) ctx.drawImage(ASSET_MANAGER.getAsset("./img/black.png"), this.game.mouse.x * size + offset, this.game.mouse.y * size + offset, 40, 40);
        else ctx.drawImage(ASSET_MANAGER.getAsset("./img/white.png"), this.game.mouse.x * size + offset, this.game.mouse.y * size + offset, 40, 40);
        ctx.restore();
    }
}



// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var gameboard = new GameBoard(gameEngine);
    gameEngine.addEntity(gameboard);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
