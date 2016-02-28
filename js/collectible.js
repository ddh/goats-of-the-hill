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
    this.timeAlive = 0;     // seconds the collectible has been on screen
    this.timeExpire = 15;   // seconds until collectible disappears

    // Animations:
    var spriteSheet = ASSET_MANAGER.getAsset("./img/" + type + "-collectible.png");
    this.collectibleAnimation = new Animation(spriteSheet, 0, 0, width, height, 0.1, 1, true, false); // TODO: Careful, not all animations are the same
    Entity.call(this, game, x, y, width, height);
}

Collectible.prototype = new Entity();
Collectible.prototype.constructor = Collectible;

Collectible.prototype.reset = function () {
};


Collectible.prototype.update = function () {
    // Cycle through each goat, seing if it can pick this collectible up:
    for (var i = 0; i < this.game.goats.length; i++) {
        var goat = this.game.goats[i];
        if (this.boundingBox.collide(goat.boundingBox)) {
            switch (this.type) {
                case 'coin':
                    break;
                case 'speedUp':
                    break;
                case 'doubleJump':
                    break;
                case 'highJump':
                    break;
                case 'maxCharge':
                    break;
                case'attackUp':
                    break;
                case'invincibility':
                    break;
                default:
                    break;
            }
            console.log(goat + " picked up " + this);
            this.removeFromWorld = true; // Remove collectible on next gameengine update
            break; // Enforces only one goat per collectible
        }
    }

    // Update lifetime of collectible, removing when expired:
    this.timeAlive += this.game.clockTick;
    if (this.timeAlive / 1 > this.timeExpire) {
        this.removeFromWorld = true;
        console.log(this + " expired");
    }


    Entity.prototype.update.call(this);
};

Collectible.prototype.draw = function (ctx) {
    this.collectibleAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    Entity.prototype.draw.call(this, ctx);
};

Collectible.prototype.toString = function () {
    return "Collectible: " + this.type;
};

