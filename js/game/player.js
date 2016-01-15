'use strict';


var Ken = function (game, parameters) {
    Phaser.Sprite.call(this, game, 350, 120, 'ken');
    //this._parentTransform = game.players;
    //this.updateTransform(game.players);
    this.name = "Ken";
    this.game = game;
    this.parameters = parameters;
    //this.tint = '#FF00FF';
    this.create();


};


Ken.prototype = Object.create(Phaser.Sprite.prototype);
Ken.prototype.constructor = Ken;


/**
 *
 * He's only a prototype but..
 * He's the best, he's the legend
 * He's.. KEN !
 *
 * And now.. YOU are Ken !
 *
 * **/
Ken.prototype.create = function () {

    /** player **/

    this.health = this.parameters.health;
    this.maxDamage = this.parameters.maxDmg;
    this.minDamage = this.parameters.minDmg;
    this.speed = 200;
    this.defaultSpeed = this.speed;
    this.score = 0;


    this.dir = 2; // direction of the player
    this.isFunky = false; //hum...
    this.messages_hit = [
        "HALP",
        "HELP",
        "LOL",
        "YOU ARE SO FUCKING BAD!",
        "PLZ",
        "I WANT TO LIV",
        "COME ON!",
        "Y U DO DIS?",
        "COM ON U MORON",
        "OUCH",
        "YOU STINK",
        "Aasdfkj jAKSJDF",
        "HE FUCKING HURT ME",
        "I SAID OUCH CUZ HE HURT ME",
        "YOU PISSED ME OFF",
        "RETARD",
        "CYKA BLYAT",
        "KURWA",
        "NOOB",
        "YOU KIDDING??",
        "MY GRANDMA IS BETTER",
        "IT HURT",
        "WHY?",
        "BEING UGLY ISN'T ENOUGH?",
        "HELP! HELP! I'M BEING REPRESSED!",
        "DO YOU REQUIRE AID HUMAN?",
        "MAYBE YOU SHOULD LEARN TO PLAY",
        "JUDGE ME BY MY SIZE, DO YOU?",
        "SAY TO THE DEV THAT THIS FUCKING GAME IS BUGGED",
        "DON'T YOU KNOW HOW TO PLAY?",
        "LET'S GET PISSED!",
        "ALL I EVER WANTED WAS TO STUDY",
        "PLEASE, LEAVE THE GAME",
        "I GETTING TOO OLD FOR THIS",
    ];


    /** actions**/
    this.attacking = false; //player is attacking
    this.walking = false; //player is walking
    this.animating = false; //player is animated

    this.messagesIsAvailable = true;
    this.attackIsAvailable = true;


    /** Keyboard **/
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.attackKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.key = {
        w: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        a: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        s: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        d: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    this.keyup2 = false;
    this.keydown2 = false;
    this.keyleft2 = false;
    this.keyright2 = false;


    /** sprites **/
    this.spriteAttack = this.game.add.sprite(this.x, this.y, 'attack');
    this.smoothed = false;

    /** physics **/
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);
    this.body.fixedRotation = true;

    /** collisions **/
    this.body.setCircle(28);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);

    this.yy = this.y;

    /** animations **/

    this.animationSpeed = 6; //frame rate
        //walking animations
    this.animations.add('walk_down', [1, 0, 2, 0], this.animationSpeed, false);
    this.animations.add('walk_up', [6, 5, 7, 5], this.animationSpeed, false);
    this.animations.add('walk_left', [11, 10, 12, 10], this.animationSpeed, false);

    //attacking animations
    this.animations.add('attack_down', [3, 4], this.animationSpeed, false);
    this.animations.add('attack_up', [8, 9], this.animationSpeed, false);
    this.animations.add('attack_left', [13, 14], this.animationSpeed, false);
    this.animations.add('attack_right', [14, 13], this.animationSpeed, false);


    this.spriteAttack.animations.add('attack', [0, 1, 2], this.animationSpeed * 2, false);
    this.spriteAttack.angle = 180;
    this.spriteAttack.anchor.setTo(0.5);

    this.spriteAttack.scale.x = this.parameters.attackSize;
    this.spriteAttack.scale.y = this.parameters.attackSize;


    /**Debug filters **/
    this.filterDebugAtk = this.game.add.filter('Debug', this.game);
    this.filterDebug = this.game.add.filter('Debug');
    this.filterDebugAtk.red = 1;
    this.filterDebugAtk.blue = 0.2;
    this.filterDebugAtk.green = 0.2;
    this.filterDebug.red = 0.2;
    this.filterDebug.blue = 1;
    this.filterDebug.green = 0.2;


    /** Before animate **/
    /*Sprite*/
    this.events.onAnimationStart.add(function () {
        //prevent others animations
        this.attacking = false;
        this.animating = true;
    }, this);


    /*Attack*/
    this.spriteAttack.events.onAnimationStart.add(function () {
        //show sprite attack
        this.spriteAttack.visible = true;
    }, this);


    /** After animate **/
    /*Attack*/
    this.spriteAttack.events.onAnimationComplete.add(function () {
        //Hide sprite attack
        this.spriteAttack.visible = false;
    }, this);

    /*Sprite*/
    this.events.onAnimationComplete.add(function () {
        //allow others animations
        this.animating = false;
    }, this);


    /*** Timers ***/
    this.game.time.events.loop(1000, this.setMessageAvailable, this); //Messages

    /*** Audio ***/

    this.fxHit = this.game.add.audio('fx_hit');
    this.fxHit.allowMultiple = false;
    this.fxHit.volume = 0.4;
    this.fxAttack = this.game.add.audio('fx_attack');
    this.fxAttack.allowMultiple = false;
    this.fxAttack.volume = 0.4;


};



