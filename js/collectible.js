/*
 Collectibles: Pickups or powerups. Generated randomly during round. Grants goats temporary abilities.
 */


function Collectible(game, x, y, width, height, type) {


    this.game = game;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.type = type;       // Name of collectible
    this.timeExpire = 15;   // seconds until collectible is removed, if not picked up in time
    this.lifetime = 10;     // seconds powerup lasts for when picked up
    this.pickedUp = false;

    this.goat;

    // Animations:
    var spriteSheet = ASSET_MANAGER.getAsset("./img/collectible-" + type + ".png");
    this.collectibleAnimation = new Animation(spriteSheet, 0, 0, width, height, 0.1, 1, true, false); // TODO: Careful, not all animations are the same
    Entity.call(this, game, x, y, width, height);
}

Collectible.prototype = new Entity();
Collectible.prototype.constructor = Collectible;

Collectible.prototype.reset = function () {
};


Collectible.prototype.update = function () {

    // While the collectible is on the screen, allow it to be picked up by a goat
    if (!this.pickedUp) {
        // Cycle through each goat, seing if it can pick this collectible up:
        for (var i = 0; i < this.game.sceneManager.currentScene.goats.length; i++) {
            this.goat = this.game.sceneManager.currentScene.goats[i];

            // On pickup, apply effect to the goat. Injured goats cannot pick up collectibles.
            if (this.boundingBox.collide(this.goat.boundingBox) && !this.goat.injured) {
                switch (this.type) {
                    case 'speedUp':
                        this.goat.maxWalkSpeed *= 2;
                        this.goat.maxRunSpeed *= 2;
                        break;
                    case 'doubleJump':
                        this.goat.maxJumps++;
                        break;
                    case 'highJump':
                        this.goat.maxVelocityY--;
                        break;
                    case 'maxCharge':
                        this.goat.maximumAttack = true;
                        break;
                    case'attackUp':
                        this.goat.maxVictims += 4;
                        break;
                    case'invincibility':
                        this.goat.invincible = true;
                        break;
                    default:
                        break;
                }
                console.log(this.goat + " picked up " + this);
                this.pickedUp = true;
                break; // Enforces only one goat per collectible
            }
        }

        // Update lifetime of collectible, removing when expired:
        this.timeExpire -= this.game.clockTick;
        if (this.timeExpire < 0) {
            this.removeFromWorld = true;
            console.log(this + " expired");
        }
    }

    // When the item was picked up
    if (this.pickedUp) {

        // Update how much time left powerup has effect on goat
        this.lifetime -= this.game.clockTick;

        // Once powerup time finished, revert effects applied to goat
        if (this.lifetime < 0) {
            switch (this.type) {
                case 'speedUp':
                    this.goat.maxWalkSpeed /= 2;
                    this.goat.maxRunSpeed /= 2;
                    break;
                case 'doubleJump':
                    this.goat.maxJumps--;
                    break;
                case 'highJump':
                    this.goat.maxVelocityY++;
                    break;
                case 'maxCharge':
                    this.goat.maximumAttack = false;
                    break;
                case'attackUp':
                    this.goat.maxVictims -= 4;
                    break;
                case'invincibility':
                    this.goat.invincible = false;
                    break;
                default:
                    break;
            }

            // Then remove this collectible from list of entity in game engine
            this.removeFromWorld = true;
        }
    }
    Entity.prototype.update.call(this);
};

Collectible.prototype.draw = function (ctx) {

    // Only show the item on screen if it wasn't picked up yet
    if (!this.pickedUp) {
        this.collectibleAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
        Entity.prototype.draw.call(this, ctx);
    }


};

Collectible.prototype.toString = function () {
    return "Collectible: " + this.type;
};

