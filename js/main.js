window.addEventListener('load', function () {
    'use strict';

    var ns = window['awaken'];
    var game = new Phaser.Game(800, 600, Phaser.CANVAS_FILTER, 'awaken-game');
    game.state.add('boot', ns.Boot);
    game.state.add('preloader', ns.Preloader);
    game.state.add('menu', ns.Menu);
    game.state.add('transition', ns.Transition);
    game.state.add('game', ns.Game);
    game.state.add('end', ns.End);
    game.state.add('over', ns.Over);
    game.state.start('boot');
}, false);
