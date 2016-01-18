
var IceTile = function (game, x, y, parameters) {

    Tile.call(this, game, x, y, 'ice', parameters);

    //randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
        return .5 - Math.random();
    });
    this.animations.add('tile_animation', animOrder, 2, true);
    this.animations.play("tile_animation");
};

IceTile.prototype = Object.create(Tile.prototype);
IceTile.prototype.constructor = IceTile;
