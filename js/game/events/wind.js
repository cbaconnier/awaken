
var Wind = function (game) {
    this.game = game;
    this.create();
};

//Snow.prototype = Object.create(Phaser.Sprite.prototype);
Wind.prototype.constructor = Wind;


Wind.prototype.create = function(){
    this.windIsAvailable = false;
    this.windForce = 0;

    this.windTimer = this.game.time.create(false);
    this.windTimer.start();
    this.windTimer.add(Math.random() * (4000 - 2000)+2000, this.changeWind, this);
};


Wind.prototype.changeWind = function(){
    if(this.windForce) {
        this.windForce = 0;
    }else{
        this.windForce = 200;
    }
    this.windTimer.add(Math.random() * (4000 - 2000)+2000, this.changeWind, this);
};

Wind.prototype.update = function(snow, entities){

        if(snow !== undefined) snow.changeWindDirection(this.windForce);

    if(this.windForce){
        entities.forEachAlive(function(sprite){
            sprite.body.x+=1;
        });
    }

};



