function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

function Goat(game) {

    // Game physics:
    this.ground = 480; // changed value from 400
    this.x = 0;
    this.y = this.ground;
    this.width = 96;
    this.height = 95;
    this.lastY = this.y; // TODO: to be used for animation drawing calculations when jumping btwn platforms
    this.velocity = {x: 0, y: 0};
    this.speed = 5;
    this.jumpHeight = 200;

    // Platforms
    this.platform = game.platforms[0]; // Ground platform to start

    // TODO: took out idle animation and status boolean b/c standing anim and bool serves that purpose already

    // Animations:
    this.standLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 0, 0, 96, 95, 0.1, 4, true, true);
    this.standRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 768, 0, 96, 95, 0.1, 4, true, false);

    this.jumpLeftAscendAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 0, 0, 96, 95, 0.1, 4, false, true);
    this.jumpRightAscendAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 768, 0, 96, 95, 0.1, 4, false, false);
    this.jumpLeftDescendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 0, 0, 96, 95, 0.1, 4, false, true);
    this.jumpRightDescendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 768, 0, 96, 95, 0.1, 4, false, false);

    this.runLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 384, 0, 96, 95, 0.1, 4, true, true);
    this.runRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 385, 0, 96, 95, 0.1, 4, true, false);

    //this.chargingLeftAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.chargingRightAnimation     = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.attackLeftAnimation        = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.attackRightAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.stunnedLeftAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.stunnedRightAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    // Action states
    this.right = true; // Facing right (true) or left (false)
    this.standing = true;
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;

    //this.boundingBox = new BoundingBox(this.x + 25, this.y, this.standAnimation.frameWidth - 40, this.standAnimation.frameHeight - 20);

    // Game engine stuff:
    //this.game = game;
    //this.ctx = game.ctx;

    Entity.call(this, game, 0, this.y, this.width, this.height);
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.reset = function () {
    this.right = true;
    this.standing = true;
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;

    this.x = 0;
    this.y = this.ground;

    this.platform = this.game.platforms[0];

    //this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);
};

// Based off of Chris Marriott's Unicorn's update method: https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js
Goat.prototype.update = function () {
    // Update goat's facing direction (LEFT or RIGHT)
    if (this.game.right) {
        this.right = true;
    } else if (this.game.left) {
        this.right = false;
    }

    // The goat begins a JUMP:
    if (this.game.space && !this.jumping && !this.falling) {
        this.jumping = true;
        console.log("Jumped");
        this.base = this.y; // Keep track of the goat's last bottom-y value
    }

    // WHILE the goat is JUMPING:
    if (this.jumping) {
        // Figure out which jump animation (left or right) to use
        var jumpAscendAnimation = this.right ? this.jumpRightAscendAnimation : this.jumpLeftAscendAnimation;

        var duration = jumpAscendAnimation.elapsedTime + this.game.clockTick;
        if (duration > jumpAscendAnimation.totalTime / 2) duration = jumpAscendAnimation.totalTime - duration;
        duration = duration / jumpAscendAnimation.totalTime;

        // quadratic jump
        var height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
        this.lastY = this.boundingBox.bottom;
        this.y = this.base - height;
        this.boundingBox = new BoundingBox(this.x, this.y, jumpAscendAnimation.frameWidth, jumpAscendAnimation.frameHeight);

        var idx;
        for (idx = 0; idx < this.game.platforms.length; idx++) {
            var pf = this.game.platforms[idx];
            if (this.boundingBox.collide(pf.boundingBox) && this.lastY < pf.boundingBox.top) {
                console.log("JUMPING COLLISION WITH " + pf);
                this.jumping = false;
                this.y = pf.boundingBox.top - jumpAscendAnimation.frameHeight;
                this.platform = pf;
                jumpAscendAnimation.elapsedTime = 0;
            }
        }
    }

    // While the goat is FALLING:
    if (this.falling) {
        // Figure out which falling animation (left or right) to use
        var jumpDescendAnimation = this.right ? this.jumpRightDescendAnimation : this.jumpLeftDescendAnimation;

        this.lastY = this.boundingBox.bottom;
        this.y += this.game.clockTick / jumpDescendAnimation.totalTime * 4 * this.jumpHeight;
        this.boundingBox = new BoundingBox(this.x, this.y, jumpDescendAnimation.frameWidth, jumpDescendAnimation.frameHeight);

        for (var i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            if (this.boundingBox.collide(pf.boundingBox) && this.lastY < pf.boundingBox.top) {
                console.log("LANDING COLLISION WITH " + pf);
                this.falling = false;
                this.y = pf.boundingBox.top - jumpDescendAnimation.frameHeight;
                this.platform = pf;
                jumpDescendAnimation.elapsedTime = 0;
            }
        }
    }

    if (!this.jumping && !this.falling) {
        var standingAnimation = this.right ? this.standRightAnimation : this.standLeftAnimation;
        this.boundingBox = new BoundingBox(this.x, this.y, standingAnimation.frameWidth, standingAnimation.frameHeight);
        if (this.boundingBox.left > this.platform.boundingBox.right) this.falling = true;
    }

    // Update running state:
    this.game.right || this.game.left ? this.running = true : this.running = false;

    // Running and boundary collisions:
    if (this.running) {
        if (this.game.right && this.x < this.game.surfaceWidth - this.width) this.x += this.speed;
        if (this.game.left && this.x > 0) this.x -= this.speed;
    }

    if (this.y > this.ground) this.y = this.ground;

    Entity.prototype.update.call(this);
};

Goat.prototype.draw = function (ctx) {

    if (this.jumping) {
        if (this.right)
            this.jumpRightAscendAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        else
            this.jumpLeftAscendAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.running) {
        if (this.right)
            this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        else
            this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

    } else {
        if (this.right)
            this.standRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        else
            this.standLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    Entity.prototype.draw.call(this, ctx);
};

Goat.prototype.toString = function () {
    return 'Goat';
};
