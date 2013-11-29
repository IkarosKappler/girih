/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile = function( size, 
		      position, 
		      angle ) {
    
    IKRS.Object.call( this );

    if( typeof angle == "undefined" )
	angle = 0.0;
    
    this.size            = size;
    this.position        = position;
    this.angle           = angle;
    this.vertices        = [];
    this.imageProperties = null;

};

IKRS.Tile.prototype.computeBounds = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.vertices );
}

IKRS.Tile.prototype._addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

IKRS.Tile.prototype.constructor = IKRS.Tile;

