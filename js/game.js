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
            this.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.onInputDown, this);
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.goFullscreen, this);


            this.game.stage.backgroundColor = '#333';
            //this.game.stage.backgroundColor = '#fff';

            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.restitution = 0.8;
            this.game.physics.p2.setImpactEvents(true);
            this.game.world.setBounds(0,12,800, 595);
            this.game.physics.p2.setBoundsToWorld(true, true, true, true, true); //set borders(left/right/up/down) collidable


            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();


            this.game.entitiesCollisions = this.game.physics.p2.createCollisionGroup();
            this.game.debugCollisions = false;


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
                var enemies = Object.keys(this.level.enemyParameters);
                enemy = this.pickRandEnemy(enemies, location.x, location.y);
                if(enemy !== null && enemy !== undefined)
                    this.game.entities.add(enemy);
            }else{
                if(enemy !== null && this.game.entities.countLiving() < enemy.maxEnemy){
                    enemy.reset(location.x,location.y);
                    enemy.init(this.level.enemyParameters[enemy.type]);
                }
            }

            this.enemiesTimer.add(Math.random() * (this.level.maxSpawnDelay - this.level.minSpawnDelay)+this.level.minSpawnDelay, this.addEnemy, this);

        },

        pickRandEnemy: function(enemies, x, y){
            if(enemies.length < 1) return null;

            var enemy = enemies[ enemies.length * Math.random() << 0];

            var nbAlive = 0;
            this.game.entities.forEachAlive(function(e){
                if(e.type == enemy) nbAlive++;
            });

            if (nbAlive < this.level.enemyParameters[enemy].maxEnemy){
                return this.game.enemyFactory.getEnemy(enemy, this.game, x, y, this.level.enemyParameters);
            }else{

                var index = enemies.indexOf(enemy);
                if (index > -1) {
                    enemies.splice(index, 1);
                }
                this.pickRandEnemy(enemies, x, y);
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
                this.game.scale.startFullScreen(false);
            }
        }


    };










    window['awaken'] = window['awaken'] || {};
    window['awaken'].Game = Game;
}());
