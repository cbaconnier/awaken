/**
 *
 *  Tiles is a factory who seed the tiles group with the given tile
 *
 *
 *
 *  @params Game
 *
 */



(function() {
    'use strict';

    function Tiles(game) {
        this.game = game;

        /** Locations possible for generated tiles (We try to not overlap them) **/
        this.locations = [];
        var xx = this.game.width/128;
        var yy = this.game.height/128;
        for(var x=1; x<xx-1;x++){
            for(var y=1; y<yy;y++) {
                if(x != 3 && y != 2) //avoid player startup position
                    this.locations.push({x:x, y:y});
            }
        }
        /** Sort the locations **/
        this.locations = this.locations.sort(function() {
            return .5 - Math.random();
        });

    }



    Tiles.prototype = {
        /** Return the tile **/
        getTile: function (tile, x, y, parameters) {
            if(tile == 'poison') return new PoisonTile(this.game, x, y, parameters);
            if(tile == 'water') return new WaterTile(this.game, x, y, parameters);
            if(tile == 'ice') return new IceTile(this.game, x, y, parameters);
            if(tile == 'blood') return new BloodTile(this.game, x, y, parameters);
            if(tile == 'grass') return new GrassTile(this.game, x, y, parameters);
            if(tile == 'shadow') return new ShadowTile(this.game, x, y, parameters);
        },

        /** Get an unique location for the tile **/
        getUniqueLocation: function(){
            if(this.locations.length){
                return this.locations.shift();
            }
            return null;
        },

        /** Add a tile **/
        addTile: function(type, x, y, parameters){
            // We try to get a dead tile before create a new one
            var tile = null;
            this.game.tiles.forEachDead(function(DeadTile){
                 if(DeadTile.type == type){
                     tile = DeadTile;
                     return;
                 }
            });

            // Rest the position of the dead tile
            if(tile){
                if(!x || !y){
                    var pos = this.getUniqueLocation();
                    if(!pos) return null;
                    x = pos.x*128;
                    y = pos.y*128;
                }
                tile.reset(x, y);
                return tile;
            }else if(this.game.tiles.length < 3000) { // We limit the game with 3000 tiles (blood included. In fact, this is especially for the blood that we need this limit)

                // position of the tile
                if(!x || !y){
                    var pos = this.getUniqueLocation();
                    if(!pos) return null;
                   x = pos.x*128;
                   y = pos.y*128;
                }

                // We add the tile except if lowPerf is enabled and the type is blood
                if(!(window['awaken'].Boot.lowPerf && type == 'blood')){
                    tile = this.getTile(type, x, y, parameters);
                    this.game.tiles.add(tile);
                    return tile;
                }
            }

            return null;

        },

        /** Add the tiles to the game **/
        addTiles: function(){
            if(this.game.level.tiles !== undefined){
                if(this.game.tiles.length < 3000) {
                    for (var tile in this.game.level.tiles){
                        for(var k=0; k<this.game.level.tiles[tile].maxTiles; k++){
                            this.addTile(tile, null, null, this.game.level.tiles[tile]);
                        }
                    }
                }
            }

        }




    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Tiles = Tiles;
}());
