// Sub-class of Scene
// Scoreboard: Background, (& text/images drawn on Canvas)

function Scoreboard(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Scoreboard"; // used to overload superclass constructor
    this.entities = [];

    this.highestScoreGoat = null; // to be changed "on the fly" in Round SceneManager's update() method
    this.goats = [];
    this.goatScoresList = {
        0: [],          // player 1
        1: [],          // player 2
        2: [],          // player 3
        3: []           // player 4
    };

    Scene.call(this, this.game, this.background, this.type);
}

Scoreboard.prototype = new Scene();
Scoreboard.prototype.constructor = Scoreboard;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Scoreboard.prototype.reset = function () {

};

Scoreboard.prototype.draw = function (ctx) {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }

    // Draw text labels; does a blinking text effect
    if (Math.floor(this.game.timer.gameTime % 2) == 0) {
        if (ROUNDS_PLAYED <= 2) { // TODO: This is a hard-coded value; find a way to calculate total #rounds
            drawPlayButton(ctx);
        } else {
            drawTextWithOutline(ctx, "40px Impact", "Press ↵ENTER for Final Results!", 160, 500, "purple", "white");
        }
    }


    var winningGoatString = this.highestScoreGoat.playerColor.toUpperCase() + " wins scoring : " + this.highestScoreGoat.score;
    drawTextWithOutline(ctx, "45px Impact", winningGoatString, 270, 105, this.highestScoreGoat.color, 'white');         // winner #1
    drawTextWithOutline(ctx, "40px Impact", this.goats[1].score, 310, 202, this.goats[1].color, 'white'); // winner #2
    drawTextWithOutline(ctx, "40px Impact", this.goats[2].score, 585, 288, this.goats[2].color, 'white'); // winner #3
    drawTextWithOutline(ctx, "40px Impact", this.goats[3].score, 220, 368, this.goats[3].color, 'white'); // winner #4
};

Scoreboard.prototype.update = function () {};

// performs variable initialization
Scoreboard.prototype.startScene = function () {
    this.entities.push(this.background);
};

// performs cleanup operations
Scoreboard.prototype.endScene = function () {

};

// checks if user has clicked to play next round
Scoreboard.prototype.isSceneDone = function () {
    return this.game.continueKeyPressed;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/
