(function() {
    'use strict';

    function Events(game) {
        this.game = game;
    }


    Events.prototype = {


        update: function(){
            this.snow.update();
            this.wind.update(this.snow, this.game.entities);
        },

        setEvents: function(eventsList, params){

            var l = Object.keys(eventsList);

            for(var i=0; i< l.length;i++){
                this.setEvent(l[i], params);
            }
        },

        setEvent: function (event, params) {
            if(event == 'snow') this.snow = new Snow(this.game);
            if(event == 'wind') this.wind = new Wind(this.game);
        },

    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Events = Events;
}());
