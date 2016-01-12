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



            this.game.entitiesCollisions = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();

            this.game.debugCollisions = false;




            this.game.enemies = new ns.Enemies();
            this.game.bosses = new ns.Bosses();
            this.game.effects = this.game.add.group();
            this.game.entities = this.game.add.group();

            this.game.effects.z = 0;
            this.game.entities.z = 5;

            this.game.maxEnemies = 10;
            this.game.enemiesKilled = 0;

            this.game.ken = new Ken(this.game, this.level.playerParameters);
            this.game.entities.add(this.game.ken);
            this.game.ui = new ns.UI(this.game);

            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();
            this.addEnemy();

            this.bossesTimer = this.game.time.create(false);
            this.bossesTimer.start();
            this.addBoss();

            if(!ns.Boot.fxMusic.isPlaying) ns.Boot.fxMusic.play();
            if(!ns.Boot.fxMusic.paused) ns.Boot.fxMusic.resume();


            this.game.events = new ns.Events(this.game);
            this.game.events.setEvents(this.level.events);

        },



        update: function () {
            this.game.ui.update();
            this.game.events.update();
            this.game.entities.sort("y");
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

        //todo : in bosses
        addBoss: function(){
            var location = this.popLocation();


            var self = this;
            var boss = null;
            var nbBossesAlive = 0;

            this.game.entities.filter(function(child) {

                if(self.game.bosses.getBossesList().indexOf(child.type) != -1){

                    //retrive the first boss dead
                    if (boss === null  && !child.alive) {
                        boss = child;
                    }

                    //count the number of children(bosses) alive of this type
                    if (child.alive && boss !== null) {
                        if (boss !== null && child.type == enemy.type) nbBossesAlive++;
                    }

                }
                return child;

            }, true);

            if(boss !== null && nbBossesAlive < boss.maxBoss) {
                boss.reset(location.x,location.y);
                boss.init(this.level.bossParameters[boss.type]);
                console.log("1");
            }else if(nbBossesAlive < this.level.maxBosses){
                this.createRandomBoss(Object.keys(this.level.bossParameters), location.x, location.y);
                console.log("2");
            }


            this.bossesTimer.add(Math.random() * (this.level.maxSpawnDelay - this.level.minSpawnDelay)+this.level.minSpawnDelay, this.addBoss, this);

        },

        createRandomBoss: function(bosses, x, y){
            if(bosses.length < 1) return null;
            console.log("tick");
            //pick random boss
            var boss = bosses[ bosses.length * Math.random() << 0 ];

            var nbAlive = 0; //number of boss alive: A type of enemies can have a limit
            this.game.entities.forEachAlive(function(e){
                if(e.type == boss) nbAlive++;
            });

            if (nbAlive < this.level.bossParameters[boss].maxBoss){
                //add a new boss to the entities
                this.game.entities.add(this.game.bosses.getBoss(boss, this.game, x, y, this.level.bossParameters));
            }else{
                //In case, we have reach the limit of the picked one, we to look for an another one
                var index = bosses.indexOf(boss);
                if (index > -1) {
                    bosses.splice(index, 1);
                }
                this.createRandomBoss(bosses, x, y);
            }
        },

        //todo : in enemies
        addEnemy: function(){

            var location = this.popLocation();

            if(this.game.entities.length < this.level.maxEnemies) {
                 this.createRandomEnemy(Object.keys(this.level.enemyParameters), location.x, location.y);
            }else{

                var enemy = null;
                var self = this;
                var nbEnemyAlive = 0;
                this.game.entities.filter(function(child) {

                    if (self.game.enemies.getEnemiesList().indexOf(child.type) != -1 ){

                        //retrive the first enemy dead
                        if (enemy === null  && !child.alive) {
                            enemy = child;
                        }

                        //count the number of children alive of this type
                        if (child.alive && enemy !== null) {
                            if (enemy !== null && child.type == enemy.type) nbEnemyAlive++;
                        }
                    }
                    return child;
                }, false);

                if(enemy !== null && nbEnemyAlive <= enemy.maxEnemy){
                    enemy.reset(location.x,location.y);
                    enemy.init(this.level.enemyParameters[enemy.type]);
                }
            }

            this.enemiesTimer.add(Math.random() * (this.level.maxSpawnDelay - this.level.minSpawnDelay)+this.level.minSpawnDelay, this.addEnemy, this);

        },

        //todo : in enemies
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
                this.game.entities.add(this.game.enemies.getEnemy(enemy, this.game, x, y, this.level.enemyParameters));
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
        }




    };










    window['awaken'] = window['awaken'] || {};
    window['awaken'].Game = Game;
}());
