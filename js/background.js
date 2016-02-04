function Background(game, image, width, height) {
    this.game = game;
    this.ctx = game.ctx;
    this.image = image;
    this.width = width;
    this.height = height;
    Entity.call(this, game, 0, 530, 800, 100); // changed last param from 400
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

// currently, background image isn't being updated - static image
Background.prototype.update = function () {
    Entity.prototype.update.call(this);
};

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    //Entity.prototype.draw.call(this, ctx);
};

Background.prototype.toString = function () {
    return 'Background';
};