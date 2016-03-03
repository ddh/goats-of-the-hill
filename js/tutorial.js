// Sub-class of Scene
// Tutorial: Background (& text/images drawn on Canvas)

function Tutorial(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Tutorial"; // used to overload superclass constructor

    this.entities = [];
    this.entities.push(this.background);

    Scene.call(this, this.game, this.background, this.type);
}

Tutorial.prototype = new Scene();
Tutorial.prototype.constructor = Tutorial;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Tutorial.prototype.reset = function () {

};

Tutorial.prototype.draw = function (ctx) {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }
};

Tutorial.prototype.update = function () {};

// performs variable initialization
Tutorial.prototype.startScene = function () {

};

// performs cleanup operations
Tutorial.prototype.endScene = function () {

};

// checks if user has clicked to return to title scene
Tutorial.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/