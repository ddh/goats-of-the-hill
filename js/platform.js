function Platform(game, size, x, y, movement, platType, angle) {
    var obj = helper(size, platType);

    this.game = game;
    this.size = size;
    this.image = obj.img;
    this.width = obj.width;
    this.height = obj.height;
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
    this.velocity = {x: 3, y: 3};
    this.angle = angle;
    this.ellipticalSpeed = 0.5;
    this.radius = 250;
    this.movement = movement;
    this.isHill = false;
    this.ranking = null; // used in end game for determining height of vertical platforms for 1st, 2nd, and 3rd goats
    this.hillAnimation = new Animation(ASSET_MANAGER.getAsset("./img/hill-arrow.png"), 0, 0, 120, 120, .1, 10, true, false);
    Entity.call(this, game, x, y, obj.width, obj.height);
}

// Function below capable for different plat images and sizes for different stages
function helper(size, platType) {
    switch (size) {
        case 's':
            return {img: ASSET_MANAGER.getAsset("./img/platform-small-" + platType + ".png"), width: 85, height: 50};
        case'm':
            return {img: ASSET_MANAGER.getAsset("./img/platform-medium-" + platType + ".png"), width: 155, height: 50};
        case'l':
            return {img: ASSET_MANAGER.getAsset("./img/platform-large-" + platType + ".png"), width: 240, height: 50};
        case'ground':
            return {img: ASSET_MANAGER.getAsset("./img/transparent_pixel.png"), width: 800, height: 70};
        default:
            break;
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
            if (this.isHill) { // the target platform to win points
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
            var xOffset = this.game.surfaceWidth / 2 - this.width / 2;
            var yOffset = this.game.surfaceHeight / 2;

            // Store the previous position of platform (top-left)
            this.lastX = this.x;
            this.lastY = this.y;

            // Calculate new position:
            this.angle += this.ellipticalSpeed * this.game.clockTick;
            this.x = xOffset + Math.cos(this.angle) * this.radius;
            this.y = yOffset + Math.sin(this.angle) * this.radius;

            // Calculate vector velocities for x and y
            this.velocity.x = this.x - this.lastX;
            this.velocity.y = this.y - this.lastY;

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
        case 'endgame':
            this.velocity.x = 0;
            this.y += this.velocity.y;
            if (this.y <= 200 || this.y + this.height >= 500) {
                this.velocity.y *= -1;
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

    if (this.isHill) {
        var scaleBy = .6;
        var offsetFromLeftEdge = (this.width - 115) / 2; // this offset is used with centerAlignX
        var centerAlignX = this.x + offsetFromLeftEdge;

        this.hillAnimation.drawFrame(this.game.clockTick, ctx, this.x + (this.width / 2) - (this.hillAnimation.frameWidth / 3), this.y - 100, scaleBy); //draws sparkles parallel with platform
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.ranking) { // for end game scene
            // TODO: fill in...
        }
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
