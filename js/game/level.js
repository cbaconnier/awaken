(function() {
    'use strict';

    function Level() {
    }

    Level.prototype = {


        /*

        level 1 : House -- spiders
        level 2 : Garden -- worms + grass
        level 3 : City -- cockroaches, worms + rain + water
        level 4 : Sewers -- rat, cockroaches + poison
        level 5 : Train -- ??, ~wind, + poison
        level 6 : City -- spiders, worms, cockroaches + snow + wind + fog
        level 7 : School -- boss, spiders, worms, cockroaches

         */

        getFirstLevel: function () {
            return this.getLevels().level_1;
        },


        getLevels: function () {

            var levels;

            return levels = {

                /********************************************************
                 *  Level 1
                 *
                 *
                 *
                 *********************************************************/

                level_1: {
                    title: "Level 1",
                    short: "The house",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n" +
                                "Suspendisse posuere augue aliquam risus elementum, eu accumsan orci ullamcorper. \n" +
                                "Suspendisse malesuada ante sem, at ultrices nunc pellentesque quis. \n" +
                                "Vestibulum suscipit accumsan lorem, sit amet pharetra sem. Vivamus sed elementum risus",

                    enemiesToKill: 100000,
                    //timeLimit: 10,
                    //bossesToKill: 2,
                    maxEnemies: 5,
                    maxBosses: 2,
                    minSpawnDelay: 250,
                    maxSpawnDelay: 500,

                    nextLevel: function () {
                        return levels.level_2;
                    },

                    events: {
                        //wind: {},
                        //snow: {},
                        rain: {},
                        //fog: {}
                    },

                    tiles: {
                        poison: {
                            maxTiles: 0,
                            scale:4,
                            dmg: 5
                        },
                        water: {
                            maxTiles: 0,
                            speedDecrease: 150
                        },
                        grass:{
                            maxTiles: 0
                        }
                    },

                    playerParameters: {
                        health: 200,
                        //minDmg: 3,
                        minDmg: 3000,
                        //maxDmg: 7,
                        maxDmg: 7000,
                        attackSize: 4
                    },

                    bossParameters: {
                        david: {
                            maxBoss: 2,
                            health: 100000,
                            dmg: 5000,
                            score: 4242424242
                        }
                    },


                    enemyParameters: {
                        spider: {
                            maxEnemy: 100,
                            health: 2,
                            dmg: 5,
                            score: 20
                        },
                        worm: {
                            maxEnemy: 0,
                            health: 4,
                            dmg: 2,
                            score: 20
                        }
                    }
                },





                /********************************************************
                 *  Level 2
                 *
                 *
                 *
                 *********************************************************/

                level_2: {
                    title: "Level 2",
                    short: "The garden",
                    description: "blablabla",
                    enemiesToKill: 25,
                    maxEnemies: 100,
                    minSpawnDelay: 250,
                    maxSpawnDelay: 500,
                    nextLevel: function () {
                        return levels.level_3;
                    },

                    events: {
                         wind: {},
                         snow: {}
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





                /********************************************************
                 *  Level 3
                 *
                 *
                 *
                 *********************************************************/
                level_3: {
                    title: "Level 3",
                    short: "The city",
                    description: "mouhahahaha",
                    enemiesToKill: 1000000,
                    maxEnemies: 100,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return null;
                    },

                    playerParameters: {
                        health: 1600,
                        minDmg: 1800,
                        maxDmg: 2600,
                        attackSize: 4
                    },

                    enemyParameters: {
                        worm: {
                            maxEnemy: 200,
                            health: 1000,
                            dmg: 50,
                            score: 200
                        }
                    }
                },





                /********************************************************
                 *  Level 4
                 *
                 *
                 *
                 *********************************************************/
                level_4: {
                    title: "Level 4",
                    short: "The sewers",
                    description: "HO NO",
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
