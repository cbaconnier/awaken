/**
 *
 * Main of Awaken
 *
 * */

window.addEventListener('load', function () {
    'use strict';

    //Creation of the game
    var ns = window['awaken'];
    var game = new Phaser.Game(800, 600, Phaser.CANVAS_FILTER, 'awaken-game');


    //Initialisation of all the states
    game.state.add('boot', ns.Boot);
    game.state.add('preloader', ns.Preloader);
    game.state.add('menu', ns.Menu);
    game.state.add('transition', ns.Transition);
    game.state.add('game', ns.Game);

    //Start the boot state
    game.state.start('boot');


}, false);
