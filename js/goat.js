function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

// Audio:
var soundFX = new Howl({
    autoplay: false,
    urls: ['./audio/goat_sfx.wav'], // Sound 'sprite' containing all sfx
    sprite: {
        jump: [0, 154],
        land: [154, 143]
    }
});

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Goat(game, playerNumber, controls, sprite, color) {
    // Game properties:
    this.playerNumber = playerNumber;
    this.aiEnabled = false;
    this.controls = controls;
    this.game = game;
    this.ctx = game.ctx;
    this.sprite = sprite;
    this.color = color;
    if (color === "rgb(255, 215, 0)") {
        this.playerColor = "yellow";
    } else {
        this.playerColor = color;
    }

    // Control keys:
    this.jumpKey = false;
    this.leftKey = false;
    this.rightKey = false;
    this.attackKey = false;
    this.runKey = false;

    // Rigid body physics:
    this.scale = 0.65;
    this.x = 200;   // game.ctx.canvas.width/height
    this.y = 200;   // game.platforms[0].y // Ground platforms' y
    this.width = 96 * this.scale;
    this.height = 95 * this.scale;
    if (this.game.playGame.isInTransitionScene) {
        this.entity = null; // there is no ground platform
    } else {
        this.entity = this.game.platforms[0];
    }
    this.standingOn = null;

    // Movement physics:
    this.friction = 0.75;
    this.speed = 0.5;
    this.maxVelocityX = 3.0;
    this.walkSpeed = 0.5;
    this.runSpeed = 1.5;
    this.maxWalkSpeed = 3.0;
    this.maxRunSpeed = 6.0;


    // Jump physics
    this.velocity = {x: 0, y: 0};
    this.gravity = 0.5;
    this.terminalVelocity = 12;     // Max falling velocity
    this.maxVelocityY = -6.0;       // Max jump velocity (more negative, higher jump)
    this.airTime = 0;               // How long the jump key is held
    this.maxAirTime = 0.3;          // Max time the jump key can be held for variable jumping
    this.jumps = 0;                 // The number of times goat has jumped before landing
    this.maxJumps = 1;              // Maximum number of jumps allowed (2=double-jumping, 3=triple, etc)
    this.allowJump = true;

    // Attack physics
    this.chargeTime = 0;            // Elapsed time held during charging
    this.chargeDecayCounter = 0;    // Keeps count of how long the charge has been decaying for
    this.chargeDecayTime = 10;       // 10 secs before charge power starts decaying
    this.chargeDecay = false;       // Whether charge power is decaying
    this.chargePower = 1;           // Currently held charge power
    this.chargePowerMax = 5;        // Maximum charge power (ticks) (TODO: POWERUP)
    this.attackTimeCounter = 0;
    this.attackTimeMax = 20;        // How many UPDATES the attack lasts for
    this.attackVelocity = 2.5;      // Initial attack velocity

    // Hit physics:
    this.hit = {right: 0, pow: 0};  // A hit object containing information about the collision
    this.timeout = 0;
    this.timeoutMax = 100;          // How many updates an injured goat is immobolized for
    this.injured = false;           // Whether this goat was collided into
    this.maxVictims = 1;            // The number of goats a goat can attack in one attack (TODO: POWERUP)

    // Hit boxes for attacking:
    this.rightAttackBB = new BoundingBox(this.boundingBox.x + 33, this.boundingBox.y + 4, 10, this.boundingBox.height * 0.8);
    this.leftAttackBB = new BoundingBox(this.boundingBox.x, this.boundingBox.y + 4, 10, this.boundingBox.height * 0.8);

    // Collectibles (Power-ups)
    this.invincible = false;        // If true, this goat cannot be attacked (TODO: POWERUP)
    this.maximumAttack = false;     // If true, goat's charge power is constantly maxed out
    this.powerUps = [];             // Holds what powerups this goat currently has


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
    this.jumpRightAnimation = new Animation(rightAsset, 846, 0, 94, 90, 0.1, 4, false, false);

    this.fallLeftAnimation = new Animation(leftAsset, 1222, 0, 94, 90, 0.1, 4, false, false);
    this.fallRightAnimation = new Animation(rightAsset, 1222, 0, 94, 90, 0.1, 4, false, false);


    this.landLeftAnimation = new Animation(leftAsset, 1504, 0, 94, 90, 0.1, 4, false, false);
    this.landRightAnimation = new Animation(rightAsset, 1504, 0, 94, 90, 0.1, 4, false, false);

    this.chargeLeftAnimation = new Animation(leftAsset, 1880, 0, 94, 90, 0.1, 4, true, false);
    this.chargeRightAnimation = new Animation(rightAsset, 1880, 0, 94, 90, 0.1, 4, true, false);

    this.attackLeftAnimation = new Animation(leftAsset, 1974, 0, 94, 90, 0.1, 1, true, false);
    this.attackRightAnimation = new Animation(rightAsset, 1974, 0, 94, 90, 0.1, 1, true, false);

    this.injuredLeftAnimation = new Animation(leftAsset, 2068, 0, 94, 90, 0.1, 4, true, false);
    this.injuredRightAnimation = new Animation(rightAsset, 2068, 0, 94, 90, 0.1, 4, true, false);

    this.leftStunnedAnimation = new Animation(leftAsset, 2538, 0, 94, 90, 0.1, 4, true, false);
    this.rightStunnedAnimation = new Animation(rightAsset, 2538, 0, 94, 90, 0.1, 4, true, false);

    this.crownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/simple-crown-animated.png"), 0, 0, 40, 40, 0.1, 10, true, false);
    this.chargingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/auras.png"), -15, 125, 97, 100, 0.1, 7, true, false);

    this.attackAuraLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/" + this.sprite + "-attackAuraLeft.png"), 3, 0, 44, 150, .1, 4, true, false);
    this.attackAuraRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/" + this.sprite + "-attackAuraRight.png"), 16, 0, 43, 150, .1, 4, true, true);

    // Action states:
    this.right = true; // Facing right (true) or left (false)
    this.standing = true;
    this.running = false;
    this.skidding = false;
    this.jumping = false;
    this.falling = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;
    this.king = false;

    // TODO: KEEP THIS IN THE CONSTRUCTOR ELSE SCORE IS EITHER UNDEFINED OR NaN
    this.score = 0;

    // this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);

    Entity.call(this, game, 0, this.y, this.width, this.height);
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.reset = function () {


    this.resetActionStates();

    this.score = 0;
    this.king = false;

    this.x = 0;
    if (this.game.playGame.isInTransitionScene) {
        this.y = 0; // there is no ground platform
        this.entity = null;
    } else {
        this.y = this.game.platforms[0].y - this.height;
        this.entity = this.game.platforms[0]; // This should be the ground platform
    }

    // this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);
};

// Based off of Chris Marriott's Unicorn's update method: https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js
Goat.prototype.update = function () {


    /****************************************
     *              AI Goat                 *
     ****************************************/

    // AI Goat basically emulates key presses:

    if (this.aiEnabled && !this.injured) {

        // Find the hill
        function findHill(that) {
            for (var i = 0, len = that.game.platforms.length; i < len; i++) {
                if (that.game.platforms[i].isHill) return that.game.platforms[i];
            }
        }

        var hill = findHill(this);

        // If goat is NOT king, allow it to run. Otherwise just walk
        this.runKey = !this.king;

        // If goat is on the hill, just walk
        if (this.entity == hill) this.runKey = false;

        // When there is a hill present, AI Goat moves towards it:
        if (hill) {

            // Horizontal movement towards hill (walk/run left and right)
            if (this.entity != hill || !this.king) {
                if (this.x < hill.x) {
                    //console.log(this + " AI is moving right!");
                    this.rightKey = true;
                    this.leftKey = false;
                } else if (this.x + this.width > hill.x + hill.width) {
                    //console.log(this + " AI is moving left!");
                    this.leftKey = true;
                    this.rightKey = false;
                }
            } else {
                this.leftKey = this.rightKey = false; // Stop the goat from moving if king
            }

            // Jump when underneath the hill, if not already on it
            if (this.entity != hill && this.boundingBox.collide(new BoundingBox(hill.x, hill.y, hill.width, this.game.surfaceHeight))) {
                this.allowJump = true;
                this.jumpKey = true;
            }
        }

        // AI Attacking: Goat is always charging up
        this.attackKey = true

        // Or Goat will attack the king if it detects a collision with king
        if (this.chargePower >= getRandomIntInclusive(3, this.chargePowerMax)) {
            for (var i = 0; i < this.game.goats.length; i++) {
                var otherGoat = this.game.goats[i];
                if (this.boundingBox.collide(otherGoat.boundingBox) && this != otherGoat) {
                    this.attackKey = false;
                }
            }
        }

        // If AI's charge is decaying, attack at power 2, before losing it
        if (this.chargeDecay && this.chargePower == 2) this.attackKey = false;

    }


    /****************************************
     *              Position                *
     ****************************************/

    // Update goat's velocities/position if it's on another entity
    if (this.entity) {
        this.y = this.entity.boundingBox.top - this.boundingBox.height;
        var ent = this.entity;
        while (ent) {
            this.x += ent.velocity.x;
            this.y += ent.velocity.y;
            ent = ent.entity;
        }
    }

    /****************************************
     *              Movement                *
     ****************************************/

    if (!this.attacking && !this.injured) {
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

        // Determine whether walking or running speeds:
        this.speed = (this.runKey) ? this.runSpeed : this.walkSpeed;
        this.maxVelocityX = (this.runKey) ? this.maxRunSpeed : this.maxWalkSpeed;

        // Update Running velocities:
        if (this.rightKey && this.x < this.game.surfaceWidth - this.width) this.velocity.x = Math.min(this.velocity.x + this.speed, this.maxVelocityX); // Running right
        if (this.leftKey && this.x > 0) this.velocity.x = Math.max(this.velocity.x - this.speed, -1 * this.maxVelocityX); // Running left

        // Prevent goat from moving out of bounds of stage:
        if (this.x < 0 && this.leftKey || this.x + this.width > this.game.surfaceWidth && this.rightKey) this.velocity.x = 0;

        // if (Math.abs(this.velocity.x) < this.speed / 3) // If velocity is negligible
        //     this.velocity.x = 0; // Set velocity to 0 so we don't have really small values that are basically 0.


        this.x += this.velocity.x;
    }

    /****************************************
     *              Jumping                 *
     ****************************************/

    if (!this.attacking && !this.injured) {
        // Update Jump state:
        if (this.jumpKey && !this.jumping && this.jumps < this.maxJumps && this.allowJump) {
            this.allowJump = false;
            this.jumps++;
            this.airTime = 0;
            this.velocity.y = 0;
            this.falling = false;
            this.jumping = true;
            this.ramping = true; // ramp up velocity instead of immediate impulse
            this.entity = null;
            soundFX.play('jump');
            console.log(this + " Jumped");
            this.base = 535; // Keep track of the goat's last bottom-y value
        }

        // Only allow another jump if previous jump key was let go before making another jump
        if (!this.jumpKey) this.allowJump = true;

        // Calculate jump velocity; incrementally 'ramping' velocity until a threshold
        if (this.jumping) {

            // Apply variable jumping velocity until threshold:
            if (this.jumpKey && this.airTime < this.maxAirTime) {
                this.velocity.y -= this.gravity; // Negate force of gravity during airTime
                this.airTime += this.game.clockTick;
            }


            // Apply additional velocity until threshold:
            if (this.ramping) this.velocity.y -= 3.0; // To adjust how quickly goat reaches max jump velocity

            // Cap additional velocity when threshold reached:
            if (this.velocity.y < this.maxVelocityY) this.ramping = false;

            // Apply the force of gravity
            this.velocity.y += this.gravity;
            //console.log("JUMPING Velocity " + this.velocity.y);

            if (!this.ramping && Math.abs(this.velocity.y) < 0.1) { // If jump is at/near peak
                this.jumping = false;
                this.falling = true;
            }
        }
    }

    /****************************************
     *              Falling                 *
     ****************************************/

    if (!this.attacking) { // Prevent falling updates during attacking
        // Determine falling velocity of goat; mainly controlled by gravity pulling goat downwards
        if (this.falling) {
            //console.log("FALLING Velocity: " + this.velocity.y);
            this.velocity.y = Math.min(this.velocity.y + this.gravity, this.terminalVelocity);
            //this.velocity.y += this.gravity;

            // Determine goat's position upon landing on an entity
            if (this.y > this.base || this.entity) { // Should change to case where goat lands on a platform/goat
                //console.log(this + "'s final fall velocity was " + this.velocity.y);
                this.falling = false;
                this.airTime = 0;
                this.jumps = 0;
                this.velocity.y = 0;
                this.y = this.entity ? this.entity.boundingBox.top - this.boundingBox.height : this.base;
            }
        }

        this.y += this.velocity.y;
        this.boundingBox.update(this);
    }

    /****************************************
     *             Collisions               *
     ****************************************/

    // Setup temp bounding boxes to check for corner collisions:
    var leftCornerBB = new BoundingBox(this.boundingBox.x + 3, this.boundingBox.y + this.boundingBox.height / 2, 15, this.boundingBox.height / 2);
    var rightCornerBB = new BoundingBox(this.boundingBox.x + 17, this.boundingBox.y + this.boundingBox.height / 2, 15, this.boundingBox.height / 2);

    if (!this.right) {
        leftCornerBB = new BoundingBox(this.boundingBox.x + 7, this.boundingBox.y + this.boundingBox.height / 2, 15, this.boundingBox.height / 2);
        rightCornerBB = new BoundingBox(this.boundingBox.x + 22, this.boundingBox.y + this.boundingBox.height / 2, 15, this.boundingBox.height / 2);
    }

    // Jumping onto an entity
    if (this.falling) {
        for (var i = 0, length = this.game.collidables.length; i < length; i++) {
            var entity = this.game.collidables[i];
            if (entity != this && this.falling && (leftCornerBB.collide(entity.boundingBox) ||
                rightCornerBB.collide(entity.boundingBox)) && (this.boundingBox.bottom - this.velocity.y * 1.5 <= entity.boundingBox.y)) {
                console.log(this + " collided with " + entity);
                this.entity = entity;
                this.y = entity.boundingBox.top - this.boundingBox.height;
                this.x += entity.velocity.x;
                this.y += entity.velocity.y;
            }
        }
    }

    // Walking off an entity
    if (!this.attacking) {
        if (!this.jumping && !this.falling && this.entity) {
            if ((leftCornerBB.left > this.entity.boundingBox.right || leftCornerBB.right < this.entity.boundingBox.x) &&
                (rightCornerBB.left > this.entity.boundingBox.right || rightCornerBB.right < this.entity.boundingBox.x)) {
                //console.log(this + " walked off " + this.entity);
                this.falling = true;
                this.y += 2; // To prevent bug where goat alternates between falling and landing on same platform
                this.entity = null;
            }
        }
    }


    /****************************************
     *              Attacking               *
     ****************************************/

    // When attack key is held down, charge.
    if (this.attackKey && !this.attacking && !this.injured) {
        this.charging = true;
        this.attacking = false;
        this.chargeTime += this.game.clockTick;
        if (!this.chargeDecay) {
            this.chargePower = Math.min(Math.ceil(this.chargeTime / 1), this.chargePowerMax);
            //console.log(this + " has Charge of: " + this.chargePower);
        }
        if (this.maximumAttack) this.chargePower = this.chargePowerMax;
    }

    // While charging...
    if (this.charging) {

        // Enable decay if charge held for too long
        if (this.chargeTime / 1 >= this.chargeDecayTime + this.chargePower) this.chargeDecay = true;

        // On decay, decrement the charge power. Unless maxAtatck powerup enabled.
        if (this.chargeDecay && !this.maximumAttack) {
            this.chargeDecayCounter += this.game.clockTick;
            this.chargePower = Math.max(Math.floor(this.chargePowerMax - this.chargeDecayCounter) / 1, 1);
            console.log(this + "'s charge power decayed to " + this.chargePower);

        }

        // On letting go of charging key, release an attack
        if (!this.attackKey) {
            //console.log(this + " stopped charging w/ power " + this.chargePower + " and held for " + this.chargeTime.toFixed(2) + "s.");
            this.charging = false;
            this.chargeDecayCounter = 0;
            this.chargeTime = 0;
            this.chargeDecay = false;
            this.attacking = true;
        }
    }

    // The attack
    if (this.attacking) {
        this.running = false;

        // Determine position during attack
        if (this.right) this.x += this.attackVelocity * this.chargePower;
        if (!this.right) this.x -= this.attackVelocity * this.chargePower;
        this.attackTimeCounter++;

        // Prevent attack-dash from moving goat out of bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.surfaceWidth) this.x = this.game.surfaceWidth - this.width;

        // When the attack is finished:
        if (this.attackTimeCounter > this.attackTimeMax) {
            this.finishAttack();
        }

        // If attack collides with another goat:
        var victims = 0;
        for (var i = 0, len = this.game.goats.length; i < len; i++) {
            var goat = this.game.goats[i];
            if (victims < this.maxVictims) {
                if (this.right) {
                    // Goats who are already injured cannot be attacked
                    if (this.rightAttackBB.collide(goat.leftAttackBB) && goat != this && !goat.injured && !goat.invincible) {
                        transferHit(this, goat);
                        this.finishAttack();
                        victims++;
                        break; // Can only attack one goat at a time
                    }
                } else {
                    if (this.leftAttackBB.collide(goat.rightAttackBB) && goat != this && !goat.injured && !goat.invincible) {
                        transferHit(this, goat);
                        this.finishAttack();
                        victims++;
                        break; // Can only attack one goat at a time
                    }
                }
            } else {
                console.log(victims + " " + this.maxVictims);
                this.attacking = false;
            }

        }
    }


    /****************************************
     *              On Hit                  *
     ****************************************/

    // TODO: 1. Need to prevent an injured goat from gaining points if on hill
    // TODO: 2. Prevent goats from being hit out of bounds of the stage
    // TODO: 3. Fix animations
    // TODO: 4. Tweak knockback durations and distance if needed

    if (this.injured) {

        // Knockback goats but keep them in bounds of stage
        if (this.hit.right) {
            if (this.x + this.width < this.game.surfaceWidth) this.x += 2 * this.hit.pow; // TODO: Magic numbers...
        } else {
            if (this.x > 0)this.x -= 2 * this.hit.pow;
        }
        this.chargePower = 1; // An injured goat cannot charge
        this.timeout += 20 / this.hit.pow; // TODO: Magic numbers...
        this.runKey = false;
        this.jumpKey = false;
        this.leftKey = false;
        this.rightKey = false;

        // Goat is knocked out for seconds equal to attacking goat's chargePower
        if (this.timeout >= this.timeoutMax) {
            this.injured = false;
            this.timeout = 0;
        }
    }


    /****************************************
     *              Powerups                *
     ****************************************/

    /****************************************
     *              Misc.                   *
     ****************************************/

    /****************************************
     *              Scoring                 *
     ****************************************/

    // Increments goat's score count:
    if (this.entity && this.entity.isHill && !isMounted(this, this.game.goats)) {
        var incrementScore = true;
        for (var i = 0, len = this.game.goats.length; i < len; i++) {
            var goat = this.game.goats[i];
            if (goat != this && this.entity == goat.entity) {
                incrementScore = false;
            }
        }
        if (incrementScore) {
            this.score += 1;
            //console.log("score = " + this.score);
        }
    }
    // helper function to prevent goat on goat on hill from gaining points
    function isMounted(thisGoat, goats) {
        for (var i = 0, len = goats.length; i < len; i++) {
            var goat = goats[i];
            if (goat.entity == thisGoat) return true;
        }
        return false;
    }

    Entity.prototype.update.call(this);
}
;

Goat.prototype.draw = function (ctx) {

    if (this.attacking) {
        if (this.right) {
            this.attackRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            this.attackAuraRightAnimation.drawFrame(this.game.clockTick, ctx, this.x - 50, this.y - 15, this.scale * 5);
        } else {
            this.attackLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            this.attackAuraLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x - 20, this.y - 15, this.scale * 5);
        }

    }
    else if (this.falling) {
        if (this.right)
            this.fallRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.fallLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        this.jumpLeftAnimation.elapsedTime = this.jumpRightAnimation.elapsedTime = 0;
    }
    else if (this.jumping) {
        if (this.right)
            this.jumpRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.jumpLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        this.fallLeftAnimation.elapsedTime = this.fallRightAnimation.elapsedTime = 0;
    }
    else if (this.running) {
        if (this.right)
            this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }
    else if (this.injured) {
        if (this.right) {
            this.injuredRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.injuredRightAnimation.isDone()) {
                this.rightStunnedAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            }
        }
        else {
            this.injuredLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            if (this.injuredLeftAnimation.isDone()) {
                this.leftStunnedAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
            }
        }
        //this.injuredLeftAnimation.elapsedTime = this.injuredRightAnimation.elapsedTime = 0;
    }
    else {
        if (this.right)
            this.standRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.standLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }


    // For the charging anim
    if (this.charging && this.chargePower == this.chargePowerMax) {
        if (this.right)
            this.chargingAnimation.drawFrame(this.game.clockTick, ctx, this.x - 1, this.y - 20, this.scale + .2);
        else
            this.chargingAnimation.drawFrame(this.game.clockTick, ctx, this.x - 12, this.y - 20, this.scale + .2);
    }

    // Display player indicator
    drawTextWithOutline(this.game.ctx, "24px Impact", (this.aiEnabled) ? "AI" : "P" + (this.playerNumber + 1), this.x + this.scale * 36, (this.y - this.scale * 30) + Math.sin(this.game.timer.gameTime * 10), this.color, 'white');
    drawTextWithOutline(this.game.ctx, "6px Impact", "▼", this.x + this.scale * 48, (this.y - this.scale * 10) + Math.sin(this.game.timer.gameTime * 10), this.color, 'white');

    // For drawing CROWN:
    if (this.king) {
        if (this.right) { // drawn crown above right-turned head
            this.crownAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.scale * 44, this.y - this.scale * 30, this.scale);
        } else { // draw crown above left-turned head
            this.crownAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.scale * 13, this.y - this.scale * 30, this.scale);
        }
    }

    // Display charge meter:
    drawChargeMeter(this);

    Entity.prototype.draw.call(this, ctx);
};

