/**
 *
 * Shadow
 *
 * Description :
 *  Provide an shadow effect on the ground
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param parameters {Levels.level.TileParameters.type}
 *
 */

var ShadowTile = function (game, x, y, parameters) {
    // Sprite
    Tile.call(this, game, x, y, 'shadow', parameters);
    this.anchor.set(0.5);

    // Physic
    this.enableBody = false;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);

    // Collisions (disabled)
    this.body.collideWorldBounds = false;

    // Orientation of the sprite
    if (parameters.dir == 0) this.body.angle = 0;
    if (parameters.dir == 2) this.body.angle = 180;
    if (parameters.dir == 1) this.body.angle = 90;
    if (parameters.dir == 3) this.body.angle = 270;


};

ShadowTile.prototype = Object.create(Tile.prototype);
ShadowTile.prototype.constructor = ShadowTile;

ShadowTile.prototype.update = function() {
    this.bringToTop();
};