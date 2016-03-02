// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

// Class Constants:
var ROUND_TIME_LIMIT = 60; // 1 minute (in seconds) TODO: change this value to 'team agreed upon' value
var ROUNDS_PLAYED = 0;
var GOLD_COLOR = "rgb(255, 215, 0)";
var COLLECTIBLES = ['speedUp', 'doubleJump', 'highJump', 'maxCharge', 'attackUp', 'invincibility'];
//var COLLECTIBLES = ['invincibility']; //TODO: Using this as a means to test a powerup individually. Just comment out the above.
var POWERUP_INTERVAL = 5;  // Every x sec a powerup spawns


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
    this.roundTimer = ROUND_TIME_LIMIT;
    //this.roundSecondsElapsed = 0; // TODO: Round countdown refactor; flagged for removal
    this.timerStarted = false;
    this.lastRoundWasTie = false;
    //this.roundTimerDiv = document.getElementById('roundTimer'); // TODO: Round countdown refactor; flagged for removal
    this.highestScore = null;
    this.powerUpTimer = POWERUP_INTERVAL;
    this.goatScores = [];

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
            //if (!this.timerStarted) this.startTimer(ROUND_TIME_LIMIT, this.roundTimerDiv); // TODO: Round countdown refactor; flagged for removal

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
        this.roundTimer -= this.game.clockTick;
        this.scoreChecker();
        this.randomHillGenerator();
        this.generateRandomCollectible();
        this.goatScores = [];

        if (this.roundTimer / 1 < 0) {
            // logistic stuff
            this.isInTransitionScene = true;
            this.roundTimer = ROUND_TIME_LIMIT;
            ROUNDS_PLAYED++;
            this.lastRoundWasTie = false;

            for (var i = 0; i < this.game.goats.length; i++) {
                this.goatScores.push(this.game.goats[i]);
            }

            this.goatScores.sort(function (a, b) {
                return b.score - a.score;
            });
            // asset stuff
            this.isInTitleScreenScene = false; // 'cause at least one round has now been played
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
    var playerOneControls = {jump: 87, left: 65, right: 68, attack: 70, run: 16}; // W A D F shift
    var goat1 = new Goat(this.game, 0, playerOneControls, "blue-goat", "blue");
    goat1.x = 30;
    this.game.addEntity(goat1);

    var playerTwoControls = {jump: 38, left: 37, right: 39, attack: 191, run: 190}; // ↑ ← → / .
    var goat2 = new Goat(this.game, 1, playerTwoControls, "green-goat", "green");
    goat2.x = 230;
    this.game.addEntity(goat2);

    var playerThreeControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    var goat3 = new Goat(this.game, 2, playerThreeControls, "red-goat", "red");
    goat3.x = 430;
    this.game.addEntity(goat3);

    var playerFourControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    var goat4 = new Goat(this.game, 3, playerFourControls, "yellow-goat", GOLD_COLOR);
    goat4.x = 630;
    this.game.addEntity(goat4);
};

