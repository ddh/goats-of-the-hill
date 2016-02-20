function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

function Goat(game, playerNumber, controls, sprite) {

    // Game properties:
    this.playerNumber = playerNumber;
    this.controls = controls;
    this.game = game;
    this.ctx = game.ctx;

    // Control keys:
    this.jumpKey = false;
    this.leftKey = false;
    this.rightKey = false;
    this.chargeKey = false;

    // Game physics:
    this.scale = 0.65;
    this.x = 200;   // game.ctx.canvas.width/height
    this.y = 200;   // game.platforms[0].y // Ground platforms' y
    this.width = 96 * this.scale;
    this.height = 95 * this.scale;
    this.lastY = this.y;
    this.velocity = {x: 0, y: 0};
    this.acceleration = {x: 0, y: 0};
    this.gravity = 0.5;
    this.friction = 0.75;
    this.speed = 0.5;
    this.maxVelocityX = 3.0;
    this.jumpHeight = 100;
    this.entity = this.game.platforms[0];
    this.standingOn = null;

    // Animations:
    this.trim = {top: 50, bottom: 50, left: 50, right: 50}; //

    var leftAsset = ASSET_MANAGER.getAsset("./img/" + sprite + "-left.png");
    var rightAsset = ASSET_MANAGER.getAsset("./img/" + sprite + "-right.png");

    this.standLeftAnimation = new Animation(leftAsset, 0, 0, 94, 90, 0.1, 4, true, false);
    this.standRightAnimation = new Animation(rightAsset, 0, 0, 94, 90, 0.1, 4, true, false);

    this.runLeftAnimation = new Animation(leftAsset, 376, 0, 94, 90, 0.075, 4, true, false);
    this.runRightAnimation = new Animation(rightAsset, 376, 0, 94, 90, 0.075, 4, true, false);

    this.skidLeftAnimation = new Animation(leftAsset, 752, 0, 94, 90, 0.1, 1, true, false);
    this.skidRightAnimation = new Animation(rightAsset, 752, 0, 94, 90, 0.1, 1, true, false);

    this.jumpLeftAnimation = new Animation(leftAsset, 846, 0, 94, 90, 0.1, 4, false, false);
    this.jumpRightAnimation = new Animation(rightAsset, 1128, 0, 94, 90, 0.1, 1, false, false);

    this.fallLeftAnimation = new Animation(leftAsset, 1222, 0, 94, 90, 0.1, 4, false, false);
    this.fallRightAnimation = new Animation(rightAsset, 1410, 0, 94, 90, 0.1, 1, false, false);

    this.landLeftAnimation = new Animation(leftAsset, 1504, 0, 94, 90, 0.1, 4, false, false);
    this.landRightAnimation = new Animation(rightAsset, 1504, 0, 94, 90, 0.1, 4, false, false);

    this.leftChargeAnimation = new Animation(leftAsset, 1880, 0, 94, 90, 0.1, 4, true, false);
    this.rightChargeAnimation = new Animation(rightAsset, 1880, 0, 94, 90, 0.1, 4, true, false);

    this.leftAttackAnimation = new Animation(leftAsset, 1974, 0, 94, 90, 0.1, 4, true, false);
    this.rightAttackAnimation = new Animation(rightAsset, 1974, 0, 94, 90, 0.1, 4, true, false);

    this.leftHurtAnimation = new Animation(leftAsset, 2068, 0, 94, 90, 0.1, 4, false, false);
    this.rightHurtAnimation = new Animation(rightAsset, 2068, 0, 94, 90, 0.1, 4, false, false);

    this.leftStunnedAnimation = new Animation(leftAsset, 2538, 0, 94, 90, 0.1, 4, true, false);
    this.rightStunnedAnimation = new Animation(rightAsset, 2538, 0, 94, 90, 0.1, 4, true, false);


    this.crownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/smallest-king-crown.png"), 0, 0, 40, 32, 0.1, 1, true, false);

    // Audio:
    this.soundFX = new Howl({
        autoplay: false,
        urls: ['./audio/goat_sfx.wav'], // Sound 'sprite' containing all sfx
        sprite: {
            jump: [0, 154],
            land: [154, 143]
        }
    });

    // Action states:
    this.right = true; // Facing right (true) or left (false)
    this.standing = true;
    this.skidding = false;
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;
    this.king = false;

    // this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);


    Entity.call(this, game, 0, this.y, this.width, this.height);
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.reset = function () {
    this.right = true;
    this.standing = true;
    this.skidding = false
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;

    this.x = 0;
    this.y = this.game.platforms[0].y - this.height;

    this.entity = this.game.platforms[0];

    // this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);
};

// Based off of Chris Marriott's Unicorn's update method: https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js
Goat.prototype.update = function () {
    // if (this.playerNumber === 0)
        // console.log(this.boundingBox);

    /****************************************
     *              Collisions              *
     ****************************************/

    // Update goat's velocities if it's on a platform
    if (this.entity) {
        this.x += this.entity.velocity.x;
        this.y += this.entity.velocity.y;
    }

    /****************************************
     *              Movement                *
     ****************************************/

    // Update Goat's facing direction state:
    if (this.rightKey) {
        if (this.right == false) {
            this.velocity.x *= Math.pow(this.friction, 10);
        }
        this.right = true;
    } else if (this.leftKey) {
        if (this.right == true) {
            this.velocity.x *= Math.pow(this.friction, 4);
        }
        this.right = false;
    }

    // Apply friction on running after letting go of run keys
    if (!this.rightKey && !this.leftKey) {
        this.velocity.x *= this.friction;
    }

    // Update running state:
    this.rightKey || this.leftKey ? this.running = true : this.running = false;

    // Running and boundary collisions:
    if (this.rightKey && this.x < this.game.surfaceWidth - this.width) this.velocity.x = Math.min(this.velocity.x + this.speed, this.maxVelocityX); // Running right
    if (this.leftKey && this.x > 0) this.velocity.x = Math.max(this.velocity.x - this.speed, -1 * this.maxVelocityX); // Running left
    
    // if (Math.abs(this.velocity.x) < this.speed / 3) // If velocity is negligible 
    //     this.velocity.x = 0; // Set velocity to 0 so we don't have really small values that are basically 0.

    this.x += this.velocity.x;

    /****************************************
     *              Jumping                 *
     ****************************************/

    // Update Jump state:
    if (this.jumpKey && !this.jumping && !this.falling) {
        this.jumping = true;
        this.ramping = true; // ramp up velocity instead of immediate impulse
        this.entity = null;
        this.soundFX.play('jump');
        console.log("Jumped");
        // this.base = 500; // Keep track of the goat's last bottom-y value
    }

    if (this.jumping) {
        if (this.ramping)
            this.velocity.y -= 3.0; // To adjust how quickly goat reaches max jump velocity

        if (this.velocity.y < -9) // To adjust the max jump velocity
            this.ramping = false;

        this.velocity.y += this.gravity;

        if (!this.ramping && Math.abs(this.velocity.y) < 0.1) { // If jump is at/near peak
            // this.velocity.y = 0;
            this.jumping = false;
            this.falling = true;
        }
    }

    /****************************************
     *              Falling                 *
     ****************************************/

    if (this.falling) {
        this.velocity.y += this.gravity;
        
        if (this.y > this.base || this.entity) { // Should change to case where goat lands on a platform/goat
            this.falling = false;
            this.velocity.y = 0;
            this.y = this.entity? this.entity.boundingBox.top - this.boundingBox.height : this.base;
        }
    }
    
    var lastBB = this.boundingBox;
    this.y += this.velocity.y;
    this.boundingBox.update(this);

    /****************************************
     *             Collision                *
     ****************************************/

    // Setup temp bounding boxes to check for corner collisions:
    var leftCornerBB = new BoundingBox(this.boundingBox.left, this.boundingBox.top + this.boundingBox.height / 2, 5, this.boundingBox.height / 2);
    var rightCornerBB = new BoundingBox(this.boundingBox.right - 5, this.boundingBox.top + this.boundingBox.height / 2, 5, this.boundingBox.height / 2);
    
    // Jumping onto an entity 
    for (var i = 0; i < this.game.entities.length; i++) {
        var entity = this.game.entities[i];
        if (entity != this && this.falling && (leftCornerBB.collide(entity.boundingBox) ||
            rightCornerBB.collide(entity.boundingBox)) && lastBB.top <= entity.boundingBox.top) {
            
            console.log(this + " collided with " + entity);
            this.entity = entity;
            this.y = entity.boundingBox.top - this.boundingBox.height;
            this.x += entity.velocity.x;
            this.y += entity.velocity.y;
        }
    }
    
    // Walking off an entity
    if (!this.jumping && !this.falling) {
       if ((leftCornerBB.left > this.entity.boundingBox.right || leftCornerBB.right < this.entity.boundingBox.left) &&
           (rightCornerBB.left > this.entity.boundingBox.right || rightCornerBB.right < this.entity.boundingBox.left)) {
           this.falling = true;
           this.entity = null;
       }
    }


    /****************************************
     *              Attacking               *
     ****************************************/

    /****************************************
     *              Misc.                   *
     ****************************************/
    // Just to place a crown manually on top of player 1's goat.
    if (this.playerNumber === 0)
        this.king = this.game.kKey;

    //// WHILE the goat is JUMPING:
    //if (this.jumping) {
    //    // Figure out which jump animation (left or right) to use
    //    var jumpAscendAnimation = this.right ? this.jumpRightAnimation : this.jumpLeftAnimation;
    //
    //    var duration = jumpAscendAnimation.elapsedTime + this.game.clockTick;
    //    if (duration > jumpAscendAnimation.totalTime / 2) duration = jumpAscendAnimation.totalTime - duration;
    //    duration = duration / jumpAscendAnimation.totalTime;
    //
    //    // quadratic jump
    //    var height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
    //    this.lastY = this.boundingBox.bottom;
    //    this.y = this.base - height;
    //    this.boundingBox = new BoundingBox(this.x, this.y, jumpAscendAnimation.frameWidth * this.scale, jumpAscendAnimation.frameHeight * this.scale);
    //
    //    var idx;
    //    for (idx = 0; idx < this.game.platforms.length; idx++) {
    //        var pf = this.game.platforms[idx];
    //        if (this.boundingBox.collide(pf.boundingBox) && this.lastY < pf.boundingBox.top) {
    //            console.log("JUMPING COLLISION WITH " + pf);
    //            this.jumping = false;
    //            this.soundFX.play('land');
    //            this.y = pf.boundingBox.top - jumpAscendAnimation.frameHeight * this.scale;
    //            this.platform = pf;
    //            jumpAscendAnimation.elapsedTime = 0;
    //        }
    //    }
    //
    //    // Goat ON TOP of another goat
    //    for (var i = 0; i < this.game.goats.length; i++) {
    //        var goat = this.game.goats[i];
    //        if (goat != this && this.boundingBox.collide(goat.boundingBox) && this.lastY < goat.boundingBox.top) {
    //            console.log("ON TOP OF GOAT");
    //            this.jumping = false;
    //            this.y = goat.boundingBox.top - jumpAscendAnimation.frameHeight * this.scale;
    //            this.platform = goat;
    //            jumpAscendAnimation.elapsedTime = 0;
    //        }
    //    }
    //}

    //// While the goat is FALLING:
    //if (this.falling) {
    //    // Figure out which falling animation (left or right) to use
    //    var jumpDescendAnimation = this.right ? this.fallRightAnimation : this.fallLeftAnimation;
    //
    //    this.lastY = this.boundingBox.bottom;
    //    this.y += this.game.clockTick / jumpDescendAnimation.totalTime * 4 * this.jumpHeight;
    //    this.boundingBox = new BoundingBox(this.x, this.y, jumpDescendAnimation.frameWidth * this.scale, jumpDescendAnimation.frameHeight * this.scale);
    //
    //    for (var i = 0; i < this.game.platforms.length; i++) {
    //        var pf = this.game.platforms[i];
    //        if (this.boundingBox.collide(pf.boundingBox) && this.lastY < pf.boundingBox.top) {
    //            console.log("LANDING COLLISION WITH " + pf);
    //            this.falling = false;
    //            this.soundFX.play('land');
    //            this.y = pf.boundingBox.top - jumpDescendAnimation.frameHeight * this.scale;
    //            this.platform = pf;
    //            jumpDescendAnimation.elapsedTime = 0;
    //        }
    //    }
    //}
    //
    //// Handles when dropping off of platforms triggers falling animation
    //if (!this.jumping && !this.falling) {
    //    var standingAnimation = this.right ? this.standRightAnimation : this.standLeftAnimation;
    //    this.boundingBox = new BoundingBox(this.x, this.y, standingAnimation.frameWidth * this.scale, standingAnimation.frameHeight * this.scale);
    //    if (this.boundingBox.left > this.platform.boundingBox.right) this.falling = true;
    //    if (this.boundingBox.right < this.platform.boundingBox.left) this.falling = true;
    //}

    //// Handles keeping goat above the ground if it's falling down
    //if (this.y > this.game.platforms[0].y) this.y = this.game.platforms[0].y - 1;


    Entity.prototype.update.call(this);
};

Goat.prototype.draw = function (ctx) {

    // For drawing CROWN:
    if (this.king) {
        if (this.right) { // drawn crown above right-turned head
            this.crownAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.scale * 42, this.y - this.scale * 20, this.scale);
        } else { // draw crown above left-turned head
            this.crownAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.scale * 13, this.y - this.scale * 20, this.scale);
        }
    }

    if (this.jumping) {

        if (this.right)
            this.jumpRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.jumpLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        this.fallLeftAnimation.elapsedTime = this.fallRightAnimation.elapsedTime = 0;
    }
    else if (this.falling) {
        if (this.right)
            this.fallRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.fallLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        this.jumpLeftAnimation.elapsedTime = this.jumpRightAnimation.elapsedTime = 0;
    }
    else if (this.running) {
        if (this.right)
            this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);

    } else {
        if (this.right)
            this.standRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.standLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }

    Entity.prototype.draw.call(this, ctx);
};

Goat.prototype.toString = function () {
    return 'Goat ' + this.playerNumber;
};
