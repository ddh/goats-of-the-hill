// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

// Class Constants:
var ROUND_TIME_LIMIT = 60; // 1 minute (in seconds) TODO: change this value to 'team agreed upon' value
var ROUNDS_PLAYED = 0;
var GOLD_COLOR = "rgb(255, 215, 0)";
var COLLECTIBLES = ['speedUp', 'doubleJump', 'highJump', 'maxCharge', 'attackUp', 'invincibility'];
//var COLLECTIBLES = ['invincibility']; //TODO: Using this as a means to test a powerup individually. Just comment out the above.
var POWERUP_INTERVAL = 10;  // Every x sec a powerup spawns


function PlayGame(game, btnX, btnY, hill, randomizeHill, randomHillSpeed) {
    this.game = game;
    this.btnX = btnX;
    this.btnY = btnY;
    this.hill = hill;
    this.isInTransitionScene = true; // false if round is currently running
    this.randomizeHill = randomizeHill;
    this.randomHillSpeed = randomHillSpeed;
    this.randomHillClockTickTracker = 0;
    this.sceneSelector = null;
    this.scene = null;
    this.isInTitleScreenScene = true;
    this.roundSecondsElapsed = 0;
    this.timerStarted = false;
    this.lastRoundWasTie = false;
    this.roundTimerDiv = document.getElementById('roundTimer');
    this.goatWhoWonLastRound = null;
    this.powerUpTimer = POWERUP_INTERVAL;
    Entity.call(this, game, 0, 0, 0, 0);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
};

PlayGame.prototype.update = function () {
    Entity.prototype.update.call(this);

    // ACTUAL ROUND JUST STARTED
    if (this.game.click) {
        console.log("click detected");
        if (this.isInTransitionScene) {
            // logistic stuff
            this.isInTransitionScene = false;
            this.randomHillClockTickTracker = 0;
            if (!this.timerStarted) this.startTimer(ROUND_TIME_LIMIT, this.roundTimerDiv);

            // asset stuff
            this.game.prepForScene();
            this.scene = this.sceneSelector.getNextScene();
            this.game.addEntity(this.scene);
            this.game.addEntity(this);
            console.log("TRANSITION THING");
            this.initGoats();
        }
    }

    // TRANSITION SCENE JUST STARTED
    if (!this.isInTransitionScene) {
        // asset stuff
        this.scoreChecker();
        this.randomHillGenerator();
        this.generateRandomCollectible();
        this.updateScores();

        if (this.roundSecondsElapsed >= ROUND_TIME_LIMIT) {
            // logistic stuff
            this.isInTransitionScene = true;
            this.roundTimerDiv.innerHTML = "";
            ROUNDS_PLAYED++;
            this.roundSecondsElapsed = 0;
            this.lastRoundWasTie = false;
            this.goatWhoWonLastRound = null;

            // asset stuff
            this.determineWinningGoat();
            this.game.prepForScene();
            this.scene = this.sceneSelector.getNextScene();
            this.game.addEntity(this.scene);
            this.game.addEntity(this);
            //this.initGoats(); // TODO: Taken out to prevent goats interacting between rounds
        }
    }
};

PlayGame.prototype.initGoats = function () {
    /* === Goats === */
    var playerOneControls = {jump: 87, left: 65, right: 68, attack: 83, run: 16}; // W,A,D,S,shift
    var goat1 = new Goat(this.game, 0, playerOneControls, "blue-goat");
    goat1.x = 30;
    this.game.addEntity(goat1);

    var playerTwoControls = {jump: 38, left: 37, right: 39, attack: 40, run: 18}; // ↑,←,→,↓,alt
    var goat2 = new Goat(this.game, 1, playerTwoControls, "green-goat");
    goat2.x = 230;
    this.game.addEntity(goat2);

    var playerThreeControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    var goat3 = new Goat(this.game, 2, playerThreeControls, "red-goat");
    goat3.x = 430;
    this.game.addEntity(goat3);

    var playerFourControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    var goat4 = new Goat(this.game, 3, playerFourControls, "yellow-goat");
    goat4.x = 630;
    this.game.addEntity(goat4);
};

// Checks which goat is the leader and crowns them.
PlayGame.prototype.scoreChecker = function () {
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
};

