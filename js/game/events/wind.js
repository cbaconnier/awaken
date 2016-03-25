/**
 *
 * Wind event is a bit special because he can affect others events and entities
 * Also, he has sprites to indicate to the player that it's windy
 *
 *
 * @param game
 *
 */

var Wind = function (game) {
    this.game = game;
    this.create();
};

Wind.prototype.constructor = Wind;

/** Create the wind **/
Wind.prototype.create = function(){
    this.windChanged = false; //When it's true, we change the direction of the wind
    this.windForce = 0; //default force of the wind

    /** Create 3 sprites to indicate that's windy **/
    this.windSprites = [];
    for(var i=0; i<3; i++)
        this.windSprites.push(this.game.add.sprite(0, 0, 'wind'));

    /** Define a new location for the sprites (Should be refactored in sprite creation) **/
    var self = this;
    this.windSprites.forEach(function(sprite){
        sprite.visible = false;
        sprite.x = Math.random() * (self.game.width-200)+100;
        sprite.y = Math.random() * (self.game.height-300)+150;
        sprite.scale.x = Math.random() * (3 - 1)+3;
        sprite.scale.y = Math.random() * (3 - 1)+3;
    });

    /** Timer for the wind **/
    this.windTimer = this.game.time.create(false);
    this.windTimer.start();
    this.windTimer.add(Math.random() * (4000 - 2000)+2000, this.changeWind, this);


};

/** We toggle the wind (active or inactive) **/
Wind.prototype.changeWind = function(){
    //We stop the wind
    if(this.windForce) {
        this.windForce = 0;
        var self = this;
        // Define the new location of the sprites before the next wind event
        this.windSprites.forEach(function(sprite){
            sprite.visible = false;
            sprite.x = Math.random() * (self.game.width-200)+100;
            sprite.y = Math.random() * (self.game.height-300)+150;
            sprite.scale.x = Math.random() * (3 - 1)+3;
            sprite.scale.y = Math.random() * (3 - 1)+3;
        });
    // We define the force of the wind and set the sprites visible
    }else{
        this.windForce = Math.random() > 0.5 ? -200 : 200;
        this.windSprites.forEach(function(sprite) {
            sprite.visible = true;
        });
    }
    this.windChanged = true; //indicate to the update that we have change something

    //Change the wind again in 3 or 4 seconds
    this.windTimer.add(Math.random() * (4000 - 3000)+3000, this.changeWind, this);
};

Wind.prototype.changeWindDirection = function(){};


/** Update logic if the wind **/
Wind.prototype.update = function(){

    /** Trigger the wind effect on the others events **/
    var self = this;
    this.game.events.forEach(function(evt){
        if(evt !== undefined && self.windChanged){
            evt.changeWindDirection(self.windForce);
        }
    });


    if(this.windForce != 0){

        /** Update the wind force on the entities **/
        var force = Math.round(this.windForce/100);

        this.game.entities.forEachAlive(function(entity){
            entity.setWindForce(force);
        });

        /** Move the wind sprites **/
        this.windSprites.forEach(function(sprite) {
            if(sprite.scale.x > 0 && force < 0) sprite.scale.x *= -1;
            if(sprite.scale.x < 0 && force > 0) sprite.scale.x *= -1;
            sprite.angle = Math.random() * (2 +2)+2;
            sprite.x += force * (Math.random() * (1.5 - 1)+1.5);
        });

    }

};



