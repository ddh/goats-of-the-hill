// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

var ROUND_TIME_LIMIT = 300; // 5 minutes
var ROUNDS_PLAYED = 0;

function PlayGame(game, btnX, btnY) {
    this.game = game;
    this.btnX = btnX;
    this.btnY = btnY;
    this.isInTransitionScene = true;
    this.sceneSelector = null;
    this.scene = null;
    this.roundRunning = false; // TODO: need to set this to true upon Canvas click

    Entity.call(this, game, 0, 0, 0, 0);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
    this.roundRunning = false;
    ROUNDS_PLAYED++; // a game has been played previously because the game is getting reset
    this.game.roundNumber.innerHTML = "Round #" + (ROUNDS_PLAYED + 1);
};

PlayGame.prototype.update = function () {
    // TODO: need to change how we're keeping track of round time vs. total game time
    this.game.running = (this.game.click && this.game.timer.gameTime < ROUND_TIME_LIMIT);
    Entity.prototype.update.call(this);
};

PlayGame.prototype.draw = function (ctx) {
    this.drawPlayButton(ctx);
    Entity.prototype.draw.call(this, ctx);
};

PlayGame.prototype.drawPlayButton = function (ctx) {
    ctx.fillStyle = "purple";
    if (!this.game.running) {
        ctx.font = "24pt Impact";
        if (ROUNDS_PLAYED === 0) {
            ctx.fillText("Play OMG!?!", this.btnX, this.btnY);
        } else {
            ctx.fillText("Play OMG Again?!?", this.btnX, this.btnY);
        }
    }
};

PlayGame.prototype.initFirstScene = function () {
    this.scene = this.sceneSelector.scenes[0];
};

PlayGame.prototype.toString = function () {
    return 'PlayGame';
};