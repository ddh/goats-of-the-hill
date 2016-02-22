// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameEngine() {
    this.entities = [];
    this.platforms = [];
    this.goats = [];
    this.collidables = [];
    this.enableDebug = false; // debugging flag for drawing bounding boxes
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.running = false; // boolean used by playgame.js
    this.keys = {}; // TODO: use map to correlate certain e.which's or keys to booleans or elapsed times
    this.sceneSelector = null;
    this.scene = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
};

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

GameEngine.prototype.loadFirstScene = function () {

    // Set Scene
    this.scene = this.sceneSelector.scenes[0];

    // Set Background
    this.entities.push(this.scene.background);

    // Set Platforms
    // Note: push.apply allows you to append array contents all at once (no need for loops)
    // Note: setting each array individually here to avoid shallow copying mistakes
    this.platforms.push.apply(this.platforms, this.scene.platforms);
    this.entities.push.apply(this.entities, this.scene.platforms);
    this.collidables.push.apply(this.collidables, this.scene.platforms);

    // Set Goats
    for (var i = 0; i < this.scene.goats.length; i++) {
        var goat = this.scene.goats[i];
        goat.reset(); // Reset so goat's initial platform is the ground
        this.entities.push(goat);
        this.goats.push(goat);
        this.collidables.push(goat);
        // Add key listeners associated with goat
        // "closure" is needed so listener knows what element to refer to
        (function(goat, gameEngine) {
            gameEngine.ctx.canvas.addEventListener("keydown", function (e) {
                if (e.which === goat.controls.jump) goat.jumpKey = true;
                if (e.which === goat.controls.right) goat.rightKey = true;
                if (e.which === goat.controls.left) goat.leftKey = true;
            }, false);
            gameEngine.ctx.canvas.addEventListener("keyup", function (e) {
                if (e.which === goat.controls.jump) goat.jumpKey = false;
                if (e.which === goat.controls.right) goat.rightKey = false;
                if (e.which === goat.controls.left) goat.leftKey = false;
            });
        })(goat, this);
    }
};

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    /* === KEYBOARD EVENTS === */

    // Prevent some keyboard navigation defaults:
    // http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
    this.ctx.canvas.addEventListener("keydown", function (e) {
        // space and arrow keys (32:spacebar, 37:left, 38:up, 39:right, 40:down)
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (e.which === 75) {
            that.kKey ^= true;
            console.log("king turned " + (that.kKey ? "on" : "off"));
        }
        if (e.which === 70) {
            that.enableDebug ^= true; // 'F' key to toggle debug
            console.log("debugging turned " + (that.enableDebug ? "on" : "off"));

        }
    }, false);

    /* === MOUSE SETTINGS === */

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        return {x: x, y: y};
    };

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        //console.log(getXandY(e));
        that.click = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("wheel", function (e) {
        //console.log(getXandY(e));
        that.wheel = e;
        //console.log(e.wheelDelta);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        //console.log(getXandY(e));
        that.rightclick = getXandY(e);
        e.preventDefault();
    }, false);

    console.log('Input started');
};

// TODO: need to tweak how we're adding entities to the game engine, ie. have separate field arrays for each entity type
GameEngine.prototype.addEntity = function (entity) {
    console.log('added ' + entity.toString());
    this.entities.push(entity);
};

GameEngine.prototype.draw = function () {

    // 1. Clear the window (Removes previously drawn things from canvas)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // 2. Save (What are we saving exactly here?)
    this.ctx.save();

    // 3. Draw each entity onto canvas
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    // Cycle through the list of entities in GameEngine.
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        // Only update those not flagged for removal, for optimization
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    // Removal of flagged entities
    for (var j = this.entities.length - 1; j >= 0; --j) {
        if (this.entities[j].removeFromWorld) {
            this.entities.splice(j, 1);
        }
    }
};

GameEngine.prototype.loop = function () {

    // 1. Advance game a 'tick' on the game timer
    this.clockTick = this.timer.tick();

    // 2. Update game engine (cycle through all entities)
    this.update();

    // 3. Redraw out to canvas
    this.draw();

    // 4. Reset inputs to prevent repeated firing
    this.click = null;
    this.rightclick = null;
    this.wheel = null;
    this.space = null;
};

GameEngine.prototype.reset = function () {
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].reset();
    }
};

GameEngine.prototype.toString = function gameEngineToString() {
    return 'Game Engine';
};

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};
