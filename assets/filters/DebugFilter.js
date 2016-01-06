/**
 * @author Clément Baconnier :))
 */

/**
 * This add a border to your displayObjects
 * @class Border
 * @contructor
 */
Phaser.Filter.Debug = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.red = { type: '1f', value: 0.0 };
    this.uniforms.green = { type: '1f', value: 0.0 };
    this.uniforms.blue = { type: '1f', value: 0.0 };
    this.uniforms.alpha = { type: '1f', value: 0.5 };

    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "uniform sampler2D  uSampler;",

        "uniform float     alpha;",
        "uniform float     red;",
        "uniform float     green;",
        "uniform float     blue;",

        "void main(void) {",
        'vec4 tex = texture2D ( uSampler, vTextureCoord );',
        'gl_FragColor = vec4(tex.r + red, tex.g + green, tex.b + blue, alpha);',
        "}"
    ];

};

Phaser.Filter.Debug.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Debug.prototype.constructor = Phaser.Filter.Debug;


Object.defineProperty(Phaser.Filter.Debug.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Debug.prototype, 'red', {

    get: function() {
        return this.uniforms.red.value;
    },

    set: function(value) {
        this.uniforms.red.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Debug.prototype, 'green', {

    get: function() {
        return this.uniforms.green.value;
    },

    set: function(value) {
        this.uniforms.green.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Debug.prototype, 'blue', {

    get: function() {
        return this.uniforms.blue.value;
    },

    set: function(value) {
        this.uniforms.blue.value = value;
    }

});