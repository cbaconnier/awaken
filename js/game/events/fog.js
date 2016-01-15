
var Fog = function (game) {
    this.game = game;
    //this.tile = this.game.add.sprite(0,0, 'fog');

    this.tile = this.game.add.sprite(0,0, 'fog');
    //Phaser.Sprite.call(this, game, 0, 0, 'fog');

    this.tile.width = this.game.width;
    this.tile.height = this.game.height;
    this.tile.alpha = 0.7;
    this.create();
};

//Fog.prototype = Object.create(Phaser.Sprite.prototype);
Fog.prototype.constructor = Fog;


Fog.prototype.create = function(){


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

    this.filter = new Phaser.Filter(this.game, customUniforms, fragmentSrc);
    this.filter.setResolution(this.game.width, this.game.height);

    this.tile.filters = [ this.filter ];


};


Fog.prototype.changeWindDirection = function(){

};

Fog.prototype.setXSpeed = function(max){

};

Fog.prototype.update = function(){
    this.filter.update();
};



