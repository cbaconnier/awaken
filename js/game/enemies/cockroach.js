/**
 *
 * Extend WorstEnemyEver (enemy.js)
 *  cockroach has a specificity : The sprite don't has the right size with the front and back view
 *  So I had to override the animate function and adjust the size in it
 *
 * @param game
 * @param {Levels.level.EnemyParameters}
 *
 */
var Cockroach = function (game, parameters) {

    /** Sprite **/
    WorstEnemyEver.call(this, game, parameters, 'cockroach');
    this.smoothed = false;


    /** Sprites animations**/
    this.animationSpeed = 6; //frame rate
    // walking
    this.animations.add('walk_down', [1,0,2,0], this.animationSpeed, false);
    this.animations.add('walk_up', [7,6,8,6], this.animationSpeed, false);
    this.animations.add('walk_right', [13,12,14,12], this.animationSpeed, false);
    this.animations.add('walk_left', [19,18,20,18], this.animationSpeed, false);

    // attacking
    this.animations.add('attack_down', [3,4,5], this.animationSpeed, false);
    this.animations.add('attack_up', [9,10,11], this.animationSpeed, false);
    this.animations.add('attack_right', [15,16,17], this.animationSpeed, false);
    this.animations.add('attack_left', [21,22,23], this.animationSpeed, false);


};

Cockroach.prototype = Object.create(WorstEnemyEver.prototype);
Cockroach.prototype.constructor = Cockroach;

/** Override : Cockroach doesn't react like other enemies. Poison hit only 1 damage **/
Cockroach.prototype.poisonHit = function(damage){
    if(!this.poisoned.value){
        this.poisoned.value = true;
        this.highlight(0x0d7200, this.poisoned);
        this.poisonEffect(1, 10);
    }
};


/** Override : Adjust the front and back size of the sprite  **/
Cockroach.prototype.animate = function(){

    if(!this.animating && this.isMovable){ //play if he has finished the previous animation
        if(this.dir == 0){ // north


            this.scale.x = this.factor/1.5;
            this.scale.y = this.factor/1.5;

            if(this.attacking){
                this.animations.play("attack_up");
            }else{
                this.animations.play("walk_up");
            }
        }
        if(this.dir == 1){ //east

            this.scale.x = this.factor;
            this.scale.y = this.factor;

            if(this.attacking){
                this.animations.play("attack_right");
            }else{
                this.animations.play("walk_right");
            }
        }
        if(this.dir == 2){ //south

            this.scale.x = this.factor/1.5;
            this.scale.y = this.factor/1.5;

            if(this.attacking){
                this.animations.play("attack_down");
            }else{
                this.animations.play("walk_down");
            }
        }
        if(this.dir == 3){ //west

            this.scale.x = this.factor;
            this.scale.y = this.factor;

            if(this.attacking){
                this.animations.play("attack_left");
            }else{
                this.animations.play("walk_left");
            }
        }
    }
};