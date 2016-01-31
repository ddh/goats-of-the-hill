function Entity(game, x, y) {
    this.game = game;
    // location of entity on canvas
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

// TODO: Marriott has this empty in his code, do we need to add anything to this???
Entity.prototype.update = function () {};

Entity.prototype.draw = function () {
    if (this.game.showOutlines && this.radius) { // means that we should only give radii fields to those entities
                                                 // whose outlines should be drawn
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "red";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
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
