
var Fullscreen = function (game) {
    this.game = game;
    Phaser.Sprite.call(this, game, this.game.world.width-32, 64, 'fullscreen');
    this.inputEnabled = true;
    this.events.onInputDown.add(this.toggleFullscreen, this);


    if(this.game.scale.isFullScreen) this.frame = 1;

};

Fullscreen.prototype = Object.create(Phaser.Sprite.prototype);
Fullscreen.prototype.constructor = Fullscreen;

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


