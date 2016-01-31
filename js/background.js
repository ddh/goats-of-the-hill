function Background(game) {
    Entity.call(this, game, 0, 0); // changed last param from 400
    this.radius = 200; // TODO: double-check w/ Marriott that radius is used for drawing bounding circles
    this.game = game;
    this.ctx = game.ctx;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
};

Background.prototype.draw = function () { // deleted ctx parameter and put it as a field of the Background object
    // TODO: draw background image given ctx

    Entity.prototype.draw.call(this);
};