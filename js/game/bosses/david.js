/**
 *
 * Boss david
 *
 * Description :
 *  The boss is a foot.
 *  The boss have a leg (that do nothing, except hide a part of the game) and a shadow
 *  The shadow indicate the position of the foot to the player
 *
 *  The only attackable part of the boss is his foot
 *
 * Abilities :
 *  Attack from the top (zero collisions)
 *  Crush the ground (custom collisions)
 *  Pull up the foot
 *
 *
 *
 * @param game
 * @param {Levels.level.bossParameters}
 *
 */
var David = function (game, parameters) {

    var type = 'david';
    this.game = game;

    // Start position
    var x = game.width/2;
    var y = -150;

    // Sprite
    Phaser.Sprite.call(this, game, x, y, 'david_foot');
    this.anchor.set(0.5);

    // Set type of the entity
    this.type = type;

    // Initialise the parameters
    this.init(parameters[this.type]);
    this.create();


};

David.prototype = Object.create(Phaser.Sprite.prototype);
David.prototype.constructor = David;



/** Initialise the boss **/
David.prototype.init = function(parameters) {
    this.maxEnemy = parameters.maxEnemy;
    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.defaultHealth = this.health;
    this.scoreGiven = parameters.score;

    this.game.bosses.sharedHealthbar.addEntity(this.health, this.health, "DAVID");


};

David.prototype.create = function(){

    /** Sprite parameter **/
    this.scale.x = 13;
    this.scale.y = 13;
    this.frame = 3;
    this.smoothed = false;


    // Define the default yy render sort
    this.yy = this.y;


    /** Physic **/
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);

    /** Collisions **/
    this.body.setRectangle(350, 80, 0, 26);
    this.body.fixedRotation = true;
    this.body.collideWorldBounds = false;
    this.body.kinematic = true;

    /** Attack Phases **/
    this.destinationY = 0;
    this.phase1 = false;
    this.phase3 = false;
    //this.phase1 = false;
    this.lastPhase = false;

    /** Behavior **/
    this.canTakeDamage = false;
    this.blocked = false;

    /** Child sprites **/
    // Shadow
    this.shadow = this.game.tilesf.addTile('shadow', this.game.ken.x, this.game.ken.y, {dir: this.dir, scaleX:1, scaleY:1});

    // Leg
    var leg = this.game.make.sprite(0, -8, 'david_leg');
    leg.anchor.setTo(0.5, 1);
    this.addChild(leg);
    this.leg = leg;
    this.leg.smoothed = false;
    this.leg.frame = 1;

    /** Blood particles **/
    this.blood = this.game.add.emitter(0, 0, 10);
    this.blood.makeParticles('blood', [0,1,2]);
    this.blood.gravity = 0;

    /** Timers **/
        //Attack
    this.attackTimer = this.game.time.create(false);
    this.attackTimer.start();
    this.attack();

    /** Audio **/
    this.fxAttack = this.game.add.audio('fx_david');
    this.fxAttack.allowMultiple = false;
    this.fxAttack.volume = 0.6;



    /** Debug **/
    this.filterDebug = this.game.add.filter('Debug');
    this.filterDebug.red = 0.1;
    this.filterDebug.blue = 1;
    this.filterDebug.green = 0.5;
};



/** Theses functions have to be empty. The boss don't react to theses events **/
David.prototype.decreaseSpeed = function(speed){};
David.prototype.increaseSpeed = function(speed){};
David.prototype.resetSpeed = function(){};
David.prototype.poisonHit = function(damage){};
David.prototype.setWindForce = function(force){};



