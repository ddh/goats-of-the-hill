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
    if (this.game.enableDebug) this.boundingBox.draw(ctx);

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

BoundingBox.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.closePath();
};

BoundingBox.prototype.update = function (entity) {
    this.x = entity.x;
    this.y = entity.y;

    this.left = entity.x;
    this.top = entity.y;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

};

// Used if you want to shrink from both sides some pixels on the bounding box
BoundingBox.prototype.trim = function(width, height) {
    this.x += (width / 2);
    this.y += (height / 2);

    this.left = this.x;
    this.top = this.y;
    this.right = this.left + this.width - (width / 2);
    this.bottom = this.top + this.height - (height / 2);
};

// Used if you want to take off pixels off the top, bottom, left, right on the bounding box
BoundingBox.prototype.shave = function(top, bottom, left, right) {
    this.x += left;
    this.y += top;

    this.left = this.x;
    this.top = this.y;
    this.right = this.left + this.width - right;
    this.bottom = this.top + this.height - bottom;
};
