// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

var ROUND_TIME_LIMIT = 300; // 5 minutes
var ROUNDS_PLAYED = 0;

function PlayGame(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    //this.game.roundNumber.innerHTML = "Round #" + (ROUNDS_PLAYED + 1); // don't think this is necessary ~Reid

    Entity.call(this, game, x, y, 0, 0);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
    this.game.running = false;
    ROUNDS_PLAYED++; // a game has been played previously because the game is getting reset
    this.game.roundNumber.innerHTML = "Round #" + (ROUNDS_PLAYED + 1);
};

PlayGame.prototype.update = function () {
    // TODO: need to change how we're keeping track of round time vs. total game time
    this.game.running = (this.game.click && this.game.timer.gameTime < ROUND_TIME_LIMIT);
    Entity.prototype.update.call(this);
};

PlayGame.prototype.draw = function (ctx) {
    ctx.fillStyle = "purple";
    if (!this.game.running) {
        ctx.font = "24pt Impact";
        if (ROUNDS_PLAYED === 0) {
            ctx.fillText("Play OMG!?!", this.x, this.y);
        } else {
            ctx.fillText("Play OMG Again?!?", this.x, this.y);
        }
    }
    Entity.prototype.draw.call(this, ctx);
};

PlayGame.prototype.toString = function () {
    return 'PlayGame';
};