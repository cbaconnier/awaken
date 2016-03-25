/**
 *
 *  Rat
 *
 *   Description :
 *      Nothing special
 *
 *   Abilities :
 *      Lock the player position
 *      Charge this position
 *      Wait a bit
 *      Repeat
 *
 * @param game
 * @param {Levels.level.bossParameters}
 */

var Rat = function (game, parameters) {

    this.game = game;
    var location = this.popLocation();

    // Sprite
    Phaser.Sprite.call(this, game, location.x, location.y, 'rat');
    this.type = 'rat';


    this.init(parameters[this.type]);
    this.create();
};

Rat.prototype = Object.create(Phaser.Sprite.prototype);
Rat.prototype.constructor = Rat;



Rat.prototype.init = function(parameters){
    // We keep a trace of the max boss of this type for the factory
    this.maxEnemy = parameters.maxEnemy;


    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.defaultHealth = this.health;
    this.scoreGiven = parameters.score;
    this.speed = 200;
    this.defaultSpeed = this.speed;

    this.game.bossesFactory.sharedHealthbar.addEntity(this.health, this.health, " THE RAT");

};

Rat.prototype.create = function(){

    /** Sprite parameters **/
    this.smoothed = false;
    this.scale.x = 2.5;
    this.scale.y = 2.5;


    /** animations **/
    this.animationSpeed = 6;

    //walking animations
    this.animations.add('walk_down', [1,0,2,0], this.animationSpeed, false);
    this.animations.add('walk_up', [5,4,6,4], this.animationSpeed, false);
    this.animations.add('walk_right', [9,8,10,8], this.animationSpeed, false);
    this.animations.add('walk_left', [13,12,14,12], this.animationSpeed, false);

    //attacking animations
    this.animations.add('attack_down', [0,3,0], this.animationSpeed, false);
    this.animations.add('attack_up', [0,7,0], this.animationSpeed, false);
    this.animations.add('attack_right', [0,11,0], this.animationSpeed, false);
    this.animations.add('attack_left', [0,15,0], this.animationSpeed, false);


    /** Physics **/
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);

    /** collisions **/
    this.body.fixedRotation = true;
    this.body.setCircle(32);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    //this.body.collides(this.game.entitiesCollisions);
    this.body.collideWorldBounds = false;


    /** Actions **/
    this.destX = null;
    this.destY = null;

    this.poisoned = {
        value : false  // object because we need the reference of the value when we use it in callback
    };

    /** Blood particles **/
    this.blood = this.game.add.emitter(0, 0, 10);
    this.blood.makeParticles('blood', [0,1,2]);
    this.blood.gravity = 0;



    /** Debug **/
    this.filterDebug = this.game.add.filter('Debug');
    this.filterDebug.red = 0.1;
    this.filterDebug.blue = 1;
    this.filterDebug.green = 0.5;


    //prevent others animations
    this.events.onAnimationStart.add(function(){
        this.attacking = false;
        this.animating = true;
    }, this);

    //allow others animations
    this.events.onAnimationComplete.add(function(){
        this.animating = false;
    }, this);


    /*** Timers ***/
    // Set attack available
    this.game.time.events.loop(250, this.setAttackAvailable, this); //1 second

    // Set a new charge destination
    this.destinationTimer = this.game.time.create(false);
    this.destinationTimer.start();
    this.destinationTimer.add(Math.random() * (3000-1000)+1000 , this.updateDestination, this);
};



/** Theses functions have to be empty. The boss don't react to theses events **/
Rat.prototype.setWindForce = function(force){};



Rat.prototype.update = function(){
    if(this.alive) {
        this.move();
        this.attack();
        this.debugCollisions();
        this.animate();
        this.resetSpeed(); // Events/Tiles can change the speed of the player. When it's done, we reset his speed
        this.yy = this.y;  // update the sort rendering
    }
};

/** Decrease the speed of the boss **/
Rat.prototype.decreaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed -= speed;
};

/** Increase the speed of the boss **/
Rat.prototype.increaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed += speed*2.5;
};

/** Reset the speed of the boss **/
Rat.prototype.resetSpeed = function(){
    this.speed = this.defaultSpeed;
};

/** Update the next destination of the charge **/
Rat.prototype.updateDestination = function(){
    this.destX = this.game.ken.x;
    this.destY = this.game.ken.y;
};


/** Move (charge) to the destination **/
Rat.prototype.move = function(){

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if(this.destX && this.destY){
        var radians = Math.atan2(this.destY - this.y, this.destX - this.x);

        //sprite direction
        if(radians <= -0.79 || radians <=  0.79) this.dir = 1; //east
        if(radians <= -2.4  || radians >=  2.4 ) this.dir = 3; //west
        if(radians <=  2.4  && radians >=  0.79) this.dir = 2; //south
        if(radians >= -2.4  && radians <= -0.79) this.dir = 0; //north


        //velocity direction
        this.body.velocity.x = this.speed * Math.cos(radians);
        this.body.velocity.y = this.speed * Math.sin(radians);

    }

    if(
        this.destY <= this.y+2 &&
        this.destY >= this.y-2 &&
        this.destX <= this.x+2 &&
        this.destX >= this.x-2
        )
    {
        // The boss has reach the destination, wait between 1.5 and 3 seconds, then looks for a new destination
        this.destX = null;
        this.destY = null;
        this.destinationTimer.add(Math.random() * (3000-1500)+1500, this.updateDestination, this);
    }


};