David.prototype.update = function(){
if(this.alive){
    if(!this.blocked){

        // Phase 1 of the attack : The boss follow the player
        if(this.phase1 && this.game.ken.x > this.x) this.body.velocity.x = 100;
        if(this.phase1 && this.game.ken.x <  this.x) this.body.velocity.x = -100;
        if(this.phase1 && this.game.ken.y > this.y) this.body.velocity.y = 100;
        if(this.phase1 && this.game.ken.y <  this.y) this.body.velocity.y = -100;

        // Phase 1 of the attack : The shadow follow the player for the Y axe and the foot for the axe X
        if(this.phase1 && this.game.ken.y+32 > this.shadow.y) this.shadow.body.velocity.y = 100;
        if(this.phase1 && this.game.ken.y+32 <  this.shadow.y) this.shadow.body.velocity.y = -100;
        this.shadow.body.x = this.body.x;

        // While the foot go down, the shadow become more bigger
        if(this.phase1){
            this.shadow.scale.x += 0.005;
            this.shadow.scale.y += 0.005;
        }

        // When the foot reach the ken position-300px we start the second phase (The foot going down)
        if(this.y >= this.game.ken.y-300 && this.phase1){
            this.attackPhase2();
        }

        // The foot is getting faster, the shadow become much bigger
        if(this.phase3){
            if(this.shadow.scale.x < this.scale.x-1 && this.shadow.scale.y < this.scale.y-1){
                this.shadow.scale.x += .1;
                this.shadow.scale.y += .1;
            }
        }

        // The foot as reach the destination, we change the sprite and starting the new phase
        if(this.y >= this.destinationY && this.phase3){
            this.attackPhase4();
            if(this.frame == 0) this.frame++;
            if(this.frame == 2) this.frame++;
        }

        // The foot goes up, the shadow size is reduced
        if(this.lastPhase){
            if(this.shadow.scale.x >= 0)this.shadow.scale.x -= .1;
            if(this.shadow.scale.y >= 0)this.shadow.scale.y -= .1;
        }

        //if(this.phase1){
         //   if(this.game.ken.x > this.x)
        //        this.body.velocity.x = 100;
        //    if(this.game.ken.x < this.x)
        //        this.body.velocity.x = -100;
       // }
    }else{
        // foot is blocked by a event (like game over), we stop the movement
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

    }

    // We update the sort render
    this.yy = this.y+85;
}


};

/** Start the attack with all the phases  **/
David.prototype.attack = function(){
    if(this.alive){

        // Initialise the start position before attacking
        this.shadow.visible = false;
        this.body.x = this.game.ken.x;
        this.body.velocity.y = 0;
        this.body.y = -80-this.game.height;
        this.destinationY = this.game.ken.y;
        this.lastPhase = false;

        // Set the foot with front or profile
        if(Math.round(Math.random())){ //0 or 1
            this.body.setRectangle(150, 80, 0, 26);
            this.frame = 0;
            this.leg.frame = 0;
            this.dir = 0;
        }else{
            this.body.setRectangle(350, 80, 0, 26);
            this.frame = 2;
            this.leg.frame = 1;
            this.dir = 3;
        }
    }

    // Start the first phase
    this.attackPhase1();

};

/*************************
 * START THE ATTACK PHASE
 ************************/

/** Foot going down calmly **/
David.prototype.attackPhase1 = function() {

    this.body.velocity.y = 100;

    //adjust the shadow with the foot (front or profile)
    if (this.dir == 0) {
        this.shadow.scale.x=4;
        this.shadow.scale.y=1;
        this.shadow.body.angle =0 ;
    }
    if (this.dir == 3) {
        this.shadow.scale.x=1;
        this.shadow.scale.y=4;
        this.shadow.body.angle = 270;
    }
    this.shadow.visible = true;


    this.phase1 = true;
};

/** When the phase1 is done (see update) : The foot stop moving for a time **/
David.prototype.attackPhase2 = function() {
    this.phase1 = false;

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.shadow.body.velocity.y = 0;
    this.destinationY = this.shadow.body.y-64; //set the destination for the next phase


    var attackTimer = this.game.time.create(false);
    attackTimer.start();
    attackTimer.add(500, this.attackPhase3, this);

};


