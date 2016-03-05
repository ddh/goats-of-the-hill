// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

// Class Constants:
var ROUND_TIME_LIMIT = 60; // 1 minute (in seconds)
var GOLD_COLOR = "rgb(255, 215, 0)";
var MAX_IDLE_TIME = 10;    // *Currently turned off* - How many seconds of inactivity before goat AI kicks in on an idle player.
//var COLLECTIBLES = ['speedUp', 'doubleJump', 'highJump', 'maxCharge', 'attackUp', 'invincibility'];
var POWERUP_INTERVAL = 5;  // Every x sec a powerup spawns
var COLLECTIBLES = ['highJump', 'attackUp']; //TODO: Using this as a means to test a powerup individually. Just comment out the above.

function Round(game, background, platforms, randomizeHill, randomHillSpeed) {
    this.game = game;
    this.background = background;
    this.platforms = platforms;
    this.entities = [];
    this.collidables = [];
    this.randomizeHill = randomizeHill;
    this.randomHillSpeed = randomHillSpeed;
    this.randomHillClockTickTracker = 0;
    this.roundTimer = ROUND_TIME_LIMIT;
    this.powerUpTimer = POWERUP_INTERVAL;
    this.highestScoreGoat = null;
    this.idleTime = [0, 0, 0, 0];   // How long each goat has been idle for. Used to determine when to enable AI.
    this.goats = []; // used for storing goats for this round (will be wiped when Round is over)
    this.goatScoresList = { // stores goat scores during particular round (data passed from round to scoreboard scene)
        0: [],          // player 1
        1: [],          // player 2
        2: [],          // player 3
        3: []           // player 4
    };
    this.type = "Round"; // used to overload superclass constructor

    Scene.call(this, this.game, this.background, this.type);
}

Round.prototype = new Scene();
Round.prototype.constructor = Round;

Round.prototype.initAllEntities = function () {
    // 1. Goats list
    this.initGoats();

    // 2. Entities list
    this.entities.push(this.background);
    this.entities.push.apply(this.entities, this.platforms);
    this.entities.push.apply(this.entities, this.goats);

    // 3. Collidables list
    this.collidables.push.apply(this.collidables, this.goats);
    this.collidables.push.apply(this.collidables, this.platforms);

    // 4. Platforms list (initialized in constructor)
};

Round.prototype.initGoats = function () {
    /* === Goats === */
    var playerOneControls = {jump: 87, left: 65, right: 68, attack: 70, run: 16}; // W A D F shift
    var goat1 = new Goat(this.game, 0, playerOneControls, "blue-goat", "blue");
    goat1.initControls();
    goat1.x = 30;
    this.goats.push(goat1);

    var playerTwoControls = {jump: 38, left: 37, right: 39, attack: 191, run: 190}; // ↑ ← → / .
    var goat2 = new Goat(this.game, 1, playerTwoControls, "green-goat", "green");
    goat2.initControls();
    goat2.x = 230;
    goat2.aiEnabled = true;
    this.goats.push(goat2);

    var playerThreeControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    var goat3 = new Goat(this.game, 2, playerThreeControls, "red-goat", "red");
    goat3.initControls();
    goat3.x = 430;
    this.goats.push(goat3);

    var playerFourControls = {jump: 0, left: 0, right: 0, attack: 0, run: 0};
    var goat4 = new Goat(this.game, 3, playerFourControls, "yellow-goat", GOLD_COLOR);
    goat4.initControls();
    goat4.x = 630;
    this.goats.push(goat4);
};

Round.prototype.deleteAllEntities = function () {
    this.goats = [];
    this.platforms = [];
    this.entities = [];
    this.collidables = [];
};

// Checks which goat is the leader and crowns them.
Round.prototype.scoreChecker = function () {
    this.highestScoreGoat = this.goats[0]; //sets a goat as king
    //checks which goat has the highest score
    for (var i = 1, len = this.goats.length; i < len; i++) {
        var goat = this.goats[i];
        if (this.highestScoreGoat.score < goat.score) {
            this.highestScoreGoat = goat;
        }
    }
    //ensures other goats don't have the crown 
    for (var i = 0, len = this.goats.length; i < len; i++) {
        if (this.highestScoreGoat != this.goats[i]) {
            this.goats[i].king = false;
        }
    }
    if (typeof this.highestScoreGoat.score !== 'undefined'
        && typeof this.highestScoreGoat.score !== 'NaN'
        && this.highestScoreGoat.score !== 0) { //Avoids start of game deciding who is king
        this.highestScoreGoat.king = true;
    }
};

