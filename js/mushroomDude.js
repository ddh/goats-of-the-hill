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