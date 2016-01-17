
var David = function (game, parameters) {

    var type = 'david';
    this.game = game;

    var x = game.width/2;
    var y = -150;
    Phaser.Sprite.call(this, game, x, y, 'david_foot');
    this.type = type;
    this.init(parameters[this.type]);
    //this.create();

    this.yy = this.y;


    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false); // true = debug
    this.body.fixedRotation = true;


    this.body.collideWorldBounds = false;
    this.smoothed = false;
    this.body.kinematic = true;
    this.anchor.set(0.5);


    this.shadow = this.game.tilesf.addTile('shadow', this.game.ken.x, this.game.ken.y, {dir: this.dir, scaleX:1, scaleY:1});

    this.destinationY = 0;
    this.ready = false;
    this.ready2 = false;
    this.phase1 = false;
    this.lastPhase = false;

    this.frame = 3;
    this.body.setRectangle(350, 80, 0, 26);

    this.canTakeDamage = false;
    this.blocked = false;

    this.scale.x = 13;
    this.scale.y = 13;
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


    /*** Timers ***/
        //Attack
    this.attackTimer = this.game.time.create(false);
    this.attackTimer.start();
    this.attack();


    this.fxAttack = this.game.add.audio('fx_david');
    this.fxAttack.allowMultiple = false;
    this.fxAttack.volume = 0.6;



};

David.prototype = Object.create(Phaser.Sprite.prototype);
David.prototype.constructor = David;




David.prototype.init = function(parameters) {
    this.maxEnemy = parameters.maxEnemy;
    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.scoreGiven = parameters.score;

};

David.prototype.create = function(){
    /** Debug **/
    this.filterDebug = this.game.add.filter('Debug');
    this.filterDebug.red = 0.1;
    this.filterDebug.blue = 1;
    this.filterDebug.green = 0.5;
};




David.prototype.decreaseSpeed = function(speed){};
David.prototype.resetSpeed = function(){};


David.prototype.update = function(){
if(this.alive){
    if(!this.blocked){

        if(this.ready && this.game.ken.x > this.x) this.body.velocity.x = 100;
        if(this.ready && this.game.ken.x <  this.x) this.body.velocity.x = -100;
        if(this.ready && this.game.ken.y > this.y) this.body.velocity.y = 100;
        if(this.ready && this.game.ken.y <  this.y) this.body.velocity.y = -100;

        if(this.ready && this.game.ken.y+32 > this.shadow.y) this.shadow.body.velocity.y = 100;
        if(this.ready && this.game.ken.y+32 <  this.shadow.y) this.shadow.body.velocity.y = -100;
        this.shadow.body.x = this.body.x;

        if(this.ready){
            this.shadow.scale.x += 0.005;
            this.shadow.scale.y += 0.005;
        }

        if(this.y >= this.game.ken.y-300 && this.ready){
            this.attackPhase2();
        }

        if(this.ready2){
            if(this.shadow.scale.x < this.scale.x-1 && this.shadow.scale.y < this.scale.y-1){
                this.shadow.scale.x += .1;
                this.shadow.scale.y += .1;
            }
            //this.shadow.body.velocity.y = -300;
        }

        if(this.y >= this.destinationY && this.ready2){
            this.attackPhase4();
            if(this.frame == 0) this.frame++;
            if(this.frame == 2) this.frame++;
        }

        if(this.lastPhase){
            if(this.shadow.scale.x >= 0)this.shadow.scale.x -= .1;
            if(this.shadow.scale.y >= 0)this.shadow.scale.y -= .1;
        }

        if(this.phase1){
            if(this.game.ken.x > this.x)
                this.body.velocity.x = 100;
            if(this.game.ken.x < this.x)
                this.body.velocity.x = -100;
        }
    }else{
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

    }
    this.yy = this.y+85;
}


};


David.prototype.attack = function(){
    if(this.alive){
        this.shadow.visible = false;
        this.body.x = this.game.ken.x;
        this.body.velocity.y = 0;
        this.body.y = -80-this.game.height;
        this.destinationY = this.game.ken.y;
        this.lastPhase = false;

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

    this.attackPhase1();

};




David.prototype.attackPhase1 = function() {
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
    this.body.velocity.y = 100;
    this.ready = true;
};

David.prototype.attackPhase2 = function() {
    this.ready = false;

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.shadow.body.velocity.y = 0;
    this.destinationY = this.shadow.body.y-64;


    var attackTimer = this.game.time.create(false);
    attackTimer.start();
    attackTimer.add(500, this.attackPhase3, this);

};

David.prototype.attackPhase3 = function() {

    this.ready2 = true;

    this.body.velocity.y = 1000;
    if(this.frame == 0) this.frame++;
    if(this.frame == 2) this.frame++;
};

David.prototype.attackPhase4 = function() {
    this.fxAttack.play();
    this.canTakeDamage = true;
    this.ready2 = false;
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

    var self = this;
    this.game.entities.forEachAlive(function(entity){
        if(self.checkOverlap( body, entity)){
            if(entity.type != self.type) entity.hit(self.damage);
        }
    });



    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
    var attackTimer = this.game.time.create(false);
    attackTimer.start();
    attackTimer.add(3000, this.attackPhase5, this);

};

David.prototype.attackPhase5 = function() {
    if(this.alive){
        this.lastPhase = true;
        this.canTakeDamage = false;
        this.shadow.visible = true;
        this.body.clearCollision(true);
        this.body.velocity.y = -500;
        this.attackTimer.add(2000, this.attack, this);
        //this.attack();
    }
};





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

David.prototype.poisonHit = function(damage){};
David.prototype.setWindForce = function(force){};


David.prototype.hit = function(damage){

    if(this.canTakeDamage){
        //blood
        this.bleed();

        this.game.dialogues.create(this.x, this.y, damage.toString(), 30, 350, -96);

        this.health -= damage;
        if(this.health <= 0){
            this.die();
        }
    }
};

David.prototype.die = function(){
    this.game.bossesKilled++;
    var parameters = {
        dir: this.dir,
        scaleX: this.scale.x,
        scaleY: this.scale.y
    };
    this.game.tilesf.addTile('blood', this.x, this.y, parameters);
    this.shadow.visible = false;
    this.shadow.kill();
    this.kill();
};


David.prototype.distance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};

David.prototype.objectsDistance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};


David.prototype.checkOverlap = function (body1, body2) {
    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};

David.prototype.popLocation = function(){
    var max = this.game.world.width - this.width / 2;
    var min = this.width / 2;
    var x = Math.random() * (max-min) + min;
    var y = - 120;
    return {x:x,y:y};

};