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


    //randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
                                return .5 - Math.random();
                            });

    // Animations
    this.animations.add('tile_animation', animOrder, 3, true);
    this.animations.play("tile_animation");


};

GrassTile.prototype = Object.create(Tile.prototype);
GrassTile.prototype.constructor = GrassTile;


GrassTile.prototype.update = function() {
    this.bringToTop();
};