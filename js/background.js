function Background(game, image, width, height) {
    Entity.call(this, game, 0, 0); // changed last param from 400
    this.game = game;
    this.ctx = game.ctx;
    this.image = image;
    this.width = width;
    this.height = height;
    // TODO: Needs a BoundingBox otherwise crashes Work-around: hide it ~Duy
    this.boundingBox = new BoundingBox(0, 0, width, height);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

// currently, background image isn't being updated - static image
Background.prototype.update = function () {
    //this.boundingBox = new BoundingBox(0, 0, 0, 0); // TODO: to prevent collisions with background for now. Needs fix. ~Duy
};

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    Entity.prototype.draw.call(this);
};

Background.prototype.toString = function backgroundToString() {
    return 'Background';
};