
var Wind = function (game) {
    this.game = game;
    this.create();
};

//Snow.prototype = Object.create(Phaser.Sprite.prototype);
Wind.prototype.constructor = Wind;


Wind.prototype.create = function(){
    this.windChanged = false;
    this.windForce = 0;

    this.windTimer = this.game.time.create(false);
    this.windTimer.start();
    this.windTimer.add(Math.random() * (4000 - 2000)+2000, this.changeWind, this);
};


Wind.prototype.changeWind = function(){
    if(this.windForce) {
        this.windForce = 0;
    }else{
        this.windForce = Math.random() > 0.5 ? -200 : 200;
    }
    this.windChanged = true;
    this.windTimer.add(Math.random() * (4000 - 3000)+3000, this.changeWind, this);
};

Wind.prototype.update = function(events, entities){

    var self = this;
    events.forEach(function(evt){
        if(evt !== undefined && self.windChanged){
            evt.changeWindDirection(self.windForce);
            self.windChanged = false;
        }
    });


    if(this.windForce != 0){
        var force = this.windForce;
        entities.forEachAlive(function(sprite){
            sprite.body.x+=(force/100);
        });
    }

};



