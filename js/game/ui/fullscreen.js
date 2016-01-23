/**
 *
 *  Button fullscreen to toggle the fullscreen
 *
 * @param game
 *
 */


var Fullscreen = function (game) {
    this.game = game;

    //Button
    Phaser.Sprite.call(this, game, this.game.world.width-32, 64, 'fullscreen');

    // Mouse input
    this.inputEnabled = true;
    this.events.onInputDown.add(this.toggleFullscreen, this);

    // fullscreen can be enabled when we load the prototype, so we have to be sure to show the right frame
    if(this.game.scale.isFullScreen) this.frame = 1;

};

Fullscreen.prototype = Object.create(Phaser.Sprite.prototype);
Fullscreen.prototype.constructor = Fullscreen;


/** Toggle the fullscreen **/
Fullscreen.prototype.toggleFullscreen = function(){
    if (this.game.scale.isFullScreen)
    {
        this.frame = 0;
        this.game.scale.stopFullScreen();

    }
    else
    {
        this.frame = 1;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.scale.startFullScreen(false);

    }
};


