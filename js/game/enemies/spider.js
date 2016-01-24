/**
 *
 * Extend WorstEnemyEver (enemy.js)
 *
 * @param game
 * @param {Levels.level.EnemyParameters}
 *
 */


var Spider = function (game, parameters) {

    /** Sprite **/
    WorstEnemyEver.call(this, game, parameters, 'spider');
    this.smoothed = false;


    /** Animations **/
    this.animationSpeed = 6; //frame rate
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


};

Spider.prototype = Object.create(WorstEnemyEver.prototype);
Spider.prototype.constructor = Spider;
