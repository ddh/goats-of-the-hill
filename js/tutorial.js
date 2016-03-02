// Sub-class of Scene
// Tutorial: Background (& text/images drawn on Canvas)

function Tutorial(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Tutorial"; // used to overload superclass constructor

    Scene.call(this, this.game, this.background, this.type);
}

Tutorial.prototype = new Scene();
Tutorial.prototype.constructor = Tutorial;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Tutorial.prototype.reset = function () {

};

Tutorial.prototype.draw = function () {

};

Tutorial.prototype.update = function () {

};

// performs variable initialization
Tutorial.prototype.startScene = function () {
    Scene.prototype.startScene.call(this);
};

// performs cleanup performs
Tutorial.prototype.endScene = function () {
    Scene.prototype.endScene.call(this);
};

// checks if user has clicked to return to title scene
Tutorial.prototype.isSceneDone = function () {
    Scene.prototype.isSceneDone.call(this);
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/