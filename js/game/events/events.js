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

        /** Create the event (For now, events don't have parameters) **/
        getEvent: function (event, params) {
            if(event == 'snow') return new Snow(this.game);
            if(event == 'rain') return new Rain(this.game);
            if(event == 'wind') return new Wind(this.game);
            if(event == 'fog') return new Fog(this.game);
        },

        /** Update manual all the events **/
        update: function(){
           this.game.events.forEach(function(evt){
               evt.update();
           });
        },

        /** Create all the events **/
        setEvents: function(){
            if(this.game.level.events === undefined) return; // We don't have events, we quit

            var l = Object.keys(this.game.level.events); // Get an array of the events

            for(var i=0; i< l.length;i++){
                this.game.events.push(this.getEvent(l[i], this.game.level.events));  //create the event
            }
        }



    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Events = Events;
}());