Ken.prototype.update = function () {
    this.move();
    this.attack();
    this.debugCollisions(); //only if actived
    this.animate();
    this.disco();
    this.yy = this.y;
    this.resetSpeed();
};



Ken.prototype.decreaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed -= speed;
};

Ken.prototype.resetSpeed = function(){
    this.speed = this.defaultSpeed;
};




Ken.prototype.move = function () {
    this.body.setZeroVelocity();
    var x = 0;
    var y = 0;


    if (this.keys.up.isDown || this.key.w.isDown) y--;
    if (this.keys.down.isDown || this.key.s.isDown) y++;
    if (this.keys.left.isDown || this.key.a.isDown) x--;
    if (this.keys.right.isDown || this.key.d.isDown) x++;

    if (this.keyup2 != this.keys.up.isDown && this.keyup2 != this.key.w.isDown && !this.attacking) {
        this.animating = false;
        this.keyup2 = this.keys.up.isDown || this.key.w.isDown;
    }

    if (this.keydown2 != this.keys.down.isDown && this.keyup2 != this.key.s.isDown && !this.attacking) {
        this.animating = false;
        this.keydown2 = this.keys.down.isDown || this.key.s.isDown;
    }

    if (this.keyleft2 != this.keys.left.isDown && this.keyup2 != this.key.a.isDown && !this.attacking) {
        this.animating = false;
        this.keyleft2 = this.keys.left.isDown || this.key.a.isDown;
    }

    if (this.keyright2 != this.keys.right.isDown && this.keyup2 != this.key.d.isDown && !this.attacking) {
        this.animating = false;
        this.keyright2 = this.keys.right.isDown || this.key.d.isDown;
    }


    if (this.keys.up.downDuration(50) || this.key.w.downDuration(50))this.animating = false;
    if (this.keys.down.downDuration(50) || this.key.s.downDuration(50))this.animating = false;
    if (this.keys.left.downDuration(50) || this.key.a.downDuration(50))this.animating = false;
    if (this.keys.right.downDuration(50) || this.key.d.downDuration(50))this.animating = false;


    if (x != 0 || y != 0) { // (left||right||up||down).isDown .. Sorry, I was lazy

        if (x > 0) {
            this.dir = 1; //east
            this.body.moveRight(this.speed);
            if (this.scale.x < 0) this.scale.x *= -1; // mirroring
        }
        if (x < 0) {
            this.dir = 3; //west
            this.body.moveLeft(this.speed);
            if (this.scale.x > 0) this.scale.x *= -1; // mirroring
        }
        if (y > 0) {
            this.dir = 2; //south
            this.body.moveDown(this.speed);
            if (this.scale.x < 0) this.scale.x *= -1;
        }
        if (y < 0) {
            this.dir = 0; // north
            if (this.scale.x < 0) this.scale.x *= -1; // mirroring
            this.body.moveUp(this.speed);
        }

        this.walking = true;
    } else {
        this.walking = false;
    }


};