// Draw charge meter to canvas
function drawRoundedRect(ctx, x, y, width, height, radius) {

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};


Goat.prototype.finishAttack = function () {
    console.log(this + " attacked with power of " + this.chargePower);
    this.attacking = false;
    this.attackTimeCounter = 0;
    this.chargePower = (this.maximumAttack) ? this.chargePowerMax : 1;
};


var transferHit = function (thisGoat, otherGoat) {
    console.log(thisGoat + " attacked " + otherGoat + (thisGoat.right ? " from the left!" : " from the right!"));
    otherGoat.injured = true;
    otherGoat.hit = {right: thisGoat.right, pow: thisGoat.chargePower};
};

Goat.prototype.resetAllKeys = function () {
    this.leftKey = this.rightKey = this.jumpKey = this.runKey = this.attackKey = false;
};

Goat.prototype.resetActionStates = function (goat) {
    this.right = true;
    this.standing = true;
    this.skidding = false
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;
};

var drawChargeMeter = function (goat) {
    goat.ctx.strokeStyle = "rgb(255, 0, 0)";
    goat.ctx.fillStyle = "rgba(255, 255, 0, .5)";
    drawRoundedRect(goat.ctx, goat.boundingBox.x, goat.boundingBox.y + goat.boundingBox.height + 10, goat.boundingBox.width, 10, 2);
    goat.ctx.fillStyle = "rgba(0, 255, 0, 1)";
    drawRoundedRect(goat.ctx, goat.boundingBox.x, goat.boundingBox.y + goat.boundingBox.height + 10, (goat.chargePower / goat.chargePowerMax) * goat.boundingBox.width, 10, 2);
};

var drawPowerupsHeld = function (goat) {
    goat.ctx.drawImage()
};

Goat.prototype.toString = function () {
    return 'Goat ' + this.playerNumber;
};
