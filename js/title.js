// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Title(gameEngine) {
    this.game = gameEngine;
    this.type = "Title";

    this.roundScene = null;
    this.tutorialScene = null;
    this.creditsScene = null;

    this.next = null;
    this.running = false;
    this.isDone = false;

    this.background = new Background(this.game, ASSET_MANAGER.getAsset("./img/titleScreen.png"), 800, 600);

    this.playGameHitbox = {left: 407, right: 540, top: 307, bottom: 388};
    this.tutorialHitbox = {left: 407, right: 540, top: 407, bottom: 488};
    this.creditsHitbox = {left: 407, right: 540, top: 507, bottom: 588};

    this.playGameHover = false;
    this.tutorialHover = false;
    this.creditsHover = false;

    Scene.call(this, this.game, this.background, this.type);
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
        this.creditsHover = false;

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

            if (this.game.mouse.x < this.creditsHitbox.right && this.game.mouse.x > this.creditsHitbox.left &&
                this.game.mouse.y < this.creditsHitbox.bottom && this.game.mouse.y > this.creditsHitbox.top) {

                this.creditsHover = true;
                // console.log("Credits hovered");
            }
        }

        if (this.game.click) {
            if (this.game.click.x < this.playGameHitbox.right && this.game.click.x > this.playGameHitbox.left &&
                this.game.click.y < this.playGameHitbox.bottom && this.game.click.y > this.playGameHitbox.top) {

                this.next = this.roundScene;
                this.isDone = true;
                // console.log("Play Game clicked");
            }

            if (this.game.click.x < this.tutorialHitbox.right && this.game.click.x > this.tutorialHitbox.left &&
                this.game.click.y < this.tutorialHitbox.bottom && this.game.click.y > this.tutorialHitbox.top) {

                this.next = this.tutorialScene;
                this.isDone = true;
                // console.log("Tutorial clicked");
            }

            if (this.game.click.x < this.creditsHitbox.right && this.game.click.x > this.creditsHitbox.left &&
                this.game.click.y < this.creditsHitbox.bottom && this.game.click.y > this.creditsHitbox.top) {

                this.next = this.creditsScene;
                this.isDone = true;
                // console.log("Credits clicked");
            }
        }
    }
};

Title.prototype.draw = function (ctx) {
    this.background.draw(ctx);

    // draw buttons
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/platform-small-hay.png"), 400, 300, 147, 92);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/platform-small-hay.png"), 400, 400, 147, 92);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/platform-small-hay.png"), 400, 500, 147, 92);
    drawTextWithOutline(ctx, "26px Impact", "Play Game", 420, 355, 'indigo', 'white');
    drawTextWithOutline(ctx, "26px Impact", "Tutorial", 430, 455, 'indigo', 'white');
    drawTextWithOutline(ctx, "26px Impact", "Credits", 430, 555, 'indigo', 'white');

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
    if (this.creditsHover) {
        drawRoundedRect(ctx, this.creditsHitbox.left,
            this.creditsHitbox.top,
            this.creditsHitbox.right - this.creditsHitbox.left,
            this.creditsHitbox.bottom - this.creditsHitbox.top,
            25,
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0)");
    }
    if (MUTED) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/volume-muted-icon.png"), 0, 0, 1024, 1024, 750, 550, 50, 50);
    } else {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/volume-on-icon.png"), 0, 0, 2000, 2000, 750, 550, 50, 50);
    }
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