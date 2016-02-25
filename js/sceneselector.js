function Scene(platforms, background) {
    this.platforms = platforms;
    this.background = background;
}

Scene.prototype = new Entity();
Scene.prototype.constructor = Scene;

Scene.prototype.draw = function() {};

Scene.prototype.update = function() {};

Scene.prototype.toString = function() {
    return "Scene";
};

function SceneSelector(scenes) {
    this.scenes = scenes;
    this.currentScene = 0;
}

SceneSelector.prototype = new Entity();
SceneSelector.prototype.constructor = SceneSelector;

SceneSelector.prototype.addScene = function(scene) {
    this.scenes.push(scene);
};

SceneSelector.prototype.getNextScene = function() {
    return this.scenes[++this.currentScene];
};

SceneSelector.prototype.draw = function() {};

SceneSelector.prototype.update = function() {};

SceneSelector.prototype.toString = function() {
    return "SceneSelector";
};
