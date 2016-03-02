// Sub-class of Scene
// Tutorial: Background (& text/images drawn on Canvas)

function Tutorial(game, background) {
    this.game = game;
    this.background = background;
    this.type = "Tutorial"; // used to overload superclass constructor

    this.entities = [];
    this.entities.push(this.background);

    Scene.call(this, this.game, this.background, this.type);
}

Tutorial.prototype = new Scene();
Tutorial.prototype.constructor = Tutorial;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Tutorial.prototype.reset = function () {

};

Tutorial.prototype.draw = function (ctx) {
    for (var i = 0, len = this.entities.length; i < len; i++) {
        this.entities[i].draw(this.game.ctx);
    }
};

Tutorial.prototype.update = function () {
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
Tutorial.prototype.startScene = function () {

};

// performs cleanup operations
Tutorial.prototype.endScene = function () {

};

// checks if user has clicked to return to title scene
Tutorial.prototype.isSceneDone = function () {
    return this.game.click;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/