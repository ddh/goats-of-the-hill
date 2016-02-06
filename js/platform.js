function Platform(game, image, x, y, width, height, movement) {
    this.game = game;
    this.image = image;
    this.width = width;
    this.height = height;
    this.startX = x;
    this.startY = y;
    this.velocity = {x: 3, y: 3};
    this.movement = movement;
    Entity.call(this, game, x, y, width, height);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.reset = function () {
};


Platform.prototype.update = function () {

    switch (this.movement) {
        case 'vertical':
            this.velocity.x = 0;
            this.y += this.velocity.y;
            if (this.y <= 0 || this.y + this.height >= this.game.ctx.canvas.height) {
                this.velocity.y *= -1;
            }
            break;
        case 'horizontal':
            this.x += this.velocity.x;
            this.velocity.y = 0;
            if (this.x <= 0 || this.x + this.width >= this.game.ctx.canvas.width) {
                this.velocity.x *= -1;
            }
            break;
        case 'elliptical':
            break;
        case 'diagonal':
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            if (this.y <= 0 || this.y + this.height >= this.game.ctx.canvas.height || this.x <= 0 || this.x + this.width >= this.game.ctx.canvas.width) {
                this.velocity.x *= -1;
                this.velocity.y *= -1;

            }
            break;
        case 'bouncing':
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            if (this.y <= 0 || this.y + this.height >= this.game.ctx.canvas.height) {
                this.velocity.y *= -1;
            }
            if (this.x <= 0 || this.x + this.width >= this.game.ctx.canvas.width) {
                this.velocity.x *= -1;
            }

        default: // Stationary
            this.velocity.x = 0;
            this.velocity.y = 0;
            break;
    }
    Entity.prototype.update.call(this);
};


Platform.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
