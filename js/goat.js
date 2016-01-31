function Goat(game) {
    // TODO: initialize animation field(s)
    this.jumping = false;
    //this.radius = 100;
    this.ground = 650; // changed value from 400
    this.x = 0;
    this.y = 0;
    // TODO: add hardcoded values for width and height of one of the Goat's animations
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 650); // changed value from 400
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        // TODO: change 'var height' code below to correct impl from wed lecture!
        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this); // TODO: call is built-in method of JavaScript ??
};

Goat.prototype.draw = function (ctx) {
    if (this.jumping) {
        // TODO: meaning of magic numbers?
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this); // TODO: call is built-in method of JavaScript ??
};