//Helper function for the hill
Round.prototype.randomHillGenerator = function () {
    var len = this.platforms.length;
    if (len !== 0) { // there is a hill b/c there is at least 1 platform
        if (this.randomizeHill) { // It's a random hill style
            if (!this.isInTransitionScene) this.randomHillClockTickTracker += this.game.clockTick;
            if (this.randomHillClockTickTracker >= this.randomHillSpeed) {
                console.log("potential for hill change");
                this.randomHillClockTickTracker = 0;
                for (var i = 1; i < len; i++) { // finds the current hill and disables it.
                    if (this.platforms[i].isHill) {
                        this.platforms[i].isHill = false;
                    }
                }
                // ***NOTE: if no platforms in scene, len is 0 so multiplying by zero is BAAAADD !!! :P
                var randomPlatformIndex = Math.floor((Math.random() * len));
                //do not include 0 (ground platform)
                if (randomPlatformIndex !== 0) {
                    this.platforms[randomPlatformIndex].isHill = true; // sets a new platform as the hill
                } else {
                    while (randomPlatformIndex == 0) { // checks to make sure its not the ground platform
                        randomPlatformIndex = Math.floor((Math.random() * len));
                    }
                    this.platforms[randomPlatformIndex].isHill = true; // sets a new platform as the hill
                }
            }
        }
    }
};

Round.prototype.drawScores = function (ctx) {
    for (var i = 0; i < this.goats.length; i++) {
        drawTextWithOutline(ctx, "32px Impact", this.goats[i].score, 75 + 200 * i, 590, 'white', this.goats[i].color);
    }
};

Round.prototype.generateRandomCollectible = function () {
    // Generate powerup every x seconds
    this.powerUpTimer -= this.game.clockTick;
    if (this.powerUpTimer < 0) {
        this.powerUpTimer = POWERUP_INTERVAL;
        var randomX = Math.floor(Math.random() * (this.game.surfaceWidth - 40)); // +40 to avoid spawning off screen
        var randomY = Math.floor(Math.random() * (this.game.surfaceHeight - 100)); // +100 to avoid powerups in ground
        var randomCollectible = Math.floor(Math.random() * (COLLECTIBLES.length));
        this.entities.push(new Collectible(this.game, randomX, randomY, 40, 40, COLLECTIBLES[randomCollectible]));
    }
};

Round.prototype.toString = function () {
    return 'Round ' + (ROUNDS_PLAYED + 1);
};

Round.prototype.drawTimer = function (ctx) {
    var secondsLeft = Math.floor(this.roundTimer / 1);
    if (secondsLeft < 0) secondsLeft = 0;
    if (Math.floor(this.roundTimer / 1) == 0) {
        drawTextWithOutline(ctx, "200px Impact", "TIME!", 180, 300, 'rgba(255, 0, 0, 0.7)', 'white');
    }
    else if (this.roundTimer / 1 < 10) {
        drawTextWithOutline(ctx, "200px Impact", secondsLeft, 350, 300, 'rgba(255, 0, 0, 0.7)', 'white');
    } else {
        drawTextWithOutline(ctx, "50px Impact", secondsLeft, 380, 60, 'black', 'white');
    }
};

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

// performs variable initialization
Round.prototype.startScene = function () {
    this.initAllEntities();
};

// performs cleanup operations
Round.prototype.endScene = function () {
    this.deleteAllEntities();
};

// checks if timer is done to indicate round is over
Round.prototype.isSceneDone = function () {
    return (this.roundTimer / 1 < 0);
};

Round.prototype.reset = function () {
};

Round.prototype.draw = function (ctx) {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }

    this.drawScores(ctx);
    this.drawTimer(ctx);
    drawTextWithOutline(ctx, "32px Impact", "Round #" + (ROUNDS_PLAYED + 1), 650, 40, 'purple', 'white');
    drawTextWithOutline(ctx, "32px Impact", "Oh My Goat!", 20, 40, 'purple', 'white');
};

Round.prototype.update = function () {
    this.roundTimer -= this.game.clockTick;
    this.scoreChecker();
    this.randomHillGenerator();
    this.generateRandomCollectible();

    // Disable Player 2 AI if controller connected. Enable Player 3 & 4 if controller disconnected.
    if (this.goats.length == 4) {
        if (navigator.getGamepads()[1]) this.goats[1].aiEnabled = false; // Disable player 2 AI if controller connected
        if (typeof navigator.getGamepads()[2] === 'undefined') this.goats[2].aiEnabled = true;
        if (typeof navigator.getGamepads()[3] === 'undefined') this.goats[3].aiEnabled = true;
    }

    // Poll for gamepads
    for (var i = 0; i < this.goats.length; i++) {
        var gamepad = navigator.getGamepads()[i];
        if (gamepad) {
            this.goats[i].jumpKey = buttonPressed(gamepad.buttons[0]);
            this.goats[i].leftKey = gamepad.axes[0] < -0.5;
            this.goats[i].rightKey = gamepad.axes[0] > 0.5;
            this.goats[i].attackKey = buttonPressed(gamepad.buttons[7]);
            this.goats[i].runKey = buttonPressed(gamepad.buttons[6]);
        }
    }

    // entity management code from GameEngine
    if (typeof this.entities !== 'undefined') {
        var entitiesCount = this.entities.length;

        // Cycle through the list of entities in GameEngine.
        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            // Only update those not flagged for removal, for optimization
            if (typeof entity !== 'undefined' && !entity.removeFromWorld) entity.update();
        }

        // Removal of flagged entities
        for (var j = this.entities.length - 1; j >= 0; --j) {
            if (this.entities[j].removeFromWorld) this.entities.splice(j, 1);
        }

    }
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/