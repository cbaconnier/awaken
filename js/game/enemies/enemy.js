/**
 *
 * WorstEnemyEver parent
 *
 * Description :
 *  We can't instantiate this object. It's only the parent of the enemies.
 *  The object extend Sprite
 *
 *  All the enemies have the same behavior. They all follow the player
 *  They can have different size, speed, damage.
 *  All theses parameters came initially from the Levels.level.enemyParameters but they are influenced by a factor
 *  Who his calculate herer
 *
 *
 * Abilities :
 *  Attack when they are close to the player
 *
 *
 * @param game
 * @param {Levels.level.enemyParameters}
 *
 */


var WorstEnemyEver = function (game, parameters, type) {

    this.game = game;

    // start position
    var location = this.popLocation();

    // Sprite
    Phaser.Sprite.call(this, game, location.x, location.y, type);

    // Set type of the entity
    this.type = type;




    // Initialise the parameters
    this.init(parameters[type]);
    this.create();
};

WorstEnemyEver.prototype = Object.create(Phaser.Sprite.prototype);
WorstEnemyEver.prototype.constructor = WorstEnemyEver;


/** Init the enemy **/
WorstEnemyEver.prototype.init = function(parameters){

    // The factor define the size, the health, the speed and the damages of the enemy
    this.factor = Math.round(Math.random() * (4-1)+1);

    // We keep a trace of the max enemy of this type for the factory
    this.maxEnemy = parameters.maxEnemy;

    /** propriety of the enemy **/
    this.damage = parameters.dmg * this.factor  ;
    this.health = parameters.health * this.factor  ;
    this.scoreGiven = parameters.score *this.factor ;
    this.speed = 130 - (10*this.factor);
    this.defaultSpeed = this.speed;

    // starting direction
    this.dir = 0;

    /** Availability of actions **/
    this.animating = false; // enemy is currently animated
    this.attacking = false; // enemy is currently attacking
    this.attackIsAvailable = false; // Attacking action is available
    this.blocked = false; // Block the enemy
    this.isMovable = true; // Can't move

    this.poisoned = {
        value : false // object because we need the reference of the value when we use it in callback
    };


};

WorstEnemyEver.prototype.create = function(){

    /** Sprite parameters **/
    this.scale.x = this.factor;
    this.scale.y = this.factor;
    // Others sprites parameters must be define the child class

    /** Physic **/
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);
    this.body.fixedRotation = true;

    /** collisions **/
    this.body.setRectangle(4*(this.factor));
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
    this.yy = this.y;
    this.sensor = true;
    this.body.onBeginContact.add(this.attack, this);

    /** Blood particles **/
    this.blood = this.game.add.emitter(0, 0, 10);
    this.blood.makeParticles('blood', [0,1,2]);
    this.blood.gravity = 0;

    /** Debug **/
    this.filterDebug = this.game.add.filter('Debug');
    this.filterDebug.red = 0.1;
    this.filterDebug.blue = 1;
    this.filterDebug.green = 0.5;

    /** Animations behavior **/
    // prevent others animations
    this.events.onAnimationStart.add(function(){
        this.attacking = false;
        this.animating = true;
    }, this);

    // allow others animations
    this.events.onAnimationComplete.add(function(){
        this.animating = false;
    }, this);

    /*** Timers ***/
    //Attack
    this.game.time.events.loop(250, this.setAttackAvailable, this); //1 second


};

/** Update of the entity logic **/
WorstEnemyEver.prototype.update = function(){
    if(this.alive) {
        if(!this.blocked){
            if (this.isMovable) this.moveTo({x: this.game.ken.x, y: this.game.ken.y});
            this.attack();
        }else{
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }

        this.debugCollisions();
        this.animate();
        this.yy = this.y; // We update the sort render
        this.resetSpeed(); // Events/Tiles can change the speed of the player. When it's done, we reset his speed
    }
};

/** Decrease the speed of the enemy **/
WorstEnemyEver.prototype.decreaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed -= speed;
};

/** Increase the speed of the enemy **/
WorstEnemyEver.prototype.increaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed += speed*2.5;
};

/** Reset the speed of the enemy **/
WorstEnemyEver.prototype.resetSpeed = function(){
    this.speed = this.defaultSpeed;
};

