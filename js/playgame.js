// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

var ROUND_TIME_LIMIT = 300; // 5 minutes
var ROUNDS_PLAYED = 0;

function PlayGame(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.game.roundNumber.innerHTML = "Round #" + (ROUNDS_PLAYED + 1);
    Entity.call(this, game, x, y);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
    this.game.running = false;
    ROUNDS_PLAYED++; // a game has been played previously because the game is getting reset
    this.game.roundNumber.innerHTML = "Round #" + (ROUNDS_PLAYED + 1);
};

PlayGame.prototype.update = function () {
    if (this.game.click && this.game.timer.gameTime < ROUND_TIME_LIMIT) this.game.running = true;
};

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "24pt Arial";
        //ctx.fillStyle = "gold"; // TODO: thought the UW colors would be a fun theme, at least for play game button
        if (this.game.mouse) { ctx.fillStyle = "purple"; }
        if (ROUNDS_PLAYED === 0) {
            ctx.fillText("Play OMG!?!", this.x, this.y);
        } else {
            ctx.fillText("Play OMG Again?!?", this.x - 30, this.y);
        }
    }
};