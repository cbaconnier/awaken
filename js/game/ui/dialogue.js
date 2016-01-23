/**
 *
 * Dialogue display a message to the given position
 * He's used for the dialogues spoken by entities
 *
 *
 * @param game
 *
 */


var Dialogue = function (game) {
    this.game = game;
};

Dialogue.prototype.constructor = Dialogue;
Dialogue.prototype.update = function(){

};


/** Create a dialogue **/
Dialogue.prototype.create = function(x, y, msg, size, duration, distance, color){

    var fontSize = size || 32;
    var time = duration || 2000;
    distance = distance || -192;
    color = color || 0xffffff;

    fontSize = (msg.length > 20 && !size) ? 20 : fontSize;
    time = (msg.length < 20 && !duration) ? 1000 : time;

    //Create the text
    var text = this.game.add.bitmapText(x, y-64, 'gem', msg, fontSize);
    text.tint = color;
    text.anchor.set(0.5);

    // Orientation of text
    var angle =  Math.random() * (25 - 5)+5;
    var angle = ((Math.random()) > 0.5) ? angle : -angle;
    var xx = (angle > 0) ?  Math.floor(Math.random() * (distance/1.5-0)+0) : -Math.floor(Math.random() * (distance/1.5-0)+0);

    // Animate the text
    var tween = this.game.add.tween(text)
        .to( {angle: angle, y:y+distance, x:x-xx}, time, Phaser.Easing.Linear.None, true, 0)
        .start();

    tween.onComplete.add(function() {
        text.destroy();
    }, this);
};

