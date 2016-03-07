// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Credits(gameEngine) {
    this.game = gameEngine;
    this.type = "Credits";

    this.roundScene = null;
    this.tutorialScene = null;

    this.next = null;
    this.running = false;
    this.isDone = false;

    this.background = new Background(this.game, ASSET_MANAGER.getAsset("./img/bg-credits.png"), 800, 600)

    this.backButtonHitbox = {left: 20, right: 110, top: 490, bottom: 580};
    this.backButtonHover = false;

    // Goat Animations
    this.blueGoatAnimation = new Animation(ASSET_MANAGER.getAsset('./img/blue-goat-right.png'), 0, 0, 94, 90, 0.1, 4, true, false);
    this.greenGoatAnimation = new Animation(ASSET_MANAGER.getAsset('./img/green-goat-right.png'), 0, 0, 94, 90, 0.1, 4, true, false);
    this.redGoatAnimation = new Animation(ASSET_MANAGER.getAsset('./img/red-goat-right.png'), 0, 0, 94, 90, 0.1, 4, true, false);
    this.yellowGoatAnimation = new Animation(ASSET_MANAGER.getAsset('./img/yellow-goat-right.png'), 0, 0, 94, 90, 0.1, 4, true, false);

}

Credits.prototype = new Scene();
Credits.prototype.constructor = Credits;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Credits.prototype.reset = function () {

};

Credits.prototype.update = function () {
    // Check for mouse/keyboard input
    // game.mouse for hover, game.click for click
    if (this.running) {

        this.backButtonHover = false;

        if (this.game.mouse) {

            if (this.game.mouse.x < this.backButtonHitbox.right && this.game.mouse.x > this.backButtonHitbox.left &&
                this.game.mouse.y < this.backButtonHitbox.bottom && this.game.mouse.y > this.backButtonHitbox.top) {

                this.backButtonHover = true;
            }

            if (this.game.click) {
                if (this.game.click.x < this.backButtonHitbox.right && this.game.click.x > this.backButtonHitbox.left &&
                    this.game.click.y < this.backButtonHitbox.bottom && this.game.click.y > this.backButtonHitbox.top) {

                    this.isDone = true;
                    ;
                }
            }
        }

    }
};

Credits.prototype.draw = function (ctx) {

    // Draw background
    this.background.draw(ctx);

    // For a darker background
    drawRoundedRect(ctx, 0, 0, 800, 600, 0, 'rgba(0, 0, 0, 0.3)', 'rgb(0, 0, 0)');

    // Back button
    ctx.drawImage(ASSET_MANAGER.getAsset('./img/back.png'), 20, 490, 90, 90);

    // Back to Title button
    if (this.backButtonHover) {
        drawRoundedRect(ctx, this.backButtonHitbox.left,
            this.backButtonHitbox.top,
            this.backButtonHitbox.right - this.backButtonHitbox.left,
            this.backButtonHitbox.bottom - this.backButtonHitbox.top,
            50,
            'rgba(255, 255, 255, 0.4)',
            'rgba(255, 255, 255, 0)');
    }

    // Draw goats
    this.blueGoatAnimation.drawFrame(this.game.clockTick, ctx, 200, 150, 1);
    this.greenGoatAnimation.drawFrame(this.game.clockTick, ctx, 200, 250, 1);
    this.redGoatAnimation.drawFrame(this.game.clockTick, ctx, 200, 350, 1);
    this.yellowGoatAnimation.drawFrame(this.game.clockTick, ctx, 200, 450, 1);

    // Draw developer names
    drawTextWithOutline(ctx, '32px Impact', 'Duy Huynh', 320, 210, 'blue', 'white', 5);
    drawTextWithOutline(ctx, '32px Impact', 'Such Kamal', 320, 310, 'green', 'white', 5);
    drawTextWithOutline(ctx, '32px Impact', 'Jasmine Pedersen', 320, 410, 'red', 'white', 5);
    drawTextWithOutline(ctx, '32px Impact', 'Reid Thompson', 320, 510, GOLD_COLOR, 'white', 5);


    // Credits
    drawTextWithOutline(ctx, '48px Impact', 'Red Three Team', 240, 120, 'red', 'white', 5);


};

// performs variable initialization
Credits.prototype.startScene = function () {
    this.running = true;
    this.isDone = false;
};

// performs cleanup operations
Credits.prototype.endScene = function () {
    this.isDone = true;
    this.running = false;
};

// checks if user has clicked to play or see tutorial
Credits.prototype.isSceneDone = function () {
    return this.isDone;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/