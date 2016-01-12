
var Boss = function (game, x, y, parameters, type) {

    Phaser.Sprite.call(this, game, x, y, type);
    this.type = type;
    this.game = game;

    this.init(parameters[type]);
    this.create();
};

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;




Boss.prototype.init = function(parameters) {
    this.maxEnemy = parameters.maxEnemy;
    this.damage = parameters.dmg;
    this.health = parameters.health ;
    this.scoreGiven = parameters.score;

};

Boss.prototype.create = function(){
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);

    this.body.setZeroDamping();
    this.body.fixedRotation = true;



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
