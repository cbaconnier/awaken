

var Rat = function (game, parameters) {

    this.game = game;
    var location = this.popLocation();
    Phaser.Sprite.call(this, game, location.x, location.y, 'rat');
    this.type = 'rat';

    this.poisoned = {
        value : false
    };

    this.init(parameters[this.type]);
    this.create();
};

Rat.prototype = Object.create(Phaser.Sprite.prototype);
Rat.prototype.constructor = Rat;



Rat.prototype.init = function(parameters){

    this.maxEnemy = parameters.maxEnemy;
    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.defaultHealth = this.health;
    this.scoreGiven = parameters.score;
    this.speed = 200;
    this.defaultSpeed = this.speed;

    this.game.bosses.sharedHealthbar.addEntity(this.health, this.health, " THE RAT");

};

Rat.prototype.create = function(){


    this.animationSpeed = 6;

    /** animations **/
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

    this.scale.x = 2.5;
    this.scale.y = 2.5;

    /** collisions **/

    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false); // true = debug
    this.body.fixedRotation = true;
    this.body.setCircle(32);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    //this.body.collides(this.game.entitiesCollisions);
    this.smoothed = false;

    this.body.collideWorldBounds = false;


    this.destX = null;
    this.destY = null;

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
        //Attack
    this.game.time.events.loop(250, this.setAttackAvailable, this); //1 second
    this.destinationTimer = this.game.time.create(false);
    this.destinationTimer.start();
    this.destinationTimer.add(Math.random() * (3000-1000)+1000 , this.updateDestination, this);
};


Rat.prototype.update = function(){
    if(this.alive) {
        this.move();
        this.attack();
        this.debugCollisions();
        this.animate();
        this.resetSpeed();
        this.yy = this.y;
    }
};

Rat.prototype.decreaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed -= speed;
};

Rat.prototype.increaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed += speed*2.5;
};


Rat.prototype.resetSpeed = function(){
    this.speed = this.defaultSpeed;
};

Rat.prototype.updateDestination = function(){

    this.destX = this.game.ken.x;
    this.destY = this.game.ken.y;




};

Rat.prototype.move = function(destination){


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

        this.destX = null;
        this.destY = null;
        this.destinationTimer.add(2000, this.updateDestination, this);
    }


};


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

Rat.prototype.attack = function(){
    if(this.attackIsAvailable) {
        this.game.ken.hit(this.damage);
        //this.sprite.tint = Math.random() * 0xfffff;
        this.attacking = true;
    }
    this.attackIsAvailable = false;
};



Rat.prototype.poisonHit = function(damage){
    if(!this.poisoned.value){
        this.poisoned.value = true;
        this.highlight(0x0d7200, this.poisoned);
        this.poisonEffect(damage, 10);
    }
};

Rat.prototype.poisonEffect = function(damage, i){
    i--;
    if(i <= 0 || !this.poisoned.value){
        this.poisoned.value = false;
        return;
    }

    var maxDamage = ((this.health-damage) < 0) ? this.health : damage;
    this.game.bosses.sharedHealthbar.updateHealthBar(maxDamage);

    this.health -= damage;
    this.game.dialogues.create(this.x, this.y, damage.toString(), 16, null, null, 0x0d7200);
    if (this.health <= 0) {
        this.die();
    }

    var poisonTimer = this.game.time.create(false);
    poisonTimer.start();
    poisonTimer.add(200, this.poisonEffect, this, damage, i);

};


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



Rat.prototype.hit = function(damage){

    //blood
    this.bleed();

    // dialogue
    this.game.dialogues.create(this.x, this.y, damage.toString(), 15, 350, -96);

    // displacement due to the impact
    var xx = 0;
    var yy = 0;
    var dist = 30;
    if(this.dir==0)yy = -dist;
    if(this.dir==2)yy = dist;
    if(this.dir==1)xx = dist;
    if(this.dir==3)xx = -dist;



    var maxDamage = ((this.health-damage) < 0) ? this.health : damage;
    this.game.bosses.sharedHealthbar.updateHealthBar(maxDamage);

    this.health -= damage;
    if(this.health <= 0){
        this.die();
    }

};

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


Rat.prototype.setAttackAvailable = function(){
    //overlaping
    if(this.objectsDistance(this, this.game.ken) < 64)
        this.attackIsAvailable = true;

};


Rat.prototype.setWindForce = function(force){};

Rat.prototype.die = function(){
    this.game.bossesKilled++;
    var parameters = {
        dir: this.dir,
        scaleX: this.scale.x,
        scaleY: this.scale.y
    };
    this.game.tilesf.addTile('blood', this.x, this.y, parameters);
    this.game.bosses.sharedHealthbar.removeEntity(this.defaultHealth);
    this.kill();
};

Rat.prototype.objectsDistance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};

Rat.prototype.resetCollisions = function (){
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
};

Rat.prototype.debugCollisions = function(){
    if(this.game.debugCollisions){
        this.filters = [this.filterDebug];
    }else{
        this.filters =  null;
    }
};


Rat.prototype.checkOverlap = function (body1, body2) {

    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};

Rat.prototype.popLocation = function(){
    var x = Math.random() * (this.game.world.width * 3) - this.game.world.width;
    var y = (x < 0 || x > this.game.world.height) ?
    Math.random()* (this.game.world.height) :  // X is outside of the screen -> random on the Y axe
        Math.random() > 0.5 ? // X is inside of the screen -> we need to be above the top or below the bottom
        Math.random() - 128 :
        Math.random() * 128 + this.game.world.height;
    return {x:x,y:y};

};