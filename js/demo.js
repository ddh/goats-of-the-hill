function Demo(game, background, platforms) {
    this.game = game;
    this.background = background;
    this.platforms = platforms;
    this.entities = [];
    this.goats = [ // used for storing goats for this round (will be wiped when Round is over)
        {
            playerColor: "blue",
            color: "blue",
            x: 368,
            y: 230,
            width: 94,
            height: 90,
            leftAnim: new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-left.png"), 0, 0, 94, 90, 0.1, 4, true, false)
        },
        {
            playerColor: "green",
            color: "green",
            x: 190,
            y: 350,
            width: 94,
            height: 90,
            leftAnim: new Animation(ASSET_MANAGER.getAsset("./img/green-goat-left.png"), 0, 0, 94, 90, 0.1, 4, true, false)
        },
        {
            playerColor: "red",
            color: "red",
            x: 535,
            y: 350,
            width: 94,
            height: 90,
            leftAnim: new Animation(ASSET_MANAGER.getAsset("./img/red-goat-left.png"), 0, 0, 94, 90, 0.1, 4, true, false)
        },
        {
            playerColor: "yellow",
            color: "rgb(255, 215, 0)",
            x: 355,
            y: 80,
            width: 94,
            height: 90,
            leftAnim: new Animation(ASSET_MANAGER.getAsset("./img/yellow-goat-left.png"), 0, 0, 94, 90, 0.1, 4, true, false)
        }
    ];
    this.type = "Demo"; // used to overload superclass constructor

    Scene.call(this, this.game, this.background, this.type);
}

Demo.prototype = new Scene();
Demo.prototype.constructor = Demo;

Demo.prototype.initAllEntities = function () {
    // 1. Goats list (initialized in constructor

    // 2. Entities list (goats not added b/c drawing and updating of goats' state is handled differently in this scene)
    this.entities.push(this.background);
    this.entities.push.apply(this.entities, this.platforms);

    // 3. Platforms list (initialized in constructor)
};

Demo.prototype.deleteAllEntities = function () {
    this.goats = [];
    this.platforms = [];
    this.entities = [];
};

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

// performs variable initialization
Demo.prototype.startScene = function () {
    this.initAllEntities();
};

// performs cleanup operations
Demo.prototype.endScene = function () {
    this.deleteAllEntities();
};

// checks if timer is done to indicate round is over
Demo.prototype.isSceneDone = function () {
    return this.game.continueKeyPressed; // enter to end scene
};

Demo.prototype.reset = function () {
};

Demo.prototype.draw = function (ctx) {
    // draws Background and Platforms
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }
    for (var j = 0, len2 = this.goats.length; j < len2; j++) {
        var goat = this.goats[j];
        if (j <= 2) {
            goat.leftAnim.drawFrame(this.game.clockTick, ctx, goat.x, goat.y, 0.65);
        } else {
            goat.leftAnim.drawFrame(this.game.clockTick, ctx, goat.x, goat.y, 1);
        }
    }
};

Demo.prototype.update = function () {

};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/
