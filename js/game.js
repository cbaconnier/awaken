(function () {
    'use strict';


    var ns = window['awaken'];

    function Game() {
    }

    Game.prototype = {

        init: function(level){
            this.game.level = level;
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

            this.input.gamepad.start();
            this.game.pad = this.input.gamepad.pad1;
            this.game.pad.addCallbacks(this, {onConnect: this.addButtons});
            this.addButtons();

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


            this.game.enemies = new ns.Enemies(this.game);
            this.game.bosses = new ns.Bosses(this.game);
            this.game.tilesf = new ns.Tiles(this.game);

            this.game.tiles = this.game.add.group();
            this.game.effects = this.game.add.group();
            this.game.entities = this.game.add.group();

            this.game.over = false;

            this.game.maxEnemies = 10;

            // Objectives
            this.game.enemiesKilled = 0;
            this.game.bossesKilled = 0;


            this.game.ken = new Ken(this.game, this.game.level.playerParameters);
            this.game.entities.add(this.game.ken);
            this.game.ui = new ns.UI(this.game);

            this.game.tilesf.addTiles();
            this.game.bosses.addBosses();
            this.game.enemies.addEnemies();

            if(!ns.Boot.fxMusic.isPlaying) ns.Boot.fxMusic.play();
            if(!ns.Boot.fxMusic.paused) ns.Boot.fxMusic.resume();


            this.game.events = new ns.Events(this.game);
            this.game.events.setEvents(this.game.level.events);

        },


        update: function () {
            this.game.ui.update();
            this.game.events.update();
            this.game.entities.sort("yy");
            this.objectivesComplete();
        },

        render: function (){
            /**debug**/
            //this.game.debug.spriteInfo(this.ken.sprite, 2, 32);
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#fff");

        },

        objectivesComplete: function(){

            if(this.game.over) this.gameOver();

              if(
                  (this.game.level.enemiesToKill != null && this.game.enemiesKilled >= this.game.level.enemiesToKill) //Number of enemies to kill
                    ||
                  (this.game.level.timeLimit != null && this.game.time.totalElapsedSeconds() > this.game.level.timeLimit)  //Time elapsed in the level
                    ||
                  (this.game.level.bossesToKill != null && this.game.bossesKilled >= this.game.level.bossesToKill)
              ){

                  this.game.entities.setAll('blocked', true);

                  var nextLevelTimer = this.game.time.create(false);
                  nextLevelTimer.start();
                  nextLevelTimer.add(1000, this.killThemAll, this);
              }


        },

        gameOver: function(){
            this.game.entities.setAll('blocked', true);

            var nextLevelTimer = this.game.time.create(false);
            nextLevelTimer.start();
            nextLevelTimer.add(3000, this.gameOverState, this);

        },

        killThemAll: function(){
            this.game.entities.forEachAlive(function(entity){
                entity.blocked = true;
                if(entity.type != 'ken') {
                    entity.bleed();
                    entity.die();
                }
            });

            var nextLevelTimer = this.game.time.create(false);
            nextLevelTimer.start();
            nextLevelTimer.add(1000, this.nextLevel, this);

        },

        gameOverState: function(){
            if(this.game.level.nextLevel()){
                this.game.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.dispose();
                this.game.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.dispose();
                this.game.state.start('over', true, false, this.game.level.nextLevel());
            }
        },

        nextLevel: function(){
            if(this.game.level.nextLevel()){
                this.game.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.dispose();
                this.game.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.dispose();
                this.game.state.start('transition', true, false, this.game.level.nextLevel());
            }
        },


        addButtons: function(){
            this.game.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(this.onInputDown, this);
            //this.pad.getButton(Phaser.Gamepad.XBOX360_Y).onDown.add(this.goFullscreen, this);
        },

        onInputDown: function () {
            this.game.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.dispose();
            this.game.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.dispose();
            this.game.state.start('menu');
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