/** Foot going down very fast until he reach the destination (see update) **/
David.prototype.attackPhase3 = function() {

    this.phase3 = true;

    this.body.velocity.y = 1000;
    if(this.frame == 0) this.frame++;
    if(this.frame == 2) this.frame++;
};

/** The foot as reach the ground, he can hit once and have to active collisions. He can also get damage**/
David.prototype.attackPhase4 = function() {
    this.fxAttack.play();
    this.canTakeDamage = true;
    this.phase3 = false;
    this.body.velocity.y = 0;
    this.shadow.visible = false;

    //Because we use a custom collision zone, we have to get the real collisions bounds of the sprite
    //P2 convert pixels to meters with 20px/m, we need them in pixels so : multiplied by 20
    var body = {};
    var correctionX = this.body.data.shapes[0].position[0]*20;
    var correctionY = this.body.data.shapes[0].position[1]*20;
    body.left   = this.x + (this.body.data.shapes[0].vertices[0][0] * 20) - correctionX;
    body.right  = this.x + (this.body.data.shapes[0].vertices[1][0] * 20) - correctionX;
    body.top    = this.y + (this.body.data.shapes[0].vertices[0][1] * 20) - correctionY;
    body.bottom = this.y + (this.body.data.shapes[0].vertices[2][1] * 20) - correctionY;

    // Check collisions with entities
    var self = this;
    this.game.entities.forEachAlive(function(entity){
        if(self.checkOverlap( body, entity)){
            if(entity.type != self.type) entity.hit(self.damage);
        }
    });


    // Enable Collisions
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);


    // Set a timer before leaving the ground
    var attackTimer = this.game.time.create(false);
    attackTimer.start();
    attackTimer.add(3000, this.attackPhase5, this);

};


/** Leave the ground, the foot can take damage anymore**/
David.prototype.attackPhase5 = function() {
    if(this.alive){
        this.lastPhase = true;
        this.canTakeDamage = false;
        this.shadow.visible = true;

        this.body.clearCollision(true); // remove collisions
        this.body.velocity.y = -500; // going up

        //After 2 seconds going up, we reset the position
        this.attackTimer.add(2000, this.attack, this);
        //this.attack();
    }
};

/*************************
 * END THE ATTACK PHASE
 ************************/



/** Make the boss bleeding **/
David.prototype.bleed = function(){

    this.blood.x = this.game.ken.spriteAttack.x;
    this.blood.y = this.game.ken.spriteAttack.y;


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

    this.blood.start(true, 500, null, 50);
};




/** When the boss get hit **/
David.prototype.hit = function(damage){

    if(this.canTakeDamage){
        //blood particles
        this.bleed();

        this.game.dialogues.create(this.x, this.y, damage.toString(), 30, 350, -96);

        var maxDamage = ((this.health-damage) < 0) ? this.health : damage;
        this.game.bosses.sharedHealthbar.updateHealthBar(maxDamage);

        this.health -= damage;
        if(this.health <= 0){
            this.die();
        }
    }
};

/** Boss die **/
David.prototype.die = function(){
    this.game.bossesKilled++;

    //Blood tile parameters
    var parameters = {
        dir: this.dir,
        scaleX: this.scale.x,
        scaleY: this.scale.y
    };
    this.game.tilesf.addTile('blood', this.x, this.y, parameters);


    this.shadow.visible = false;

    //remove boss from the sharedHealthBar
    this.game.bosses.sharedHealthbar.removeEntity(this.defaultHealth);

    //Kill the entities
    this.shadow.kill();
    this.kill();
};


/** reset the collisions (when we toggle the fullscreen) **/
David.prototype.resetCollisions = function (){
    this.body.setCollisionGroup(this.game.entitiesCollisions);
};


/** check Overlap between 2 bodies **/
David.prototype.checkOverlap = function (body1, body2) {
    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};

