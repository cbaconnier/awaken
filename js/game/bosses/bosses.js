(function() {
    'use strict';

    function Bosses() {
    }

    Bosses.prototype = {

        getBossesList: function(){
            return ['david'];
        },

        getBoss: function (entity, game, x, y, parameters) {
            if(entity == 'david') return new David(game, x, y, parameters);

        },

    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Bosses = Bosses;
}());
