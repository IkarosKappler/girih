/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile.Decagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_DECAGON );
    
    // Init the actual decahedron shape with the passed size   
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var theta = Math.PI/2 * (144.0 / 360.0);
    for( var i = 1; i <= 9; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
    }

    // Move to center
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0 - size*1.1,   // ???
				  -bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( move );
		
    }
    
    this.imageProperties = {
	x:      169,
	y:      140,
	width:  313,
	height: 297
    };
    
};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Decagon.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Decagon.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Decagon.prototype._getTranslatedPoint = IKRS.Tile.prototype._getTranslatedPoint;
IKRS.Tile.Decagon.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Decagon.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;


IKRS.Tile.Decagon.prototype.constructor         = IKRS.Tile.Decagon;

