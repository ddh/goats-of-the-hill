/*
 * Sub-classes of Scene include Title, Tutorial, Round, Scoreboard, EndGame
 *
 * Title: Background (& text/images drawn on Canvas)
 * Tutorial: Background (& text/images drawn on Canvas)
 * Round: Background, Platforms, Goats, (& text/images drawn on Canvas)
 * Scoreboard: Background, (& text/images drawn on Canvas)
 * EndGame: Background, (& text/images drawn on Canvas)
 * TODO: add in Esc/Pause screen (has Objective, Controls, Description of powerups) ??? <-- let's do this later...
 */

function Scene(game, background, type) {
    this.game = game;
    this.background = background;
    this.next = null; // field to be set in main ("on the fly")
    this.type = type;
}

Scene.prototype = new Entity();
Scene.prototype.constructor = Scene;

Scene.prototype.toString = function () {
    return "Scene";
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

var drawPlayButton = function (ctx) {
    var btnX = 320, btnY = 300;
    if (ROUNDS_PLAYED === 0) {
        drawTextWithOutline(ctx, "24pt Impact", "Click to play!", btnX, btnY + 120, "purple", "white");
    } else {
        drawTextWithOutline(ctx, "24pt Impact", "Play again?", btnX + 10, btnY + 160, 'purple', 'white');
    }
};

/***********************************************
 *          START OF SCENE 'INTERFACE'         *
 ***********************************************/

Scene.prototype.startScene = function () {};

Scene.prototype.endScene = function () {};

Scene.prototype.isSceneDone = function () {};

Scene.prototype.update = function () {};

Scene.prototype.draw = function (ctx) {};

Scene.prototype.reset = function () {};

/***********************************************
 *           END OF SCENE 'INTERFACE'          *
 ***********************************************/

/*
 * The Scene Manager handles loading scene assets into the game engine and transitions between scenes.
 */

// Class constants:
var ROUNDS_PLAYED = 0;

function SceneManager(game, currentScene) {
    this.game = game;
    this.currentScene = currentScene; // TODO: all Scenes for game stored in linkedlist attached to this head pointer
    this.goatScoresList = { // serves as temp storage for goat scores between rounds (data passed from scene to scene)
        0: [],          // player 1
        1: [],          // player 2
        2: [],          // player 3
        3: []           // player 4
    };
    this.highestScoreGoat = null;
    this.goats = []; // serves as temp storage for goat from last round (to be sorted)
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.update = function() {
    // check if Scene is done, then start transition to next Scene
    if (this.currentScene.isSceneDone()) {
        if (this.currentScene.type === "Title") {

        }
        if (this.currentScene.type === "Round") {
            this.storeScoresFromLastRound();
            ROUNDS_PLAYED++;
        }
        this.currentScene.endScene();
        // TODO: reassignment of current scene!!!
        this.currentScene = this.currentScene.next;
        if (this.currentScene.type === "Scoreboard") { // TODO: handle logic for EndGame later...
            this.passAlongLastRoundsScores();
        }
        if (this.currentScene.type === "Title") {
            // TODO: toggle these prints to see end game stats in console
            for (var i = 0; i < 4; i++) {
                var total = 0;
                var str = "player " + (i+1) + "'s scores are: ";
                for (var j = 0; j < this.goatScoresList[i].length; j++) {
                    var currScore = this.goatScoresList[i][j];
                    total += currScore;
                    str += currScore + ", ";
                }
                str += "with a total of " + total;
                console.log(str);
            }

            ROUNDS_PLAYED = 0;
            this.goatScoresList = { // serves as temp storage for goat scores between rounds (data passed from scene to scene)
                0: [],          // player 1
                1: [],          // player 2
                2: [],          // player 3
                3: []           // player 4
            };
            this.highestScoreGoat = null;
            this.goats = []; // serves as temp storage for goat from last round (to be sorted)
            this.reinitRoundsAndLinks();
        }
        this.currentScene.startScene();
    } else { // else, if Scene not done, continue updating current Scene
        if (this.currentScene.running === false) {
            this.currentScene.startScene();
        }
        this.currentScene.update();
    }
};

// this.currentScene is Round
SceneManager.prototype.storeScoresFromLastRound = function () {
    // keeps track of goat with highest score from last round
    this.highestScoreGoat = this.currentScene.highestScoreGoat;

    // handles aggregating scores from prev rounds
    for (var i = 0, len = this.currentScene.goats.length; i < len; i++) {
        this.goatScoresList[i].push(this.currentScene.goats[i].score);
    }
    // handles indvl goat scores
    this.goats = this.currentScene.goats;
    this.goats.sort(function (a, b) {
        return b.score - a.score;
    });
};

// this.currentScene is Scoreboard
SceneManager.prototype.passAlongLastRoundsScores = function () {
    this.currentScene.highestScoreGoat = this.highestScoreGoat;
    this.currentScene.goats = this.goats;
    this.currentScene.goatScoresList = this.goatScoresList;
};

// TODO: once main's linkedlist control flow is finalized, this will need to change too!
SceneManager.prototype.reinitRoundsAndLinks = function () {
    // 1. Create all Scenes necessary for game
    // ---
    var r1 = createFirstRound(this.game); // first round
    var sb1 = new Scoreboard(this.game, new Background(this.game, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var r2 = createSecondRound(this.game); // second round
    var sb2 = new Scoreboard(this.game, new Background(this.game, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));
    var r3 = createThirdRound(this.game); // third round
    var sb3 = new Scoreboard(this.game, new Background(this.game, ASSET_MANAGER.getAsset("./img/scoreBoard.png"), CANVAS_WIDTH, CANVAS_HEIGHT));

    // 2. Link up all Scenes in correct sequence before returning SceneManager with a reference to the title Scene
    // ---
    this.currentScene.roundScene = r1;   // TODO: link will change once Tutorial Scene added
    this.currentScene.tutorialScene = this.currentScene; // COMPLETE WHEN TUTORIAL SCENE IS DONE
    r1.next = sb1;
    sb1.next = r2;
    r2.next = sb2;
    sb2.next = r3;
    r3.next = sb3;
    sb3.next = this.currentScene; // this.currentScene is Title
};

SceneManager.prototype.draw = function(ctx) {
    this.currentScene.draw(ctx);
};

SceneManager.prototype.reset = function () {
    this.currentScene.reset();
};

SceneManager.prototype.toString = function() {
    return "SceneManager";
};
