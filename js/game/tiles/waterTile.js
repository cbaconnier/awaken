
var WaterTile = function (game, parameters) {
    x = 450;
    y = 450;
    Tile.call(this, game, x, y, 'bloodTile', parameters);

};

WaterTile.prototype = Object.create(Tile.prototype);
WaterTile.prototype.constructor = WaterTile;
