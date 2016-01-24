/**
 *
 * Ice
 *
 * Description :
 *  Move the entities which are above faster
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param parameters {Levels.level.TileParameters.type}
 *
 */

var IceTile = function (game, x, y, parameters) {

    // Sprite
    Tile.call(this, game, x, y, 'ice', parameters);

    // Randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
        return .5 - Math.random();
    });

    // Animations
    this.animations.add('tile_animation', animOrder, 2, true);
    this.animations.play("tile_animation");
};

IceTile.prototype = Object.create(Tile.prototype);
IceTile.prototype.constructor = IceTile;


IceTile.prototype.update = function() {

    this.bringToTop();

    var self = this;
    // Increase the speed of the entities which overlap the tile
    this.game.entities.forEachAlive(function(entity){
        if(self.checkOverlap(self.collisions, entity)){
            entity.increaseSpeed(self.speedIncrease);
        }
    });

};