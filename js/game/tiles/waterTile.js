
var WaterTile = function (game, x, y, parameters) {


    Tile.call(this, game, x, y, 'water', parameters);

    //randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
        return .5 - Math.random();
    });
    this.animations.add('tile_animation', animOrder, 6, true);
    this.animations.play("tile_animation");

};

WaterTile.prototype = Object.create(Tile.prototype);
WaterTile.prototype.constructor = WaterTile;
