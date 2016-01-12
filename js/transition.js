(function() {
    'use strict';

    function Transition() {}


    Transition.prototype = {
        init: function(level){
            this.level = level;
            this.charIndex = 0;
            this.charDelay = 20;
        },

        create: function () {

            var title = this.add.text(this.game.width * 0.5, this.game.height * 0.2,
                this.level.title, {font: '42px Arial', fill: '#ffffff', align: 'center'
                });
            title.anchor.set(0.5);


            this.timer = this.game.time.create(false);
            this.timer.start();

            this.description = this.game.add.bitmapText(50, this.game.height * 0.5, 'gem', '', 16);
            this.description.anchor.set(0);

            this.nextChar();

            this.input.onDown.add(this.onDown, this);
            this.continue = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },


        nextChar: function(){
            if(this.charIndex >= this.level.description.length) return;
            this.description.text = this.description.text.concat(this.level.description[this.charIndex]);
            this.charIndex++;
            this.timer.add(this.charDelay, this.nextChar, this);
        },

        update: function () {
            if(this.continue.downDuration(10)) {
                if(this.textLoaded) {
                    this.onDown();
                }else{
                    this.timer.stop();
                    this.description.text = '';
                    this.description.text = this.level.description;
                    this.textLoaded = true;
                }
            }
        },

        onDown: function () {
            this.game.state.start('game', true, false, this.level);
        }
    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Transition = Transition;
}());
