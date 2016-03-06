// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

var TIMER_TO_APPEAR = 1;

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

    this.goats = [
        {
            playerColor: "blue",
            color: "blue",
            x: 10,
            y: 500,
            width: 94,
            height: 90,
            velocity: {x: 3, y: 0},
            timeBeforeDrawn: 0,
            drawMe: false,
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-right.png"), 376, 0, 94, 90, 0.075, 4, true, false)
        },
        {
            playerColor: "green",
            color: "green",
            x: 10,
            y: 500,
            width: 94,
            height: 90,
            velocity: {x: 3, y: 0},
            timeBeforeDrawn: 0,
            drawMe: false,
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/green-goat-right.png"), 376, 0, 94, 90, 0.075, 4, true, false)
        },
        {
            playerColor: "red",
            color: "red",
            x: 10,
            y: 500,
            width: 94,
            height: 90,
            velocity: {x: 3, y: 0},
            timeBeforeDrawn: 0,
            drawMe: false,
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/red-goat-right.png"), 376, 0, 94, 90, 0.075, 4, true, false)
        },
        {
            playerColor: "yellow",
            color: "rgb(255, 215, 0)",
            x: 10,
            y: 500,
            width: 94,
            height: 90,
            velocity: {x: 3, y: 0},
            timeBeforeDrawn: 0,
            drawMe: false,
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/yellow-goat-right.png"), 376, 0, 94, 90, 0.075, 4, true, false)
        }
    ];
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
                // console.log("Play Game clicked");
            }

            if (this.game.click.x < this.tutorialHitbox.right && this.game.click.x > this.tutorialHitbox.left &&
                this.game.click.y < this.tutorialHitbox.bottom && this.game.click.y > this.tutorialHitbox.top) {

                this.next = this.tutorialScene;
                this.isDone = true;
                // console.log("Tutorial clicked");
            }
        }

        // for animating goats walking along the bottom
        for (var i = 0, len = this.goats.length; i < len; i++) {
            var goat = this.goats[i];
            goat.timeBeforeDrawn += this.game.clockTick;
            if ((goat.timeBeforeDrawn >= (TIMER_TO_APPEAR * i)) && goat.x <= 700) goat.drawMe = true;
            if (goat.drawMe) goat.x += goat.velocity.x;
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

    // for drawing animated goats at bottom
    for (var i = 0, len = this.goats.length; i < len; i++) {
        var goat = this.goats[i];
        if (goat.drawMe) goat.rightAnim.drawFrame(this.game.clockTick, ctx, goat.x, goat.y, 1);
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