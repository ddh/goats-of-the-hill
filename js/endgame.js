// Sub-class of Scene
// EndGame: Background, (& text/images drawn on Canvas)

function EndGame(game, background) {
    this.game = game;
    this.background = background;
    this.type = "EndGame"; // used to overload superclass constructor

    this.entities = [];

    this.pfData = [  // filled with JS objs...
        {image: ASSET_MANAGER.getAsset("./img/platform-small-hay.png"),
            stopRising: false, x: 30, y: 525, velocity: {x: 0, y: 3}, color: "blue", width: 85, height: 50,
            platColor: "blue"},
        {image: ASSET_MANAGER.getAsset("./img/platform-small-hay.png"),
            stopRising: false, x: 230, y: 525, velocity: {x: 0, y: 3}, color: "green", width: 85, height: 50,
            platColor: "green"},
        {image: ASSET_MANAGER.getAsset("./img/platform-small-hay.png"),
            stopRising: false, x: 430, y: 525, velocity: {x: 0, y: 3}, color: "red", width: 85, height: 50,
            platColor: "red"},
        {image: ASSET_MANAGER.getAsset("./img/platform-small-hay.png"),
            stopRising: false, x: 630, y: 525, velocity: {x: 0, y: 3}, color: "yellow", width: 85, height: 50,
            platColor: "rgb(255, 215, 0)"}
    ];

    this.goatData = [ // filled with JS objs... (goat state & stats data)
        {playerColor: "blue", color: "blue", x: 30, y: 435, width: 94, height: 90, velocity: {x: 0, y: 0},
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-right.png"), 0, 0, 94, 90, 0.1, 4, true, false)},
        {playerColor: "green", color: "green", x: 230, y: 435, width: 94, height: 90, velocity: {x: 0, y: 0},
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/green-goat-right.png"), 0, 0, 94, 90, 0.1, 4, true, false)},
        {playerColor: "red", color: "red", x: 430, y: 435, width: 94, height: 90, velocity: {x: 0, y: 0},
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/red-goat-right.png"), 0, 0, 94, 90, 0.1, 4, true, false)},
        {playerColor: "yellow", color: "rgb(255, 215, 0)", x: 630, y: 435, width: 94, height: 90, velocity: {x: 0, y: 0},
            rightAnim: new Animation(ASSET_MANAGER.getAsset("./img/yellow-goat-right.png"), 0, 0, 94, 90, 0.1, 4, true, false)}
    ];

    this.goatStats = { // each list stores (for each goat): total score, rounds won (out of 3), high score (for that goat)
        "red": [0, 0, 0],
        "yellow": [0, 0, 0],
        "blue": [0, 0, 0],
        "green": [0, 0, 0]
    };

    this.totals = []; // based on total scores for all goats

    Scene.call(this, this.game, this.background, this.type);
}

EndGame.prototype = new Scene();
EndGame.prototype.constructor = EndGame;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

EndGame.prototype.reset = function () {

};

// draw Background, Platforms, Goats, and stats
EndGame.prototype.draw = function (ctx) {
    // draws Background
    this.entities[0].draw(ctx);

    // draws Platforms
    for (var i = 0, len = this.pfData.length; i < len; i++) {
        var currPFDataObj = this.pfData[i];
        ctx.drawImage(currPFDataObj.image, currPFDataObj.x, currPFDataObj.y, currPFDataObj.width, currPFDataObj.height);
        drawTextWithOutline(ctx, "16pt Impact", currPFDataObj.ranking, currPFDataObj.x + 40, currPFDataObj.y + 30,
            currPFDataObj.platColor, 'white');
    }

    // draws Goats & their corresponding stats
    for (var j = 0, len2 = this.goatData.length; j < len2; j++) {
        var currGoatData = this.goatData[j];
        currGoatData.rightAnim.drawFrame(this.game.clockTick, ctx, currGoatData.x, currGoatData.y, 1);
        var wins = "Wins: (" + currGoatData.wins + "/3)";
        var total = "Total: " + currGoatData.total;
        var best = "Best: " + currGoatData.best;
        drawTextWithOutline(ctx, "14pt Impact", wins, currGoatData.x, currGoatData.y + 150, currGoatData.color, 'white');
        drawTextWithOutline(ctx, "14pt Impact", total, currGoatData.x, currGoatData.y + 170, currGoatData.color, 'white');
        drawTextWithOutline(ctx, "14pt Impact", best, currGoatData.x, currGoatData.y + 190, currGoatData.color, 'white');
    }
};

EndGame.prototype.update = function () {
    // 1. update background
    this.entities[0].update();

    // 2. update "platforms"
    for (var i = 0, len = this.pfData.length; i < len; i++) {
        updateIndvlPFDataObj(this.pfData[i]);
    }

    // 3. update "goats"
    for (var j = 0, len = this.goatData.length; j < len; j++) {
        updateIndvlGoatDataObj(this.goatData[j], this.pfData);
    }
};

// performs variable initialization
EndGame.prototype.startScene = function () {
    this.goats = []; // wipe goats from Scoreboard, data already captured in goatStats obj

    /* --- BACKGROUND --- */
    this.entities.push(this.background);

    /* --- PLATFORMS --- */
    // state initialization done in constructor

    // TODO: remove, used for debugging stat calculations
    console.log(this.goatStats);

    /* --- GOATS --- */
    // 1. pass goat stats data onto goatData list of objs
    for (var i = 0, len = this.goatData.length; i < len; i++) {
        var currGoatData = this.goatData[i];
        switch (i) {
            case 0: // blue
                currGoatData.total = this.goatStats["blue"][0]; // also serves as ranking
                currGoatData.wins = this.goatStats["blue"][1];
                currGoatData.best = this.goatStats["blue"][2];
                break;
            case 1: // green
                currGoatData.total = this.goatStats["green"][0]; // also serves as ranking
                currGoatData.wins = this.goatStats["green"][1];
                currGoatData.best = this.goatStats["green"][2];
                break;
            case 2: // red
                currGoatData.total = this.goatStats["red"][0]; // also serves as ranking
                currGoatData.wins = this.goatStats["red"][1];
                currGoatData.best = this.goatStats["red"][2];
                break;
            case 3: // yellow
                currGoatData.total = this.goatStats["yellow"][0]; // also serves as ranking
                currGoatData.wins = this.goatStats["yellow"][1];
                currGoatData.best = this.goatStats["yellow"][2];
                break;
            default:
                break;
        }
    }

    // 2. update ranking data for later
    this.totals.push(this.goatStats["blue"][0]);
    this.totals.push(this.goatStats["green"][0]);
    this.totals.push(this.goatStats["red"][0]);
    this.totals.push(this.goatStats["yellow"][0]);

    // 3. sort ranking data in descending order
    this.totals.sort(function (a, b) {
        return b - a;
    });

    // 4. set correct ranking fields for goatData objs
    for (var j = 0, length = this.goatData.length; j < length; j++) {
        var currGoatData = this.goatData[j];
        switch (currGoatData.total) {
            case this.totals[0]: // should be ranked #1 (first)
                currGoatData.ranking = 1;
                break;
            case this.totals[1]: // should be ranked #2 (second)
                currGoatData.ranking = 2;
                break;
            case this.totals[2]: // should be ranked #3 (third)
                currGoatData.ranking = 3;
                break;
            case this.totals[3]: // should be ranked #4 (fourth)
                currGoatData.ranking = 4;
                break;
        }
        // passing goat's ranking data to platforms for height calculations
        for (var k = 0, length2 = this.pfData.length; k < length2; k++) {
            var currPFData = this.pfData[k];
            if (currGoatData.playerColor === currPFData.color) {
                currPFData.ranking = currGoatData.ranking;
            }
        }
    }

    // 5. null out data just consumed
    this.goatStats = null; // data now stored in better representation so it's deleted
};

// performs cleanup operations
EndGame.prototype.endScene = function () {
    this.entities = [];
    this.goatData = [];
    this.pfData = [];
};

// checks if user has clicked to play game again
EndGame.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/

var updateIndvlGoatDataObj = function (goatDataObj, pfData) {
    for (var i = 0, len = pfData.length; i < len; i++) {
        var currPFData = pfData[i];
        if (currPFData.ranking === goatDataObj.ranking && !currPFData.stopRising) { // goat's plat is still rising, then goat should rise too
            goatDataObj.y += currPFData.velocity.y;
            break;
        }
    }
};

var updateIndvlPFDataObj = function (pfDataObj) {
    // LOGIC BLOCK FOR END GAME PLATFORM MOVEMENT
    if (!pfDataObj.stopRising) { // platform should continue rising
        pfDataObj.y += pfDataObj.velocity.y;
        // controls variable height raising of platforms for end game scene
        switch (pfDataObj.ranking) {
            case 1: // first place
                if (pfDataObj.y + pfDataObj.height >= 576) {
                    pfDataObj.velocity.y *= -1;
                } else if (pfDataObj.y <= 100) {
                    pfDataObj.stopRising = true;
                }
                break;
            case 2: // second place
                if (pfDataObj.y + pfDataObj.height >= 576) {
                    pfDataObj.velocity.y *= -1;
                } else if (pfDataObj.y <= 200) {
                    pfDataObj.stopRising = true;
                }
                break;
            case 3: // third place
                if (pfDataObj.y + pfDataObj.height >= 576) {
                    pfDataObj.velocity.y *= -1;
                } else if (pfDataObj.y <= 300) {
                    pfDataObj.stopRising = true;
                }
                break;
            case 4: // fourth place
                if (pfDataObj.y + pfDataObj.height >= 576) {
                    pfDataObj.velocity.y *= -1;
                } else if (pfDataObj.y <= 400) {
                    pfDataObj.stopRising = true;
                }
                break;
            default: // invalid state
                break;
        }
    } else { // y-value should now be held in place
        pfDataObj.velocity.y = 0;
        switch (pfDataObj.ranking) {
            case 1:
                pfDataObj.y = 100;
                break;
            case 2:
                pfDataObj.y = 200;
                break;
            case 3:
                pfDataObj.y = 300;
                break;
            case 4:
                pfDataObj.y = 400;
                break;
            default:
                break;
        }
    }
};
