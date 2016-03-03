// Sub-class of Scene
// Title: Background (& text/images drawn on Canvas)

function Title(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Title"; // used to overload superclass constructor

    this.entities = [];
    this.entities.push(this.background);

    Scene.call(this, this.game, this.background, this.type);
}

Title.prototype = new Scene();
Title.prototype.constructor = Title;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Title.prototype.reset = function () {

};

Title.prototype.draw = function (ctx) {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(ctx);
    }

    drawPlayButton(ctx);
};

Title.prototype.update = function () {
    if (typeof this.entities !== 'undefined') {
        var entitiesCount = this.entities.length;

        // Cycle through the list of entities in Scene.
        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            // Only update those not flagged for removal, for optimization
            if (typeof entity !== 'undefined' && !entity.removeFromWorld) entity.update();
        }

        // Removal of flagged entities
        for (var j = this.entities.length - 1; j >= 0; --j) {
            if (this.entities[j].removeFromWorld) this.entities.splice(j, 1);
        }

    }
};

// performs variable initialization
Title.prototype.startScene = function () {

};

// performs cleanup operations
Title.prototype.endScene = function () {

};

// checks if user has clicked to play or see tutorial
Title.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/