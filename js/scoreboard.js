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
    this.mutedHitBox = {left: 750, right: 800, top: 550, bottom: 600};

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
            ctx.drawImage(ASSET_MANAGER.getAsset("./img/Keyboard_White_Enter.png"), 260, 460, 50, 50);
            drawTextWithOutline(ctx, "40px Impact", "Press          for Final Results!", 160, 500, "purple", "white");
        }
    }


    var winningGoatString = this.highestScoreGoat.playerColor.toUpperCase() + " wins scoring : " + this.highestScoreGoat.score;
    drawTextWithOutline(ctx, "45px Impact", winningGoatString, 270, 105, this.highestScoreGoat.color, 'white');         // winner #1
    drawTextWithOutline(ctx, "40px Impact", this.goats[1].score, 310, 202, this.goats[1].color, 'white'); // winner #2
    drawTextWithOutline(ctx, "40px Impact", this.goats[2].score, 585, 288, this.goats[2].color, 'white'); // winner #3
    drawTextWithOutline(ctx, "40px Impact", this.goats[3].score, 220, 368, this.goats[3].color, 'white'); // winner #4

    if (MUTED) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/volume-muted-icon.png"), 0, 0, 1024, 1024, 750, 550, 50, 50);
    } else {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/volume-on-icon.png"), 0, 0, 2000, 2000, 750, 550, 50, 50);
    }
};

Scoreboard.prototype.update = function () {
    // handles muting and unmuting
    if (this.game.click) {
        if (this.game.click.x < this.mutedHitBox.right && this.game.click.x > this.mutedHitBox.left &&
            this.game.click.y < this.mutedHitBox.bottom && this.game.click.y > this.mutedHitBox.top) {

            MUTED ^= true; // toggle muted bool
            // console.log("Volume/mute button clicked.");
        }
    }
    if (MUTED) {
        bgMusic.mute();
        announcerSFX.mute();
        goatSFX.mute();
        collectibleSFX.mute();
    } else {
        bgMusic.unmute();
        announcerSFX.unmute();
        goatSFX.unmute();
        collectibleSFX.unmute();
    }
};

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
