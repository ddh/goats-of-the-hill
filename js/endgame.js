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

// TODO: get goats' colors from scene manager or round 3's scoreboard for writing stats
EndGame.prototype.draw = function (ctx) {
    // draws background and platforms
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }

    // draw text
    drawTextWithOutline(ctx, "48pt Impact", "And the Winner is...", 150, 100, 'purple', 'white');
    drawTextWithOutline(ctx, "24pt Impact", "Play Oh My Goat Again?", 250, 550, 'purple', 'white');
};

EndGame.prototype.update = function () {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].update();
    }
};

// performs variable initialization
EndGame.prototype.startScene = function () {
    // background
    this.entities.push(this.background);

    // platforms
    var pf1 = new Platform(this.game, 'm', 120, 400, 'endgame', 'hay');
    pf1.ranking = 3; // for 3rd place
    this.entities.push(pf1);
    var pf2 = new Platform(this.game, 'm', 320, 400, 'endgame', 'hay');
    pf2.ranking = 1; // for 1st place
    this.entities.push(pf2);
    var pf3 = new Platform(this.game, 'm', 520, 400, 'endgame', 'hay');
    pf3.ranking = 2; // for 2nd place
    this.entities.push(pf3);
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