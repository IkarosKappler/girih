/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @version 1.0.0
 **/


IKRS.Tile.IrregularHexagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON );
    
    // Init the actual decahedron shape with the passed size
    var pointA        = new IKRS.Point2(0,0);
    var pointB        = pointA;
    var startPoint    = pointA;
    var oppositePoint = null;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   144.0,
		   144.0,
		   72.0
		   // 144.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x -= size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

	if( i == 2 )
	    oppositePoint = pointB;

    }

    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( (oppositePoint.x - startPoint.x)/2.0, 
				  (oppositePoint.y - startPoint.y)/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].sub( move );
		
    }

    this.imageProperties = {
	source: { x:      75,
		  y:      11,
		  width:  207, // 207,
		  height: 150
		},
	destination: { xOffset: 0,
		       yOffset: 0
		     }
    };
    
};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.IrregularHexagon.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.IrregularHexagon.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.IrregularHexagon.prototype.getTranslatedVertex = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.IrregularHexagon.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.IrregularHexagon.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.IrregularHexagon.prototype.locateAdjacentEdge  = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.IrregularHexagon.prototype.getVertexAt         = IKRS.Tile.prototype.getVertexAt;

IKRS.Tile.IrregularHexagon.prototype.constructor         = IKRS.Tile.IrregularHexagon;

