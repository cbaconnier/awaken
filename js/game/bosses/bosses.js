/**
 *
 *  Bosses is a factory who seed the entities group with the given bosses of the level
 *
 *
 *
 *  @params Game
 *
 */

(function() {
    'use strict';


    function Bosses(game) {
        this.game = game;

        // Spawn timer
        this.bossesTimer = this.game.time.create(false);
        this.bossesTimer.start();

        // Shared health bar initialisation
        this.healthBarParams = {
            x: this.game.width/2-150,
            y: this.game.height-40,
            width: 300,
            height: 20,
            radius: 3,
            color: '#FFFFFF',
            bgColor: '#651828',
            highlight: false,
            hiddable: true,
            name: "BOSS",
            names: "BOSSES"
        };
        this.sharedHealthbar = new HealthBar(this.game, 0, this.healthBarParams);
        this.sharedHealthbar.hideHealthBar();

    }

    Bosses.prototype = {

        /** Return the list of the bosses **/
        getBossesList: function(){
            return ['david', 'rat'];
        },

        /** Return a new boss **/
        getBoss: function (entity, game, parameters) {
            if(entity == 'david') return new David(game, parameters);
            if(entity == 'rat') return new Rat(game, parameters);
        },

        /** Add bosses to entities group **/
        addBosses: function(){
            this.addBoss();
        },

        /** Add boss to the entities group **/
        addBoss: function(){

            var self = this;
            var boss = null;
            var nbBossesAlive = 0;


            // Before create a new boss, we try to get one from the dead bosses
            this.game.entities.filter(function(child) {
                if(self.game.bosses.getBossesList().indexOf(child.type) != -1){
                    //retrive the first boss dead
                    if (boss === null  && !child.alive) {
                        boss = child;
                    }
                    nbBossesAlive++;
                }
            }, true);


            if(boss !== null && nbBossesAlive <= boss.maxBoss) {
                // Reset the dead boss that we got
                var location = boss.popLocation();
                boss.reset(location.x,location.y);
                boss.init(this.game.level.bossParameters[boss.type]);
            }else if(nbBossesAlive < this.game.level.maxBosses && this.game.level.bossParameters){
                // Create a new random boss from the available boss parameters list
                this.createRandomBoss(Object.keys(this.game.level.bossParameters));
            }else{
                return;
            }

            // Create a new boss in X seconds
            this.bossesTimer.add(Math.random() * (this.game.level.maxSpawnDelay - this.game.level.minSpawnDelay)+this.game.level.minSpawnDelay, this.addBoss, this);


        },

        /** Create a new random boss from the parameters list **/
        createRandomBoss: function(bosses){
            if(bosses.length < 1) return null;

            //pick random boss
            var boss = bosses[ bosses.length * Math.random() << 0 ];

            var nbAlive = 0; //number of boss alive: A type of enemies can have a limit
            this.game.entities.forEachAlive(function(e){
                if(e.type == boss) nbAlive++;
            });

            if (nbAlive < this.game.level.bossParameters[boss].maxBoss){
                //add a new boss to the entities group
                var boss = this.game.bosses.getBoss(boss, this.game, this.game.level.bossParameters);
                this.game.entities.add(boss);
            }else{
                //In case, we have reach the limit of the picked one, we to look for an another one
                var index = bosses.indexOf(boss);
                if (index > -1) {
                    bosses.splice(index, 1);
                }
                this.createRandomBoss(bosses);
            }
        }




    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Bosses = Bosses;
}());
