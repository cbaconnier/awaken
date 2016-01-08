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

        },



        update: function () {
            this.game.ui.update();
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

        goFullscreen: function(){
           // this.game.paused = true;
            if (this.game.scale.isFullScreen)
            {
                console.log(this.game.ken);
                this.game.scale.stopFullScreen();

                //this.game.scale.fullScreenChange();


            }
            else
            {
                console.log(this.game.physics.p2);
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.startFullScreen(false);
            }
            //this.game.paused = false;
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
