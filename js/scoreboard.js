// Sub-class of Scene
// Scoreboard: Background, (& text/images drawn on Canvas)

function Scoreboard(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Scoreboard"; // used to overload superclass constructor

    Scene.call(this, this.game, this.background, this.type);
}

Scoreboard.prototype = new Scene();
Scoreboard.prototype.constructor = Scoreboard;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Scoreboard.prototype.reset = function () {

};

Scoreboard.prototype.draw = function () {

};

Scoreboard.prototype.update = function () {

};

// performs variable initialization
Scoreboard.prototype.startScene = function () {
    Scene.prototype.startScene.call(this);
};

// performs cleanup performs
Scoreboard.prototype.endScene = function () {
    Scene.prototype.endScene.call(this);
};

// checks if user has clicked to play next round
Scoreboard.prototype.isSceneDone = function () {
    Scene.prototype.isSceneDone.call(this);
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/
