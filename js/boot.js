/**
 *
 * Boot state
 *
 * Boot state is used to pre-configure the window and his behavior before loading everything (except the splash/load image)
 *
 */


(function () {
    'use strict';

    function Boot() {
    }

    Boot.prototype = {


        /** before the boot, we load the very first image **/
        preload: function () {
            this.load.image('preloader', 'assets/ui/preloader.gif');

        },

        /** set the windows parameters **/
        create: function () {


            this.game.input.maxPointers = 1; // max pointers of mouse, > 1 for multi-touch
            this.stage.disableVisibilityChange = true; // pause when the game loses the focus


            if (this.game.device.desktop) {
                // deskop configuration
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.setShowAll();
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVeritcally = true;
                this.game.scale.refresh();
            } else {
                // mobile and others platforms configuration (not input compatible for now)
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.minWidth = 480;
                this.game.scale.minHeight = 260;
                this.game.scale.maxWidth = 640;
                this.game.scale.maxHeight = 480;
                this.game.scale.forceOrientation(true);
                this.game.scale.pageAlignHorizontally = true;
            }

            // On resize of the window we have to refresh the scale of the game
            var self = this;
            window.addEventListener('resize', function(event){
                self.resizeGame();
            });

            // Start the proloader state
            this.game.state.start('preloader');
        },

         /** Reset the size of the game **/
         resizeGame: function () {
            this.game.scale.setShowAll();
            this.game.scale.refresh();
        }


    };


    window['awaken'] = window['awaken'] || {};
    window['awaken'].Boot = Boot;
}());

