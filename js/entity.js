function Entity(game, x, y) {
    this.game = game;
    // location of entity on canvas
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

// TODO: Marriott has this empty in his code, do we need to add anything to this???
Entity.prototype.update = function () {};

// added b/c Marriott had it in his Unicorn game code and I thought it might be useful later down the road
Entity.prototype.reset = function () {};

Entity.prototype.draw = function (ctx) {
    if (this.game.enableDebug) {
        this.game.ctx.beginPath();
        this.game.ctx.lineWidth = "4";
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.rect(this.x, this.y, this.width, this.height);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
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
