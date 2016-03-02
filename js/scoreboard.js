// Sub-class of Scene
// Scoreboard: Background, (& text/images drawn on Canvas)

function Scoreboard(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Scoreboard"; // used to overload superclass constructor

    this.entities = [];
    this.entities.push(this.background);

    this.highestScore = 0; // to be changed "on the fly" in Round Scene's update() method

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

    if (ROUNDS_PLAYED <= 2) drawPlayButton(ctx);

    var winningGoatString = this.highestScore.playerColor.toUpperCase() + " wins scoring : " + this.highestScore.score;
    drawTextWithOutline(ctx, "45px Impact", winningGoatString, 210, 105, this.highestScore.color, 'white');         // winner #1
    drawTextWithOutline(ctx, "40px Impact", this.goatScores[1].score, 310, 202, this.goatScores[1].color, 'white'); // winner #2
    drawTextWithOutline(ctx, "40px Impact", this.goatScores[2].score, 585, 288, this.goatScores[2].color, 'white'); // winner #3
    drawTextWithOutline(ctx, "40px Impact", this.goatScores[3].score, 220, 368, this.goatScores[3].color, 'white'); // winner #4
};

Scoreboard.prototype.update = function () {
    if (typeof this.entities !== 'undefined') {
        var entitiesCount = this.entities.length;

        // Cycle through the list of entities in Scene.
        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            // Only update those not flagged for removal, for optimization
            if (typeof entity !== 'undefined' && !entity.removeFromWorld) entity.update();
        }

        // Removal of flagged entities
        for (var j = this.entities.length - 1; j >= 0; --j) {
            if (this.entities[j].removeFromWorld) this.entities.splice(j, 1);
        }

    }
};

// performs variable initialization
Scoreboard.prototype.startScene = function () {

};

// performs cleanup operations
Scoreboard.prototype.endScene = function () {

};

// checks if user has clicked to play next round
Scoreboard.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/
