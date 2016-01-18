
var Notification = function (game) {
    this.game = game;
    Phaser.BitmapText.call(this, game, this.game.world.width *.5, 128, 'gem', '', 20);
    this.anchor.set(0.5);
    this.tint = 0xbada55;
    this.hideTimer = this.game.time.create(false);
    this.hideTimer.start();

    this.i = 0;

};

Notification.prototype = Object.create(Phaser.BitmapText.prototype);
Notification.prototype.constructor = Notification;


Notification.prototype.setText = function(text, delay) {
    delay = delay || 2000;
    this.text = text;
    this.i++;

    this.hideTimer.add(delay, this.hideText, this, this.i);

};


Notification.prototype.hideText = function(i){
    if(i == this.i)
        this.text = '';
};


