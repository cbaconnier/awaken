
var ShadowTile = function (game, x, y, parameters) {

    Tile.call(this, game, x, y, 'shadow', parameters);
    this.anchor.set(0.5);
    this.enableBody = false;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);
    this.body.collideWorldBounds = false;
    if (parameters.dir == 0)this.body.angle = 0;
    if (parameters.dir == 2) this.body.angle = 180;
    if (parameters.dir == 1)this.body.angle = 90;
    if (parameters.dir == 3) this.body.angle = 270;


};

ShadowTile.prototype = Object.create(Tile.prototype);
ShadowTile.prototype.constructor = ShadowTile;

Tile.prototype.update = function() {
    this.bringToTop();
};