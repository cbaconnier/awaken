(function() {
    'use strict';

    function Bosses(game) {
        this.game = game;
        this.bossesTimer = this.game.time.create(false);
        this.bossesTimer.start();
    }

    Bosses.prototype = {

        getBossesList: function(){
            return ['david'];
        },

        getBoss: function (entity, game, parameters) {
            if(entity == 'david') return new David(game, parameters);
        },

        addBosses: function(){
            this.addBoss();
            this.bossesTimer = this.game.time.create(false);

        },

        addBoss: function(){

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
                var location = boss.popLocation();
                boss.reset(location.x,location.y);
                boss.init(this.game.level.bossParameters[boss.type]);
            }else if(nbBossesAlive < this.game.level.maxBosses && this.game.level.bossParameters){
                this.createRandomBoss(Object.keys(this.game.level.bossParameters));
            }


            this.bossesTimer.add(Math.random() * (this.game.level.maxSpawnDelay - this.game.level.minSpawnDelay)+this.game.level.minSpawnDelay, this.addBoss, this);

        },

        createRandomBoss: function(bosses){
            if(bosses.length < 1) return null;
            //pick random boss
            var boss = bosses[ bosses.length * Math.random() << 0 ];

            var nbAlive = 0; //number of boss alive: A type of enemies can have a limit
            this.game.entities.forEachAlive(function(e){
                if(e.type == boss) nbAlive++;
            });

            if (nbAlive < this.game.level.bossParameters[boss].maxBoss){
                //add a new boss to the entities
                this.game.entities.add(this.game.bosses.getBoss(boss, this.game, this.game.level.bossParameters));
            }else{
                //In case, we have reach the limit of the picked one, we to look for an another one
                var index = bosses.indexOf(boss);
                if (index > -1) {
                    bosses.splice(index, 1);
                }
                this.createRandomBoss(bosses);
            }
        },




    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Bosses = Bosses;
}());
