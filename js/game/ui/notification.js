/**
 *
 * Display notification on the center of the screen
 *
 * @param game
 *
 */


var Notification = function (game) {
    this.game = game;
    Phaser.BitmapText.call(this, game, this.game.world.width *.5, 128, 'gem', '', 20);
    this.anchor.set(0.5);
    this.tint = 0xbada55;

    // Timer before remove the notification
    this.hideTimer = this.game.time.create(false);
    this.hideTimer.start();

    // the i value have to be the same between the current message the hideText.
    // Otherwise the timer will hide the text of the last notification instead of is own.
    this.i = 0;

};

Notification.prototype = Object.create(Phaser.BitmapText.prototype);
Notification.prototype.constructor = Notification;


/** Set the text of the notification **/
Notification.prototype.setText = function(text, delay) {
    delay = delay || 2000;
    this.text = text;
    this.i++;

    this.hideTimer.add(delay, this.hideText, this, this.i);

};

/** Hide the text **/
Notification.prototype.hideText = function(i){
    if(i == this.i)
        this.text = '';
};


