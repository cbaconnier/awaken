/**
 * Created by Clement on 19.12.2015.
 */
(function () {
    'use strict';


    function UI(game) {
        this.game = game;
        this.create();
    }

    UI.prototype = {

        create: function(){

            this.defaultHealth = this.game.ken.health;
            this.drawHealthBar();
            this.drawScore();
            this.setHealthWidth(this.game.ken.health);
            this.game.time.events.loop(250, this.highlightHealth, this); //1 second
            this.highlighting = false;
            this.drawGear();


        },

        render: function(){


        },

        update: function(){
            this.gear.bringToTop();
            this.healthBarBgSprite.bringToTop();
            this.healthBarSprite.bringToTop();
            this.scoreText.setText(window['awaken'].Boot.score.toString());
            this.healthText.setText(this.game.ken.health.toString() + "/" + this.defaultHealth.toString());

        },

        drawGear: function(){
            this.gear = this.game.add.image(this.game.world.width-36, 64, 'gear');
            this.gear.inputEnabled = true;
            this.gear.events.onInputDown.add(this.toggleDebug, this);
        },

        drawScore: function(){
            this.scoreText = this.game.add.bitmapText(this.game.world.width-20, 15, 'gem', window['awaken'].Boot.score.toString(), 32);
            this.scoreText.anchor.x = 1;
        },

        toggleDebug: function(){
            this.game.debugCollisions = !this.game.debugCollisions;
        },

        drawHealthBar: function(){

            this.healthbar = {x: 20, y: 30, width: 300, height: 20, radius: 3, color: '#FFFFFF', bgColor: '#651828'};

            //HealthBar background
            var bmd = this.game.add.bitmapData(this.healthbar.width, this.healthbar.height);
            bmd.ctx.fillStyle = this.healthbar.bgColor;
            bmd.ctx.beginPath();
            bmd.ctx.roundRect(0, 0, this.healthbar.width, this.healthbar.height, this.healthbar.radius);
            bmd.ctx.fill();

            this.healthBarBgSprite = this.game.add.sprite(this.healthbar.x, this.healthbar.y, bmd);


            //HealthBar
            bmd = this.game.add.bitmapData(this.healthbar.width, this.healthbar.height);
            bmd.ctx.fillStyle = this.healthbar.color;
            bmd.ctx.beginPath();
            bmd.ctx.roundRect(0, 0, this.healthbar.width, this.healthbar.height, this.healthbar.radius);
            bmd.ctx.fill();

            this.healthBarSprite = this.game.add.sprite(this.healthbar.x, this.healthbar.y, bmd);

            this.healthText = this.game.add.bitmapText(this.healthbar.width+this.healthbar.x, this.healthbar.height, 'gem', this.game.ken.health.toString() + "/" + this.defaultHealth.toString(), 16);
            this.healthText.anchor.x = 1;
            this.healthText.anchor.y = .5;


        },

        setHealthWidth: function(health){



            //Graphic bug fix -> Cause : Textures overlaping
            this.healthBarBgSprite.width = this.healthbar.width;
            this.healthBarBgSprite.x = this.healthbar.x;
            if(this.defaultHealth == health){
                this.healthBarBgSprite.width = this.healthbar.width-10;
            }


            this.health = (health / this.defaultHealth) * 100;
            var width = this.healthbar.width * (this.health / 100);
            if(width <= 0) width = 0;

            //Graphic bug fix2 -> Cause Textures overlaping with rounded corner
            if(this.health > 20){
                this.healthBarBgSprite.x = this.healthbar.x+5;
                this.healthBarBgSprite.width = this.healthBarBgSprite.width - 5;
            }

            //HealthBar coloration
            this.healthBarSprite.tint = this.rgbToHex((this.health > 50 ? 1-2*(this.health-50)/190.0 : 1.0) * 255,
                                                        (this.health > 50 ? 1.9 : 2*this.health/100.0) * 255,
                                                        0);
            if(this.health < 1) this.healthBarSprite.tint = '#FF0000';


            this.game.add.tween(this.healthBarSprite).to( { width: width }, 200, Phaser.Easing.Linear.None, true);
        },

        rgbToHex: function (r, g, b) {
            return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        highlightHealth: function(){
            if(this.health < 20){
                this.highlighting = !this.highlighting;
                this.healthBarSprite.visible = this.highlighting;
            }

        },

        dialogue: function(x, y, msg, size, duration, distance, color){
            var fontSize = size || 32;
            var time = duration || 2000;
            distance = distance || -192;
            color = color || 0xffffff;

            fontSize = (msg.length > 20 && !size) ? 20 : fontSize;
            time = (msg.length < 20 && !duration) ? 1000 : time;


            var text = this.game.add.bitmapText(x, y-64, 'gem', msg, fontSize);
            text.tint = color;
            text.anchor.set(0.5);

            var angle =  Math.random() * (25 - 5)+5;
            var angle = ((Math.random()) > 0.5) ? angle : -angle;
            var xx = (angle > 0) ?  Math.floor(Math.random() * (distance/1.5-0)+0) : -Math.floor(Math.random() * (distance/1.5-0)+0);

            var tween = this.game.add.tween(text)
                .to( {angle: angle, y:y+distance, x:x-xx}, time, Phaser.Easing.Linear.None, true, 0)
                .start();

            tween.onComplete.add(function() {
                text.destroy();
            }, this);



        }




    };


    window['awaken'] = window['awaken'] || {};
    window['awaken'].UI = UI;
}());
