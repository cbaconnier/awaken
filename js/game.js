(function () {
    'use strict';


    var ns = window['awaken'];

    function Game() {
    }

    Game.prototype = {

        init: function(level){
            this.level = level;
        },


        create: function () {

            //bug fix with the fullscreen... When chrome (also others nav?) quit the fullscreen mode, we have to trigger manually the event to make it work
            if (document.addEventListener)
            {
                var self = this;
                document.addEventListener('webkitfullscreenchange', function(){
                    self.exitHandler();
                }, false);
                document.addEventListener('mozfullscreenchange', function(){
                    self.exitHandler();
                }, false);
                document.addEventListener('fullscreenchange', function(){
                    self.exitHandler();
                }, false);
                document.addEventListener('MSFullscreenChange', function(){
                    self.exitHandler();
                }, false);
            }


            this.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.onInputDown, this);
            this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.goFullscreen, this);


            this.game.stage.backgroundColor = '#333';

            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
            this.game.physics.p2.restitution = 0.8;
            this.game.world.setBounds(0,12,800, 595);//set borders(left/right/up/down) collidable
            //this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);



            this.game.entitiesCollisions = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();

            this.game.debugCollisions = false;

            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();


            this.game.enemyFactory = new ns.EnemyFactory();
            this.game.effects = this.game.add.group();
            this.game.entities = this.game.add.group();

            this.game.effects.z = 0;
            this.game.entities.z = 5;

            this.game.maxEnemies = 10;
            this.game.enemiesKilled = 0;

            this.game.ken = new Ken(this.game, this.level.playerParameters);
            this.game.entities.add(this.game.ken);
            this.game.ui = new ns.UI(this.game);

            this.addEnemy();

            if(!ns.Boot.fxMusic.isPlaying) ns.Boot.fxMusic.play();
            if(!ns.Boot.fxMusic.paused) ns.Boot.fxMusic.resume();


            //this.game.sound.setDecodedCallback(this.fxMusic, start, this);
            //this.fxMusic.play();

            /*** TEST ***/
                //Todo make it cleaner and in a separate place
             this.max = 0;
             this.front_emitter;
             this.mid_emitter;
             this.back_emitter;
             this.update_interval = 4 * 60;
             this.i = 0;
            this.back_emitter = this.game.add.emitter(this.game.world.centerX, -32, 600);
            this.back_emitter.makeParticles('blood', [0, 1, 2]);
            this.back_emitter.maxParticleScale = 0.6;
            this.back_emitter.minParticleScale = 0.2;
            this.back_emitter.setYSpeed(20, 100);
            this.back_emitter.gravity = 0;
            this.back_emitter.width = this.game.world.width * 1.5;
            this.back_emitter.minRotation = 0;
            this.back_emitter.maxRotation = 40;

            this.mid_emitter = this.game.add.emitter(this.game.world.centerX, -32, 250);
            this.mid_emitter.makeParticles('blood', [0, 1, 2]);
            this.mid_emitter.maxParticleScale = 1.2;
            this.mid_emitter.minParticleScale = 0.8;
            this.mid_emitter.setYSpeed(50, 150);
            this.mid_emitter.gravity = 0;
            this.mid_emitter.width = this.game.world.width * 1.5;
            this.mid_emitter.minRotation = 0;
            this. mid_emitter.maxRotation = 40;

            this.front_emitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
            this.front_emitter.makeParticles('blood', [0, 1, 2]);
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


            /*** FIN TEST ***/

        },



        update: function () {
            this.game.ui.update();
            this.events();
            this.game.entities.sort();
            this.nextLevel();

        },

        render: function (){
            /**debug**/
            //this.game.debug.spriteInfo(this.ken.sprite, 2, 32);
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#fff");

        },

        nextLevel: function(){
            if(this.level.nextLevel()){
              if(this.game.enemiesKilled >= this.level.enemiesToKill){
                  this.game.state.start('transition', true, false, this.level.nextLevel());
              }
            }

        },

        onInputDown: function () {
            this.game.state.start('over');
        },

        addEnemy: function(){

            var location = this.popLocation();
            var enemy = this.game.entities.getFirstDead();

            if(this.game.entities.length < this.level.maxEnemies) {
                 this.createRandomEnemy(Object.keys(this.level.enemyParameters), location.x, location.y);
            }else{
                if(enemy !== null && this.game.entities.countLiving() < enemy.maxEnemy){
                    enemy.reset(location.x,location.y);
                    enemy.init(this.level.enemyParameters[enemy.type]);
                }
            }

            this.enemiesTimer.add(Math.random() * (this.level.maxSpawnDelay - this.level.minSpawnDelay)+this.level.minSpawnDelay, this.addEnemy, this);

        },

        createRandomEnemy: function(enemies, x, y){
            if(enemies.length < 1) return null;

            //pick random enemy
            var enemy = enemies[ enemies.length * Math.random() << 0 ];

            var nbAlive = 0; //number of enemy alive: A type of enemies can have a limit
            this.game.entities.forEachAlive(function(e){
                if(e.type == enemy) nbAlive++;
            });

            if (nbAlive < this.level.enemyParameters[enemy].maxEnemy){
                //add a new enemy to the entities
                this.game.entities.add(this.game.enemyFactory.getEnemy(enemy, this.game, x, y, this.level.enemyParameters));
            }else{
                //In case, we have reach the limit of the picked one, we to look for an another one
                var index = enemies.indexOf(enemy);
                if (index > -1) {
                    enemies.splice(index, 1);
                }
                this.createRandomEnemy(enemies, x, y);
            }
        },

        popLocation: function(){
            var x = Math.random() * (this.game.world.width * 3) - this.game.world.width;
            var y = (x < 0 || x > this.game.world.height) ?
            Math.random()* (this.game.world.height) :  // X is outside of the screen -> random on the Y axe
                Math.random() > 0.5 ? // X is inside of the screen -> we need to be above the top or below the bottom
                Math.random() - 128 :
                Math.random() * 128 + this.game.world.height;
            return {x:x,y:y};

        },


        events: function(){
            //this.generateWind([this.game.entities]);
            this.generateSnow();



        },

        generateSnow: function(){
            this.i++;

            if (this.i === this.update_interval)
            {
                this.changeWindDirection();
                this.update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
                this.i = 0;
            }
        },

        changeWindDirection: function(){
            var multi = Math.floor((this.max + 200) / 4),
                frag = (Math.floor(Math.random() * 100) - multi);
            this.max = this.max + frag;

            if (this.max > 200) this.max = 150;
            if (this.max < -200) this.max = -150;

            this.setXSpeed(this.back_emitter, this.max);
            this.setXSpeed(this.mid_emitter, this.max);
            this.setXSpeed(this.front_emitter, this.max);
        },

        setXSpeed: function(emitter, max){
            emitter.setXSpeed(max - 20, max);
            emitter.forEachAlive(this.setParticleXSpeed, this, max);
        },

        setParticleXSpeed: function(particle, max){
            particle.body.velocity.x = max - Math.floor(Math.random() * 30);
        },

        generateWind: function(groups){
            for(var i=0; i < groups.length; i++){
                groups[i].forEachAlive(function(sprite){
                   sprite.body.x+=1;
                });
            }
        },




        goFullscreen: function(){
            if (this.game.scale.isFullScreen)
            {
                this.game.scale.stopFullScreen();
            }
            else
            {
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.startFullScreen(false);
            }

        },

        exitHandler: function(){
            if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null)
            {
                /* Run code on exit */
                this.game.world.setBounds(0,12,800, 595,true,true,true,true,false);//set borders(left/right/up/down) collidable
                this.game.physics.p2.updateBoundsCollisionGroup();

                this.game.entitiesCollisions = this.game.physics.p2.createCollisionGroup();
                this.game.entities.callAll("resetCollisions");
            }
        },




    };










    window['awaken'] = window['awaken'] || {};
    window['awaken'].Game = Game;
}());
