
var Boss = function (game, parameters, type) {
    this.game = game;
    var location = this.popLocation();
    location.x = 100;
    location.y = 150;
    console.log(parameters);
    Phaser.Sprite.call(this, game, location.x, location.y, type);
    this.type = type;


    this.init(parameters[type]);
    this.create();
};

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;



Boss.prototype.update = function(){
    this.game.debug.body(this);
};

Boss.prototype.init = function(parameters) {
    this.maxEnemy = parameters.maxEnemy;
    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.scoreGiven = parameters.score;

};

Boss.prototype.create = function(){
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


Boss.prototype.bleed = function(){
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

Boss.prototype.hit = function(damage){
    //blood
    this.bleed();



    this.health -= damage;
    if(this.health <= 0){
        this.die();
    }
};

Boss.prototype.die = function(){

};

Boss.prototype.objectsDistance = function(object, destination){
    var dx = object.x - destination.x;
    var dy = object.y - destination.y;
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras (get the distance to each other)
    return dist
};



Boss.prototype.popLocation = function(){
    var x = Math.random() * (this.game.world.width * 3) - this.game.world.width;
    var y = (x < 0 || x > this.game.world.height) ?
    Math.random()* (this.game.world.height) :  // X is outside of the screen -> random on the Y axe
        Math.random() > 0.5 ? // X is inside of the screen -> we need to be above the top or below the bottom
        Math.random() - 128 :
        Math.random() * 128 + this.game.world.height;
    return {x:x,y:y};

};