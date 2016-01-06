(function () {
    'use strict';

    function Preloader() {
        this.asset = null;
        this.ready = false;
    }

    Preloader.prototype = {
        preload: function () {
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
            this.load.setPreloadSprite(this.asset);

            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.loadResources();

            this.game.time.advancedTiming = true;

            this.ready = true;
        },

        loadResources: function () {
            //sprites
            this.load.spritesheet('ken', 'assets/player/ken.png', 64, 64, 15);
            this.load.spritesheet('attack', 'assets/player/attack.png', 64, 80, 3);
            this.load.spritesheet('worm', 'assets/enemy/worm.png', 32, 32, 20);
            this.load.spritesheet('spider', 'assets/enemy/spider.png', 32, 32, 32);

            //ui
            this.load.image('gear', 'assets/ui/gear.png');

            //fonts
            this.load.bitmapFont('gem', 'assets/fonts/gem.png', 'assets/fonts/gem.xml');

            //filters
            this.load.script('debug',   'assets/filters/DebugFilter.js');
           //this.load.script('recolor', 'assets/filters/RecolorFilter.js');

            //particles
            this.load.spritesheet('blood', 'assets/particles/blood.png', 4, 4, 3);
        },

        create: function () {

        },

        update: function () {
            if (!!this.ready) {
                this.game.state.start('menu');
            }
        },

        onLoadComplete: function () {
            this.ready = true;
        }
    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Preloader = Preloader;
}());