/** Move the enemy to the player **/
WorstEnemyEver.prototype.moveTo = function(destination, speed){

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    speed = speed || this.speed;

    var radians = Math.atan2(destination.y - this.y, destination.x - this.x);

    if(radians <= -0.79 || radians <=  0.79) this.dir = 1; //east
    if(radians <= -2.4  || radians >=  2.4 ) this.dir = 3; //west
    if(radians <=  2.4  && radians >=  0.79) this.dir = 2; //south
    if(radians >= -2.4  && radians <= -0.79) this.dir = 0; //north


    if(this.dir==0)this.body.moveUp(speed);
    if(this.dir==2)this.body.moveDown(speed);
    if(this.dir==1)this.body.moveRight(speed);
    if(this.dir==3)this.body.moveLeft(speed);

};

/** Animate the enemy **/
WorstEnemyEver.prototype.animate = function(){
    if(!this.animating && this.isMovable){ //play if he has finished the previous animation
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

/** When the attack is available, the enemy attack the player**/
WorstEnemyEver.prototype.attack = function(){
    if(this.attackIsAvailable) {
        this.game.ken.hit(this.damage);
        this.attacking = true;
    }
    this.attackIsAvailable = false;
};


/** When the player is hit by poison **/
WorstEnemyEver.prototype.poisonHit = function(damage){
    if (!this.alive) return;
    if(!this.poisoned.value){
        this.poisoned.value = true;
        this.highlight(0x0d7200, this.poisoned);
        this.poisonEffect(damage, 10);  // start the poison effect (damage, number of recursions)
    }
};

/** recursives effects of the poison (damage, number of recursions) **/
WorstEnemyEver.prototype.poisonEffect = function(damage, i){
    if (!this.alive) return;
    i--;
    if(i <= 0 || !this.poisoned.value){
        this.poisoned.value = false;
        return;
    }

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

/** Highlight the enemy while the given object is true **/
WorstEnemyEver.prototype.highlight = function(tint, callback){
    if(!this.alive){
        this.tint = 0xffffff;
        return;
    }

    if(callback.value){
        this.tint =  (this.tint == 0xffffff) ? tint : 0xffffff;

        var timerHighlight = this.game.time.create(false);
        timerHighlight.start();
        timerHighlight.add(200, this.highlight, this, tint, callback);
    }else{
        this.tint = 0xffffff;
    }

};


/** When the enemy get hit **/
WorstEnemyEver.prototype.hit = function(damage){
    if (!this.alive) return;
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

    this.isMovable = false; // Update has to not use the moveTo function, we use this one instead
    this.moveTo({x: this.x - xx, y: this.y - yy}, 300, 150);
    this.game.time.events.add(150, this.setMovable, this); // After 150ms can use the moveTo function

    this.health -= damage;
    if(this.health <= 0){
        this.die();
    }

};


/** Make the enemy bleeding **/
WorstEnemyEver.prototype.bleed = function(){
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

/** Set attack available if the player is close to the enemy **/
WorstEnemyEver.prototype.setAttackAvailable = function(){
    //overlaping
    if(this.objectsDistance(this, this.game.ken) < 64)
        this.attackIsAvailable = true;

};

/** Set the enemy movable. Update can use the moveTo function **/
WorstEnemyEver.prototype.setMovable = function(){
    this.isMovable = true;
};

/** Simulates the wind force on the enemy -- see ns.Wind **/
WorstEnemyEver.prototype.setWindForce = function(force){
    if(!this.blocked) this.body.x+=force;
};

/** Enemy die **/
WorstEnemyEver.prototype.die = function(){
    if (!this.alive) return;

    this.game.enemiesKilled++;

    // blood tile parameters
    var parameters = {
        dir: this.dir,
        scaleX: this.scale.x,
        scaleY: this.scale.y
    };
    this.game.tilesFactory.addTile('blood', this.x, this.y, parameters);
    this.kill();
};

/** Return the distance between two objects **/
WorstEnemyEver.prototype.objectsDistance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};

/** Return the distance between two objects **/
WorstEnemyEver.prototype.resetCollisions = function (){
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
};

/** Debug the collisions **/
WorstEnemyEver.prototype.debugCollisions = function(){
    if(this.game.debugCollisions){
        this.filters = [this.filterDebug];
    }else{
        this.filters =  null;
    }
};

/** Check the overlap between two bodies **/
WorstEnemyEver.prototype.checkOverlap = function (body1, body2) {
    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );
};

/** Init the pop location (outside of the screen) **/
WorstEnemyEver.prototype.popLocation = function(){
    var x = Math.random() * (this.game.world.width * 3) - this.game.world.width;
    var y = (x < 0 || x > this.game.world.height) ?
    Math.random()* (this.game.world.height) :  // X is outside of the screen -> random on the Y axe
        Math.random() > 0.5 ? // X is inside of the screen -> we need to be above the top or below the bottom
        Math.random() - 128 :
        Math.random() * 128 + this.game.world.height;
    return {x:x,y:y};

};