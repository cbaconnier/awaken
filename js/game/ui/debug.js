/**
 *
 *  Button to enable debug mode
 *
 *
 * @param game
 *
 */

var Debug = function (game) {
    this.game = game;

    // Button
    Phaser.Sprite.call(this, game, this.game.world.width-108, 64, 'debug');

    // Mouse input
    this.inputEnabled = true;
    this.events.onInputDown.add(this.toggleDebug, this);

    // by default, debug is disabled, we need the next frame
    this.frame = 1;
};

Debug.prototype = Object.create(Phaser.Sprite.prototype);
Debug.prototype.constructor = Debug;


/** Toggle the debug **/
Debug.prototype.toggleDebug = function(){

    this.game.debugCollisions = !this.game.debugCollisions;

    if (this.game.debugCollisions) {
        this.frame = 0;
        this.game.notification.setText("Debug activated");
    }else{
        this.frame = 1;
        this.game.notification.setText("Debug deactivated");
    }
};


