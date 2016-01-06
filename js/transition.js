(function() {
    'use strict';

    function Transition() {}

    var line = [];




    Transition.prototype = {
        init: function(level){
            this.level = level;

            this.charIndex = 0;
            this.lineIndex = 0;

            this.charDelay = 20;
            this.lineDelay = 400;


        },

        create: function () {

            var title = this.add.text(this.game.width * 0.5, this.game.height * 0.2,
                this.level.title, {font: '42px Arial', fill: '#ffffff', align: 'center'
                });
            title.anchor.set(0.5);


            this.timer = this.game.time.create(false);
            this.timer.start();

            this.description = this.game.add.bitmapText(50, this.game.height * 0.5, 'gem', '', 16);
            this.description.anchor.set(0);

            this.nextLine();

            this.input.onDown.add(this.onDown, this);
            this.continue = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },


        nextLine: function(){
            if (this.lineIndex === this.level.description.length)
            {
                //  We're finished
                return;
            }

            //  Split the current line on spaces, so one word per array element
            line = this.level.description[this.lineIndex].split('');

            //  Reset the word index to zero (the first word in the line)
            this.charIndex = 0;

            //  Call the 'nextWord' function once for each word in the line (line.length)
            //this.timer = this.game.time.events.repeat(this.charDelay, line.length, this.nextChar, this);
            this.timer.add(this.charDelay, this.nextChar, this);
            //  Advance to the next line
            this.lineIndex++;
        },

        nextChar: function(){
            //  Add the next word onto the text string, followed by a space
            this.description.text = this.description.text.concat(line[this.charIndex] + "");

            //  Advance the word index to the next word in the line
            this.charIndex++;

            //  Last word?
            if (this.charIndex === line.length)
            {
                //  Add a carriage return
                this.description.text = this.description.text.concat("\n");

                //  Get the next line after the lineDelay amount of ms has elapsed
                this.game.time.events.add(this.lineDelay, this.nextLine, this);

                if(this.lineIndex == this.level.description.length){
                    this.textLoaded = true;
                }
            }else{
                this.timer.add(this.charDelay, this.nextChar, this);
            }
        },

        update: function () {
            if(this.continue.downDuration(10)) {
                if(this.textLoaded) {
                    this.onDown();
                }else{
                    this.timer.stop();
                    this.description.text = '';
                    this.description.text = this.level.description.join("\n");
                    this.textLoaded = true;
                }
            }
        },

        onDown: function () {
            this.game.state.start('game', true, false, this.level);
        }
    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Transition = Transition;
}());
