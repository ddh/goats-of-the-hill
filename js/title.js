// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Title(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Title"; // used to overload superclass constructor

    this.entities = [];
    this.entities.push(this.background);

    Scene.call(this, this.game, this.background, this.type);
}

Title.prototype = new Scene();
Title.prototype.constructor = Title;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Title.prototype.reset = function () {

};

Title.prototype.draw = function (ctx) {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }

    drawPlayButton(ctx);
};

Title.prototype.update = function () {};

// performs variable initialization
Title.prototype.startScene = function () {

};

// performs cleanup operations
Title.prototype.endScene = function () {

};

// checks if user has clicked to play or see tutorial
Title.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/