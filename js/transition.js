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

            var title = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.2, 'gem', this.level.title, 42);
            title.anchor.set(0.5);


            var short = this.game.add.bitmapText(50, this.game.height * 0.35, 'gem', this.level.short, 32);
            short.anchor.set(0);


            this.timer = this.game.time.create(false);
            this.timer.start();

            this.description = this.game.add.bitmapText(50, this.game.height * 0.5, 'gem', '', 16);
            this.description.anchor.set(0);

            this.fxText = this.game.add.audio('fx_text');
            this.fxText.allowMultiple = false;
            this.fxText.volume = .6;
            this.mutedChars = [" ", "\n"];

            this.nextChar();

            this.input.onDown.add(this.onDown, this);
            this.continue = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },


        nextChar: function(){
            if(this.charIndex >= this.level.description.length) return;
            var char = this.level.description[this.charIndex];
            this.description.text = this.description.text.concat(char);
            if(this.mutedChars.indexOf(char) == -1) this.fxText.play();

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
