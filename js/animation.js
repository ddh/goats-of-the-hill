// TODO: currently MushroomDude walks off of screen, need to figure out how to programmatically stop him at right edge

var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse; // Marriott's unicorn animation: his spritesheet's frames were in reserve order
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0; // if this is a looping animation, reset timer for next time anim happens
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    if (frame > 13) {
        frame = 26 - frame; // TODO: there were 26 frames in his spritesheet?
    }
    // calculating current frame's x/y coords
    xindex = frame % 5;
    yindex = Math.floor(frame / 5);

    console.log(frame + " " + xindex + " " + yindex);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth,
                 this.frameHeight);
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 0.05, 26, true, false);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
}

MushroomDude.prototype.draw = function () {
//    console.log("drawing");
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};

MushroomDude.prototype.update = function() {
    this.x += 2;
};


AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.png");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/notthere.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

//    var img = AM.getAsset("./img/mushroomdude.png");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));

    console.log("All Done!");
});