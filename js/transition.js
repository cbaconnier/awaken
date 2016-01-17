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

            this.input.onDown.add(this.onNext, this);
            this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.onNext, this);
            this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.goFullscreen, this);


            this.game.input.gamepad.start();
            this.pad = this.game.input.gamepad.pad1;
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected){
                this.pad.addCallbacks(this, {onConnect: this.addButtons});
                this.addButtons();
            }
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

        },

        addButtons: function(){
            this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(this.onNext, this);
            //this.pad.getButton(Phaser.Gamepad.XBOX360_Y).onDown.add(this.goFullscreen, this);
        },

        onNext: function(){
            if(this.textLoaded) {
                this.onDown();
            }else{
                this.timer.stop();
                this.description.text = '';
                this.description.text = this.level.description;
                this.textLoaded = true;
            }
        },


        onDown: function () {
            this.resetButtons();
            this.game.state.start('game', true, false, this.level);
        },

        goFullscreen: function(){
            if (this.game.scale.isFullScreen)
            {
                this.game.scale.stopFullScreen();
            }
            else
            {
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.startFullScreen(false);
            }

        },

        resetButtons: function(){
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected){
                this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.dispose();
            }
        }


    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Transition = Transition;
}());
