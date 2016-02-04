function Platform(game, image, x, y, width, height) {
    this.game = game;
    this.image = image;
    this.width = width;
    this.height = height;
    this.startX = x;
    this.startY = y;
    this.velocity = 3;
    Entity.call(this, game, x, y, width, height);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.reset = function () {
};

// don't need to update our platforms as their state won't change after the game is initialized
Platform.prototype.update = function () {

    // Sample code to make platforms move back and forth
    //this.x += this.velocity;
    //if (this.x <= 0 || this.x + 100 >= this.game.ctx.canvas.width) {
    //    this.velocity *= -1;
    //}
    //this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.prototype.update.call(this);
};


Platform.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.startX, this.startY, this.width, this.height);
    Entity.prototype.draw.call(this, ctx);
};

Platform.prototype.toString = function () {
    return 'Platform';
};

// Platform.prototype.draw = function (ctx) {
//     // TODO: would be cool to draw platforms with gradients like in code below

//     /*
//     var grad;
//     grad = ctx.createLinearGradient(0, this.y, 0, this.y + this.height);
//     grad.addColorStop(0, 'red');
//     grad.addColorStop(1 / 6, 'orange');
//     grad.addColorStop(2 / 6, 'yellow');
//     grad.addColorStop(3 / 6, 'green')
//     grad.addColorStop(4 / 6, 'aqua');
//     grad.addColorStop(5 / 6, 'blue');
//     grad.addColorStop(1, 'purple');
//     ctx.fillStyle = grad;


//     ctx.fillRect(this.x, this.y, this.width, this.height);
// }
//     ctx.fillRect(this.x, this.y, this.width, this.height);
//     */
// };
