// Sub-class of Scene
// EndGame: Background, (& text/images drawn on Canvas)

function EndGame(game, background) {
    this.game = game;
    this.background = background;
    this.type = "EndGame"; // used to overload superclass constructor

    this.entities = [];
    this.goats = [];
    this.platforms = [];

    this.goatStats = { // each list stores (for each goat): total score, rounds won (out of 3), high score (for that goat)
        "red": [0, 0, 0],
        "yellow": [0, 0, 0],
        "blue": [0, 0, 0],
        "green": [0, 0, 0]
    };
    this.statDrawingCoords = { // only for 3 goats now
        1: [0, 0],
        2: [0, 0],
        3: [0, 0]
    };

    Scene.call(this, this.game, this.background, this.type);
}

EndGame.prototype = new Scene();
EndGame.prototype.constructor = EndGame;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

EndGame.prototype.reset = function () {

};

EndGame.prototype.draw = function (ctx) {
    // draws background and platforms
    for (var i = 0, len = this.entities.length; i < len; i++) {
        var ent = this.entities[i];
        if (ent instanceof Background) {
            ent.draw(ctx);
        } else if (ent instanceof Goat) { // draw one frame of Goat's standing animation
            ent.drawStillStandingAnimation(ctx, this.goats);
        } else if (ent instanceof Platform) {
            ent.drawWithRanking(ctx, this.goats);
        }
    }

    // draw "header/footer" text on canvas
    drawTextWithOutline(ctx, "48pt Impact", "And the Winner is...", 150, 100, 'purple', 'white');
    drawTextWithOutline(ctx, "24pt Impact", "Play Oh My Goat Again?", 250, 550, 'purple', 'white');

    // draw end game stats next to corresponding goat
    for (var i = 1; i < 4; i++) {
        var goatCtr = {x: this.statDrawingCoords[i].x + 30, y: this.statDrawingCoords[i].y + 40};
        drawTextWithOutline(ctx, "16pt Impact", "x", goatCtr.x, goatCtr.y, 'purple', 'white');
    }
};

EndGame.prototype.update = function () {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        var ent = this.entities[i];
        if (ent instanceof Goat) {
            ent.updateWithPlatform(this.platforms);
            switch (ent.ranking) {
                case 1:
                    this.statDrawingCoords[1].y = ent.y;
                    break;
                case 2:
                    this.statDrawingCoords[2].y = ent.y;
                    break;
                case 3:
                    this.statDrawingCoords[3].y = ent.y;
                    break;
            }
        } else { // for Background and Platforms
            ent.update();
        }
    }
};

// performs variable initialization
EndGame.prototype.startScene = function () {
    // TODO: for debugging...
    //console.log(this.goatStats);

    // background
    this.entities.push(this.background);

    // platforms
    var pf1 = new Platform(this.game, 'm', 120, 400, 'endgame', 'hay');
    pf1.ranking = 3; // for 3rd place
    pf1.stopRising = false;
    this.entities.push(pf1);
    this.platforms.push(pf1);

    var pf2 = new Platform(this.game, 'm', 320, 400, 'endgame', 'hay');
    pf2.ranking = 1; // for 1st place
    pf1.stopRising = false;
    this.entities.push(pf2);
    this.platforms.push(pf2);

    var pf3 = new Platform(this.game, 'm', 520, 400, 'endgame', 'hay');
    pf3.ranking = 2; // for 2nd place
    pf1.stopRising = false;
    this.entities.push(pf3);
    this.platforms.push(pf3);

    this.entities.push.apply(this.entities, this.goats);

    /* --- GOATS --- */
    // pre-condition: goats list already sorted
    for (var i = 0, len = this.goats.length; i < len; i++) {
        var currGoat = this.goats[i];
        currGoat.disableControls = true; // may not need this bool flag...
        currGoat.ranking = (i + 1);
        currGoat.y = 400 - currGoat.height; // starting height
        switch (currGoat.ranking) {
            case 1: // 1st place
                currGoat.x = 320 + 50;
                this.statDrawingCoords[1].x = 320 + 50;
                break;
            case 2: // 2nd place
                currGoat.x = 520 + 50;
                this.statDrawingCoords[2].x = 520 + 50;
                break;
            case 3: // 3rd place
                currGoat.x = 120 + 50;
                this.statDrawingCoords[3].x = 120 + 50;
                break;
        }
    }
    this.goats.splice(3, 1); // delete goat with lowest score (with ranking of 4...) - TODO: remove this later
};

// performs cleanup operations
EndGame.prototype.endScene = function () {
    this.entities = [];
    this.goatStats = { // each list stores (for each goat): total score, rounds won (out of 3), high score (for that goat)
        "red": [0, 0, 0],
        "yellow": [0, 0, 0],
        "blue": [0, 0, 0],
        "green": [0, 0, 0]
    };
    this.goats = [];
    this.platforms = [];
};

// checks if user has clicked to play game again
EndGame.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/