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


        /**
         *
         *
         *
         *
         *
         *
         *
                     title: "Level 1",
                     short: "The house",
                     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n" +
                                    "Suspendisse posuere augue aliquam risus elementum, eu accumsan orci ullamcorper.",

                     --enemiesToKill: 30,
                     --bossesToKill: 2,
                     --timeLimit: 10,
                     maxEnemies: 10,
                     maxBosses: 0,
                     minSpawnDelay: 250,
                     maxSpawnDelay: 500,

                    playerParameters: {
                        health: 100,
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

                     **************************************

                    enemyParameters: {
                        spider:{
                            maxEnemy: 10,
                            health: 20,
                            dmg: 50,
                            score: 200
                        },
                        worm:{
                            maxEnemy: 10,
                            health: 20,
                            dmg: 50,
                            score: 200
                        }
                    },

                    **************************************

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

                    **************************************

                    events: {
                        //wind: {},
                        //snow: {},
                        //rain: {},
                        //fog: {}
                    },

                    **************************************
         *
         *
         *
         *
         *
         *
         */



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

                    enemiesToKill: 30,
                    //timeLimit: 10,
                    //bossesToKill: 2,
                    maxEnemies: 5,
                    maxBosses: 0,
                    minSpawnDelay: 250,
                    maxSpawnDelay: 500,

                    nextLevel: function () {
                        return levels.level_2;
                    },

                    events: {
                        //wind: {},
                        //snow: {},
                        //rain: {},
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
                        health: 100,
                        //minDmg: 3,
                        minDmg: 3,
                        //maxDmg: 7,
                        maxDmg: 7,
                        attackSize: 1
                    },


                    enemyParameters: {
                        spider: {
                            maxEnemy: 10,
                            health: 5,
                            dmg: 5,
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
                    enemiesToKill: 60,
                    maxEnemies: 20,
                    minSpawnDelay: 250,
                    maxSpawnDelay: 500,
                    nextLevel: function () {
                        return levels.level_3;
                    },

                    events: {
                         //wind: {},
                         //rain: {}
                    },

                    playerParameters: {
                        health: 200,
                        minDmg: 30,
                        maxDmg: 70,
                        attackSize: 1.5
                    },

                    enemyParameters: {
                        worm:{
                            maxEnemy: 20,
                            health: 35,
                            dmg: 20,
                            score: 200
                        }
                    },

                    tiles: {
                        grass:{
                            maxTiles: 9
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
                    enemiesToKill: 75,
                    maxEnemies: 100,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return levels.level_4;
                    },

                    playerParameters: {
                        health: 500,
                        minDmg: 300,
                        maxDmg: 600,
                        attackSize: 2.5
                    },

                    enemyParameters: {
                        worm: {
                            maxEnemy: 30,
                            health: 500,
                            dmg: 35,
                            score: 200
                        },
                        spider:{
                            maxEnemy: 30,
                            health: 400,
                            dmg: 45,
                            score: 2000
                        }
                    },
                    events: {
                        wind: {},
                        rain: {}
                    },

                    tiles: {
                        water: {
                            maxTiles: 4,
                            speedDecrease: 100
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
                    enemiesToKill: 120,
                    maxEnemies: 100,
                    maxBosses: 0,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return levels.level_5;
                    },

                    playerParameters: {
                        health: 1000,
                        minDmg: 3000,
                        maxDmg: 7000,
                        attackSize: 3
                    },

                    enemyParameters: {
                        worm: {
                            maxEnemy: 75,
                            health: 3000,
                            dmg: 100,
                            score: 20000
                        }
                    },
                    tiles: {
                        poison: {
                            dmg: 5,
                            maxTiles: 3
                        }
                    }
                },



                /********************************************************
                 *  Level 5
                 *
                 *
                 *
                 *********************************************************/
                level_5: {
                    title: "Level 5",
                    short: "The train",
                    description: "HO NO",
                    timeLimit: 5,
                    maxEnemies: 100,
                    maxBosses: 0,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return levels.level_6;
                    },

                    playerParameters: {
                        health: 2000,
                        minDmg: 6000,
                        maxDmg: 9000,
                        attackSize: 3
                    },

                    enemyParameters: {
                        worm: {
                            maxEnemy: 75,
                            health: 3000,
                            dmg: 100,
                            score: 20000
                        }
                    },
                    tiles: {
                        poison: {
                            dmg: 5,
                            maxTiles: 3
                        }
                    }
                },



                /********************************************************
                 *  Level 6
                 *
                 *
                 *
                 *********************************************************/
                level_6: {
                    title: "Level 6",
                    short: "The city",
                    description: "HO NO",
                    enemiesToKill: 150,
                    maxEnemies: 100,
                    maxBosses: 0,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return levels.level_7;
                    },

                    playerParameters: {
                        health: 2000,
                        minDmg: 6000,
                        maxDmg: 9000,
                        attackSize: 4
                    },

                    enemyParameters: {
                        spider: {
                            maxEnemy: 100,
                            health: 4500,
                            dmg: 250,
                            score: 20000
                        }
                    },

                    events: {
                        snow: {},
                        wind: {},
                        fog: {}
                    }

                },



                /********************************************************
                 *  Level 7
                 *
                 *
                 *
                 *********************************************************/
                level_7: {
                    title: "Level 7",
                    short: "The school",
                    description: "HO NO",
                    bossesToKill: 1,
                    maxEnemies: 50,
                    maxBosses: 1,
                    minSpawnDelay: 100,
                    maxSpawnDelay: 250,
                    nextLevel: function () {
                        return null;
                    },

                    playerParameters: {
                        health: 20000,
                        minDmg: 60000,
                        maxDmg: 100000,
                        attackSize: 5
                    },

                    bossParameters: {
                        david: {
                            maxBoss: 1,
                            health: 5000000,
                            dmg: 6000,
                            score: 10000000000
                        }
                    },

                    enemyParameters: {
                        spider: {
                            maxEnemy: 50,
                            health: 40000,
                            dmg: 1000,
                            score: 200000
                        },
                        worm: {
                            maxEnemy: 50,
                            health: 50000,
                            dmg: 1000,
                            score: 200000
                        }
                    }

                }





            };

        }





    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Level = Level;
}());
