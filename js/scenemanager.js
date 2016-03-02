/*
 * Sub-classes of Scene include Title, Tutorial, Round, Scoreboard, EndGame
 *
 * Title: Background (& text/images drawn on Canvas)
 * Tutorial: Background (& text/images drawn on Canvas)
 * Round: Background, Platforms, Goats, (& text/images drawn on Canvas)
 * Scoreboard: Background, (& text/images drawn on Canvas)
 * EndGame: Background, (& text/images drawn on Canvas)
 * TODO: add in Esc/Pause screen (has Objective, Controls, Description of powerups) ???
 */

function Scene(game, background, nextScene) {
    //this.platforms = platforms;
    this.game = game;
    this.background = background;
    this.next = nextScene;
}

Scene.prototype = new Entity();
Scene.prototype.constructor = Scene;

// the Scene superclass is only responsible for drawing its Background (NEEDS TO BE AT TOP OF EVERY SUB-CLASSES' DRAW METHOD)
Scene.prototype.draw = function (ctx) {
    this.background.draw(ctx);
};

Scene.prototype.toString = function () {
    return "Scene";
};

Scene.prototype.nextScene = function () {
    return this.next;
};

/***********************************************
 *          START OF SCENE 'INTERFACE'         *
 ***********************************************/

// performs variable initialization
Scene.prototype.startScene = function () {};

// performs cleanup performs
Scene.prototype.endScene = function () {};

// for Round, checks if timer is completed
// for all others, checks if click has been detected
Scene.prototype.isSceneDone = function () {};

// this alteration of state logic happens in subclass
Scene.prototype.update = function () {};

/***********************************************
 *           END OF SCENE 'INTERFACE'          *
 ***********************************************/

/*
 * The Scene Manager handles loading scene assets into the game engine and transitions between scenes.
 */

// Class constants:
var POWERUP_INTERVAL = 10;  // Every x sec a powerup spawns
var ROUNDS_PLAYED = 0;
var COLLECTIBLES = ['speedUp', 'doubleJump', 'highJump', 'maxCharge', 'attackUp', 'invincibility'];
//var COLLECTIBLES = ['invincibility']; //TODO: Using this as a means to test a powerup individually. Just comment out the above.

function SceneManager(scenes) {
    this.scenes = scenes;
    this.currentScene = null;
    this.goatScores = { // serves as temp storage for goat scores between rounds (data passed from scene to scene)
        1: [],          // player 1
        2: [],          // player 2
        3: [],          // player 3
        4: []           // player 4
    };
    this.currentScene = null;
}

SceneManager.prototype = new Entity();
SceneManager.prototype.constructor = SceneManager;

SceneManager.prototype.getNextScene = function() {
    return this.currentScene.next;
};

SceneManager.prototype.update = function() {
    // TODO: check if Scene is done, then start transition to next Scene
};

SceneManager.prototype.draw = function() {};

SceneManager.prototype.toString = function() {
    return "SceneManager";
};
