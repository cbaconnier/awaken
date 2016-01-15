
var BloodTile = function (game, parameters) {

    Tile.call(this, game, parameters.x, parameters.y, 'bloodTile', parameters);


};

BloodTile.prototype = Object.create(Tile.prototype);
BloodTile.prototype.constructor = BloodTile;
