'use strict';


/**
 *
 * Ken
 *
 * He's only a prototype but..
 * He's the best, he's the legend
 * He's.. KEN !
 *
 * And now.. YOU are Ken !
 *
 *
 *  @params {Game}
 *  @params {Levels.level.playerParameters}
 *
 *
 */




var ns = window['awaken'];

/** Extend Sprite **/
var Ken = function (game, parameters) {
    this.game = game;

    Phaser.Sprite.call(this, game, this.game.width *.5, this.game.height *.5, 'ken');

    this.type = "ken"; // phaser override type if placed before the extend
    this.parameters = parameters;

    this.create();
};

Ken.prototype = Object.create(Phaser.Sprite.prototype);
Ken.prototype.constructor = Ken;



/** Creation of Ken **/
Ken.prototype.create = function () {

    /** Player propriety **/
    this.health = this.parameters.health;
    this.maxDamage = this.parameters.maxDmg;
    this.minDamage = this.parameters.minDmg;
    this.speed = 200;
    this.defaultSpeed = this.speed;


    this.yy = this.y; //y position to sorting during the render
    this.dir = 2; // direction of the player

    /** Health bar **/
    var healthBarParams = {x: 30, y: 35, width: 300, height: 20, radius: 3, color: '#FFFFFF', bgColor: '#651828', highlight: true, hiddable: false, name: "KEN", names: "PLAYERS"};
    this.healthBar = new HealthBar(this.game, this.health, healthBarParams);



    /** Availability of animations, actions, ... **/
    this.attacking = false; // player is currently attacking
    this.walking = false; // player is currently walking
    this.animating = false; // player is currently animated
    this.attackIsAvailable = true; // Attacking action is available
    this.messagesIsAvailable = true; // Message when hit is available

    // objects because we need the reference of the value when we use them in callback
    this.invulnerability = {
        value: false
    };
    this.poisoned = {
        value: false
    };



    /** Block the player **/
    this.blocked = false;

    /** Messages of the player when he's hit**/
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


    /** Gamepad **/
    this.attackButton = null;
    this.padX = null;
    this.padY = null;


    if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.pad.connected){
        this.game.pad.addCallbacks(this, {onConnect: this.addButtons});
        this.addButtons();
    }



    /** sprites
     *
     * Ken have currently 3 sprites actives but only 2 visible
     *      The first one is obviously Ken (Already created -> this)
     *      The second one is the attack
     *      The third one is the attack zone. who isn't visible
     * **/

    //The sprite attack
    this.spriteAttack = this.game.add.sprite(this.x, this.y, 'attack');
    this.spriteAttack.angle = 180;
    this.spriteAttack.anchor.setTo(0.5);

    //The attack zone
    this.attackZone = this.game.add.sprite(this.x, this.y, 'attack');
    this.attackZone.angle = 180;
    this.attackZone.anchor.setTo(0.5);


    // We keep pixels instead of smooting the sprite when he's bigger
    this.smoothed = false;
    this.spriteAttack.smoothed = false;


    /** physics **/
    // Ken
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this, false);
    this.body.fixedRotation = true;

    // Attack zone
    this.attackZone.enableBody = true;
    this.attackZone.physicsBodyType = Phaser.Physics.P2JS;
    this.game.physics.p2.enable(this.attackZone, false);
    this.attackZone.body.fixedRotation = true;
    this.attackZone.body.collideWorldBounds = false;


    /** collisions **/
    this.body.setCircle(28);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);



    /** animations **/
    this.animationSpeed = 6; //frame rate

    // walking animations
    this.animations.add('walk_down', [1, 0, 2, 0], this.animationSpeed, false);
    this.animations.add('walk_up', [6, 5, 7, 5], this.animationSpeed, false);
    this.animations.add('walk_left', [11, 10, 12, 10], this.animationSpeed, false);
    this.animations.add('walk_right', [16, 15, 17, 15], this.animationSpeed, false);

    // attacking animations
    this.animations.add('attack_down', [3, 4], this.animationSpeed, false);
    this.animations.add('attack_up', [8, 9], this.animationSpeed, false);
    this.animations.add('attack_left', [13, 14], this.animationSpeed, false);
    this.animations.add('attack_right', [18, 19], this.animationSpeed, false);

    // attack animation
    this.spriteAttack.animations.add('attack', [0, 1, 2], this.animationSpeed * 2, false);

    // attack zone animation (should be removed)
    this.attackZone.animations.add('attack', [0, 1, 2], this.animationSpeed * 2, false);


    /** Sizes **/

    //Ken
    this.scale.x = 1.5;
    this.scale.y = 1.5;

    //Sprite attack
    this.spriteAttack.scale.x = this.parameters.attackSize;
    this.spriteAttack.scale.y = this.parameters.attackSize;

    //Attack zone
    this.attackZone.scale.x = this.parameters.attackSize;
    this.attackZone.scale.y = this.parameters.attackSize;


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
    //Sprite
    this.events.onAnimationStart.add(function () {
        //prevent others animations
        this.attacking = false;
        this.animating = true;
    }, this);


    //Attack
    this.spriteAttack.events.onAnimationStart.add(function () {
        //show sprite attack
        this.spriteAttack.visible = true;
    }, this);


    /** After animate **/
    // Attack
    this.spriteAttack.events.onAnimationComplete.add(function () {
        //Hide sprite attack
        this.spriteAttack.visible = false;
    }, this);

    //Sprite
    this.events.onAnimationComplete.add(function () {
        //allow others animations
        this.animating = false;
    }, this);


    /*** Timers ***/
    // Messages when hit are available each second
    this.game.time.events.loop(1000, this.setMessageAvailable, this);


    /*** Audio ***/
    // When hit an entity
    this.fxHit = this.game.add.audio('fx_hit');
    this.fxHit.allowMultiple = false;
    this.fxHit.volume = ns.Boot.fxVolume;

    //When attack but don't hit
    this.fxAttack = this.game.add.audio('fx_attack');
    this.fxAttack.allowMultiple = false;
    this.fxAttack.volume = ns.Boot.fxVolume;


};

