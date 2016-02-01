function Background(game, image, width, height) {
    Entity.call(this, game, 0, 0); // changed last param from 400
    //this.radius = 200; // TODO: double-check w/ Marriott that radius is used for drawing bounding circles
    this.game = game;
    this.ctx = game.ctx;
    this.image = image;
    this.width = width;
    this.height = height;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

// currently, background image isn't being updated - static image
Background.prototype.update = function () {};

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    Entity.prototype.draw.call(this);
};