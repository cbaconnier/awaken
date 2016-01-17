
var Cockroach = function (game, parameters) {

    WorstEnemyEver.call(this, game, parameters, 'cockroach');

    this.animationSpeed = 6; //frame rate
    this.smoothed = false;


    //walking animations
    this.animations.add('walk_down', [1,0,2,0], this.animationSpeed, false);
    this.animations.add('walk_up', [8,7,9,7], this.animationSpeed, false);
    this.animations.add('walk_right', [16,15,17,15], this.animationSpeed, false);
    this.animations.add('walk_left', [22,21,23,21], this.animationSpeed, false);

    //attacking animations
    this.animations.add('attack_down', [4,5,6], this.animationSpeed, false);
    this.animations.add('attack_up', [12,13,14], this.animationSpeed, false);
    this.animations.add('attack_right', [18,19,20], this.animationSpeed, false);
    this.animations.add('attack_left', [24,25,26], this.animationSpeed, false);

    //this.factor = Math.round(Math.random() * (4-1)+1);
    //this.init(parameters.spider);
    //this.create();

};

Cockroach.prototype = Object.create(WorstEnemyEver.prototype);
Cockroach.prototype.constructor = Cockroach;
