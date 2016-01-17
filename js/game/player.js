'use strict';


var Ken = function (game, parameters) {
    this.game = game;
    Phaser.Sprite.call(this, game, this.game.width *.5, this.game.height *.5, 'ken');
    //this._parentTransform = game.players;
    //this.updateTransform(game.players);
    this.type = "ken";

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


    //objects because we need the reference of the value when we use them in callback
    this.invulnerability = {
        value: false
    };
    this.poisoned = {
        value: false
    };

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
        "I GETTING TOO OLD FOR THIS"
    ];


    /** actions**/
    this.attacking = false; //player is attacking
    this.walking = false; //player is walking
    this.animating = false; //player is animated

    this.messagesIsAvailable = true;
    this.attackIsAvailable = true;

    this.blocked = false;


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


    this.game.pad.addCallbacks(this, {onConnect: this.addButtons});
    this.attackButton = null;
    this.pad = null;
    this.addButtons();




    /** sprites **/
    this.spriteAttack = this.game.add.sprite(this.x, this.y, 'attack');
    this.attackZone = this.game.add.sprite(this.x, this.y, 'attack');
    //this.attackZone.visible = false;
    this.smoothed = false;
    this.spriteAttack.smoothed = false;

    /** physics **/
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);
    this.body.fixedRotation = true;

    this.attackZone.enableBody = true;
    this.attackZone.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this.attackZone, false); // true = debug
    this.attackZone.body.fixedRotation = true;
    this.attackZone.body.collideWorldBounds = false;


    /** collisions **/
    this.body.setCircle(28);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);


    //this.attackZone.body.setRectangle(this.spriteAttack.width*this.parameters.attackSize, this.spriteAttack.height*this.parameters.attackSize, 0, 20*this.parameters.attackSize);


    this.yy = this.y;

    /** animations **/

    this.animationSpeed = 6; //frame rate
        //walking animations
    this.animations.add('walk_down', [1, 0, 2, 0], this.animationSpeed, false);
    this.animations.add('walk_up', [6, 5, 7, 5], this.animationSpeed, false);
    this.animations.add('walk_left', [11, 10, 12, 10], this.animationSpeed, false);
    this.animations.add('walk_right', [16, 15, 17, 15], this.animationSpeed, false);

    //attacking animations
    this.animations.add('attack_down', [3, 4], this.animationSpeed, false);
    this.animations.add('attack_up', [8, 9], this.animationSpeed, false);
    this.animations.add('attack_left', [13, 14], this.animationSpeed, false);
    this.animations.add('attack_right', [18, 19], this.animationSpeed, false);


    this.spriteAttack.animations.add('attack', [0, 1, 2], this.animationSpeed * 2, false);
    this.spriteAttack.angle = 180;
    this.spriteAttack.anchor.setTo(0.5);

    this.attackZone.animations.add('attack', [0, 1, 2], this.animationSpeed * 2, false);
    this.attackZone.angle = 180;

    this.attackZone.anchor.setTo(0.5);


    this.attackZone.scale.x = this.parameters.attackSize;
    this.attackZone.scale.y = this.parameters.attackSize;


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
    //this.attackTimer = this.game.time.create(false);
    //this.attackTimer.start();
    //this.attackTimer.add(500, this.setAttackAvailable, this);

    /*** Audio ***/

    this.fxHit = this.game.add.audio('fx_hit');
    this.fxHit.allowMultiple = false;
    this.fxHit.volume = 0.4;
    this.fxAttack = this.game.add.audio('fx_attack');
    this.fxAttack.allowMultiple = false;
    this.fxAttack.volume = 0.4;


    this.scale.x = 1.5;
    this.scale.y = 1.5;

};



Ken.prototype.addButtons = function (){
    this.attackButton = this.game.pad.getButton(Phaser.Gamepad.XBOX360_A);
};

