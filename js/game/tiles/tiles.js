(function() {
    'use strict';

    function Tiles(game) {
        this.game = game;
    }

    Tiles.prototype = {

        getTilesList: function(){
            return ['bloodTile', 'poisonTile', 'waterTile'];
        },

        getTile: function (tile, game, parameters) {
            if(tile == 'poison') return new PoisonTile(game, parameters);
            if(tile == 'water') return new WaterTile(game, parameters);
            if(tile == 'blood') return new BloodTile(game, parameters);
        },


        addTiles: function(){

            if(this.game.level.tiles !== undefined){
                if(this.game.tiles.length < 3000) {
                    for (var i in this.game.level.tiles){
                        for(var k=0; k<this.game.level.tiles[i].maxTiles; k++){
                            this.game.tiles.add(this.getTile(i, this.game, this.game.level.tiles[i]));
                        }
                    };
                }
            }

        }




    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Tiles = Tiles;
}());
