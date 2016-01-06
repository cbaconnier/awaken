
var Spider = function (game, x, y, parameters) {

    WorstEnemyEver.call(this, game, x, y, parameters, 'spider');

    this.animationSpeed = 6; //frame rate
    this.smoothed = false;


    //walking animations
    this.animations.add('walk_down', [1,2,3,4,0], this.animationSpeed, false);
    this.animations.add('walk_up', [9,10,11,12,8], this.animationSpeed, false);
    this.animations.add('walk_right', [17,18,19,16], this.animationSpeed, false);
    this.animations.add('walk_left', [25,26,27,24], this.animationSpeed, false);

    //attacking animations
    this.animations.add('attack_down', [5,6], this.animationSpeed, false);
    this.animations.add('attack_up', [13,14], this.animationSpeed, false);
    this.animations.add('attack_right', [21,22], this.animationSpeed, false);
    this.animations.add('attack_left', [29,30], this.animationSpeed, false);

    //this.factor = Math.round(Math.random() * (4-1)+1);
    //this.init(parameters.spider);
    //this.create();
};

Spider.prototype = Object.create(WorstEnemyEver.prototype);
Spider.prototype.constructor = Spider;