// Checks which goat is the leader and crowns them.
PlayGame.prototype.scoreChecker = function () {
    this.highestScore = this.game.goats[0]; //sets a goat as king
    //checks which goat has the highest score
    for (var i = 1, len = this.game.goats.length; i < len; i++) {
        var goat = this.game.goats[i];
        if (this.highestScore.score < goat.score) {
            this.highestScore = goat;
        }
    }
    //ensures other goats don't have the crown 
    for (var i = 0, len = this.game.goats.length; i < len; i++) {
        if (this.highestScore != this.game.goats[i]) {
            this.game.goats[i].king = false;
        }
    }
    if (typeof this.highestScore.score !== 'undefined'
        && typeof this.highestScore.score !== 'NaN'
        && this.highestScore.score !== 0) { //Avoids start of game deciding who is king
        this.highestScore.king = true;
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
        var winningGoatString = "";

        if (!this.lastRoundWasTie) {
            if (!this.isInTitleScreenScene) {

                winningGoatString = this.highestScore.playerColor.toUpperCase() + " wins scoring : " + this.highestScore.score;
                drawTextWithOutline(ctx, "45px Impact", winningGoatString, 210, 105, this.highestScore.color, 'white'); // winner #1
                drawTextWithOutline(ctx, "40px Impact", this.goatScores[1].score, 310, 202, this.goatScores[1].color, 'white'); // winner #2
                drawTextWithOutline(ctx, "40px Impact", this.goatScores[2].score, 585, 288, this.goatScores[2].color, 'white'); // winner #3
                drawTextWithOutline(ctx, "40px Impact", this.goatScores[3].score, 220, 368, this.goatScores[3].color, 'white'); // winner #4
            }
        } else {
            if (!this.isInTitleScreenScene) {
                statStr = "Last round was a tie!";
            }
        }
    } else {
        this.drawScores(ctx);
        this.drawTimer(ctx);
        drawTextWithOutline(ctx, "32px Impact", "Round #" + (ROUNDS_PLAYED + 1), 650, 40, 'purple', 'white');
        drawTextWithOutline(ctx, "32px Impact", "Oh My Goat!", 20, 40, 'purple', 'white');
    }
    Entity.prototype.draw.call(this, ctx);
};

PlayGame.prototype.drawPlayButton = function (ctx) {
    if (ROUNDS_PLAYED === 0) {
        drawTextWithOutline(ctx, "24pt Impact", "Click to play!", this.btnX, this.btnY + 120, "purple", "white");
    } else {
        drawTextWithOutline(ctx, "24pt Impact", "Play again?", this.btnX + 10, this.btnY + 160, 'purple', 'white');
    }
};

PlayGame.prototype.drawScores = function (ctx) {
    // Draw scores
    for (var i = 0; i < this.game.goats.length; i++) {
        drawTextWithOutline(ctx, "32px Impact", this.game.goats[i].score, 45 + 200 * i, 590, 'white', this.game.goats[i].color);
        // Draw crown
        if (this.game.goats[i].king) ctx.drawImage(ASSET_MANAGER.getAsset("./img/crown.png"), 45 + 200 * i, 520, 50, 50);
    }
};

PlayGame.prototype.drawTimer = function(ctx) {
    if (Math.floor(this.roundTimer / 1) == 0) {
        drawTextWithOutline(ctx, "200px Impact", "TIME!", 180, 300, 'red', 'white');
    }
    else if (this.roundTimer / 1 < 10) {
        drawTextWithOutline(ctx, "200px Impact", Math.floor(this.roundTimer / 1), 350, 300, 'red', 'white');
    } else {
        drawTextWithOutline(ctx, "50px Impact", Math.floor(this.roundTimer / 1), 380, 60, 'black', 'white');
    }
};

var drawTextWithOutline = function (ctx, font, text, x, y, fillColor, outlineColor) {
    ctx.font = font;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 5;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
};

PlayGame.prototype.initFirstScene = function () {
    this.scene = this.sceneSelector.scenes[0];
};

PlayGame.prototype.generateRandomCollectible = function () {

    // Generate powerup every x seconds
    if (!this.isInTransitionScene) {
        this.powerUpTimer -= this.game.clockTick;
        if (this.powerUpTimer < 0) {
            this.powerUpTimer = POWERUP_INTERVAL;
            var randomX = Math.floor(Math.random() * (this.game.surfaceWidth - 40)); // +40 to avoid spawning off screen
            var randomY = Math.floor(Math.random() * ((this.game.surfaceHeight - 100) - 50) + 50); // +100 to avoid powerups in ground
            var randomCollectible = Math.floor(Math.random() * (COLLECTIBLES.length));
            this.game.addEntity(new Collectible(this.game, randomX, randomY, 40, 40, COLLECTIBLES[randomCollectible]));
        }
    } else this.powerUpTimer = POWERUP_INTERVAL;
};

PlayGame.prototype.toString = function () {
    return 'PlayGame';
};