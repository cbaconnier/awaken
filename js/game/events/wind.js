
var Wind = function (game) {
    this.game = game;
    this.create();
};

//Snow.prototype = Object.create(Phaser.Sprite.prototype);
Wind.prototype.constructor = Wind;


Wind.prototype.create = function(){


};


Wind.prototype.update = function(snow, entities){
    if(snow !== undefined) snow.changeWindDirection(200);

    entities.forEachAlive(function(sprite){
        sprite.body.x+=1;
    });


};



