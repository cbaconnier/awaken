
var LowPerf = function (game) {
    this.game = game;
    Phaser.Sprite.call(this, game, this.game.world.width-72, 64, 'lowPerf');
    this.scale.x = 0.5;
    this.scale.y = 0.5;
    this.inputEnabled = true;
    this.events.onInputDown.add(this.togglePerf, this);
    this.clean = false;

    this.text = this.game.add.bitmapText(this.game.width*0.5, 64, 'gem', '', 32);
    this.text.anchor.set(0.5);


};

LowPerf.prototype = Object.create(Phaser.Sprite.prototype);
LowPerf.prototype.constructor = LowPerf;

LowPerf.prototype.togglePerf = function() {
    window['awaken'].Boot.lowPerf = !window['awaken'].Boot.lowPerf;
    if(window['awaken'].Boot.lowPerf){
        this.frame = 1;
        this.game.notification.setText("High performances deactivated");
    }else{
        this.frame = 0;
        this.game.notification.setText("High performances activated");
    }

    this.clean = false;
    this.destroySprites();


};

LowPerf.prototype.destroySprites = function(){
    if(window['awaken'].Boot.lowPerf && !this.clean){
        var i = 0;
        this.game.tiles.forEach(function(tile){
            if(tile.type == 'bloodTile'){
                i++;
                tile.destroy();
            }
        });

        if(i) this.destroySprites();

    }



};



