/**
 *
 * Blood
 *
 * Description :
 *  Provide an blood effect on the ground
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param parameters {Levels.level.TileParameters.type}
 *
 */
var BloodTile = function (game, x, y, parameters) {
    // Sprite
    Tile.call(this, game, x, y, 'bloodTile', parameters);

};

BloodTile.prototype = Object.create(Tile.prototype);
BloodTile.prototype.constructor = BloodTile;

// Override update to be sure, that he's done nothing else
BloodTile.prototype.update = function() {};