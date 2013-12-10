/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @version 1.0.0
 **/


IKRS.Tile.BowTie = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_BOW_TIE );
    
    // Init the actual decahedron shape with the passed size
    var pointA          = new IKRS.Point2(0,0);
    var pointB          = pointA;
    var startPoint      = pointA;
    var oppositePoint   = null;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   72.0,
		   216.0,
		   72.0
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
    var move   = new IKRS.Point2( (oppositePoint.x - startPoint.x)/2.0, // bounds.getWidth()/2.0,
				  (oppositePoint.y - startPoint.y)/2.0  // -size/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].sub( move );
		
    }

    /*
    var angles = [ 0.0,
		   72.0,
		   216.0,
		   72.0,
		   72.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.y -= size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

    }

    
    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0,
				  -size/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( move );
		
    }
    */

    this.imageProperties = {
	source: { x:      287,
		  y:      7,
		  width:  206,
		  height: 150,
		  angle:  0.0   // IKRS.Girih.MINIMAL_ANGLE
		},
	destination: { xOffset: 0,
		       yOffset: 0
		     }
    };
    
};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.BowTie.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.BowTie.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.BowTie.prototype.getTranslatedVertex = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.BowTie.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.BowTie.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.BowTie.prototype.locateAdjacentEdge  = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.BowTie.prototype.getVertexAt         = IKRS.Tile.prototype.getVertexAt;

IKRS.Tile.BowTie.prototype.constructor         = IKRS.Tile.BowTie;

