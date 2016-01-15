
var Tile = function (game, x, y, type, parameters) {

    x = x || 50;
    y = y || 50;
    Phaser.Sprite.call(this, game, x, y, type);
    this.type = type;
    this.game = game;

    this.init(parameters);

    console.log(this.game.tiles.length);
};

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;


Tile.prototype.init = function(parameters) {

    this.damage = parameters.dmg || null;
    this.speedDecrease = parameters.speedDecrease || null;
    this.frame = parameters.frame || 0;

    this.scale.x = parameters.scaleX || 1;
    this.scale.y = parameters.scaleY || 1;

    if (parameters.dir == 0) this.angle = 0;
    if (parameters.dir == 2) this.angle = 180;
    if (parameters.dir == 1) this.angle = 90;
    if (parameters.dir == 3) this.angle = 270;


};





Tile.prototype.update = function() {

    if(this.speedDecrease || this.damage){
        var self = this;
        this.game.entities.forEachAlive(function(entity){
            if(self.checkOverlap(self, entity)){
                if(self.speedDecrease) entity.decreaseSpeed(self.speedDecrease);
                if(self.damage) entity.hit(self.damage);
            }
        });
    }
};




Tile.prototype.checkOverlap = function (body1, body2) {
    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};
