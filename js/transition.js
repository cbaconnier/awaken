/**
 *
 * Transition state
 *
 * this state is were occurs all the scenes with text between levels. It include :
 *
 *  Level transition with the story
 *  Game over
 *  End of the game
 *
 *
 *  @params {Levels.level}
 *
 */


(function() {
    'use strict';

    function Transition() {}


    Transition.prototype = {

        /** Constructor **/
        init: function(level){

            // Level parameters
            this.level = level;

            // Story typing
            this.charIndex = 0;
            this.charDelay = 20;
        },


        /** Creation of displayed scene **/
        create: function () {


            /** Texts **/
            var title = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.2, 'gem', this.level.title, 42);
            title.anchor.set(0.5);

            var short = this.game.add.bitmapText(50, this.game.height * 0.35, 'gem', this.level.short, 32);
            short.anchor.set(0);


            // This text is written letter by letter each letter take {this.charDelay} milliseconds
            this.description = this.game.add.bitmapText(50, this.game.height * 0.5, 'gem', '', 16);
            this.description.anchor.set(0);

            this.textLoaded = false; //To know if the text as finished to be displayed

            /** Audio **/
            // Text
            this.fxText = this.game.add.audio('fx_text');
            this.fxText.allowMultiple = false;
            this.fxText.volume = ns.Boot.fxVolume * 1.5; // todo: [sound] move the magic value
            this.mutedChars = [" ", "\n"];
            // Text events
            this.fxBoom = this.game.add.audio('fx_david');
            this.fxBoom.allowMultiple = false;
            this.fxBoom.volume = ns.Boot.fxVolume * 1.5; // todo: [sound] move the magic value

            /** Timers **/

            //Timer to create the story letters by letters
            this.timer = this.game.time.create(false);
            this.timer.start();


            this.nextChar();



            /** Keyboard input **/
            this.input.onDown.add(this.onNext, this);
            this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.onNext, this);
            this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.goFullscreen, this);


            /** Gamepad **/
            this.game.input.gamepad.start();
            this.pad = this.game.input.gamepad.pad1;
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected){
                this.pad.addCallbacks(this, {onConnect: this.addButtons});
                this.addButtons();
            }
        },

        /** Complete the story letters by letters recursively **/
        nextChar: function(){
            if(this.charIndex >= this.level.description.length){
                this.textLoaded = true;
                return;
            }
            var char = this.level.description[this.charIndex];
            if(char === "*"){
               this.charEvent();
            }else{
                this.description.text = this.description.text.concat(char);
                if(this.mutedChars.indexOf(char) == -1) this.fxText.play();

                this.charIndex++;
                this.timer.add(this.charDelay, this.nextChar, this);
            }
        },

        charEvent:function(){
            this.newCharIndex = this.level.description.indexOf("*", this.charIndex+1);
            var event = this.level.description.substring(this.charIndex+1, this.newCharIndex);
            this.timer.add(400, this.playEvent, this, event);
        },

        playEvent: function(event){
            if(event == "BOOM") this.fxBoom.play();

            this.charIndex = this.newCharIndex+1;
            this.description.text = this.description.text.concat("*"+event+"*");
            this.timer.add(400, this.nextChar, this);

        },

        /** When the input/gamepad is pressed, we load the full story OR we change the state **/
        onNext: function(){
            if(this.textLoaded) {
                this.changeState();
            }else{
                this.timer.stop();
                this.description.text = '';
                this.description.text = this.level.description;
                this.textLoaded = true;
            }
        },


        /** Change to the next level, if there is none, we go back to the menu **/
        changeState: function () {
            // We have to reset the gamepad buttons otherwise they keep the action on the next state
            this.resetButtons();

            if(this.level.nextLevel() === null) {
                this.game.state.start('menu');
            }else{
                this.game.state.start('game', true, false, this.level);
            }
        },


        /** Switch the game to fullscreen / windowed **/
        goFullscreen: function(){
            if (this.game.scale.isFullScreen)
            {
                this.game.scale.stopFullScreen();
            }
            else
            {
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.startFullScreen(false);
            }

        },


        /** Add the buttons to the gamepad **/
        addButtons: function(){
            this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(this.onNext, this);
        },

        /** Remove the buttons to the gamepad **/
        resetButtons: function(){
            if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected){
                this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.dispose();
            }
        }


    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Transition = Transition;
}());
