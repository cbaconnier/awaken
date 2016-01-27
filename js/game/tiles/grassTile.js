/**
 *
 * Grass
 *
 * Description :
 *  Provide an grass effect on the ground (kind of)
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param parameters {Levels.level.TileParameters.type}
 *
 */

var GrassTile = function (game, x, y, parameters) {

    // Sprite
    Tile.call(this, game, x, y, 'grass', parameters);

    //Randomize the start of the sprite
    //var animOrder = this.randomStart([0,1,2,1]);

    this.animations.add('tile_animation', [0,1,2,1], 2, true);
    this.animations.play("tile_animation");


};



GrassTile.prototype = Object.create(Tile.prototype);
GrassTile.prototype.constructor = GrassTile;

/** Randomize the animation but keep the same order **/
GrassTile.prototype.randomStart = function(animOrder){
    var l = Math.random() * animOrder.length;
    for(var i=0; i<l; i++)
        animOrder.unshift(animOrder.pop());

    return animOrder;
};

GrassTile.prototype.update = function() {
    this.bringToTop();
};