/** Animate the boss **/
Rat.prototype.animate = function(){
    if(!this.animating){ //play if he has finished the previous animation
        if(this.dir == 0){ // north
            if(this.attacking){
                this.animations.play("attack_up");
            }else{
                this.animations.play("walk_up");
            }
        }
        if(this.dir == 1){ //east
            if(this.attacking){
                this.animations.play("attack_right");
            }else{
                this.animations.play("walk_right");
            }
        }
        if(this.dir == 2){ //south
            if(this.attacking){
                this.animations.play("attack_down");
            }else{
                this.animations.play("walk_down");
            }
        }
        if(this.dir == 3){ //west
            if(this.attacking){
                this.animations.play("attack_left");
            }else{
                this.animations.play("walk_left");
            }
        }
    }
};



/** Attack the player **/
Rat.prototype.attack = function(){
    if(this.attackIsAvailable) {
        this.game.ken.hit(this.damage);
        this.attacking = true;
    }
    this.attackIsAvailable = false;
};


/** When the player is hit by poison **/
Rat.prototype.poisonHit = function(damage){
    if (!this.alive) return;
    if(!this.poisoned.value){
        this.poisoned.value = true;
        this.highlight(0x0d7200, this.poisoned);
        this.poisonEffect(damage, 10); // start the poison effect (damage, number of recursions)
    }
};

/** recursives effects of the poison (damage, number of recursions) **/
Rat.prototype.poisonEffect = function(damage, i){
    if (!this.alive) return;

    i--;
    if(i <= 0 || !this.poisoned.value){
        this.poisoned.value = false;
        return;
    }

    var maxDamage = ((this.health-damage) < 0) ? this.health : damage;
    this.game.bossesFactory.sharedHealthbar.updateHealthBar(maxDamage);

    this.health -= damage;
    this.game.dialogues.create(this.x, this.y, damage.toString(), 16, null, null, 0x0d7200);
    if (this.health <= 0) {
        this.die();
    }

    // we recursing this function again
    var poisonTimer = this.game.time.create(false);
    poisonTimer.start();
    poisonTimer.add(200, this.poisonEffect, this, damage, i);

};

/** Highlight the rat while the given object is true **/
Rat.prototype.highlight = function(tint, callback){
    if(callback.value){
        this.tint =  (this.tint == 0xffffff) ? tint : 0xffffff;

        var timerHighlight = this.game.time.create(false);
        timerHighlight.start();
        timerHighlight.add(200, this.highlight, this, tint, callback);
    }else{
        this.tint = 0xffffff;
    }

};


/** When the boss get hit **/
Rat.prototype.hit = function(damage){
    if (!this.alive) return;

    //blood
    this.bleed();

    // damage dialogue
    this.game.dialogues.create(this.x, this.y, damage.toString(), 15, 350, -96);

    // Update shared Health bar
    var maxDamage = ((this.health - damage) < 0) ? this.health : damage;
    this.game.bossesFactory.sharedHealthbar.updateHealthBar(maxDamage);

    this.health -= damage;
    if (this.health <= 0) {
        this.die();
    }

};


/** Make the boss bleeding **/
Rat.prototype.bleed = function(){
    this.blood.x = this.x;
    this.blood.y = this.y;


    if(this.game.ken.dir==2){
        this.blood.setXSpeed(50, -55);
        this.blood.setYSpeed(50, 150);
    }
    if(this.game.ken.dir==0){
        this.blood.setXSpeed(50, -55);
        this.blood.setYSpeed(-50, -150);
    }
    if(this.game.ken.dir==1){
        this.blood.setXSpeed(50, 150);
        this.blood.setYSpeed(50, -55);
    }
    if(this.game.ken.dir==3){
        this.blood.setXSpeed(-50, -150);
        this.blood.setYSpeed(50, -55);
    }

    this.blood.start(true, 500, null, 10);


};

/** Set attack available if the player is close to the boss **/
Rat.prototype.setAttackAvailable = function(){
    //overlaping
    if(this.objectsDistance(this, this.game.ken) < 64)
        this.attackIsAvailable = true;
};



/** Boss die **/
Rat.prototype.die = function(){
    if (!this.alive) return;

    this.game.bossesKilled++;

    //Blood tile parameters
    var parameters = {
        dir: this.dir,
        scaleX: this.scale.x,
        scaleY: this.scale.y
    };
    this.game.tilesFactory.addTile('blood', this.x, this.y, parameters);

    //remove boss from the sharedHealthBar
    this.game.bossesFactory.sharedHealthbar.removeEntity(this.defaultHealth);

    this.kill();
};

/** Return the distance between two objects **/
Rat.prototype.objectsDistance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};

/** reset the collisions (when we toggle the fullscreen) **/
Rat.prototype.resetCollisions = function (){
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    //this.body.collides(this.game.entitiesCollisions);
};

/** Debug the collisions **/
Rat.prototype.debugCollisions = function(){
    if(this.game.debugCollisions){
        this.filters = [this.filterDebug];
    }else{
        this.filters =  null;
    }
};


/** Init the pop location (outside of the screen) **/
Rat.prototype.popLocation = function(){
    var x = Math.random() * (this.game.world.width * 3) - this.game.world.width;
    var y = (x < 0 || x > this.game.world.height) ?
    Math.random()* (this.game.world.height) :  // X is outside of the screen -> random on the Y axe
        Math.random() > 0.5 ? // X is inside of the screen -> we need to be above the top or below the bottom
        Math.random() - 128 :
        Math.random() * 128 + this.game.world.height;
    return {x:x,y:y};

};