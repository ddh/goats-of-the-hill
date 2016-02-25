// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

var ROUND_TIME_LIMIT = 180; // 3 minutes
var ROUNDS_PLAYED = 0;

function PlayGame(game, btnX, btnY, hill, randomizeHill, randomHillSpeed) {
    this.game = game;
    this.btnX = btnX;
    this.btnY = btnY;
    this.hill = hill;
    this.isInTransitionScene = true;
    this.randomizeHill = randomizeHill;
    this.randomHillSpeed = randomHillSpeed;
    this.randomHillClockTickTracker = 0;
    this.sceneSelector = null;
    this.scene = null;
    this.roundRunning = false;
    this.roundTimeLeft = ROUND_TIME_LIMIT;
    this.pOneScoreDiv = document.getElementById("playerOneScore");
    this.pTwoScoreDiv = document.getElementById("playerTwoScore");
    this.pThreeScoreDiv = document.getElementById("playerThreeScore");
    this.pFourScoreDiv = document.getElementById("playerFourScore");
    this.roundNumberDiv = document.getElementById('roundNumber');
    this.roundTimerDiv = document.getElementById('roundTimer');
    this.transitionTitleDiv = document.getElementById('transitionTitle');
    this.gameTitleDuringRoundDiv = document.getElementById('gameTitleDuringRound');

    this.initDivs();

    Entity.call(this, game, 0, 0, 0, 0);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
    this.roundRunning = false;
    ROUNDS_PLAYED++; // a game has been played previously because the game is getting reset
    this.randomHillClockTickTracker = 0;
    this.roundTimeLeft = ROUND_TIME_LIMIT;
    this.initDivs();
};

PlayGame.prototype.update = function () {
    Entity.prototype.update.call(this);

    if (this.game.click) {
        if (this.isInTransitionScene) { //
            // logistic stuff
            this.isInTransitionScene = false;
            this.roundRunning = true;
            this.startTimer(ROUND_TIME_LIMIT, this.roundTimerDiv);

            // asset stuff
            this.game.prepForRound();
            this.scene = this.sceneSelector.getNextScene();
            this.game.addEntity(this.scene);
            this.initGoats();
            this.initDivs();
        }
    }

    if (this.roundRunning) {
        // asset stuff
        this.scoreChecker();
        this.randomHillGenerator();
        this.updateScores();

        // logistic stuff
        this.roundRunning = this.roundTimeLeft > 0;
    }
};

PlayGame.prototype.initGoats = function () {
    /* === Goats === */
    var playerOneControls = {jump: 38, left: 37, right: 39, attack: 40, run: 18}; // ↑,←,→,↓,alt
    this.game.addEntity(new Goat(this.game, 0, playerOneControls, "blue-goat"));

    var playerTwoControls = {jump: 87, left: 65, right: 68, attack: 83, run: 16}; // W,A,D,S,shift
    this.game.addEntity(new Goat(this.game, 1, playerTwoControls, "green-goat"));

    var playerThreeControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    this.game.addEntity(new Goat(this.game, 2, playerThreeControls, "red-goat"));

    var playerFourControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    this.game.addEntity(new Goat(this.game, 3, playerFourControls, "yellow-goat"));
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
};

//Helper function for the hill
PlayGame.prototype.randomHillGenerator = function() {
    var len = this.game.platforms.length;
    if (len !== 0 && this.hill) { //there is a hill
        if (this.randomizeHill) { // It's a random hill style 
            this.randomHillClockTickTracker += this.game.clockTick;
            if (this.randomHillClockTickTracker >= this.randomHillSpeed) {
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
    if (this.isInTransitionScene) this.drawPlayButton(ctx);
    Entity.prototype.draw.call(this, ctx);
};

PlayGame.prototype.drawPlayButton = function (ctx) {
    ctx.fillStyle = "purple";
    if (!this.game.running) {
        ctx.font = "24pt Impact";
        if (ROUNDS_PLAYED === 0) {
            ctx.fillText("Click to play!", this.btnX, this.btnY);
        } else {
            ctx.fillText("Play again?", this.btnX, this.btnY);
        }
    }
};

PlayGame.prototype.initDivs = function () {
    if (this.isInTransitionScene) {
        this.roundNumberDiv.innerHTML = "";
        this.pOneScoreDiv.innerHTML = "";
        this.pTwoScoreDiv.innerHTML = "";
        this.pThreeScoreDiv.innerHTML = "";
        this.pFourScoreDiv.innerHTML = "";
        this.gameTitleDuringRoundDiv.innerHTML = "";
        if (ROUNDS_PLAYED === 0) {
            this.transitionTitleDiv.innerHTML = "Oh My Goat!";
        } else {
            this.transitionTitleDiv.innerHTML = "";
        }
    } else {
        this.roundNumberDiv.innerHTML = "Round #" + (ROUNDS_PLAYED + 1);
        this.pOneScoreDiv.innerHTML = "0";
        this.pTwoScoreDiv.innerHTML = "0";
        this.pThreeScoreDiv.innerHTML = "0";
        this.pFourScoreDiv.innerHTML = "0";
        this.gameTitleDuringRoundDiv.innerHTML = "Oh My Goat!";
        this.transitionTitleDiv.innerHTML = "";
    }
};

PlayGame.prototype.initFirstScene = function () {
    this.scene = this.sceneSelector.scenes[0];
};

PlayGame.prototype.updateScores = function () {
    for (var i = 0, len = this.game.goats.length; i < len; i++) {
        var score = this.game.goats[i].score;
        if (i === 0) { // player one
            this.pOneScoreDiv.innerHTML = score.toString();
        } else if (i === 1) { // player two
            this.pTwoScoreDiv.innerHTML = score.toString();
        } else if (i === 2) { // player three
            this.pThreeScoreDiv.innerHTML = score.toString();
        } else if (i === 3) { // player four
            this.pFourScoreDiv.innerHTML = score.toString();
        }
    }
};

// Taken from Stackflow: http://stackoverflow.com/questions/29139357/javascript-countdown-timer-will-not-display-twice
PlayGame.prototype.startTimer = function (duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;

    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = minutes + ":" + seconds;

        this.roundTimeLeft = ROUND_TIME_LIMIT - ((minutes * 60) + seconds);

        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    }

    timer();
    setInterval(timer, 1000);
};

PlayGame.prototype.toString = function () {
    return 'PlayGame';
};