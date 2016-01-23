
var Rain = function (game) {
    this.game = game;
    this.create();
};

Rain.prototype.constructor = Rain;


Rain.prototype.create = function(){

    this.emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);

    this.emitter.width = this.game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.

    this.emitter.makeParticles('rain');

    this.emitter.minParticleScale = 0.1;
    this.emitter.maxParticleScale = 0.5;

    this.emitter.setYSpeed(150, 300);
    this.emitter.setXSpeed(-5, 5);

    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;

    this.emitter.start(false, 1600, 5, 0);
    this.max = 0;

};

Rain.prototype.update = function(){};

Rain.prototype.changeWindDirection = function(max){
    var max = max || this.max;
    var multi = Math.floor((max + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    max = max + frag;

    if (max > 200) max = 150;
    if (max < -200) max = -150;

    this.setXSpeed(this.emitter, max);

};

Rain.prototype.setXSpeed = function(emitter, max){
    emitter.setXSpeed(max - 20, max);
    emitter.forEachAlive(this.setParticleXSpeed, this, max);
};

Rain.prototype.setParticleXSpeed = function(particle, max){
    particle.body.velocity.x = max - Math.floor(Math.random() * 30);
};