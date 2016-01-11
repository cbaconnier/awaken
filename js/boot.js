(function () {
    'use strict';

    function Boot() {
        this.fxMusic = null;
    }

    Boot.prototype = {
        preload: function () {
            this.load.image('preloader', 'assets/ui/preloader.gif');

        },

        create: function () {
            // configure game
            this.game.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.setShowAll();
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVeritcally = true;
                this.game.scale.refresh();

            } else {
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.minWidth = 480;
                this.game.scale.minHeight = 260;
                this.game.scale.maxWidth = 640;
                this.game.scale.maxHeight = 480;
                this.game.scale.forceOrientation(true);
                this.game.scale.pageAlignHorizontally = true;
            }
            var self = this;
            window.addEventListener('resize', function(event){
                self.resizeGame();
            });

            this.game.state.start('preloader');
        },



         resizeGame: function () {
            this.game.scale.setShowAll();
            this.game.scale.refresh();
        }


    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Boot = Boot;
}());

