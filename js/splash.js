// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Splash(gameEngine, delay, background) {
    this.game = gameEngine;
    this.type = "Splash";

    this.next = null;
    this.running = false;
    this.isDone = false;
    this.delay = delay;     // Seconds this screen lasts for

    this.background = background;

}

Splash.prototype = new Scene();
Splash.prototype.constructor = Splash;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Splash.prototype.reset = function () {

};

Splash.prototype.update = function () {

    this.delay -= this.game.clockTick;
    console.log(this.delay);

    if (this.delay < 0 || this.game.anyKeyPressed) {
        this.isDone = true;
        this.game.anyKeyPressed = false;
    }

};

Splash.prototype.draw = function (ctx) {

    // Draw background
    this.background.draw(ctx);

};

// performs variable initialization
Splash.prototype.startScene = function () {
    this.running = true;
    this.isDone = false;
};

// performs cleanup operations
Splash.prototype.endScene = function () {
    this.isDone = true;
    this.running = false;
    if (this.next.type == "Title") bgMusic.play();     // Cue game music!

};

// checks if user has clicked to play or see tutorial
Splash.prototype.isSceneDone = function () {
    return this.isDone;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/