/** Add the buttons to the gamepad **/
Ken.prototype.addButtons = function (){
    this.attackButton = this.game.pad.getButton(Phaser.Gamepad.XBOX360_A);
};


/** Update logic called every {fps} times per seconds  **/
Ken.prototype.update = function () {

    if(!this.blocked){
        this.move();
        this.attack();
    }else{
        // if the player is blocked //see ns.Game(), the player can't move/attack and we have to stop the velocity
        this.body.setZeroVelocity();
    }


    this.animate(); // animate the player
    this.debugCollisions(); //only if actived

    this.yy = this.y; // update the sort rendering // see ns.Game()

    this.resetSpeed(); // Events/Tiles can change the speed of the player. When it's done, we reset his speed

};


/** Decrease the speed of the player **/
Ken.prototype.decreaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed -= speed*2.5;
};

/** Increase the speed of the player **/
Ken.prototype.increaseSpeed = function(speed){
    if(this.speed == this.defaultSpeed)
        this.speed += speed*2.5;
};

/** Reset the speed of the player **/
Ken.prototype.resetSpeed = function(){
    this.speed = this.defaultSpeed;
};

/** Simulates the wind force on the player -- see ns.Wind **/
Ken.prototype.setWindForce = function(force){
    if(!this.blocked) this.body.x+=force;
};


/** Move logic of the player **/
Ken.prototype.move = function () {

    // reset the velocity of the player
    this.body.setZeroVelocity();
    var x = 0;
    var y = 0;

    // get the stick orientation of the gamepad
    if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.pad.connected) {
        this.padX = this.game.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        this.padY = this.game.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    }

    /** direction of the player **/
    if (this.keys.up.isDown    || this.key.w.isDown || (this.padY < -0.1)) y--;
    if (this.keys.down.isDown  || this.key.s.isDown || (this.padY > 0.1))  y++;
    if (this.keys.left.isDown  || this.key.a.isDown || (this.padX < -0.1)) x--;
    if (this.keys.right.isDown || this.key.d.isDown || (this.padX > 0.1))  x++;


    /** Stop the animation exactly when the player release the key **/
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


    /** Move the player and set is direction **/
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

