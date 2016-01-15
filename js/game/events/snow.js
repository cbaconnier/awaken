
var Snow = function (game) {
    this.game = game;
    this.create();
};

Snow.prototype.constructor = Snow;


Snow.prototype.create = function(){

    this.max = 0;
    this.front_emitter;
    this.mid_emitter;
    this.back_emitter;
    this.update_interval = 4 * 60;
    this.i = 0;
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

    this.changeWindDirection();

    this.back_emitter.start(false, 14000, 20);
    this.mid_emitter.start(false, 12000, 40);
    this.front_emitter.start(false, 6000, 1000);


};

Snow.prototype.update = function(){
    this.i++;

    if (this.i === this.update_interval)
    {
        this.changeWindDirection();
        this.update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
        this.i = 0;
    }
};

Snow.prototype.changeWindDirection = function(max){
    var max = max || this.max;
    var multi = Math.floor((max + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    max = max + frag;

    if (max > 200) max = 150;
    if (max < -200) max = -150;

    this.setXSpeed(this.back_emitter, max);
    this.setXSpeed(this.mid_emitter, max);
    this.setXSpeed(this.front_emitter, max);
};

Snow.prototype.setXSpeed = function(emitter, max){
    emitter.setXSpeed(max - 20, max);
    emitter.forEachAlive(this.setParticleXSpeed, this, max);
};

Snow.prototype.setParticleXSpeed = function(particle, max){
    particle.body.velocity.x = max - Math.floor(Math.random() * 30);
};