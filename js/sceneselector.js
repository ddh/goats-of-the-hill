function Scene(platforms, background) {
    this.platforms = platforms;
    this.background = background;
}

Scene.prototype = new Entity();
Scene.prototype.constructor = Scene;

Scene.prototype.draw = function() {};

Scene.prototype.update = function() {};

Scene.prototype.toString = function() {
    return "Scene";
};

/*
 * The Scene 'Selector' actually manages loading scene assets into the game engine and transitions between scenes.
 */

// Class constants:
var POWERUP_INTERVAL = 10;  // Every x sec a powerup spawns
var ROUNDS_PLAYED = 0;
var COLLECTIBLES = ['speedUp', 'doubleJump', 'highJump', 'maxCharge', 'attackUp', 'invincibility'];
//var COLLECTIBLES = ['invincibility']; //TODO: Using this as a means to test a powerup individually. Just comment out the above.

function SceneSelector(scenes) {
    this.scenes = scenes;
    this.currentSceneIdx = 0;
    this.goatScores = { // serves as temp storage for goat scores between rounds (data passed from scene to scene)
        1: [], // player 1
        2: [], // player 2
        3: [], // player 3
        4: []  // player 4
    };
}

SceneSelector.prototype = new Entity();
SceneSelector.prototype.constructor = SceneSelector;

SceneSelector.prototype.addScene = function(scene) {
    this.scenes.push(scene);
};

SceneSelector.prototype.getNextScene = function() {
    return this.scenes[++this.currentSceneIdx];
};

SceneSelector.prototype.draw = function() {};

SceneSelector.prototype.update = function() {
    // TODO: check if Scene is done, then start transition to next Scene
};

SceneSelector.prototype.toString = function() {
    return "SceneSelector";
};
