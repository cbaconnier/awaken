(function() {
    'use strict';

    function Events(game) {
        this.game = game;
    }


    Events.prototype = {


        update: function(){
            if(this.fog !== undefined) this.fog.update();
            if(this.snow !== undefined) this.snow.update();
            if(this.rain !== undefined) this.rain.update();
            if(this.wind !== undefined) this.wind.update([this.snow, this.rain], this.game.entities);
        },

        setEvents: function(eventsList, params){
            if(eventsList === undefined) return;
            var l = Object.keys(eventsList);

            for(var i=0; i< l.length;i++){
                this.setEvent(l[i], params);
            }
        },

        setEvent: function (event, params) {
            if(event == 'snow') this.snow = new Snow(this.game);
            if(event == 'rain') this.rain = new Rain(this.game);
            if(event == 'wind') this.wind = new Wind(this.game);
            if(event == 'fog') this.fog = new Fog(this.game);
        },

    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Events = Events;
}());
