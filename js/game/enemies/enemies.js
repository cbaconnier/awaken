(function() {
    'use strict';

    function Enemies() {
    }

    Enemies.prototype = {

        getEnemy: function (entity, game, x, y, parameters) {
            if(entity == 'worm') return new Worm(game, x, y, parameters);
            if(entity == 'spider') return new Spider(game, x, y, parameters);
        },

    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Enemies = Enemies;
}());
