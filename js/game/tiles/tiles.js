(function() {
    'use strict';

    function Tiles(game) {
        this.game = game;
        this.locations = [];
        var xx = this.game.width/128;
        var yy = this.game.height/128;
        for(var x=1; x<xx-1;x++){
            for(var y=1; y<yy-1;y++) {
                if(x != 3 && y != 2) //avoid player startup position
                    this.locations.push({x:x, y:y});
            }
        }
        this.locations = this.locations.sort(function() {
            return .5 - Math.random();
        });

        this.i = 0;
    }

    Tiles.prototype = {

        getTile: function (tile, x, y, parameters) {
            if(tile == 'poison') return new PoisonTile(this.game, x, y, parameters);
            if(tile == 'water') return new WaterTile(this.game, x, y, parameters);
            if(tile == 'blood') return new BloodTile(this.game, x, y, parameters);
            if(tile == 'grass') return new GrassTile(this.game, x, y, parameters);
            if(tile == 'shadow') return new ShadowTile(this.game, x, y, parameters);
        },

        getUniqueLocation: function(){
            if(this.locations.length){
                return this.locations.shift();
            }
            return null;
        },

        addTile: function(type, x, y, parameters){

            var tile = null;
            this.game.tiles.forEachDead(function(DeadTile){
                 if(DeadTile.type == type){
                     tile = DeadTile;
                     return;
                 }
            });
            if(tile){
                console.log(tile.type);
                if(!x || !y){
                    var pos = this.getUniqueLocation();
                    if(!pos) return null;
                    x = pos.x*128;
                    y = pos.y*128;
                }
                tile.reset(x, y);
                return tile;
            }else if(this.game.tiles.length < 3000) {
                if(!x || !y){
                    var pos = this.getUniqueLocation();
                    if(!pos) return null;
                   x = pos.x*128;
                   y = pos.y*128;
                }
                tile = this.getTile(type, x, y, parameters);
                this.game.tiles.add(tile);
                return tile;
            }

        },


        addTiles: function(){

            if(this.game.level.tiles !== undefined){
                if(this.game.tiles.length < 3000) {
                    for (var i in this.game.level.tiles){
                        for(var k=0; k<this.game.level.tiles[i].maxTiles; k++){
                            this.addTile(i, null, null, this.game.level.tiles[i]);
                        }
                    }
                }
            }

        }




    };

    window['awaken'] = window['awaken'] || {};
    window['awaken'].Tiles = Tiles;
}());
