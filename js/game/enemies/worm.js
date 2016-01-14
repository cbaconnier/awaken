
var Worm = function (game, parameters) {

    WorstEnemyEver.call(this, game, parameters, 'worm');

    this.animationSpeed = 6; //frame rate
    this.smoothed = false;


    //walking animations
    this.animations.add('walk_down', [1,0,2,0], this.animationSpeed, false);
    this.animations.add('walk_up', [6,5,7,5], this.animationSpeed, false);
    this.animations.add('walk_right', [11,10,12,10], this.animationSpeed, false);
    this.animations.add('walk_left', [16,15,17,15], this.animationSpeed, false);

    //attacking animations
    this.animations.add('attack_down', [3,4], this.animationSpeed, false);
    this.animations.add('attack_up', [8,9], this.animationSpeed, false);
    this.animations.add('attack_right', [13,14], this.animationSpeed, false);
    this.animations.add('attack_left', [18,19], this.animationSpeed, false);

    //this.factor = Math.round(Math.random() * (4-1)+1);
    //this.init(parameters.worm);
    //this.create();
};

Worm.prototype = Object.create(WorstEnemyEver.prototype);
Worm.prototype.constructor = Worm;
