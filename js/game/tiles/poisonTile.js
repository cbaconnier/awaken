/**
 *
 * Poison
 *
 * Description :
 *  Make damages to the entities which are above
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param parameters {Levels.level.TileParameters.type}
 *
 */
var PoisonTile = function (game, x, y, parameters) {

    // Sprite
    Tile.call(this, game, x, y, 'poison', parameters);

    // Randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
        return .5 - Math.random();
    });

    // Animations
    this.animations.add('tile_animation', animOrder, 4, true);
    this.animations.play("tile_animation");
};

PoisonTile.prototype = Object.create(Tile.prototype);
PoisonTile.prototype.constructor = PoisonTile;

PoisonTile.prototype.update = function() {

    this.bringToTop();

    var self = this;
    // Affect poison to the entities which overlap the tile
    this.game.entities.forEachAlive(function(entity){
        if(self.checkOverlap(self.collisions, entity)){
            entity.poisonHit(self.damage);
        }
    });

};