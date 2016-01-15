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


            this.game.maxEnemies = 10;
            this.game.enemiesKilled = 0;

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
            this.nextLevel();

        },

        render: function (){
            /**debug**/
            //this.game.debug.spriteInfo(this.ken.sprite, 2, 32);
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#fff");

        },

        nextLevel: function(){
            if(this.game.level.nextLevel()){
              if(this.game.enemiesKilled >= this.game.level.enemiesToKill){
                  this.game.state.start('transition', true, false, this.game.level.nextLevel());
              }
            }

        },

        onInputDown: function () {
            this.game.state.start('over');
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
