/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile = function( size ) {
    
    IKRS.Object.call( this );
    
    this.size = size;
    this.vertices = [];

};

IKRS.Tile.prototype._addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

IKRS.Tile.prototype.constructor = IKRS.Tile;

