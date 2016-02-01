function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

function Goat(game) {

    // Game physics:
    this.ground = 650; // changed value from 400
    this.x = 0;
    this.y = 0;
    this.lastY = this.y; // TODO: to be used for animation drawing calculations when jumping btwn platforms
    this.velocity = { x: 0, y: 0 };

    // TODO: initialize animation field(s) - SORTA-DONE(duy)
    // TODO: important to note that the last param for the Animation constructor is a reverse boolean
    // Animations:
    this.standAnimation             = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.idleAnimation              = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    this.jumpLeftAscendAnimation    = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.jumpRightAscendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.jumpLeftDescendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.jumpRightDescendAnimation  = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.landLeftAnimation          = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.landRightAnimation         = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    this.runLeftAnimation           = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.runRightAnimation          = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    this.chargingLeftAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.chargingRightAnimation     = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.attackLeftAnimation        = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.attackRightAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.stunnedLeftAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.stunnedRightAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    // TODO: initialize boolean flags for all possible states of Goat - DONE(duy)
    // Action states
    this.standing   = true;
    this.idle       = false;
    this.jumping    = false;
    this.falling    = false;
    this.running    = false;
    this.charging   = false;
    this.attacking  = false;
    this.stunned    = false;
    this.dead       = false; // TODO: want to add this now for later??

    // Game engine stuff:
    this.game = game;
    this.ctx = game.ctx;

    this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);

    // TODO: figure out this value later!
    this.jumpHeight = 200;

    // TODO: add anymore boolean flags needed for debugging
    this.drawBoundingBoxes = false; // used to draw bounding boxes around goat as it goes thru its different animations

    Entity.call(this, game, 0, 650); // changed value from 400
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.reset = function () {
    this.standing   = true;
    this.idle       = false;
    this.jumping    = false;
    this.falling    = false;
    this.running    = false;
    this.charging   = false;
    this.attacking  = false;
    this.stunned    = false;
    this.dead       = false;

    this.x = 0;
    this.y = 0;

    this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);
};

Goat.prototype.update = function () {

    //// Jumping:
    //if (this.game.space) this.jumping = true;
    //
    //// If goat is set to jump:
    //if (this.jumping) {
    //
    //    // If goat is finished jumping:
    //    if (this.jumpAnimation.isDone()) {
    //        // Reset jump animation timer
    //        this.jumpAnimation.elapsedTime = 0;
    //        // Reset 'jump' state.
    //        this.jumping = false;
    //
    //    }
    //    var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
    //    var totalHeight = 100;
    //
    //    if (jumpDistance > 0.5)
    //        jumpDistance = 1 - jumpDistance;
    //
    //    //var height = jumpDistance * 2 * totalHeight;
    //    var height = totalHeight * (-2 * (jumpDistance * jumpDistance - jumpDistance));
    //    this.y = this.ground - height;
    //}
    //
    //// Running right and left:
    //this.game.right || this.game.left ? this.running = true : this.running = false;
    //
    //
    //// Running and boundary collisions:
    //if (this.running) {
    //    if (this.game.right && this.x < this.game.surfaceWidth - this.width) this.x += this.speed;
    //    if (this.game.left && this.x > 0) this.x -= this.speed;
    //}
    Entity.prototype.update.call(this);
};

// TODO: integrate boxes boolean flag here to draw boundingboxes for debugging different animations
Goat.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpLeftAscendAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else if (this.running) {
        if (this.game.right) this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        if (this.game.left) this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
        this.standAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};
