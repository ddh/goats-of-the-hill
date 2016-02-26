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
    this.walkSpeed = 0.5;           // (TODO: POWERUP)
    this.runSpeed = 1.5;            // (TODO: POWERUP)
    this.maxWalkSpeed = 3.0
    this.maxRunSpeed = 6.0;


    // Jump physics
    this.velocity = {x: 0, y: 0};
    this.gravity = 0.5;
    this.terminalVelocity = 12;     // Max falling velocity
    this.maxVelocityY = -6.0;       // Max jump velocity (more negative, higher jump) (TODO: POWERUP)
    this.airTime = 0;               // How long the jump key is held
    this.maxAirTime = 0.3;          // Max time the jump key can be held for variable jumping
    this.jumps = 0;                 // The number of times goat has jumped before landing
    this.maxJumps = 2;              // Maximum number of jumps allowed (2=double-jumping, 3=triple, etc) (TODO: POWERUP)
    this.allowJump = true;

    // Attack physics
    this.chargeTime = 0;            // Held charge time
    this.chargeTimeMax = 5;         // 5 seconds to obtain max charge
    this.chargeDecayTime = 15;      // 15 secs before charge power starts decaying
    this.chargeDecay = false;       // Whether charge power is decaying
    this.chargeTick = 0.5;          // Every 30sec = tick in charge power
    this.chargePower = 1;           // Currently held charge power
    this.chargePowerMax = 10;       // Maximum charge power (ticks) (TODO: POWERUP)
    this.attackTimeCounter = 0;
    this.attackTimeMax = 10;        // How many UPDATES the attack lasts for
    this.attackVelocity = 2;        // Initial attack velocity

    // Hit physics:
    this.injured = false;           // Whether this goat was collided into
    this.hit = {dir: '', pow: ''};  // A hit object containing information about the collision
    this.maxVictims = 1;            // The number of goats a goat can attack in one attack (TODO: POWERUP)
    this.invulnerable = false;      // If true, this goat cannot be attacked (TODO: POWERUP)


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

    this.leftChargeAnimation = new Animation(leftAsset, 1880, 0, 94, 90, 0.1, 4, true, false);
    this.rightChargeAnimation = new Animation(rightAsset, 1880, 0, 94, 90, 0.1, 4, true, false);

    this.attackLeftAnimation = new Animation(leftAsset, 1974, 0, 94, 90, 0.1, 1, true, false);
    this.attackRightAnimation = new Animation(rightAsset, 1974, 0, 94, 90, 0.1, 1, true, false);

    this.leftHurtAnimation = new Animation(leftAsset, 2068, 0, 94, 90, 0.1, 4, false, false);
    this.rightHurtAnimation = new Animation(rightAsset, 2068, 0, 94, 90, 0.1, 4, false, false);

    this.leftStunnedAnimation = new Animation(leftAsset, 2538, 0, 94, 90, 0.1, 4, true, false);
    this.rightStunnedAnimation = new Animation(rightAsset, 2538, 0, 94, 90, 0.1, 4, true, false);


    this.crownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/smallest-king-crown.png"), 0, 0, 40, 32, 0.1, 1, true, false);
    this.chargingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/auras.png"), -15, 125, 97, 100, 0.1, 7, true, false);

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
    this.right = true;
    this.standing = true;
    this.skidding = false
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;
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

    if (this.playerNumber == "AI") {

        // Find the hill
        function findHill(that) {
            for (var i = 0, len = that.game.platforms.length; i < len; i++) {
                if (that.game.platforms[i].isHill) return that.game.platforms[i];
            }
        }

        var hill = findHill(this);

        // If goat is NOT king, allow it to run. Otherwise just walk
        this.runKey = !this.king;

        // When there is a hill present, AI Goat moves towards it:
        if (hill) {

            // Horizontal movement towards hill (walk/run left and right)
            if (this.x + this.width < hill.x + hill.width / 2) {
                //console.log(this + " AI is moving right!");
                this.rightKey = true;
                this.leftKey = false;
            } else if (this.x > hill.x + hill.width / 2) {
                //console.log(this + " AI is moving left!");
                this.leftKey = true;
                this.rightKey = false;
            }

            // Jump when underneath the hill, if not already on it
            if (this.entity != hill && this.boundingBox.collide(new BoundingBox(hill.x, hill.y, hill.width, this.game.surfaceHeight))) {
                this.allowJump = true;
                this.jumpKey = true;
            }
        }

        // TODO: Hold a charge of variable power. Attack only the King.


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

    if (!this.attacking) {
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

    if (!this.attacking) {
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
            this.soundFX.play('jump');
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
                console.log(this + "'s final fall velocity was " + this.velocity.y);
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
                console.log(this + " walked off " + this.entity);
                this.falling = true;
                this.y += 2; // To prevent bug where goat alternates between falling and landing on same platform
                this.entity = null;
            }
        }
    }


    /****************************************
     *              Attacking               *
     ****************************************/

    /*TODO: Attacking takes precedence over all other movements such as falling, jumping, or movement.

     */

    // When attack key is held down, charge.
    if (this.attackKey && !this.attacking) {
        this.charging = true;
        this.attacking = false;
        this.chargeTime += this.game.clockTick;
        if (!this.chargeDecay) {
            if ((this.chargeTime % this.chargeTick) < 0.01) {
                this.chargePower = Math.min(++this.chargePower, this.chargePowerMax);
                console.log(this + " has Charge of: " + this.chargePower);
            }
        }
    }

    // While charging...
    if (this.charging) {

        // Decay charge power if held for too long
        if (this.chargeTime >= this.chargeDecayTime && this.chargeTime % (this.chargeTick * 2) < 0.01) {
            this.chargeDecay = true;
            this.chargePower = Math.max(--this.chargePower, 1);
            console.log(this + "'s charge power decayed to " + this.chargePower);
        }

        // Once max charge time is met:
        if (this.chargeTime >= this.chargeTimeMax) {
            console.log("MAXIMUM CHARGE REACHED!");
            // TODO: Do something here once max charge is met? Dunno what.
        }

        // On letting go of charging key, release an attack
        if (!this.attackKey) {
            console.log(this + " stopped charging w/ power " + this.chargePower + " and held for " + this.chargeTime.toFixed(2) + "s.");
            // TODO: Call attack(int power) function!
            this.charging = false;
            //this.chargePower = 1;
            this.chargeTime = 0;
            this.chargeDecay = false;
            this.attacking = true;
        }
    }

    // Hit boxes for attacking:
    this.rightAttackBB = new BoundingBox(this.boundingBox.x + 38, (this.boundingBox.y + this.boundingBox.height / 2) - 8, 5, this.boundingBox.height / 2);
    this.leftAttackBB = new BoundingBox(this.boundingBox.x, (this.boundingBox.y + this.boundingBox.height / 2) - 8, 5, this.boundingBox.height / 2);

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
            console.log(this + " attacked with power of " + this.chargePower);
            this.attacking = false;
            this.attackTimeCounter = 0;
            this.chargePower = 1;
        }

        // If attack collides with another goat:
        for (var i = 0, len = this.game.goats.length; i < len; i++) {
            var goat = this.game.goats[i];
            var victims = 0;
            if (victims < this.maxVictims) {

            }
            if (this.right) {
                // Goats who are already injured cannot be attacked
                if (this.rightAttackBB.collide(goat.leftAttackBB) && goat != this && !goat.injured) {
                    console.log(this + " attacked " + goat + " from the left!");
                    goat.injured = true;
                    goat.hit = {right: true, pow: this.chargePower};
                    victims++;
                    break; // Can only attack one goat at a time
                }
            } else {
                if (this.leftAttackBB.collide(goat.rightAttackBB) && goat != this && !goat.injured) {
                    console.log(this + " attacked " + goat + " from the right!");
                    goat.injured = true;
                    goat.hit = {right: false, pow: this.chargePower};
                    victims++;
                    break; // Can only attack one goat at a time
                }
            }
        }
    }


    /****************************************
     *              On Hit                  *
     ****************************************/


    /****************************************
     *              Powerups                *
     ****************************************/

    /****************************************
     *              Misc.                   *
     ****************************************/

    /****************************************
     *              Scoring                 *
     ****************************************/
    // Just to place a crown manually on top of player 1's goat.
    // if (this.playerNumber === 0)
    //     this.king = this.game.kKey;

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
            console.log("score = " + this.score);
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
    // For drawing CROWN:
    if (this.king) {
        if (this.right) { // drawn crown above right-turned head
            this.crownAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.scale * 42, this.y - this.scale * 20, this.scale);
        } else { // draw crown above left-turned head
            this.crownAnimation.drawFrame(this.game.clockTick, ctx, this.x + this.scale * 13, this.y - this.scale * 20, this.scale);
        }
    }


    if (this.attacking) {
        if (this.right)
            this.attackRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.attackLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
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
    else {
        if (this.right)
            this.standRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
        else
            this.standLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }

    // For the charging anim
    if (this.charging) {
        if (this.right)
            this.chargingAnimation.drawFrame(this.game.clockTick, ctx, this.x - 1, this.y - 20, this.scale + .2);
        else
            this.chargingAnimation.drawFrame(this.game.clockTick, ctx, this.x - 12, this.y - 20, this.scale + .2);
    }

    Entity.prototype.draw.call(this, ctx);
};

Goat.prototype.toString = function () {
    return 'Goat ' + this.playerNumber;
};
