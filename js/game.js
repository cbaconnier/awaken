/**
 *
 * Game state
 *
 * This state is where everything happen. The game logic, the events, the players, the enemies...
 *
 *
 *
 *
 *  @params {Levels.level}
 *
 */


(function () {
    'use strict';


    var ns = window['awaken'];

    function Game() {
    }

    Game.prototype = {

        /** Constructor **/
        init: function(level){
            this.game.level = level;
        },


        /** Creation of the game (entities, events, etc.. ) based on the level information **/
        create: function () {

            // bug fix with the fullscreen : Exit the fullscreen remove the bounce collisions.
            // we have to trigger manually the event of the browser to make it work instead of trust phaser
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


            /** Keyboard input (Player has is own input) **/
            this.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.onInputDown, this);
            this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.goFullscreen, this);


            /** Gamepad **/
            this.input.gamepad.start();
            this.game.pad = this.input.gamepad.pad1;
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.pad.connected){
                this.game.pad.addCallbacks(this, {onConnect: this.addButtons});
                this.addButtons();
            }


            /** Background color (ground) **/
            this.game.stage.backgroundColor = '#333';


            /** Enable P2JS physic in our game **/
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
            this.game.physics.p2.restitution = 0.8;
            this.game.world.setBounds(0,12,800, 595); // set borders(left/right/up/down) collidable


            /** Creation of the collisions groups **/
            this.game.entitiesCollisions = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();
            this.game.debugCollisions = false;


            /** Creation of the sprites groups **/
            // ! Order of creation is also the order of render
            this.game.tiles = this.game.add.group();
            this.game.effects = this.game.add.group();
            this.game.entities = this.game.add.group(); // We can't separate each type of entities into different groups because of the sort. The sort on Y axe can only affect his own group
            this.game.ui = this.game.add.group();
            this.game.events = [];  // Events are'nt extended from sprites or an another components. They can't be in a group


            /** Instantiation of the Entities/events/tiles factory **/
            this.game.enemiesFactory = new ns.Enemies(this.game);
            this.game.bossesFactory = new ns.Bosses(this.game);
            this.game.tilesFactory = new ns.Tiles(this.game);
            this.game.eventsFactory = new ns.Events(this.game);


            /** Objectives **/
            this.game.enemiesKilled = 0;
            this.game.bossesKilled = 0;
            this.game.over = false;
            this.game.elapsedTime = 0;


            /** Creation of the player **/
            this.game.ken = new Ken(this.game, this.game.level.playerParameters);
            this.game.entities.add(this.game.ken);


            /** Creation of the ui **/
            this.game.notification = new Notification(this.game);
            this.lowPerf = new LowPerf(this.game);
            this.game.ui.add(this.game.notification);
            this.game.ui.add(this.lowPerf);
            this.game.ui.add(new Score(this.game));
            this.game.ui.add(new Objective(this.game));
            this.game.ui.add(new Debug(this.game));
            this.game.ui.add(new Fullscreen(this.game));
            this.game.dialogues = new Dialogue(this.game);


            /** Generation of the tiles, bosses, ennemies and events **/
            this.game.tilesFactory.addTiles();
            this.game.bossesFactory.addBosses();
            this.game.enemiesFactory.addEnemies();
            this.game.eventsFactory.setEvents(this.game.level.events);


            /** Timer to count the elapsed time (used for the objective using time) **/
            this.timer = this.game.time.create(false);
            this.timer.loop(1000, this.updateElapsedTime, this);
            this.timer.start();
        },


        /** Update the game every called {fps} times per seconds  **/
        update: function () {

            // Events are'nt extended from sprites or an another components. So we have to update them manually
            this.game.eventsFactory.update();

            // Phaser isn't really compatible with game in 2.5D view, so we have
            // to sort the entites group with the y axe
            // Some sprites (like David boss) are specific where the sort is not at the default y position
            // So, to get ride of the default y axe that we can't change, we use a custom yy
            // Also, that because of the sort y that we can't separate each type of entities into multiple groups.
            this.game.entities.sort("yy");

            // Check if the objective is complete
            this.objectivesComplete();

            // Call the game over
            if(this.game.over) this.gameOver();

            // Automatic trigger : If the game has a low fps, we disable the blood tiles
            if(this.game.time.fps < 25 && !ns.Boot.lowPerf) this.lowPerf.togglePerf();

        },


        /** Render function (called {fps} times per seconds) **/
        render: function (){
            /**debug**/
            //this.game.debug.spriteInfo(this.ken.sprite, 2, 32);
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#fff");

        },


        /** Increment each seconds; time to complete the objective timeLimit **/
        updateElapsedTime: function(){
            this.game.elapsedTime++;
        },


        /** Check if the objectives are complete **/
        objectivesComplete: function(){


              if(
                  (this.game.level.enemiesToKill != null && this.game.enemiesKilled >= this.game.level.enemiesToKill) //Number of enemies to kill
                    ||
                  (this.game.level.timeLimit != null && this.game.elapsedTime > this.game.level.timeLimit)  //Time elapsed in the level
                    ||
                  (this.game.level.bossesToKill != null && this.game.bossesKilled >= this.game.level.bossesToKill) //Number of bosses to kill
              ){

                  // Block the actions of all the entities, then, kill them
                  this.game.entities.setAll('blocked', true);

                  var nextLevelTimer = this.game.time.create(false);
                  nextLevelTimer.start();
                  nextLevelTimer.add(1000, this.killThemAll, this);
              }


        },


        /** Game Over: Block the actions of all the entities, then call transition state **/
        gameOver: function(){
            this.game.entities.setAll('blocked', true);

            var nextLevelTimer = this.game.time.create(false);
            nextLevelTimer.start();
            nextLevelTimer.add(3000, this.gameOverState, this);

        },


        /** Kill all the entities alive (enemies, bosses) then call the next level **/
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


        /** Change the state to the game over **/
        gameOverState: function(){
            // We have to reset the gamepad buttons otherwise they keep the action on the next state
            this.resetButtons();

            this.game.state.start('transition', true, false, new ns.Levels().getGameOver());
        },


        /** Change to the next level **/
        nextLevel: function(){

            // We have to reset the gamepad buttons otherwise they keep the action on the next state
            this.resetButtons();

            if(this.game.level.nextLevel()){
                this.game.state.start('transition', true, false, this.game.level.nextLevel());
            }
        },


        /** Exit the game, we go back to the menu **/
        onInputDown: function () {
            // We have to reset the gamepad buttons otherwise they keep the action on the next state
            this.resetButtons();
            this.game.state.start('menu');
        },


        /** Add the buttons to the gamepad **/
        addButtons: function(){
            this.game.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(this.onInputDown, this);
            //this.pad.getButton(Phaser.Gamepad.XBOX360_Y).onDown.add(this.goFullscreen, this);
        },


        /** Remove the buttons to the gamepad **/
        resetButtons: function(){
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.pad.connected){
                this.game.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.dispose();
                this.game.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.dispose();
            }
        },



        /** Switch the game to fullscreen / windowed **/
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


        /** Reset the collisions on exit fullscreen **/
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
