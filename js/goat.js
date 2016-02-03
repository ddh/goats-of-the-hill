function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

function Goat(game) {

    // Game physics:
    this.ground = 600 - 60; // changed value from 400
    this.x = 0;
    this.y = this.ground;
    this.width = 50;
    this.height = 50;
    this.lastY = this.y; // TODO: to be used for animation drawing calculations when jumping btwn platforms
    this.velocity = {x: 0, y: 0};
    this.speed = 5;
    this.jumpHeight = 200;

    // Animations:
    this.standAnimation                 = new Animation(ASSET_MANAGER.getAsset("./img/spaz_frames.png"), 0, 0, 56, 52, 0.1, 6, true, false);
    //this.idleAnimation              = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //
    this.jumpLeftAscendAnimation        = new Animation(ASSET_MANAGER.getAsset("./img/spaz_frames.png"), 3920, 0, 56, 52, 0.05, 17, false, false);
    //this.jumpRightAscendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.jumpLeftDescendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.jumpRightDescendAnimation  = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.landLeftAnimation          = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.landRightAnimation         = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //
    this.runLeftAnimation               = new Animation(ASSET_MANAGER.getAsset("./img/spaz_frames.png"), 1904, 0, 56, 52, 0.1, 8, true, false);
    this.runRightAnimation              = new Animation(ASSET_MANAGER.getAsset("./img/spaz_frames.png"), 1456, 0, 56, 52, 0.1, 8, true, false);
    //
    //this.chargingLeftAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.chargingRightAnimation     = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.attackLeftAnimation        = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.attackRightAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.stunnedLeftAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.stunnedRightAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    // Action states
    this.standing   = true;
    this.idle       = false;
    this.jumping    = false;
    this.falling    = false;
    this.running    = false;
    this.charging   = false;
    this.attacking  = false;
    this.stunned    = false;

    this.boundingBox = new BoundingBox(this.x + 25, this.y, this.standAnimation.frameWidth - 40, this.standAnimation.frameHeight - 20);

    // Game engine stuff:
    //this.game = game;
    //this.ctx = game.ctx;

    Entity.call(this, game, 0, this.ground);
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

    this.x = 0;
    this.y = 0;

    this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);
};

Goat.prototype.update = function () {

    // Jumping:
    if (this.game.space) {
        this.jumping = true;
        console.log("Jumped");
    }

    if (this.jumping) {

        if (this.jumpLeftAscendAnimation.isDone()) {
            // Reset jump animation timer
            this.jumpLeftAscendAnimation.elapsedTime = 0;
            // Reset 'jump' state.
            this.jumping = false;
        }
        var jumpDistance = this.jumpLeftAscendAnimation.elapsedTime / this.jumpLeftAscendAnimation.totalTime;
        var totalHeight = 250;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-2 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }

    // Running right and left:
    this.game.right || this.game.left ? this.running = true : this.running = false;


    // Running and boundary collisions:
    if (this.running) {
        if (this.game.right && this.x < this.game.surfaceWidth - this.width) this.x += this.speed;
        if (this.game.left && this.x > 0) this.x -= this.speed;
    }

    // Collisions on the way down:
    var entities = this.game.entities;

    for (var i = 0; i < entities.length; i++) {
        if (this.boundingBox.collide(entities[i].boundingBox)) {
            console.log("COLLISION WITH " + entities[i]);
        }
    }

    Entity.prototype.update.call(this);
};

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

Goat.prototype.toString = function goatToString() {
    return 'Goat';
};
