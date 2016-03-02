// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Title(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Title"; // used to overload superclass constructor

    Scene.call(this, this.game, this.background, this.type);
}

Title.prototype = new Scene();
Title.prototype.constructor = Title;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Title.prototype.reset = function () {

};

Title.prototype.draw = function () {

};

Title.prototype.update = function () {

};

// performs variable initialization
Title.prototype.startScene = function () {
    Scene.prototype.startScene.call(this);
};

// performs cleanup performs
Title.prototype.endScene = function () {
    Scene.prototype.endScene.call(this);
};

// checks if user has clicked to play or see tutorial
Title.prototype.isSceneDone = function () {
    Scene.prototype.isSceneDone.call(this);
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/