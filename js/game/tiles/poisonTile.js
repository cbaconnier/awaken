
var PoisonTile = function (game, x, y, parameters) {


    Tile.call(this, game, x, y, 'poison', parameters);

    //randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
        return .5 - Math.random();
    });
    this.animations.add('tile_animation', animOrder, 4, true);
    this.animations.play("tile_animation");
};

PoisonTile.prototype = Object.create(Tile.prototype);
PoisonTile.prototype.constructor = PoisonTile;
