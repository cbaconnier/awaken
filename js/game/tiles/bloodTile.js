
var BloodTile = function (game, x, y, parameters) {

    Tile.call(this, game, x, y, 'bloodTile', parameters);

};

BloodTile.prototype = Object.create(Tile.prototype);
BloodTile.prototype.constructor = BloodTile;


BloodTile.prototype.update = function() {};