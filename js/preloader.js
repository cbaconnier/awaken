/**
 *
 * Preloader state
 *
 * Load every assets of the games
 * & Initialise the globals variables
 *
 *
 */



(function () {
    'use strict';

    function Preloader() {
        this.asset = null;
        this.ready = false;

    }

    Preloader.prototype = {

        /** Before loading the assets we show the progress bar **/
        preload: function () {
            // We show the progress bar
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
            this.load.setPreloadSprite(this.asset); // progress bar progression

            // Load all the assets
            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.loadResources();

            this.game.time.advancedTiming = true; //active the fps rate, min-max fps, suggestedFps...
            this.ready = true;
        },


        /** Load all the assets **/
        loadResources: function () {
            // player
            this.load.spritesheet('ken', 'assets/player/ken.png', 32, 32, 20);
            this.load.spritesheet('attack', 'assets/player/attack.png', 64, 80, 3);

            // ennemies
            this.load.spritesheet('worm', 'assets/enemies/worm.png', 32, 32, 20);
            this.load.spritesheet('spider', 'assets/enemies/spider.png', 32, 32, 32);
            this.load.spritesheet('cockroach', 'assets/enemies/cockroach.png', 32, 32, 24);

            // bosses
            this.load.spritesheet('david_foot', 'assets/bosses/david_foot.png', 32, 16, 4);
            this.load.spritesheet('david_leg', 'assets/bosses/david_leg.png', 32, 64, 2);
            this.load.spritesheet('rat', 'assets/bosses/rat.png', 64, 64, 16);


            // Blood particles
            this.load.spritesheet('blood', 'assets/particles/blood.png', 4, 4, 3);


            // ui
            this.load.image('gear', 'assets/ui/gear.png');
            this.load.spritesheet('debug', 'assets/ui/debug.png', 32, 32, 2);
            this.load.spritesheet('lowPerf', 'assets/ui/lowPerf.png', 64, 64, 2);
            this.load.spritesheet('fullscreen', 'assets/ui/fullscreen.png', 32, 32, 2);
            this.load.spritesheet('button', 'assets/ui/button.png', 64, 16, 3);
            this.load.spritesheet('keyboard', 'assets/ui/keyboard.png', 64, 64, 3);

            // fonts
            this.load.bitmapFont('gem', 'assets/fonts/gem.png', 'assets/fonts/gem.xml');

            // events
            this.load.image('fog', 'assets/events/fog.png');
            this.load.image('wind', 'assets/events/wind.png');
            this.load.spritesheet('snow', 'assets/events/snow.png', 4, 4, 3);
            this.load.spritesheet('rain', 'assets/events/rain.png', 4, 4, 3);

            // grounds effects
            this.load.image('bloodTile', 'assets/tiles/bloodTile.png');
            this.load.spritesheet('poison', 'assets/tiles/poison.png', 32, 32, 3);
            this.load.spritesheet('water', 'assets/tiles/water.png', 32, 32, 3);
            this.load.spritesheet('grass', 'assets/tiles/grass.png', 32, 32, 3);
            this.load.spritesheet('ice', 'assets/tiles/ice.png', 32, 32, 3);
            this.load.spritesheet('shadow', 'assets/tiles/shadow.png', 32, 32, 3);

            // filters
            this.load.script('debug', 'assets/filters/DebugFilter.js');
            //this.load.script('recolor', 'assets/filters/RecolorFilter.js');


            // musics
            this.load.audio('music_game_1', ['assets/musics/paragonX9_metropolis.ogg']);

            // sounds
            this.load.audio('fx_hit', 'assets/sounds/hit.wav');
            this.load.audio('fx_attack', 'assets/sounds/attack.wav');
            this.load.audio('fx_text', 'assets/sounds/text.wav');
            this.load.audio('fx_david', 'assets/sounds/david.wav');
            this.load.audio('fx_button_over', 'assets/sounds/button_over.wav');
            this.load.audio('fx_button_activated', 'assets/sounds/button_activated.wav');

        },

        //Initialise all the global variables
        create: function () {
            window['awaken'].Boot.fxMusic = this.game.add.audio('music_game_1');

            // musique configuration
            window['awaken'].Boot.fxMusic.allowMultiple = false;
            window['awaken'].Boot.fxMusic.loop = true;
            window['awaken'].Boot.fxMusic.volume = .5;


            window['awaken'].Boot.cheater = false; // immortality
            window['awaken'].Boot.score = 0; //player score
            window['awaken'].Boot.lowPerf = false; // reduce the performances by disabling blood
        },

        update: function () {
            // When the game have finished to load everything and decoding the music we load the menu state
            if (!!this.ready && this.cache.isSoundDecoded('music_game_1')) {
                this.game.state.start('menu');
            }
        },

        // loading is done
        onLoadComplete: function () {
            this.ready = true;
        }
    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Preloader = Preloader;
}());
