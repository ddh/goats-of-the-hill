// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Title(gameEngine) {
    this.game = gameEngine;
    this.type = "Title";

    this.roundScene = null;
    this.tutorialScene = null;

    this.next = null;
    this.running = false;
    this.isDone = false;

    this.background = new Background(this.game, ASSET_MANAGER.getAsset("./img/titleScreen.png"), 800, 600)

    this.playGameHitbox = {left: 407, right: 540, top: 307, bottom: 388};
    this.tutorialHitbox = {left: 407, right: 540, top: 407, bottom: 487};

    this.playGameHover = false;
    this.tutorialHover = false;

    // for sparkling king crown animations
    this.crownSparkleAnimation = new Animation(ASSET_MANAGER.getAsset("./img/crown-sparkle.png"), 0, 0, 140, 140, 0.1, 16, true, false);
}

Title.prototype = new Scene();
Title.prototype.constructor = Title;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Title.prototype.reset = function () {

};

Title.prototype.update = function () {
    // Check for mouse/keyboard input
    // game.mouse for hover, game.click for click
    if (this.running) {
        this.playGameHover = false;
        this.tutorialHover = false;

        if (this.game.mouse) {
            if (this.game.mouse.x < this.playGameHitbox.right && this.game.mouse.x > this.playGameHitbox.left &&
                this.game.mouse.y < this.playGameHitbox.bottom && this.game.mouse.y > this.playGameHitbox.top) {

                this.playGameHover = true;
                // console.log("Play Game hovered");
            }

            if (this.game.mouse.x < this.tutorialHitbox.right && this.game.mouse.x > this.tutorialHitbox.left &&
                this.game.mouse.y < this.tutorialHitbox.bottom && this.game.mouse.y > this.tutorialHitbox.top) {

                this.tutorialHover = true;
                // console.log("Tutorial hovered");
            }
        }

        if (this.game.click) {
            if (this.game.click.x < this.playGameHitbox.right && this.game.click.x > this.playGameHitbox.left &&
                this.game.click.y < this.playGameHitbox.bottom && this.game.click.y > this.playGameHitbox.top) {

                this.next = this.roundScene;
                this.isDone = true;
                ;
                // console.log("Play Game clicked");
            }

            if (this.game.click.x < this.tutorialHitbox.right && this.game.click.x > this.tutorialHitbox.left &&
                this.game.click.y < this.tutorialHitbox.bottom && this.game.click.y > this.tutorialHitbox.top) {

                this.next = this.tutorialScene;
                this.isDone = true;
                // console.log("Tutorial clicked");
            }
        }
    }
};

Title.prototype.draw = function (ctx) {
    this.background.draw(ctx);

    // draw buttons
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/platform-small-hay.png"), 400, 300, 147, 92);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/platform-small-hay.png"), 400, 400, 147, 92);

    drawTextWithOutline(ctx, "26px Impact", "Play Game", 420, 355, 'indigo', 'white');
    drawTextWithOutline(ctx, "26px Impact", "Tutorial", 430, 455, 'indigo', 'white');

    if (this.playGameHover) {
        drawRoundedRect(ctx, this.playGameHitbox.left,
            this.playGameHitbox.top,
            this.playGameHitbox.right - this.playGameHitbox.left,
            this.playGameHitbox.bottom - this.playGameHitbox.top,
            25,
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0)");
    }
    if (this.tutorialHover) {
        drawRoundedRect(ctx, this.tutorialHitbox.left,
            this.tutorialHitbox.top,
            this.tutorialHitbox.right - this.tutorialHitbox.left,
            this.tutorialHitbox.bottom - this.tutorialHitbox.top,
            25,
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0)");
    }

    // for drawing crown and associated sparkles
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/regal-crown.png"), 0, 0, 600, 454, 557, 10, 120, 90);
};

// performs variable initialization
Title.prototype.startScene = function () {
    this.running = true;
    this.isDone = false;
};

// performs cleanup operations
Title.prototype.endScene = function () {
    this.isDone = true;
    this.running = false;
};

// checks if user has clicked to play or see tutorial
Title.prototype.isSceneDone = function () {
    return this.isDone;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/