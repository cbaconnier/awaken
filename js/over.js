(function() {
    'use strict';

    function Over() {}

    Over.prototype = {
        create: function () {
            var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5,
                'GAME OVER', {font: '42px Arial', fill: '#ffffff', align: 'center'
                });
            text.anchor.set(0.5);
            this.input.onDown.add(this.onDown, this);
            this.continue = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },

        update: function () {
            if(this.continue.downDuration(50)) this.onDown();
        },

        onDown: function () {
            this.game.state.start('menu');
        }
    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Over = Over;
}());
