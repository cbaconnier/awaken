/**
 *
 * Water
 *
 * Description :
 *  Move the entities which are above slower
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param parameters {Levels.level.TileParameters.type}
 *
 */
var WaterTile = function (game, x, y, parameters) {

    // Sprite
    Tile.call(this, game, x, y, 'water', parameters);

    // Randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
        return .5 - Math.random();
    });

    // Animations
    this.animations.add('tile_animation', animOrder, 6, true);
    this.animations.play("tile_animation");

};

WaterTile.prototype = Object.create(Tile.prototype);
WaterTile.prototype.constructor = WaterTile;


WaterTile.prototype.update = function() {

    this.bringToTop();

    var self = this;
    // Decrease the speed of the entities which overlap the tile
    this.game.entities.forEachAlive(function(entity){
        if(self.checkOverlap(self.collisions, entity)){
            entity.decreaseSpeed(self.speedDecrease);
        }
    });

};