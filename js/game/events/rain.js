/**
 *
 * Rain emit particles from the top to the bottom
 *
 *
 * @param game
 * @constructor
 */

var Rain = function (game) {
    this.game = game;
    this.create();
};

Rain.prototype.constructor = Rain;

/** Create the rain **/
Rain.prototype.create = function(){

    /** Emitter **/
    this.emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
    this.emitter.width = this.game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.

    /** Particles **/
    this.emitter.makeParticles('rain');
    this.emitter.minParticleScale = 0.1;
    this.emitter.maxParticleScale = 0.5;

    /** Speed **/
    this.emitter.setYSpeed(150, 300);
    this.emitter.setXSpeed(-5, 5);

    /** If we need to rotate the particles **/
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;


    this.emitter.start(false, 1600, 5, 0); // start the emitter
    this.force = 0; // Default force on the X axe

};

/** Rain don't need to be updated **/
Rain.prototype.update = function(){};

/** Calculates the new force on the rain and set the new X speed**/
Rain.prototype.changeWindDirection = function(force){
    var force = force || this.force;
    var multi = Math.floor((force + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    force = force + frag;


    if (force > 200) force = 150;
    if (force < -200) force = -150;

    this.setXSpeed(this.emitter, force);

};

/** Set the force on the X axe of the rain  **/
Rain.prototype.setXSpeed = function(emitter, force){
    emitter.setXSpeed(force - 20, force);
    emitter.forEachAlive(this.setParticleXSpeed, this, force);
};

/** Set the force for each particules of the rain **/
Rain.prototype.setParticleXSpeed = function(particle, force){
    particle.body.velocity.x = force - Math.floor(Math.random() * 30);
};