/**
 *
 *  Enemies is a factory who seed the entities group with the given enemies of the level
 *
 *
 *
 *  @params Game
 *
 */



(function() {
    'use strict';

    function Enemies(game) {
        this.game = game;

        // spawn timer
        this.enemiesTimer = this.game.time.create(false);
        this.enemiesTimer.start();
    }

    Enemies.prototype = {

        /** return the list of the enemies **/
        getEnemiesList: function(){
            return ['worm', 'spider', 'cockroach'];
        },

        /** return a new enemy **/
        getEnemy: function (entity, game, parameters) {
            if(entity == 'worm') return new Worm(game, parameters);
            if(entity == 'spider') return new Spider(game, parameters);
            if(entity == 'cockroach') return new Cockroach(game, parameters);
        },

        /** Add enemies to entities group **/
        addEnemies: function(){
            this.addEnemy();
        },

        /** Add enemy to the entities group **/
        addEnemy: function(){

            // we create enemies to reach the max number of enemies in the level
            if(this.game.entities.length-1 < this.game.level.maxEnemies) {
                this.createRandomEnemy(Object.keys(this.game.level.enemyParameters));
            }else{
                // otherwise we try to get one from the dead enemies

                var enemy = null;
                var self = this;
                var nbEnemyAlive = 0;


                // retrieve a dead enemy
                this.game.entities.filter(function(child) {
                    if (self.game.enemies.getEnemiesList().indexOf(child.type) != -1 ){
                        // retrive the first enemy dead
                        if (enemy === null  && !child.alive) {
                            enemy = child;
                        }
                        // count the number of children alive of this type
                        if (child.alive && enemy !== null) {
                            if (enemy !== null && child.type == enemy.type) nbEnemyAlive++;
                        }
                    }
                    return child;
                }, false);


                // reset the dead enemy
                if(enemy !== null && nbEnemyAlive < enemy.maxEnemy){
                    var location = enemy.popLocation();
                    enemy.reset(location.x,location.y);
                    enemy.init(this.game.level.enemyParameters[enemy.type]);
                }
            }

            // Create a new enemy in X seconds
            this.enemiesTimer.add(Math.random() * (this.game.level.maxSpawnDelay - this.game.level.minSpawnDelay)+this.game.level.minSpawnDelay, this.addEnemy, this);

        },

        /** Create a new random enemy from the parameters list **/
        createRandomEnemy: function(enemies){
            if(enemies.length < 1) return null;

            //pick random enemy
            var enemy = enemies[ enemies.length * Math.random() << 0 ];

            var nbAlive = 0; //number of enemy alive: A type of enemies can have a limit
            this.game.entities.forEachAlive(function(e){
                if(e.type == enemy) nbAlive++;
            });

            if (nbAlive < this.game.level.enemyParameters[enemy].maxEnemy){
                //add a new enemy to the entities
                this.game.entities.add(this.game.enemies.getEnemy(enemy, this.game, this.game.level.enemyParameters));
            }else{
                //In case, we have reach the limit of the picked one, we to look for an another one
                var index = enemies.indexOf(enemy);
                if (index > -1) {
                    enemies.splice(index, 1);
                }
                this.createRandomEnemy(enemies);
            }
        }


    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Enemies = Enemies;
}());
