

var WorstEnemyEver = function (game, x, y, parameters, type) {

    Phaser.Sprite.call(this, game, x, y, type);
    this.type = type;


    //this.spider(game, x, y, parameters);

    //this.game = game;
    this.factor = Math.round(Math.random() * (4-1)+1);
    this.init(parameters[type]);
    this.create();
};

WorstEnemyEver.prototype = Object.create(Phaser.Sprite.prototype);
WorstEnemyEver.prototype.constructor = WorstEnemyEver;






WorstEnemyEver.prototype.init = function(parameters){

    this.maxEnemy = parameters.maxEnemy;

    this.damage = parameters.dmg * this.factor  ;
    this.health = parameters.health * this.factor  ;
    this.scoreGiven = parameters.score *this.factor ;

    this.speed = 130 - (10*this.factor);
    this.dir = 0;
    this.animating = false;
    this.attacking = false;
    this.attackIsAvailable = false;
    this.isMovable = true;
};

WorstEnemyEver.prototype.create = function(difficultyFactor){



    /** physics **/
   // this.game.physics.p2.enable(this);
   // this.body.collideWorldBounds = true;
   //

    /** collisions **/
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);
    this.body.setRectangle(4*(this.factor));
    this.body.fixedRotation = true;
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);


    this.sensor = true;
    this.body.onBeginContact.add(this.attack, this);


    /** animations **/

    this.scale.x *= this.factor;
    this.scale.y *= this.factor;





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


};


WorstEnemyEver.prototype.update = function(){
    if(this.alive) {
        this.debugCollisions();
        this.attack();
        if (this.isMovable) this.moveTo({x: this.game.ken.x, y: this.game.ken.y});
        this.animate();
    }
};


WorstEnemyEver.prototype.render = function(){

};

WorstEnemyEver.prototype.moveTo = function(destination, speed, maxTime){;


    //collideWorldBounds bug fix
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    speed = speed || this.speed;
    maxTime = maxTime || 0;


    var radians = Math.atan2(destination.y - this.y, destination.x - this.x);

    if(radians <= -0.79 || radians <=  0.79) this.dir = 1; //east
    if(radians <= -2.4  || radians >=  2.4 ) this.dir = 3; //west
    if(radians <=  2.4  && radians >=  0.79) this.dir = 2; //south
    if(radians >= -2.4  && radians <= -0.79) this.dir = 0; //north

    if (maxTime > 0) {
        //  We know how many pixels we need to move, but how fast?
        speed = this.objectsDistance(this, destination) / (maxTime / 1000);
    }

    if(this.dir==0)this.body.moveUp(speed);
    if(this.dir==2)this.body.moveDown(speed);
    if(this.dir==1)this.body.moveRight(speed);
    if(this.dir==3)this.body.moveLeft(speed);


    //Z-index correction
    if(this.y > this.game.ken.y){
        this.z = this.game.ken.z+1;
        //this.game.world.swap(this.game.ken, this);
    }else{
        this.z = this.game.ken.z-1;
    }



};


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

WorstEnemyEver.prototype.attack = function(){
    if(this.attackIsAvailable) {
        this.game.ken.hit(this.damage);
        //this.sprite.tint = Math.random() * 0xfffff;
        this.attacking = true;
    }
    this.attackIsAvailable = false;
};

WorstEnemyEver.prototype.hit = function(damage){

    //blood
    this.bleed();

    // dialogue
    this.game.ui.dialogue(this.x, this.y, damage.toString(), 15, 350, -96);

    // displacement due to the impact
    var xx = 0;
    var yy = 0;
    var dist = 30;
    if(this.dir==0)yy = -dist;
    if(this.dir==2)yy = dist;
    if(this.dir==1)xx = dist;
    if(this.dir==3)xx = -dist;

    this.isMovable = false; // Update can't use the moveTo function
    this.moveTo({x: this.x - xx, y: this.y - yy}, 300, 150);
    this.game.time.events.add(150, this.setMovable, this); // After 150ms update use the moveTo function

    this.health -= damage;
    if(this.health <= 0){
        this.die();
    }

};

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

    //this.resetBlood();
    this.blood.start(true, 500, null, 10);
    //this.game.time.events.add(500, this.stopBloodMovement, this);
   // this.game.time.events.add(2500, this.removeBlood, this);

};

WorstEnemyEver.prototype.resetBlood = function(){
    var i = this.blood.children.length;
    console.log(this.blood.children);
    while (i--)
    {
        this.blood.children[i].body.moves = true;
    }
};

WorstEnemyEver.prototype.stopBloodMovement = function(){
    var i = this.blood.children.length;
    while (i--)
    {
        this.blood.children[i].body.moves = false;
    }
};

WorstEnemyEver.prototype.removeBlood = function(){
    var i = this.blood.children.length;
    while (i--)
    {
        this.blood.children[i].lifespan = Math.random() * (1000 + 500) - 500;
    }
};

WorstEnemyEver.prototype.setAttackAvailable = function(){
    //overlaping
    if(this.objectsDistance(this, this.game.ken) < 64)
        this.attackIsAvailable = true;

};

WorstEnemyEver.prototype.setMovable = function(){
    this.isMovable = true;
};

WorstEnemyEver.prototype.die = function(){
    this.game.enemiesKilled++;
    this.kill();
};

WorstEnemyEver.prototype.objectsDistance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};

WorstEnemyEver.prototype.resetCollisions = function (){
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
};

WorstEnemyEver.prototype.debugCollisions = function(){
    if(this.game.debugCollisions){
        this.filters = [this.filterDebug];
    }else{
        this.filters =  null;
    }
};


WorstEnemyEver.prototype.checkOverlap = function (body1, body2) {

    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};

