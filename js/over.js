(function() {
    'use strict';

    function Over() {}

    Over.prototype = {
        create: function () {
            var text = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.3, 'gem', "GAME OVER", 42);
            text.anchor.set(0.5);

            this.input.onDown.add(this.onDown, this);
            this.continue = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.goFullscreen, this);

            this.input.gamepad.start();
            this.pad = this.input.gamepad.pad1;
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected){
                this.pad.addCallbacks(this, {onConnect: this.addButtons});
                this.addButtons();
            }
        },

        update: function () {
            if(this.continue.downDuration(50)) this.onDown();
        },

        addButtons: function(){
            this.nextButton = this.pad.getButton(Phaser.Gamepad.XBOX360_A);
            this.nextButton.onDown.add(this.onDown, this);
            //this.pad.getButton(Phaser.Gamepad.XBOX360_Y).onDown.add(this.goFullscreen, this);
        },

        onDown: function () {
            this.resetButtons();
            this.game.state.start('menu');
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
    window['awaken'].Over = Over;
}());
