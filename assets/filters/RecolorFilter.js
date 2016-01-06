/**
 * @author Clément Baconnier :))
 */

/**
 * This add a border to your displayObjects
 * @class Recolor
 * @contructor
 */

Phaser.Filter.Recolor = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.red = { type: '1f', value: 0.0 };
    this.uniforms.green = { type: '1f', value: 0.0 };
    this.uniforms.blue = { type: '1f', value: 0.0 };


    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "uniform sampler2D  uSampler;",

        "uniform float     red;",
        "uniform float     green;",
        "uniform float     blue;",

        'uniform int u_color;',



        "void main(void) {",
            'vec4 tex = texture2D ( uSampler, vTextureCoord );',
            'if(tex.r < 0.1 && tex.g< 0.1 && tex.b < 0.1 && tex.a > .9){',
                'gl_FragColor = vec4(red, green, blue, 1);',
            '}else{',
                'gl_FragColor = tex;',
            '}',
        "}"
    ];

};

Phaser.Filter.Recolor.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Recolor.prototype.constructor = Phaser.Filter.Recolor;



Object.defineProperty(Phaser.Filter.Recolor.prototype, 'red', {

    get: function() {
        return this.uniforms.red.value;
    },

    set: function(value) {
        this.uniforms.red.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Recolor.prototype, 'green', {

    get: function() {
        return this.uniforms.green.value;
    },

    set: function(value) {
        this.uniforms.green.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Recolor.prototype, 'blue', {

    get: function() {
        return this.uniforms.blue.value;
    },

    set: function(value) {
        this.uniforms.blue.value = value;
    }

});