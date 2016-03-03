// Sub-class of Scene
// EndGame: Background, (& text/images drawn on Canvas)

function EndGame(game, background) {
    this.game = game;
    this.background = background;
    this.type = "EndGame"; // used to overload superclass constructor

    this.entities = [];

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
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }
    drawTextWithOutline(ctx, "48pt Impact", "Game Stats From Rounds", 250, 50, 'purple', 'white');
    drawTextWithOutline(ctx, "24pt Impact", "Play Oh My Goat Again?", 250, 460, 'purple', 'white');
};

EndGame.prototype.update = function () {};

// performs variable initialization
EndGame.prototype.startScene = function () {
    this.entities.push(this.background);
};

// performs cleanup operations
EndGame.prototype.endScene = function () {
    this.entities = [];
};

// checks if user has clicked to play game again
EndGame.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/