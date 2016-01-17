
var Gear = function (game) {
    this.game = game;
    Phaser.Sprite.call(this, game, this.game.world.width-36, 64, 'gear');
    this.inputEnabled = true;
    this.events.onInputDown.add(this.toggleDebug, this);

};

Gear.prototype = Object.create(Phaser.Sprite.prototype);
Gear.prototype.constructor = Gear;

Gear.prototype.toggleDebug = function(){
    console.log("test");
    this.game.debugCollisions = !this.game.debugCollisions;
};


