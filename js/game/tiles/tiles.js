(function() {
    'use strict';

    function Tiles(game) {
        this.game = game;
        this.locations = [];
        var xx = this.game.width/128;
        var yy = this.game.height/128;
        for(var x=0; x<xx-1;x++){
            for(var y=0; y<yy-1;y++) {
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
        },

        getUniqueLocation: function(){
            if(this.locations.length){
                return this.locations.shift();
            }
            return null;
        },

        addTile: function(type, x, y, parameters){
            if(this.game.tiles.length < 3000) {
                if(!x || !y){
                    var pos = this.getUniqueLocation();
                    if(!pos) return null;
                    console.log(pos);
                   // x = pos.x*128;
                    x = 1*128;
                   // y = pos.y*128;
                    y = 2*128;
                }
                this.game.tiles.add(this.getTile(type, x, y, parameters));
            }
            //todo : else pick the first of the type
        },

        addTiles: function(){
/*
            for (var x=0; x<9; x++){
                for(var y=0; y<7; y++) {
                    //if(x%3 == 0)
                        this.addTile("poison", {x: x*128, y: y*128});
                }

            }
*/
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
