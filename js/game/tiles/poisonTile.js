
var PoisonTile = function (game, parameters) {
    x = 250;
    y = 250;
    Tile.call(this, game, x, y, 'bloodTile', parameters);

};

PoisonTile.prototype = Object.create(Tile.prototype);
PoisonTile.prototype.constructor = PoisonTile;
