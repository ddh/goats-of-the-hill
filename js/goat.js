function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

function Goat(game) {
    // TODO: initialize animation field(s)
    // TODO: initialize boolean flags for all possible states of Goat

    this.ground = 650; // changed value from 400
    this.x = 0;
    this.y = 0;

    // TODO: add correct values for width and height of Goat's default state animation
    this.width = 0;
    this.height = 0;

    this.game = game;
    this.ctx = game.ctx;

    this.velocity = { x: 0, y: 0 };

    Entity.call(this, game, 0, 650); // changed value from 400
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.setBoundingCircle = function (circle) {
    this.circle = circle;
};

Goat.prototype.update = function () {
    // TODO: anytime the goat changes animations, we must update its Circle's x, y, and radius fields

    // TODO: add code given boolean flags about managing Goat's internal state for drawing animations (see below...)

    /*
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5) jumpDistance = 1 - jumpDistance;

        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    */

    Entity.prototype.update.call(this);
};

Goat.prototype.draw = function (ctx) {
    // TODO: add a drawFrame() call with clock tick, ctx param, x, and y (perhaps using boolean flags set in constructor)
    Entity.prototype.draw.call(this);
};
