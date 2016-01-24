/**
 *
 * Tile parent
 *
 * Description :
 *  Tile on the ground that have effects on entities or not
 *
 *
 * @param game
 * @param x position
 * @param y position
 * @param type of the tile
 * @param parameters {Levels.level.TileParameters.type}
 *
 */
var Tile = function (game, x, y, type, parameters) {
    this.game = game;

    //Sprite
    Phaser.Sprite.call(this, game, x, y, type);
    this.smoothed = false;
    this.anchor.set(0.5);

    // Set type of the tile
    this.type = type;

    // init
    this.init(parameters);

    // Redefine the collisions of the tile to be more accurate.
    //   when the scale is 1 we need to adjust the bottom to -40
    //   when the scale is 4 we need to adjust the bottom to -10
    //   So.. : scale / (0.025 * scale ^ 2)
    var bottomAdjustment = this.scale.y / (0.025 * Math.pow(this.scale.y, 2));
    this.collisions = {
        left: this.left + this.scale.x*5,
        right: this.right - this.scale.x*5,
        top: this.top + this.scale.y*2,
        bottom: this.bottom - bottomAdjustment
    };


};

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

/** Init the tile with the given parameters or default values**/
Tile.prototype.init = function(parameters) {

    this.damage = parameters.dmg || null;
    this.speedDecrease = parameters.speedDecrease || null;
    this.speedIncrease = parameters.speedIncrease || null;

    // starting frame
    this.frame = parameters.frame || 0;

    //Random size
    var scaleX = parameters.scale || Math.round(Math.random() * (3 - 1) + 1);
    var scaleY = scaleX;


    // Default tile size. (+2 to flatten the tile and give a 3D perspective)
    this.scale.x = parameters.scaleX || scaleX+2;
    this.scale.y = parameters.scaleY || scaleY;


    // Orientation of the scale and flattening
    if (parameters.dir == 0) {
        this.scale.x+=2;
        this.angle = 0;
    }
    if (parameters.dir == 2) {
        this.scale.x+=2;
        this.angle = 180;
    }
    if (parameters.dir == 1) {
        this.scale.y+=2;
        this.angle = 90;
    }
    if (parameters.dir == 3) {
        this.scale.y+=2;
        this.angle = 270;
    }

};



/** Check the overlap between two bodies **/
Tile.prototype.checkOverlap = function (body1, body2) {
    return (
        body1.left   < body2.right &&
        body1.right  > body2.left &&
        body1.top    < body2.bottom &&
        body1.bottom > body2.top
    );

};
