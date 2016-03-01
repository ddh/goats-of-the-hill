function Entity(game, x, y, width, height) {
    this.game = game;
    // location of entity on canvas
    this.x = x;
    this.y = y;
    this.collided = false;
    this.removeFromWorld = false;
    this.boundingBox = new BoundingBox(x, y, width, height);
}

// TODO: Marriott has this empty in his code, do we need to add anything to this???
Entity.prototype.update = function () {
    //this.boundingBox = new BoundingBox(this.x, this.y, width, height);
    this.boundingBox.update(this);
};

// added b/c Marriott had it in his Unicorn game code and I thought it might be useful later down the road
Entity.prototype.reset = function () {
};

Entity.prototype.draw = function (ctx) {
    if (this.game.enableDebug) {
        this.boundingBox.draw(ctx);  
        if (this instanceof Goat) {
            this.rightAttackBB.draw(ctx); // TODO: I've seen the game crash on some occasions because this was undefined between stages
            this.leftAttackBB.draw(ctx);
        }
    } 
};

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    return offscreenCanvas;
};

// This code is based on Chris Marriott's Unicorn game found here:
// https://github.com/algorithm0r/GamesProject/blob/Unicorn/game.js

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (other) {
    if (this.right > other.left && this.left < other.right && this.top < other.bottom && this.bottom > other.top) return true;
    return false;
};

// if another bounding box is on top of this one
BoundingBox.prototype.collideTop = function (other) {
    return this.collide(other) && this.top < other.bottom;
};

BoundingBox.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.closePath();
};

BoundingBox.prototype.update = function (entity) {

    // Set the trim of each entity, depending on its animation if need be.
    if (entity instanceof Goat) {
        entity.trim = {top: 10, bottom: 17, left: 12, right: 19};
        entity.rightAttackBB = new BoundingBox(this.x + 33, this.y + 4, 10, this.height * 0.8);
        entity.leftAttackBB = new BoundingBox(this.x, this.y + 4, 10, this.height * 0.8);
    } else if (entity instanceof Platform) { // ie. for platforms, etc.
        entity.trim = {top: 10, bottom: 15, left: 5, right: 10};
    } else {
        // Must keep this statement here or else game crashes. This sets trim all other objects.
        entity.trim = {top: 0, bottom: 0, left: 0, right: 0};
    }

    this.x = entity.x + entity.trim.left;
    this.y = entity.y + entity.trim.top;

    this.width = entity.width - entity.trim.right;
    this.height = entity.height - entity.trim.bottom;

    this.left = entity.x;
    this.top = entity.y;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;

};
