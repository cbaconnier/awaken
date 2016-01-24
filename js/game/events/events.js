/**
 *
 * Events factory
 * Events don't extends sprite so, we have to call the update manually
 *
 *
 * @params game
 *
 */


(function() {
    'use strict';

    function Events(game) {
        this.game = game;
    }


    Events.prototype = {

        /** Update manual all the events **/
        update: function(){
            if(this.fog !== undefined) this.fog.update();
            if(this.snow !== undefined) this.snow.update();
            if(this.rain !== undefined) this.rain.update();
            if(this.wind !== undefined) this.wind.update([this.snow, this.rain], this.game.entities); // wind can affects others events and entities too
        },


        /** Create all the events **/
        setEvents: function(){
            if(this.game.level.events === undefined) return; // We don't have events, we quit

            var l = Object.keys(this.game.level.events); // Get an array of the events

            for(var i=0; i< l.length;i++){
                this.setEvent(l[i], this.game.level.events);  //create the event
            }
        },

        /** Create the event (For now, events don't have parameters) **/
        setEvent: function (event, params) {
            if(event == 'snow') this.snow = new Snow(this.game);
            if(event == 'rain') this.rain = new Rain(this.game);
            if(event == 'wind') this.wind = new Wind(this.game);
            if(event == 'fog') this.fog = new Fog(this.game);
        }

    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Events = Events;
}());