Ken.prototype.animate = function () {

    if (!this.animating) { //play if he has finished the previous animation

        if (this.dir == 0) { // north
            if (this.attacking) {
                this.animations.play("attack_up");
                this.spriteAttack.animations.play("attack");
            } else if (this.walking) {
                this.animations.play("walk_up");
            } else {
                this.frame = 5;
            }
        }
        if (this.dir == 1) { //east
            if (this.attacking) {
                this.animations.play("attack_left");
                this.spriteAttack.animations.play("attack");
            } else if (this.walking) {
                this.animations.play("walk_left");
            } else {
                this.frame = 10;
            }
        }
        if (this.dir == 2) { //south
            if (this.attacking) {
                this.animations.play("attack_down");
                this.spriteAttack.animations.play("attack");
            } else if (this.walking) {
                this.animations.play("walk_down");
            } else {
                this.frame = 0;
            }
        }
        if (this.dir == 3) { //west
            if (this.attacking) {
                this.animations.play("attack_right");
                this.spriteAttack.animations.play("attack");
            } else if (this.walking) {
                this.animations.play("walk_left");
            } else {
                this.frame = 10;
            }
        }
    }
};

    Ken.prototype.attack = function () {
        //To attack, we need the attackKey pressed and that the action is available
        if (this.attackKey.isDown && this.attackIsAvailable) {

            var dist = 32;
            var longueDist = 78;
            if (this.dir == 0) {
                dist = (this.walking) ? longueDist : dist;
                this.spriteAttack.x = this.x;
                this.spriteAttack.y = this.y - dist;
                this.spriteAttack.angle = 0;
            } else if (this.dir == 2) {
                dist = (this.walking) ? longueDist : dist;
                this.spriteAttack.x = this.x;
                this.spriteAttack.y = this.y + dist;
                this.spriteAttack.angle = 180;
            } else if (this.dir == 1) {
                dist = (this.walking) ? longueDist : dist;
                this.spriteAttack.x = this.x + dist;
                this.spriteAttack.y = this.y;
                this.spriteAttack.angle = 90;
            } else if (this.dir == 3) {
                dist = (this.walking) ? longueDist : dist;
                this.spriteAttack.x = this.x - dist;
                this.spriteAttack.y = this.y;
                this.spriteAttack.angle = 270;
            }

            var self = this;
            var hit = false;
            this.game.entities.forEachAlive(function (enemy) {
                if (self.checkOverlap(self.spriteAttack, enemy) && enemy != self) {
                    self.fxHit.play();
                    hit = true;
                    enemy.hit(Math.round(Math.random() * (self.maxDamage - self.minDamage) + self.minDamage));
                    self.score += enemy.scoreGiven;
                }
            });
            if(!hit){
                this.fxAttack.play();
            }

            this.animating = false;
            this.attacking = true;
            this.attackIsAvailable = false;
            this.game.time.events.add(500, this.setAttackAvailable, this);
        }
    };

Ken.prototype.hit = function (damage) {
    this.health -= damage;

    if (this.messagesIsAvailable) {
        this.game.ui.dialogue(this.world.x, this.world.y, this.messages_hit[Math.floor(Math.random() * this.messages_hit.length)]);
        this.messagesIsAvailable = false;
    }

    this.game.ui.setHealthWidth(this.health);
    if (this.health <= 0) {
        //this.game.state.start('over');
    }
};

Ken.prototype.setMessageAvailable = function () {
    this.messagesIsAvailable = !this.messagesIsAvailable;
};

Ken.prototype.setAttackAvailable = function () {
    this.attackIsAvailable = true;
};

Ken.prototype.checkOverlap = function (body1, body2) {

    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};

Ken.prototype.disco = function () {
    if (this.isFunky) this.tint = Math.random() * 0xfffff;
};


Ken.prototype.resetCollisions = function (){
    this.body.setCircle(28);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
};

Ken.prototype.debugCollisions = function () {
    /** Debug **/
    if (this.game.debugCollisions) {
        this.spriteAttack.filters = [this.filterDebugAtk];
        this.filters = [this.filterDebug];
    } else {
        this.spriteAttack.filters = null;
        this.filters = null;
    }
};
