/**
 *
 *  Button to switch the performances of the games by removing the blood tiles
 *  The button is on the top right
 *  He can be triggered from the user or by the game itself when the perfs are too bad
 *
 * @param Game
 *
 */

var LowPerf = function (game) {


    this.game = game;

    // Button
    Phaser.Sprite.call(this, game, this.game.world.width-72, 64, 'lowPerf');
    this.scale.x = 0.5;
    this.scale.y = 0.5;

    // Mouse input
    this.inputEnabled = true; // phaser parameter, enable the click on button
    this.events.onInputDown.add(this.togglePerf, this);

    // clean of blood tiles
    this.clean = false;


    // lowPerf can be disabled when we load the prototype, so we have to be sure to show the right frame
    if(window['awaken'].Boot.lowPerf) this.frame = 1;


};

LowPerf.prototype = Object.create(Phaser.Sprite.prototype);
LowPerf.prototype.constructor = LowPerf;


/** Switch the performances **/
LowPerf.prototype.togglePerf = function() {
    window['awaken'].Boot.lowPerf = !window['awaken'].Boot.lowPerf;
    if(window['awaken'].Boot.lowPerf){
        this.frame = 1;
        this.game.notification.setText("High performances deactivated");
    }else{
        this.frame = 0;
        this.game.notification.setText("High performances activated");
    }

    // destroy the sprites
    this.clean = false;
    this.destroySprites();


};


/** destroy the blood tiles **/
// For some reasons, on the first iteration, the group keep some tiles. So we have to iterate the group again to remove them all
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