/** Animate the player **/
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

/** Attack an entity **/
Ken.prototype.attack = function () {

    var dist;
    var dist2;

    /** Can probably be refractored **/
    if (this.dir == 0) {
        dist = (this.walking) ? this.spriteAttack.height + 16 : this.spriteAttack.height; // distance of the attack zone (hittable from the player)
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16; // distance of the sprite visible from the player

        // if the sprite is ready we place it at the right position
        if(this.attackIsAvailable){
            this.spriteAttack.x = this.x;
            this.spriteAttack.y = this.y - dist2;
            this.spriteAttack.angle = 0;
        }

        // we attack
        this.attackZone.body.x = this.x;
        this.attackZone.body.y = this.y - dist + (40*this.parameters.attackSize);
        this.attackZone.body.angle = 0;



    } else if (this.dir == 2) {
        dist = (this.walking) ? this.spriteAttack.height + 16  : this.spriteAttack.height; // distance of the attack zone (hittable from the sprite to the player)
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16; // distance of the sprite visible from the player

        // if the sprite is ready we place it at the right position
        if(this.attackIsAvailable) {
            this.spriteAttack.x = this.x;
            this.spriteAttack.y = this.y + dist2;
            this.spriteAttack.angle = 180;
        }

        // we attack
        this.attackZone.body.x = this.x;
        this.attackZone.body.y = this.y + dist - (40*this.parameters.attackSize);
        this.attackZone.body.angle = 180;



    } else if (this.dir == 1) {
        dist = (this.walking) ? this.spriteAttack.width + 16  : this.spriteAttack.width; // distance of the attack zone (hittable from the sprite to the player)
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16; // distance of the sprite visible from the player

        // if the sprite is ready we place it at the right position
        if(this.attackIsAvailable) {
            this.spriteAttack.x = this.x + dist2;
            this.spriteAttack.y = this.y;
            this.spriteAttack.angle = 90;
        }

        // we attack
        this.attackZone.body.x = this.x + dist - (32*this.parameters.attackSize);
        this.attackZone.body.y = this.y;
        this.attackZone.body.angle = 90;



    } else if (this.dir == 3) {
        dist = (this.walking) ? this.spriteAttack.width + 16  : this.spriteAttack.width; // distance of the attack zone (hittable from the sprite to the player)
        dist2 = (this.walking) ? (6-this.parameters.attackSize) * 8: 16; // distance of the sprite visible from the player

        // if the sprite is ready we place it at the right position
        if(this.attackIsAvailable) {
            this.spriteAttack.x = this.x - dist2;
            this.spriteAttack.y = this.y;
            this.spriteAttack.angle = 270;
        }

        // we attack
        this.attackZone.body.x = this.x - dist + (32*this.parameters.attackSize);
        this.attackZone.body.y = this.y;
        this.attackZone.body.angle = 270;
    }


    //To attack, we need the attackKey pressed (attackey, attackbutton) and the attack available
    if ((this.attackKey.isDown || (this.attackButton!= null && this.attackButton.isDown)) && this.attackIsAvailable) {

        var self = this;
        var hit = false;

        // Check if we hit an enemy
        this.game.entities.forEachAlive(function (enemy) {
            if (self.checkOverlap(self.attackZone, enemy) && enemy != self) {
                self.fxHit.play();
                hit = true;
                //hit the enemy
                enemy.hit(Math.round(Math.random() * (self.maxDamage - self.minDamage) + self.minDamage));
                ns.Boot.score += enemy.scoreGiven;
            }
        });

        // if we didn't hit any enemy we play the normal attack fx
        if(!hit){
            this.fxAttack.play();
        }

        //update the actions
        this.animating = false;
        this.attacking = true;
        this.attackIsAvailable = false;

        //set the next attack available in 500ms
        this.game.time.events.add(500, this.setAttackAvailable, this);
    }
};

