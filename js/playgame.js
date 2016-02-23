// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

var ROUND_TIME_LIMIT = 300; // 5 minutes
var ROUNDS_PLAYED = 0;

function PlayGame(game, btnX, btnY, hill, randomizeHill, randomHillSpeed) {
    this.game = game;
    this.btnX = btnX;
    this.btnY = btnY;
    this.hill = hill;
    this.isInTransitionScene = true;
    this.randomizeHill = randomizeHill;
    this.randomHillSpeed = randomHillSpeed;
    this.RandomHillClockTickTracker = 0;
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
    this.RandomHillClockTickTracker = 0;
};

// TODO: handle transition logic here
PlayGame.prototype.update = function () {
    // TODO: need to change how we're keeping track of round time vs. total game time
    this.game.roundRunning = (this.game.click && this.game.timer.gameTime < ROUND_TIME_LIMIT);
    Entity.prototype.update.call(this);
    this.scoreChecker();
    this.randomHillGenerator();
};

// Checks which goat is the leader and crowns them.
PlayGame.prototype.scoreChecker = function() {
    var highestScore = this.game.goats[0]; //sets a goat as king
    //checks which goat has the highest score
    for (var i = 1, len = this.game.goats.length; i < len; i++) { 
        var goat = this.game.goats[i];
        if (highestScore.score < goat.score) {
            highestScore = goat;
        }
    }
    //ensures other goats don't have the crown 
    for (var i = 0, len = this.game.goats.length; i < len; i++) {
        if (highestScore != this.game.goats[i]) {
            this.game.goats[i].king = false;
        }
    }
    if (typeof highestScore.score !== 'undefined'
                && typeof highestScore.score !== 'NaN'
                && highestScore.score !== 0) { //Avoids start of game deciding who is king
        highestScore.king = true;
    }
}

//Helper function for the hill
PlayGame.prototype.randomHillGenerator = function() {
    if (this.hill) { //there is a hill
        if (this.randomizeHill) { // It's a random hill style 
            this.RandomHillClockTickTracker += this.game.clockTick;
            if (this.RandomHillClockTickTracker >= this.randomHillSpeed) {
                this.RandomHillClockTickTracker = 0;
                var len = this.game.platforms.length;
                for (var i = 1; i < len; i++) { // finds the current hill and disables it.
                    if (this.game.platforms[i].isHill) {
                        this.game.platforms[i].isHill = false;
                    }            
                }
                var randomPlatformIndex = Math.floor((Math.random() * len));
                //do not include 0 (ground platform)
                if (randomPlatformIndex != 0) {
                    this.game.platforms[randomPlatformIndex].isHill = true; // sets a new platform as the hill
                } else {
                    while (randomPlatformIndex == 0) { // checks to make sure its not the ground platform
                        randomPlatformIndex = Math.floor((Math.random() * len));                
                    }
                    this.game.platforms[randomPlatformIndex].isHill = true; // sets a new platform as the hill
                }   
            }   
        }
    }
};

// TODO: handle transition logic here
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