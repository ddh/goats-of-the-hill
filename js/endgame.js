// Sub-class of Scene
// EndGame: Background, (& text/images drawn on Canvas)

function EndGame(game, background) {
    this.game = game;
    this.background = background;
    this.type = "EndGame"; // used to overload superclass constructor

    Scene.call(this, this.game, this.background, this.type);
}

EndGame.prototype = new Scene();
EndGame.prototype.constructor = EndGame;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

EndGame.prototype.reset = function () {

};

EndGame.prototype.draw = function () {

};

EndGame.prototype.update = function () {

};

// performs variable initialization
EndGame.prototype.startScene = function () {
    Scene.prototype.startScene.call(this);
};

// performs cleanup performs
EndGame.prototype.endScene = function () {
    Scene.prototype.endScene.call(this);
};

// checks if user has clicked to play game again
EndGame.prototype.isSceneDone = function () {
    Scene.prototype.isSceneDone.call(this);
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/