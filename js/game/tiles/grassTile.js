
var GrassTile = function (game, x, y, parameters) {
    //x = 500;
    //y = 250;


    Tile.call(this, game, x, y, 'grass', parameters);
    
    //randomize the order of sprites
    var animOrder = [0,1,2].sort(function() {
                                return .5 - Math.random();
                            });

    this.animations.add('tile_animation', animOrder, 3, true);
    this.animations.play("tile_animation");


};

GrassTile.prototype = Object.create(Tile.prototype);
GrassTile.prototype.constructor = GrassTile;

