
var David = function (game, parameters) {

    var type = 'david';
    this.game = game;
    var location = this.popLocation();
    location.x = 150;
    location.y = 230;
    Phaser.Sprite.call(this, game, location.x, location.y, 'david_foot');
    this.type = type;
    //this.init(parameters[this.type]);
    //this.create();

    this.yy = this.y;
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, true); // true = debug
    this.body.fixedRotation = true;
    this.body.setRectangle(150, 80, 0, 26);
    console.log(this.body.data.shapes[0]);

    this.smoothed = false;

    this.frameFrontDown = 0;
    this.frameFrontClutch = 1;
    this.frameProfilDown = 2;
    this.frameProfilClutch = 3;

    this.anchor.set(0.5);
    this.frame = this.frameFrontClutch;
    this.scale.x = 13;
    this.scale.y = 13;
    var leg = this.game.make.sprite(0, -8, 'david_leg');

    leg.anchor.setTo(0.5, 1);
    this.addChild(leg);
    this.leg = leg;
    this.leg.smoothed = false;





    /*** Timers ***/
        //Attack
    //this.attackTimer = this.game.time.create(false);
    //this.attackTimer.start();
    //this.attackTimer.add(Math.random() * (4000 - 3000)+4000, this.attack, this);


};

David.prototype = Object.create(Phaser.Sprite.prototype);
David.prototype.constructor = David;



David.prototype.update = function(){
    this.yy = this.y+85;
    //Because we use a custom collision zone, we have to get the real collisions bounds of the sprite
    //P2 convert pixels to meters with 20px/m, we need them in pixels so : multiplied by 20
    var body = {};
    var correctionX = this.body.data.shapes[0].position[0]*20;
    var correctionY = this.body.data.shapes[0].position[1]*20;
    body.left   = this.x + (this.body.data.shapes[0].vertices[0][0] * 20) - correctionX;
    body.right  = this.x + (this.body.data.shapes[0].vertices[1][0] * 20) - correctionX;
    body.top    = this.y + (this.body.data.shapes[0].vertices[0][1] * 20) - correctionY;
    body.bottom = this.y + (this.body.data.shapes[0].vertices[2][1] * 20) - correctionY;
    if(this.checkOverlap( body, this.game.ken))
        console.log("HIIITTTTT");
};


David.prototype.init = function(parameters) {
    this.maxEnemy = parameters.maxEnemy;
    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.scoreGiven = parameters.score;

};

David.prototype.create = function(){
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, true);

    this.body.setZeroDamping();
    this.body.fixedRotation = true;
    this.body.clearShapes();

    // -+ en bas  à gauche X,Y
    // -0 en haut à gauche
    // +0 en haut à droite
    // ++ en bas  à droite
    // this.body.addPolygon({}, [[-60, 290], [-60, 150], [30, 150], [30, 290]] );

    /** Blood particles **/
    this.blood = this.game.add.emitter(0, 0, 50);
    this.blood.makeParticles('blood', [0,1,2]);
    this.blood.gravity = 0;



    /** Debug **/
    this.filterDebug = this.game.add.filter('Debug');
    this.filterDebug.red = 0.1;
    this.filterDebug.blue = 1;
    this.filterDebug.green = 0.5;


};


David.prototype.attack = function(){
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
    this.moveTo({x: this.game.ken.x, y: this.game.ken.y});
    this.attackTimer.add(Math.random() * (4000 - 3000)+4000, this.attack, this);

};


David.prototype.moveTo = function(destination, speed, maxTime){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.speed = 400;
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

    if(this.dir==0){
        this.body.moveUp(speed);
        //  this.attackZone.moveUp(speed);
    }
    if(this.dir==2){
        this.body.moveDown(speed);
        // this.attackZone.moveDown(speed);
    }
    if(this.dir==1){
        this.body.moveRight(speed);
        //this.attackZone.moveRight(speed);
    }
    if(this.dir==3){
        this.body.moveLeft(speed);
        //this.attackZone.moveLeft(speed);
    }
};




David.prototype.bleed = function(){
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

    this.blood.start(true, 500, null, 50);
};

David.prototype.hit = function(damage){
    //blood
    this.bleed();



    this.health -= damage;
    if(this.health <= 0){
        this.die();
    }
};

David.prototype.die = function(){

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
    var x = Math.random() * (this.game.world.width * 3) - this.game.world.width;
    var y = (x < 0 || x > this.game.world.height) ?
    Math.random()* (this.game.world.height) :  // X is outside of the screen -> random on the Y axe
        Math.random() > 0.5 ? // X is inside of the screen -> we need to be above the top or below the bottom
        Math.random() - 128 :
        Math.random() * 128 + this.game.world.height;
    return {x:x,y:y};

};