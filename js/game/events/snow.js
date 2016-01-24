/**
 *
 * Snow emit particles from the top to the bottom
 * The snow use 3 emitters with different speed and size
 *
 * @param game
 * @constructor
 */


var Snow = function (game) {
    this.game = game;
    this.create();
};

Snow.prototype.constructor = Snow;

/** Create the snow **/
Snow.prototype.create = function(){

    /** Emitters **/
    this.back_emitter = this.game.add.emitter(this.game.world.centerX, -32, 600);
    this.back_emitter.makeParticles('snow', [0, 1, 2]);
    this.back_emitter.maxParticleScale = 0.6;
    this.back_emitter.minParticleScale = 0.2;
    this.back_emitter.setYSpeed(20, 100);
    this.back_emitter.gravity = 0;
    this.back_emitter.width = this.game.world.width * 1.5;
    this.back_emitter.minRotation = 0;
    this.back_emitter.maxRotation = 40;

    this.mid_emitter = this.game.add.emitter(this.game.world.centerX, -32, 250);
    this.mid_emitter.makeParticles('snow', [0, 1, 2]);
    this.mid_emitter.maxParticleScale = 1.2;
    this.mid_emitter.minParticleScale = 0.8;
    this.mid_emitter.setYSpeed(50, 150);
    this.mid_emitter.gravity = 0;
    this.mid_emitter.width = this.game.world.width * 1.5;
    this.mid_emitter.minRotation = 0;
    this. mid_emitter.maxRotation = 40;

    this.front_emitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
    this.front_emitter.makeParticles('snow', [0, 1, 2]);
    this.front_emitter.maxParticleScale = 1;
    this.front_emitter.minParticleScale = 0.5;
    this.front_emitter.setYSpeed(100, 200);
    this.front_emitter.gravity = 0;
    this.front_emitter.width = this.game.world.width * 1.5;
    this.front_emitter.minRotation = 0;
    this.front_emitter.maxRotation = 40;

    this.force = 0; // default wind force

    // Start the emitters
    this.back_emitter.start(false, 14000, 20);
    this.mid_emitter.start(false, 12000, 40);
    this.front_emitter.start(false, 6000, 1000);

    // Update the direction of the wind -- 0 force by default
    this.changeWindDirection();

};


Snow.prototype.update = function(){};

/** Calculates the new force on the snow and set the new X speed **/
Snow.prototype.changeWindDirection = function(force){
    var force = force || this.force;
    var multi = Math.floor((force + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    force = force + frag;

    if (force > 200) force = 150;
    if (force < -200) force = -150;

    this.setXSpeed(this.back_emitter, force);
    this.setXSpeed(this.mid_emitter, force);
    this.setXSpeed(this.front_emitter, force);
};


/** Set the force on the X axe of the snow  **/
Snow.prototype.setXSpeed = function(emitter, force){
    emitter.setXSpeed(force - 20, force);
    emitter.forEachAlive(this.setParticleXSpeed, this, force);
};

/** Set the force for each particules of the snow **/
Snow.prototype.setParticleXSpeed = function(particle, force){
    particle.body.velocity.x = force - Math.floor(Math.random() * 30);
};