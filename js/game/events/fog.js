/**
 *
 * Fog create a sprite using the window size
 * The sprite is manipulated with webGL to make it move
 *
 *
 * @param game
 *
 */

var Fog = function (game) {
    this.game = game;

    /** Sprite **/
    this.tile = this.game.add.sprite(0,0, 'fog');
    this.tile.width = this.game.width;
    this.tile.height = this.game.height;
    this.tile.alpha = 0.7;


    this.create();
};

Fog.prototype.constructor = Fog;

/** Create will only add the webGL filter **/
Fog.prototype.create = function(){

    /** Filter parameters **/
    var fragmentSrc = [

        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform sampler2D iChannel0;",

        "void main( void ) {",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "uv.y *= -1.0;",
        "uv.y += (sin((uv.x + (time * 0.5)) * 1.0) * 0.1) + (sin((uv.x + (time * 0.2)) * 32.0) * 0.01);",
        "vec4 texColor = texture2D(iChannel0, uv);",
        "gl_FragColor = texColor;",

        "}"
    ];


    var customUniforms = {
        iChannel0: { type: 'sampler2D', value: this.tile.texture, textureData: { repeat: true } }
    };

    /** Filter **/
    this.filter = new Phaser.Filter(this.game, customUniforms, fragmentSrc);
    this.filter.setResolution(this.game.width, this.game.height);

    this.tile.filters = [ this.filter ];

};

/** Override : Fog don't react to wind for now **/
Fog.prototype.changeWindDirection = function(){};
Fog.prototype.setXSpeed = function(max){};

/** Update the filter **/
Fog.prototype.update = function(){
    this.filter.update();
};



