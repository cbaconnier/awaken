
var HealthBar = function (entity, game, parameters) {

    this.game = game;
    this.defaultHealth = entity.health;
    this.entity = entity;
    this.params = parameters;
    this.highlighting = false;
    this.create();
};

HealthBar.prototype.constructor = HealthBar;


HealthBar.prototype.create = function(){

    //HealthBar background
    var bmd = this.game.add.bitmapData(this.params.width, this.params.height);
    bmd.ctx.fillStyle = this.params.bgColor;
    bmd.ctx.beginPath();
    bmd.ctx.roundRect(0, 0, this.params.width, this.params.height, this.params.radius);
    bmd.ctx.fill();

    this.healthBarBgSprite = this.game.add.sprite(this.params.x, this.params.y, bmd);

    //HealthBar
    bmd = this.game.add.bitmapData(this.params.width, this.params.height);
    bmd.ctx.fillStyle = this.params.color;
    bmd.ctx.beginPath();
    bmd.ctx.roundRect(0, 0, this.params.width, this.params.height, this.params.radius);
    bmd.ctx.fill();

    this.healthBarSprite = this.game.add.sprite(this.params.x, this.params.y, bmd);

    this.healthText = this.game.add.bitmapText(this.params.width+this.params.x, this.params.height, 'gem', this.entity.health.toString() + "/" + this.defaultHealth.toString(), 16);
    this.healthText.anchor.x = 1;
    this.healthText.anchor.y = .5;

    this.updateHealthBar();
    if(this.params.highlight)
        this.game.time.events.loop(250, this.highlightHealth, this);
};


HealthBar.prototype.highlightHealth = function(){
    if(this.health < 20){
        this.highlighting = !this.highlighting;
        this.healthBarSprite.visible = this.highlighting;
    }

};

HealthBar.prototype.updateHealthBar = function(){

    this.healthText.setText(Math.round(this.entity.health).toString() + "/" + this.defaultHealth.toString());

    //Graphic bug fix -> Cause : Textures overlaping
    this.healthBarBgSprite.width = this.params.width;
    this.healthBarBgSprite.x = this.params.x;
    if(this.defaultHealth == this.entity.health){
        this.healthBarBgSprite.width = this.params.width-10;
    }


    this.health = (this.entity.health / this.defaultHealth) * 100;
    var width = this.params.width * (this.health / 100);
    if(width <= 0) width = 0;

    //Graphic bug fix2 -> Cause Textures overlaping with rounded corner
    if(this.health > 20){
        this.healthBarBgSprite.x = this.params.x+5;
        this.healthBarBgSprite.width = this.healthBarBgSprite.width - 5;
    }


    //HealthBar coloration
    this.healthBarSprite.tint = this.rgbToHex((this.health > 50 ? 1-2*(this.health-50)/190.0 : 1.0) * 255,
        (this.health > 50 ? 1.9 : 2*this.health/100.0) * 255,
        0);
    if(this.health < 1) this.healthBarSprite.tint = '#FF0000';


    this.game.add.tween(this.healthBarSprite).to( { width: width }, 200, Phaser.Easing.Linear.None, true);
};



HealthBar.prototype.rgbToHex = function(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};