/**
 *
 * Change the volume of the game
 *
 * @param Game
 *
 */


/** initialisation **/
var VolumeSlider = function (game, defaultVolume, setVolumeCallback, parameters) {

    this.slider = null;
    this.game = game;
    this.bounds = null;
    this.defaultVolume = defaultVolume;
    this.setVolume = setVolumeCallback;  // example of callback : function(volume) {ns.Boot.fxMusic.volume = volume;} ,
    this.params = parameters;
    this.create();
};

VolumeSlider.prototype.constructor = VolumeSlider;

/** Creation of the health bar **/
VolumeSlider.prototype.create = function () {

    var x = this.params.rect.x;
    var y = this.params.rect.y;
    var h = this.params.rect.h;
    var w = this.params.rect.w;


    //define the boundary of the handler
    this.bounds = new Phaser.Rectangle(x, y, w, h);


    this.background = this.game.add.sprite(this.bounds.x, this.bounds.y, this.params.barTexture);
    this.background.animations.frame = 0;
    this.background.events.onInputDown.add(this.mouseDownOnBackground, this);
    this.background.inputEnabled = true;


    this.slider = this.game.add.sprite(x+(this.defaultVolume*(w-h)), y, this.params.sliderTile);
    this.slider.events.onInputDown.add(this.mouseDown, this);
    this.slider.events.onInputOver.add(this.mouseOver, this);
    this.slider.events.onInputOut.add(this.mouseOut, this);
    this.slider.animations.frame = 0;
    this.slider.inputEnabled = true;
    this.slider.input.enableDrag(false, false, false, 255, this.bounds);
    this.slider.input.allowVerticalDrag = false;
    this.slider.events.onDragStop.add(this.setParameter.bind(this), this);

    this.overground = this.game.add.sprite(this.bounds.x, this.bounds.y, this.params.barTexture);
    this.overground.animations.frame = 1;

};


VolumeSlider.prototype.mouseDownOnBackground = function () {
    this.slider.x = this.game.input.mousePointer.x;
    if(this.slider.x > (this.params.rect.x + this.params.rect.w) - this.params.rect.h){
        this.slider.x = this.slider.x - this.params.rect.h;
    }
    this.setParameter();
};

VolumeSlider.prototype.mouseDown = function () {
    this.slider.animations.frame = 2;
};

VolumeSlider.prototype.mouseOver = function () {
    this.slider.animations.frame = 1;
};

VolumeSlider.prototype.mouseOut = function () {
    this.slider.animations.frame = 0;
};


VolumeSlider.prototype.setParameter = function () {
    if (this.slider.x > (this.bounds.width / 2) + this.bounds.x) {
        min = ((this.bounds.width + this.bounds.x - this.slider.x - this.slider.width) / (this.bounds.width + this.bounds.x - this.slider.width)) * 100;
    }
    if (this.slider.x < (this.bounds.width / 2) + this.bounds.x) {
        min = ((this.bounds.width + this.bounds.x - this.slider.x) / (this.bounds.width)) * 100;
    }

    this.setVolume((100-min) / 100);

    var sound = this.params.testables[Math.floor(Math.random() * this.params.testables.length)];
    if(sound){
        this.playSound(sound.name, sound.factor);
    }
};

VolumeSlider.prototype.playSound = function (fxName, factor) {
    var fx = this.game.add.audio(fxName);
    fx.allowMultiple = false;
    fx.volume = ns.Boot.fxVolume *factor;
    fx.play();
};

