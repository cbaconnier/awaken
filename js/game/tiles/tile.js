
var Tile = function (game, x, y, type, parameters) {

    //x = x || 0;
    // y = y || 0;
    Phaser.Sprite.call(this, game, x, y, type);
    this.type = type;
    this.game = game;
    this.smoothed = false;
    this.anchor.set(0.5);
    this.init(parameters);


    //when the scale is 1 we need to adjust the bottom to -40
    //when the scale is 4 we need to adjust the bottom to -10
    // So.. : scale / (0.025 * scale ^ 2)
    var bottomAdjustment = this.scale.y / (0.025 * Math.pow(this.scale.y, 2));
    this.collisions = {
        left: this.left + this.scale.x*5,
        right: this.right - this.scale.x*5,
        top: this.top + this.scale.y*2,
        bottom: this.bottom - bottomAdjustment
    };


};

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.init = function(parameters) {

    this.damage = parameters.dmg || null;
    this.speedDecrease = parameters.speedDecrease || null;
    this.speedIncrease = parameters.speedIncrease || null;
    this.frame = parameters.frame || 0;

    var scaleX = parameters.scale || Math.round(Math.random() * (3 - 1) + 1);
    var scaleY = scaleX;

    this.scale.x = parameters.scaleX || scaleX+2;
    this.scale.y = parameters.scaleY || scaleY;

    if (parameters.dir == 0) {
        this.scale.x+=2;
        this.angle = 0;
    }
    if (parameters.dir == 2) {
        this.scale.x+=2;
        this.angle = 180;
    }
    if (parameters.dir == 1) {
        this.scale.y+=2;
        this.angle = 90;
    }
    if (parameters.dir == 3) {
        this.scale.y+=2;
        this.angle = 270;
    }


};




Tile.prototype.update = function() {
    if(this.speedDecrease || this.damage || this.speedIncrease){
        this.bringToTop();
        var self = this;
        this.game.entities.forEachAlive(function(entity){
            if(self.checkOverlap(self.collisions, entity)){
                if(self.speedDecrease) entity.decreaseSpeed(self.speedDecrease);
                if(self.speedIncrease) entity.increaseSpeed(self.speedIncrease);
                if(self.damage) entity.poisonHit(self.damage);
            }
        });
    }
};




Tile.prototype.checkOverlap = function (body1, body2) {
    return (
        body1.left   < body2.right &&
        body1.right  > body2.left &&
        body1.top    < body2.bottom &&
        body1.bottom > body2.top
    );

};
