(function() {
    'use strict';

    function Level() {
    }

    Level.prototype = {


        getFirstLevel: function () {
            return this.getLevels().level_1;
        },


        getLevels: function () {

            var levels;

            return levels = {

                level_1: {
                    title: "Level 1",
                    description: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
                        "Suspendisse posuere augue aliquam risus elementum, eu accumsan orci ullamcorper. ",
                        "Suspendisse malesuada ante sem, at ultrices nunc pellentesque quis. ",
                        "Vestibulum suscipit accumsan lorem, sit amet pharetra sem. Vivamus sed elementum risus"],

                    enemiesToKill: 15,
                    maxEnemies: 100,
                    maxBosses: 100,
                    minSpawnDelay: 250,
                    maxSpawnDelay: 500,

                    nextLevel: function () {
                        return levels.level_2;
                    },

                    events: {
                       // wind: {},
                       // snow: {}
                    },

                    playerParameters: {
                        health: 200,
                        minDmg: 3,
                        maxDmg: 7,
                        attackSize: 1
                    },

                    bossParameters: {
                        david: {
                            maxBoss: 1,
                            health: 100000,
                            dmg: 5000,
                            score: 4242424242
                        }
                    },


                    enemyParameters: {
                        spider: {
                            maxEnemy: 2,
                            health: 2,
                            dmg: 5,
                            score: 20
                        },
                        worm: {
                            maxEnemy: 1,
                            health: 4,
                            dmg: 2,
                            score: 20
                        }
                    }
                },


                level_2: {
                    title: "Level 2",
                    description: ["blablabla"],
                    enemiesToKill: 25,
                    maxEnemies: 100,
                    minSpawnDelay: 250,
                    maxSpawnDelay: 500,
                    nextLevel: function () {
                        return levels.level_3;
                    },

                    playerParameters: {
                        health: 400,
                        minDmg: 45,
                        maxDmg: 60,
                        attackSize: 2
                    },

                    enemyParameters: {
                        spider:{
                            maxEnemy: 10,
                            health: 20,
                            dmg: 50,
                            score: 200
                        }
                    }

                },

                level_3: {
                    title: "Level 3",
                    description: ["mouhahahaha"],
                    enemiesToKill: 100,
                    maxEnemies: 100,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return null;
                    },

                    playerParameters: {
                        health: 1600,
                        minDmg: 300,
                        maxDmg: 700,
                        attackSize: 4
                    },

                    enemyParameters: {
                        worm: {
                            maxEnemy: 100,
                            health: 1000,
                            dmg: 50,
                            score: 200
                        }
                    }
                },

                level_4: {
                    title: "Level 4",
                    description: ["HO NO"],
                    enemiesToKill: 1,
                    maxEnemies: 100,
                    maxBosses: 1,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return null;
                    },

                    playerParameters: {
                        health: 16000,
                        minDmg: 3000,
                        maxDmg: 7000,
                        attackSize: 5
                    },

                    bossParameters: {
                        david: {
                            maxBoss: 1,
                            health: 100000,
                            dmg: 5000,
                            score: 4242424242
                        }
                    },

                    enemyParameters: {
                        worm: {
                            maxEnemy: 100,
                            health: 15000,
                            dmg: 500,
                            score: 2000
                        }
                    }
                }


            };

        }



    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Level = Level;
}());
