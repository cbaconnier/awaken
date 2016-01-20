
var Cockroach = function (game, parameters) {

    WorstEnemyEver.call(this, game, parameters, 'cockroach');

    this.animationSpeed = 6; //frame rate
    this.smoothed = false;


    ////walking animations
    //this.animations.add('walk_down', [1,0,2,0], this.animationSpeed, false);
    //this.animations.add('walk_up', [8,7,9,7], this.animationSpeed, false);
    //this.animations.add('walk_right', [16,15,17,15], this.animationSpeed, false);
    //this.animations.add('walk_left', [22,21,23,21], this.animationSpeed, false);

    //attacking animations
    //this.animations.add('attack_down', [4,5,6], this.animationSpeed, false);
    //this.animations.add('attack_up', [12,13,14], this.animationSpeed, false);
    //this.animations.add('attack_right', [18,19,20], this.animationSpeed, false);
    //this.animations.add('attack_left', [24,25,26], this.animationSpeed, false);
    //


    this.animations.add('walk_down', [1,0,2,0], this.animationSpeed, false);
    this.animations.add('walk_up', [7,6,8,6], this.animationSpeed, false);
    this.animations.add('walk_right', [13,12,14,12], this.animationSpeed, false);
    this.animations.add('walk_left', [19,18,20,18], this.animationSpeed, false);

    this.animations.add('attack_down', [3,4,5], this.animationSpeed, false);
    this.animations.add('attack_up', [9,10,11], this.animationSpeed, false);
    this.animations.add('attack_right', [15,16,17], this.animationSpeed, false);
    this.animations.add('attack_left', [21,22,23], this.animationSpeed, false);

    //this.factor = Math.round(Math.random() * (4-1)+1);
    //this.init(parameters.spider);
    //this.create();

};

Cockroach.prototype = Object.create(WorstEnemyEver.prototype);
Cockroach.prototype.constructor = Cockroach;


Cockroach.prototype.poisonHit = function(damage){
    if(!this.poisoned.value){
        this.poisoned.value = true;
        this.highlight(0x0d7200, this.poisoned);
        this.poisonEffect(1, 2);
    }
};


//override
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