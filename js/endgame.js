// Sub-class of Scene
// EndGame: Background, (& text/images drawn on Canvas)

function EndGame(game, background) {
    this.game = game;
    this.background = background;
    this.type = "EndGame"; // used to overload superclass constructor

    this.entities = [];
    this.entities.push(this.background);

    Scene.call(this, this.game, this.background, this.type);
}

EndGame.prototype = new Scene();
EndGame.prototype.constructor = EndGame;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

EndGame.prototype.reset = function () {

};

EndGame.prototype.draw = function (ctx) {
    // 1. Clear the window (Removes previously drawn things from canvas)
    this.game.ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);

    // 2. Save (What are we saving exactly here?)
    this.game.ctx.save();

    // 3. Draw each entity onto canvas
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(this.game.ctx);

    }

    // 4. Restore previous state
    this.game.ctx.restore();
};

EndGame.prototype.update = function () {

};

// performs variable initialization
EndGame.prototype.startScene = function () {

};

// performs cleanup operations
EndGame.prototype.endScene = function () {

};

// checks if user has clicked to play game again
EndGame.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/