/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile.Decagon = function( size ) {
    
    IKRS.Tile.call( this, size );
    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var theta = Math.PI * (144.0 / 180.0);
    for( var i = 1; i <= 9; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
    }

};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Decagon.prototype._addVertex = IKRS.Tile.prototype._addVertex;


IKRS.Tile.Decagon.prototype.constructor = IKRS.Tile.Decagon;

