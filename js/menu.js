(function () {
    'use strict';

    var ns = window['awaken'];

    function Menu() {
    }

    Menu.prototype = {
        create: function () {
            var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5,
                'MENU', {
                    font: '42px Arial', fill: '#ffffff', align: 'center'
                });
            text.anchor.set(0.5);
            this.input.onDown.add(this.onDown, this);
            this.continue = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        },

        update: function () {
            if(this.continue.downDuration(50)) this.onDown();
        },

        onDown: function () {
            this.game.state.start('transition', true, false, new ns.Level().getFirstLevel());
        }
    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Menu = Menu;
}());
