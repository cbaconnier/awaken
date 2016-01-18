
var HealthBar = function (game, health, parameters) {

    this.game = game;
    this.defaultHealth = health;
    this.health = this.defaultHealth;
    this.percentHealth = 0;
    this.params = parameters;
    this.highlighting = false;
    if(this.health == 0){
        this.numberOfEntity = 0;
    }
    else{
        this.numberOfEntity = 1;
    }
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

    //Health text
    this.healthText = this.game.add.bitmapText(this.params.width+this.params.x, this.params.y-this.params.height/2, 'gem', this.health.toString() + "/" + this.defaultHealth.toString(), 16);
    this.healthText.anchor.x = 1;
    this.healthText.anchor.y = .5;

    //Name text
    this.nameText = this.game.add.bitmapText(this.params.x, this.params.y-this.params.height/2, 'gem', this.params.name, 16);
    this.nameText.anchor.x = 0;
    this.nameText.anchor.y = .5;


    this.updateHealthBar();
    if(this.params.highlight)
        this.game.time.events.loop(250, this.highlightHealth, this);

    this.game.ui.add(this.healthBarBgSprite);
    this.game.ui.add(this.healthBarSprite);
    this.game.ui.add(this.healthText);

};

HealthBar.prototype.updateDefaultHealth = function(health){
  this.defaultHealth = health;
};

HealthBar.prototype.updateHealth = function(health){
    this.health = health;
};

HealthBar.prototype.addEntity = function(defaultHealth, health, name){
    health = health || defaultHealth;
    name = name || "Boss";
    this.params.name = name;
    this.numberOfEntity++;
    this.updateHealth(this.health + health);
    this.updateDefaultHealth(this.defaultHealth + defaultHealth);
    this.updateHealthBar();
};

HealthBar.prototype.removeEntity = function(defaultHealth){
    this.numberOfEntity--;
    this.updateDefaultHealth(this.defaultHealth - defaultHealth);
    this.updateHealthBar();
};



HealthBar.prototype.highlightHealth = function(){
    if(this.percentHealth < 20){
        this.highlighting = !this.highlighting;
        this.healthBarSprite.visible = this.highlighting;
    }

};

HealthBar.prototype.updateHealthBar = function(damage){
    damage = damage || 0;
    this.showHealthBar();

    this.health -= damage;
    if(this.health <= 0) this.health = 0;

    this.healthText.setText(Math.round(this.health).toString() + "/" + this.defaultHealth.toString());

    var name = this.params.name;
    if(this.numberOfEntity > 1) name = this.params.names;
    this.nameText.setText(name);

    //Graphic bug fix -> Cause : Textures overlaping
    this.healthBarBgSprite.width = this.params.width;
    this.healthBarBgSprite.x = this.params.x;
    if(this.defaultHealth == this.health){
        this.healthBarBgSprite.width = this.params.width-10;
    }

    this.percentHealth = (this.health / this.defaultHealth) * 100;

    var width = this.params.width * (this.percentHealth / 100);
    if(width <= 0) width = 0;

    //Graphic bug fix2 -> Cause Textures overlaping with rounded corner
    if(this.percentHealth > 20){
        this.healthBarBgSprite.x = this.params.x+5;
        this.healthBarBgSprite.width = this.healthBarBgSprite.width - 5;
    }


    //HealthBar coloration
    this.healthBarSprite.tint = this.rgbToHex((this.percentHealth > 50 ? 1-2*(this.percentHealth-50)/190.0 : 1.0) * 255,
        (this.percentHealth > 50 ? 1.9 : 2*this.percentHealth/100.0) * 255,
        0);
    if(this.percentHealth < 1) this.healthBarSprite.tint = '#FF0000';


    var tween = this.game.add.tween(this.healthBarSprite).to( { width: width }, 200, Phaser.Easing.Linear.None, true);
    var self = this;
    tween.onComplete.add(function() {
        self.hideHealthBar();
    }, this);
};

HealthBar.prototype.hideHealthBar = function(){
    if(this.health <= 0 && this.params.hiddable){
        this.healthBarSprite.visible = false;
        this.healthBarBgSprite.visible = false;
        this.healthText.visible = false;
        this.nameText.visible = false;
    }
};
HealthBar.prototype.showHealthBar = function(){
    if(this.health > 0 && this.params.hiddable){
        this.healthBarSprite.visible = true;
        this.healthBarBgSprite.visible = true;
        this.healthText.visible = true;
        this.nameText.visible = true;
    }
};

HealthBar.prototype.rgbToHex = function(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};