function Platform(game, size, x, y, movement, platType, isHill) {
    var obj = helper(size, platType);

    this.game = game;
    this.size = size;
    this.image = obj.img;
    this.width = obj.width;
    this.height = obj.height;
    this.startX = x;
    this.startY = y;
    this.velocity = {x: 3, y: 3};
    this.movement = movement;
    this.isHill = isHill;
    this.hillAnimation = new Animation(ASSET_MANAGER.getAsset("./img/sparkles.png"), 10, 0, 193, 180, .1, 29, true, true);
    Entity.call(this, game, x, y, obj.width, obj.height);
}

// Function below capable for different plat images and sizes for different stages 
function helper(size, platType) {
    if (size === 's' && platType === 'hay') {
        return {img: ASSET_MANAGER.getAsset("./img/hay.png"), width: 85, height: 50};
    } else if (size === 'm' && platType === 'hay') {
        //console.log("returned helper");
        return {img: ASSET_MANAGER.getAsset("./img/hay2.png"), width: 155, height: 50};
    } else if (size === 'l' && platType === 'hay') {
        return {img: ASSET_MANAGER.getAsset("./img/hay3.png"), width: 240, height: 50};
    } else if (size === 'ground') {
        return {img: ASSET_MANAGER.getAsset("./img/transparent_pixel.png"), width: 800, height: 70};
    }
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
            if(this.isHill) { // the target platform to win points
                this.x += this.velocity.x;
                this.velocity.y = 0;
                if (this.x <= 0 || this.x + this.width >= this.game.ctx.canvas.width) {
                    this.velocity.x *= -1;
                }
            } else {
                this.x += this.velocity.x;
                this.velocity.y = 0;
                if (this.x <= 0 || this.x + this.width >= this.game.ctx.canvas.width) {
                    this.velocity.x *= -1;
                }
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
            break;

        default: // Stationary
            this.velocity.x = 0;
            this.velocity.y = 0;
            break;
    }
    Entity.prototype.update.call(this);
};

Platform.prototype.draw = function (ctx) {

    if(this.isHill) {
        var scaleBy = .6;
        var offsetFromLeftEdge = (this.width - 115) / 2; // this offset is used with centerAlignX
        var centerAlignX = this.x + offsetFromLeftEdge;

        this.hillAnimation.drawFrame(this.game.clockTick, ctx, centerAlignX, this.y - 70, scaleBy); //draws sparkles parallel with platform
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
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
