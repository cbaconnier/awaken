
var Objective = function (game) {
    this.game = game;
    Phaser.BitmapText.call(this, game, 30, 60, 'gem', '', 20);
    this.smoothed = false;

};

Objective.prototype = Object.create(Phaser.BitmapText.prototype);
Objective.prototype.constructor = Objective;


Objective.prototype.update = function(){

    if(this.game.level.enemiesToKill){
        var enemiesToGo = ((this.game.level.enemiesToKill - this.game.enemiesKilled)>=0) ? (this.game.level.enemiesToKill - this.game.enemiesKilled) : 0 ;
        this.text = "ENEMIES REMAINING : " + enemiesToGo;
    }else if(this.game.level.timeLimit){
        var timeToGo = ((this.game.level.timeLimit - this.game.time.totalElapsedSeconds()) >= 0 ) ? (this.game.level.timeLimit - this.game.time.totalElapsedSeconds()) : 0;
        this.text = "TIME REMAINING : " + Math.round(timeToGo);
    }else if(this.game.level.bossesToKill){
        this.text = "KILL THE BOSS !";
    }

};
