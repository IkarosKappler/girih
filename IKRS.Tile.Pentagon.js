/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile.Pentagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_PENTAGON );

    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    //var theta = Math.PI*2 * (90.0 / 108.0);
    var theta = (Math.PI*2) / 5;
    for( var i = 1; i <= 4; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
    }


    // Move to center    
    // Calculate the diameter of the bounding circle
    var r_out  = (size/10) * Math.sqrt( 50 + 10*Math.sqrt(5) );
    // Calculate the diameter of the inner circle
    var r_in   = (size/10) * Math.sqrt( 25 + 10*Math.sqrt(5) );
    //var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( size/2.0, 
				  -r_out + (r_out-r_in)
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }

    this.imageProperties = {
	source: {	x:      7/500.0,
			y:      (303-15)/460.0, // -16
			width:  157/500.0, 
			height: (150+15)/460.0  // +16
		},
	destination: { xOffset: 0.0,
		       yOffset: -18/460.0 // -16
		     }
		     
    };
    //this.imageProperties.source.center = new IKRS.Point2( this.imageProperties.source.x + this.imageProperties.source.x


    this._buildInnerPolygons( size );
};

IKRS.Tile.Pentagon.prototype._buildInnerPolygons = function( edgeLength ) {

    
    // Connect all edges half-the-way
    var innerTile = new IKRS.Polygon(); // [];
    //innerTile.push( this.vertices[0].scaleTowards( this.vertices[1], 0.5 ) );
    //innerTile.push( this.vertices[1].scaleTowards( this.vertices[2], 0.5 ) );

    for( var i = 0; i < this.polygon.vertices.length; i++ ) {

	innerTile.addVertex( this.getVertexAt(i).scaleTowards( this.getVertexAt(i+1), 0.5 ) );
	// Compute the next inner polygon vertex by the intersection of two circles
	var circleA = new IKRS.Circle( innerTile.vertices[ innerTile.vertices.length-1 ], edgeLength*0.425 ); //*0.425 ); 
	var circleB = new IKRS.Circle( this.getVertexAt(i+1).clone().scaleTowards( this.getVertexAt(i+2), 0.5 ), 
				       circleA.radius );
    
	// There is definitely an intersection
	var intersection = circleA.computeIntersectionPoints( circleB );
	// One of the two points is inside the tile, the other is outside.
	// Locate the inside point.
	if( intersection ) {
	    if( this.containsPoint(intersection.pointA) ) innerTile.addVertex(intersection.pointA);
	    else                                          innerTile.addVertex(intersection.pointB);
	} else {
	    console.log( "intersection is null!" );
	}
	
	//innerTile.push( circleB.center );

    }

    //window.alert( innerTile.length );

    this.innerTilePolygons.push( innerTile );
}

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Pentagon.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Pentagon.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Pentagon.prototype.getTranslatedVertex = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Pentagon.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Pentagon.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Pentagon.prototype.locateAdjacentEdge  = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Pentagon.prototype.getVertexAt         = IKRS.Tile.prototype.getVertexAt;

IKRS.Tile.Pentagon.prototype.constructor         = IKRS.Tile.Pentagon;

