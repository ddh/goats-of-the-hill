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

/***************************
 *      Gamepad Suport     *
 ***************************/

window.addEventListener("gamepadconnected", function (e) {
    // Gamepad connected
    console.log("Gamepad connected", e.gamepad);
});

window.addEventListener("gamepaddisconnected", function (e) {
    // Gamepad disconnected
    console.log("Gamepad " + e.gamepad.index + " disconnected", e.gamepad);
});

function buttonPressed(b) {
    if (typeof(b) === "object") {
        return b.pressed;
    }
}

function GameEngine() {
    this.enableDebug = false;   // debugging flag for drawing bounding boxes
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.keys = {}; // TODO: use map to correlate certain e.which's or keys to booleans or elapsed times
    this.gamepads = [];
    this.pauseKey = false;
    this.sceneManager = null;
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

GameEngine.prototype.startInput = function () {
    // NOTE: VERY USEFUL for finding keycodes: http://keycode.info/
    console.log('Starting input');
    var that = this;

    /* === KEYBOARD EVENTS === */

    this.ctx.canvas.addEventListener("keydown", function (e) {

        // Prevent some keyboard navigation defaults:
        // http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault(); // Spacebar, ←,↑,→,↓

        // Debug: Toggling King
        //if (e.which === 75) {
        //    that.kKey ^= true;
        //    console.log("king turned " + (that.kKey ? "on" : "off"));
        //}

        // Debug: Enabling drawing of bounding boxes
        if (e.which === 192) {
            that.enableDebug ^= true; // '~' key to toggle debug
            console.log("debugging turned " + (that.enableDebug ? "on" : "off"));
        }

        // Pauses the game engine's loop()
        if (e.which === 27) {
            that.pauseKey ^= true;
            console.log("Game Engine loop" + (that.pauseKey ? "paused" : "unpaused"));
        }
    }, false);

    // Toggle AI function via keys:
    this.on = [];
    var toggleAI = function (game, num) {
        game.on[num] ^= true;
        game.sceneManager.currentScene.goats[num].resetAllKeys();
        game.sceneManager.currentScene.goats[num].aiEnabled = game.on[num];
    };

    // Pressing 1,2,3,or 4 toggles AI on/off
    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.which === 49) toggleAI(that, 0); // 1 Number Row key
        if (e.which === 50) toggleAI(that, 1); // 2 Number Row key
        if (e.which === 51) toggleAI(that, 2); // 3 Number Row key
        if (e.which === 52) toggleAI(that, 3); // 4 Number Row key
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

GameEngine.prototype.draw = function () {

    // 1. Clear the window (Removes previously drawn things from canvas)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // 2. Save old state
    this.ctx.save();

    // 3. Draw all entities from current scene onto canvas
    this.sceneManager.draw(this.ctx);

    // 4. Restore old state
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
    this.sceneManager.update();
};

GameEngine.prototype.loop = function () {

    if (!this.pauseKey) {
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
    }

};

GameEngine.prototype.reset = function () {
    this.sceneManager.reset();
};

GameEngine.prototype.toString = function () {
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
