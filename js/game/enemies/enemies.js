(function() {
    'use strict';

    function Enemies(game) {
        this.game = game;
    }

    Enemies.prototype = {

        getEnemiesList: function(){
            return ['worm', 'spider'];
        },

        getEnemy: function (entity, game, x, y, parameters) {
            if(entity == 'worm') return new Worm(game, parameters);
            if(entity == 'spider') return new Spider(game, parameters);
        },

        addEnemies: function(){
            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();
            this.addEnemy();
        },

        addEnemy: function(){

            if(this.game.entities.length < this.game.level.maxEnemies) {
                this.createRandomEnemy(Object.keys(this.game.level.enemyParameters));
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
                    var location = enemy.popLocation();
                    enemy.reset(location.x,location.y);
                    enemy.init(this.game.level.enemyParameters[enemy.type]);
                }
            }

            this.enemiesTimer.add(Math.random() * (this.game.level.maxSpawnDelay - this.game.level.minSpawnDelay)+this.game.level.minSpawnDelay, this.addEnemy, this);

        },

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
        },


    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Enemies = Enemies;
}());
