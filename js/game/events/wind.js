
var Wind = function (game) {
    this.game = game;
    this.create();
};

//Snow.prototype = Object.create(Phaser.Sprite.prototype);
Wind.prototype.constructor = Wind;


Wind.prototype.create = function(){
    this.windChanged = false;
    this.windForce = 0;

    this.windSprites = [];
    for(var i=0; i<3; i++)
        this.windSprites.push(this.game.add.sprite(0, 0, 'wind'));

    var self = this;
    this.windSprites.forEach(function(sprite){
        sprite.visible = false;
        sprite.x = Math.random() * (self.game.width-200)+100;
        sprite.y = Math.random() * (self.game.height-300)+150;
        sprite.scale.x = Math.random() * (3 - 1)+3;
        sprite.scale.y = Math.random() * (3 - 1)+3;
    });

    this.windTimer = this.game.time.create(false);
    this.windTimer.start();
    this.windTimer.add(Math.random() * (4000 - 2000)+2000, this.changeWind, this);




};


Wind.prototype.changeWind = function(){
    if(this.windForce) {
        this.windForce = 0;
        var self = this;
        this.windSprites.forEach(function(sprite){
            sprite.visible = false;
            sprite.x = Math.random() * (self.game.width-200)+100;
            sprite.y = Math.random() * (self.game.height-300)+150;
            sprite.scale.x = Math.random() * (3 - 1)+3;
            sprite.scale.y = Math.random() * (3 - 1)+3;
        });

    }else{
        this.windForce = Math.random() > 0.5 ? -200 : 200;
        this.windSprites.forEach(function(sprite) {
            sprite.visible = true;
        });
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

        var force = Math.round(this.windForce/100);

        entities.forEachAlive(function(entity){
            entity.setWindForce(force);
        });

        this.windSprites.forEach(function(sprite) {
            if(sprite.scale.x > 0 && force < 0) sprite.scale.x *= -1;
            if(sprite.scale.x < 0 && force > 0) sprite.scale.x *= -1;
            sprite.angle = Math.random() * (2 +2)+2;
            sprite.x += force * (Math.random() * (1.5 - 1)+1.5);
        });

    }

};



