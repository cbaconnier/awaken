
var Score = function (game) {
    this.game = game;
    Phaser.BitmapText.call(this, game, this.game.world.width-20, 15, 'gem', window['awaken'].Boot.score.toString(), 32);
    this.anchor.x = 1;


};

Score.prototype = Object.create(Phaser.BitmapText.prototype);
Score.prototype.constructor = Score;

Score.prototype.update = function(){
      this.text = window['awaken'].Boot.score.toString();
};