//Helper function for the hill
PlayGame.prototype.randomHillGenerator = function () {
    var len = this.game.platforms.length;
    if (len !== 0 && this.hill) { //there is a hill
        if (this.randomizeHill) { // It's a random hill style
            if (!this.isInTransitionScene) this.randomHillClockTickTracker += this.game.clockTick;
            if (this.randomHillClockTickTracker >= this.randomHillSpeed) {
                console.log("potential for hill change");
                this.randomHillClockTickTracker = 0;
                for (var i = 1; i < len; i++) { // finds the current hill and disables it.
                    if (this.game.platforms[i].isHill) {
                        this.game.platforms[i].isHill = false;
                    }
                }
                // ***NOTE: if no platforms in scene, len is 0 so multiplying by zero is BAAAADD !!! :P
                var randomPlatformIndex = Math.floor((Math.random() * len));
                //do not include 0 (ground platform)
                if (randomPlatformIndex !== 0) {
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

PlayGame.prototype.draw = function (ctx) {
    if (this.isInTransitionScene) {
        this.drawPlayButton(ctx);
        var statStr = "", statX, statY = 100;
        if (!this.lastRoundWasTie) {
            if (!this.isInTitleScreenScene) {
                statStr = this.goatWhoWonLastRound.toString() + " won with a score of " + this.goatWhoWonLastRound.score;
                statX = 200;
            }
        } else {
            if (!this.isInTitleScreenScene) {
                statStr = "Last round was a tie!";
                statX = 280;
            }
        }
        drawTextWithOutline(ctx, "32px Impact", statStr, statX, statY, GOLD_COLOR, 'white');
    } else {
        this.drawScores(ctx);
        drawTextWithOutline(ctx, "32px Impact", this.roundTimerDiv.innerHTML, 350, 40, 'black', 'white');
        drawTextWithOutline(ctx, "32px Impact", "Round #" + (ROUNDS_PLAYED + 1), 650, 40, 'purple', 'white');
        drawTextWithOutline(ctx, "32px Impact", "Oh My Goat!", 20, 40, 'purple', 'white');
    }
    Entity.prototype.draw.call(this, ctx);
};

PlayGame.prototype.drawPlayButton = function (ctx) {
    if (ROUNDS_PLAYED === 0) {
        drawTextWithOutline(ctx, "24pt Impact", "Click to play!", this.btnX, this.btnY + 120, "purple", "white");
    } else {
        drawTextWithOutline(ctx, "24pt Impact", "Play again?", this.btnX, this.btnY, 'purple', 'white');
    }
};

PlayGame.prototype.drawScores = function (ctx) {
    var font = "32px Impact";
    drawTextWithOutline(ctx, font, this.playerOneScore, 45, 590, 'white', 'blue');
    drawTextWithOutline(ctx, font, this.playerTwoScore, 245, 590, 'white', 'green');
    drawTextWithOutline(ctx, font, this.playerThreeScore, 445, 590, 'white', 'red');
    drawTextWithOutline(ctx, font, this.playerFourScore, 645, 590, 'white', GOLD_COLOR);
};

var drawTextWithOutline = function (ctx, font, text, x, y, fillColor, outlineColor) {
    ctx.font = font;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 5;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
};

PlayGame.prototype.initFirstScene = function () {
    this.scene = this.sceneSelector.scenes[0];
};

PlayGame.prototype.updateScores = function () {
    for (var i = 0, len = this.game.goats.length; i < len; i++) {
        var score = this.game.goats[i].score;
        if (i === 0) { // player one
            this.playerOneScore = score.toString();
        } else if (i === 1) { // player two
            this.playerTwoScore = score.toString();
        } else if (i === 2) { // player three
            this.playerThreeScore = score.toString();
        } else if (i === 3) { // player four
            this.playerFourScore = score.toString();
        }
    }
};

// Taken from Stackflow: http://stackoverflow.com/questions/29139357/javascript-countdown-timer-will-not-display-twice
PlayGame.prototype.startTimer = function (duration, display) {
    this.timerStarted = true;
    var start = Date.now(), diff, minutes, seconds;

    var that = this; // now children, don't forget about closure!

    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (!that.isInTransitionScene) {
            display.innerHTML = minutes + ":" + seconds;
            that.roundSecondsElapsed = ROUND_TIME_LIMIT - ((minutes * 60) + seconds);
        } else {
            display.innerHTML = "";
            that.roundSecondsElapsed = 0;
        }

        if (diff <= 0) {
            start = Date.now() + 1000;
        }

        if (that.isInTransitionScene) start = 0;
    }

    timer();
    setInterval(timer, 1000 / 60);
};

// determines which goat won the previous round
PlayGame.prototype.determineWinningGoat = function () {
    this.isInTitleScreenScene = false; // 'cause at least one round has now been played
    var len = this.game.goats.length;
    var maxScore = 0;
    this.goatWhoWonLastRound = this.game.goats[0];
    for (var i = 1; i < len; i++) {
        var goat = this.game.goats[i];
        if (goat.score > maxScore) {
            this.goatWhoWonLastRound = goat;
            maxScore = goat.score;
        }
    }
    // determines if last round was tie
    for (var j = 0; j < len; j++) {
        var goat = this.game.goats[j];
        if (this.goatWhoWonLastRound !== goat && this.goatWhoWonLastRound.score === goat.score)
            this.lastRoundWasTie = true;
    }
};

PlayGame.prototype.generateRandomCollectible = function () {

    // Generate powerup every x seconds
    if (!this.isInTransitionScene) {
        this.powerUpTimer -= this.game.clockTick;
        if (this.powerUpTimer < 0) {
            this.powerUpTimer = POWERUP_INTERVAL;
            var randomX = Math.floor(Math.random() * (this.game.surfaceWidth - 40)); // +40 to avoid spawning off screen
            var randomY = Math.floor(Math.random() * (this.game.surfaceHeight - 100)); // +100 to avoid powerups in ground
            var randomCollectible = Math.floor(Math.random() * (COLLECTIBLES.length));
            this.game.addEntity(new Collectible(this.game, randomX, randomY, 40, 40, COLLECTIBLES[randomCollectible]));
        }
    } else this.powerUpTimer = POWERUP_INTERVAL;
};

PlayGame.prototype.toString = function () {
    return 'PlayGame';
};