Ken.prototype.update = function () {
    if(!this.blocked){
        this.move();
        this.attack();
    }else{
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    this.animate();
    this.debugCollisions(); //only if actived
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

Ken.prototype.setWindForce = function(force){
    if(!this.blocked) this.body.x+=force;
};


Ken.prototype.move = function () {
    this.body.setZeroVelocity();
    var x = 0;
    var y = 0;

    this.padX = this.game.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    this.padY = this.game.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

    if (this.keys.up.isDown    || this.key.w.isDown || (this.padY < -0.1)) y--;
    if (this.keys.down.isDown  || this.key.s.isDown || (this.padY > 0.1))  y++;
    if (this.keys.left.isDown  || this.key.a.isDown || (this.padX < -0.1)) x--;
    if (this.keys.right.isDown || this.key.d.isDown || (this.padX > 0.1))  x++;

    if (this.keyup2 != (this.keys.up.isDown || this.key.w.isDown || (this.padY < -0.1)) && !this.attacking) {
        this.animating = false;
        this.keyup2 = this.keys.up.isDown || this.key.w.isDown || (this.padY < -0.1);
    }

    if (this.keydown2 != (this.keys.down.isDown || this.key.s.isDown || (this.padY > 0.1)) && !this.attacking) {
        this.animating = false;
        this.keydown2 = this.keys.down.isDown || this.key.s.isDown || (this.padY > 0.1);
    }

    if (this.keyleft2 != (this.keys.left.isDown|| this.key.a.isDown || (this.padX < -0.1)) && !this.attacking) {
        this.animating = false;
        this.keyleft2 = this.keys.left.isDown || this.key.a.isDown || (this.padX < -0.1);
    }

    if (this.keyright2 != (this.keys.right.isDown || this.key.d.isDown || (this.padX > 0.1)) && !this.attacking) {
        this.animating = false;
        this.keyright2 = this.keys.right.isDown || this.key.d.isDown || (this.padX > 0.1);
    }


    if (this.keys.up.downDuration(50)    || this.key.w.downDuration(50))this.animating = false;
    if (this.keys.down.downDuration(50)  || this.key.s.downDuration(50))this.animating = false;
    if (this.keys.left.downDuration(50)  || this.key.a.downDuration(50))this.animating = false;
    if (this.keys.right.downDuration(50) || this.key.d.downDuration(50))this.animating = false;


    if (x != 0 || y != 0) { // (left||right||up||down).isDown .. Sorry, I was lazy

        if (x > 0) {
            this.dir = 1; //east
            this.body.moveRight(this.speed);
            //if (this.scale.x < 0) this.scale.x *= -1; // mirroring
        }
        if (x < 0) {
            this.dir = 3; //west
            this.body.moveLeft(this.speed);
            //if (this.scale.x > 0) this.scale.x *= -1; // mirroring
        }
        if (y > 0) {
            this.dir = 2; //south
            this.body.moveDown(this.speed);
            //if (this.scale.x < 0) this.scale.x *= -1;
        }
        if (y < 0) {
            this.dir = 0; // north
            //if (this.scale.x < 0) this.scale.x *= -1; // mirroring
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
                this.animations.play("walk_right");
            } else {
                this.frame = 15;
            }
        }
    }
};

Ken.prototype.attack = function () {

    var dist;
    var dist2;

    if (this.dir == 0) {
        dist = (this.walking) ? this.spriteAttack.height + 16 : this.spriteAttack.height;
        dist2 = (this.walking) ? this.spriteAttack.height/2: 0;
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16;

        if(this.attackIsAvailable){
            this.spriteAttack.x = this.x;
            this.spriteAttack.y = this.y - dist2;
            this.spriteAttack.angle = 0;
        }

        this.attackZone.body.x = this.x;
        this.attackZone.body.y = this.y - dist + (40*this.parameters.attackSize);
        this.attackZone.body.angle = 0;



    } else if (this.dir == 2) {
        dist = (this.walking) ? this.spriteAttack.height + 16  : this.spriteAttack.height;
        dist2 = (this.walking) ? this.spriteAttack.height/2: 0;
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16;
        if(this.attackIsAvailable) {
            this.spriteAttack.x = this.x;
            this.spriteAttack.y = this.y + dist2;
            this.spriteAttack.angle = 180;
        }

        this.attackZone.body.x = this.x;
        this.attackZone.body.y = this.y + dist - (40*this.parameters.attackSize);
        this.attackZone.body.angle = 180;



    } else if (this.dir == 1) {
        dist = (this.walking) ? this.spriteAttack.width + 16  : this.spriteAttack.width;
        dist2 = (this.walking) ? this.spriteAttack.width/2: 0;
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16;
        if(this.attackIsAvailable) {
            this.spriteAttack.x = this.x + dist2;
            this.spriteAttack.y = this.y;
            this.spriteAttack.angle = 90;
        }

        this.attackZone.body.x = this.x + dist - (32*this.parameters.attackSize);
        this.attackZone.body.y = this.y;
        this.attackZone.body.angle = 90;



    } else if (this.dir == 3) {
        dist = (this.walking) ? this.spriteAttack.width + 16  : this.spriteAttack.width;
        dist2 = (this.walking) ? this.spriteAttack.width/2: 0;
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16;
        if(this.attackIsAvailable) {
            this.spriteAttack.x = this.x - dist2;
            this.spriteAttack.y = this.y;
            this.spriteAttack.angle = 270;
        }
        this.attackZone.body.x = this.x - dist + (32*this.parameters.attackSize);
        this.attackZone.body.y = this.y;
        this.attackZone.body.angle = 270;
    }



    //To attack, we need the attackKey pressed and that the action is available
    if ((this.attackKey.isDown || this.attackButton.isDown) && this.attackIsAvailable) {



        var self = this;
        var hit = false;


        this.game.entities.forEachAlive(function (enemy) {
            if (self.checkOverlap(self.attackZone, enemy) && enemy != self) {
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


Ken.prototype.poisonHit = function(damage){
    if(!this.poisoned.value && !this.invulnerability.value){
        this.poisoned.value = true;
        this.highlight(0x0d7200, this.poisoned);
        if (this.messagesIsAvailable) {
            this.game.ui.dialogue(this.x, this.y, this.messages_hit[Math.floor(Math.random() * this.messages_hit.length)]);
            this.messagesIsAvailable = false;
        }
        this.poisonEffect(damage, 10);
    }
};

Ken.prototype.poisonEffect = function(damage, i){
    i--;
    if(i <= 0){
        this.poisoned.value = false;
        return;
    }

    this.health -= damage;
    this.game.ui.setHealthWidth(this.health);
    this.game.ui.dialogue(this.x, this.y, damage.toString(), 16, null, null, 0x0d7200);
    if (this.health <= 0) {
        //this.game.state.start('over');
    }

    var poisonTimer = this.game.time.create(false);
    poisonTimer.start();
    poisonTimer.add(200, this.poisonEffect, this, damage, i);

};


Ken.prototype.hit = function (damage) {
    if(!this.invulnerability.value){
        this.setInvulnerable(1000);
        this.highlight(0x510000, this.invulnerability);
        this.health -= damage;

        this.game.ui.dialogue(this.x, this.y, damage.toString(), 16, null, null, 0xFFD555);

        if (this.messagesIsAvailable) {
            this.game.ui.dialogue(this.x, this.y, this.messages_hit[Math.floor(Math.random() * this.messages_hit.length)]);
            this.messagesIsAvailable = false;
        }

        this.game.ui.setHealthWidth(this.health);
        if (this.health <= 0) {
            //this.game.state.start('over');
        }
    }
};

Ken.prototype.setInvulnerable = function(time){
    this.invulnerability.value = true;
    if(time){
        var timerInvulnerability = this.game.time.create(false);
        timerInvulnerability.start();
        timerInvulnerability.add(time, this.unsetInvulnerable, this);
    }
};

Ken.prototype.unsetInvulnerable = function(){
    this.invulnerability.value = false;

};

Ken.prototype.highlight = function(tint, callback){
    if(callback.value){
        this.tint =  (this.tint == 0xffffff) ? tint : 0xffffff;

        var timerHighlight = this.game.time.create(false);
        timerHighlight.start();
        timerHighlight.add(200, this.highlight, this, tint, callback);
    }else{
        this.tint = 0xffffff;
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
        this.attackZone.filters = [this.filterDebugAtk];
        this.filters = [this.filterDebug];
    } else {
        this.spriteAttack.filters = null;
        this.attackZone.filters = null;
        this.filters = null;
    }
};
