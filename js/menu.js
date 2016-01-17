(function () {
    'use strict';

    var ns = window['awaken'];

    function Menu() {
    }

    Menu.prototype = {
        create: function () {


            var text = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.3, 'gem', "AWAKEN", 42);
            text.anchor.set(0.5);

            var author = this.game.add.bitmapText(this.game.width-25, this.game.height * 0.9, 'gem', "Developed by Clement Baconnier", 12);
            author.anchor.set(1);

            var music = this.game.add.bitmapText(this.game.width-25, this.game.height * 0.93, 'gem', "Music by ParagonX9", 12);
            music.anchor.set(1);



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


        addButtons: function(){
             this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(this.onDown, this);
        },


        onDown: function () {
            this.resetButtons();
            this.game.state.start('transition', true, false, new ns.Level().getFirstLevel());
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
    window['awaken'].Menu = Menu;
}());