/** When the player is hit by poison **/
Ken.prototype.poisonHit = function(damage){
    if (!this.alive) return;

    if(!this.poisoned.value && !this.invulnerability.value){ // needs to not be already poisoned and not invulnerable to be poisoned
        this.poisoned.value = true;

        this.highlight(0x0d7200, this.poisoned);

        // display a random message if possible
        if (this.messagesIsAvailable) {
            this.game.dialogues.create(this.x, this.y, this.messages_hit[Math.floor(Math.random() * this.messages_hit.length)]);
            this.messagesIsAvailable = false;
        }

        this.poisonEffect(damage, 10); // start the poison effect (damage, number of recursions)
    }
};

/** recursives effects of the poison (damage, number of recursions) **/
Ken.prototype.poisonEffect = function(damage, i){
    if (!this.alive) return;
    i--;

    if(i <= 0){
        this.poisoned.value = false;
        return;
    }


    if(!ns.Boot.cheater) this.health -= damage;
    if(this.health < 0) this.health = 0;


    if(!ns.Boot.cheater) this.healthBar.updateHealthBar(damage);

    // Create a dialogue with the number of damage the player got
    this.game.dialogues.create(this.x, this.y, damage.toString(), 16, null, null, 0x0d7200);


    if (this.health <= 0) {
       this.die();
    }

    // we recursing this function again
    var poisonTimer = this.game.time.create(false);
    poisonTimer.start();
    poisonTimer.add(200, this.poisonEffect, this, damage, i);

};

/** player is hit **/
Ken.prototype.hit = function (damage) {
    if (!this.alive) return;

    if(!this.invulnerability.value){

        this.setInvulnerable(1000);
        this.highlight(0x510000, this.invulnerability);

        if(!ns.Boot.cheater) this.health -= damage;
        if(this.health < 0) this.health = 0;

        // Create a dialogue with the number of damage the player got
        this.game.dialogues.create(this.x, this.y, damage.toString(), 16, null, null, 0xFFD555);

        // display a random message if possible
        if (this.messagesIsAvailable) {
            this.game.dialogues.create(this.x, this.y, this.messages_hit[Math.floor(Math.random() * this.messages_hit.length)]);
            this.messagesIsAvailable = false;
        }

        if(!ns.Boot.cheater) this.healthBar.updateHealthBar(damage);

        if (this.health <= 0) {
            this.die();
        }
    }
};


/** The player die **/
Ken.prototype.die = function() {
    if (!this.alive) return;

    // blood tile parameters
    var parameters = {
        dir: this.dir,
        scaleX: 2,
        scaleY: 2
    };

    this.game.tilesFactory.addTile('blood', this.x, this.y, parameters);
    this.kill();
    this.game.over = true;
};


/** Set the player invulnerable for a given time **/
Ken.prototype.setInvulnerable = function(time){
    this.invulnerability.value = true;
    if(time){
        var timerInvulnerability = this.game.time.create(false);
        timerInvulnerability.start();
        timerInvulnerability.add(time, this.unsetInvulnerable, this);
    }
};

/** Remove invulnerability **/
Ken.prototype.unsetInvulnerable = function(){
    this.invulnerability.value = false;

};

/** Highlight the player while the given object is true **/
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

/** Set message available **/
Ken.prototype.setMessageAvailable = function () {
    this.messagesIsAvailable = !this.messagesIsAvailable;
};

/** Set the attack available **/
Ken.prototype.setAttackAvailable = function () {
    this.attackIsAvailable = true;
};


/** Check the overlap between two bodies **/
Ken.prototype.checkOverlap = function (body1, body2) {

    return (
        body1.left < body2.right &&
        body1.right > body2.left &&
        body1.top < body2.bottom &&
        body1.bottom > body2.top
    );

};


/** reset the collisions (when we toggle the fullscreen) **/
Ken.prototype.resetCollisions = function (){
    this.body.setCircle(28);
    this.body.setCollisionGroup(this.game.entitiesCollisions);
    this.body.collides(this.game.entitiesCollisions);
};

/** Debug the collisions **/
Ken.prototype.debugCollisions = function () {
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
