/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.Rhombus = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_RHOMBUS  );
    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   108.0
		   // 72.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

    }

    
    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0 - (bounds.getWidth()-size), 
				  bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }

    this.imageProperties = {
	source: { x:      32/500.0,
		  y:      188/460.0,
		  width:  127/500.0, // 127,
		  height: 92/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
    
    this._buildInnerPolygons();
    this._buildOuterPolygons();  // Call only AFTER the inner polygons were built!
};

IKRS.Tile.Rhombus.prototype._buildInnerPolygons = function() {

       // Connect all edges half-the-way
    var innerTile = new IKRS.Polygon(); // [];
    innerTile.addVertex( this.polygon.vertices[0].scaleTowards( this.polygon.vertices[1], 0.5 ) );
    innerTile.addVertex( this.polygon.vertices[1].scaleTowards( this.polygon.vertices[2], 0.5 ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new IKRS.Circle( innerTile.vertices[1], innerTile.vertices[0].distanceTo(innerTile.vertices[1])*0.73 );
    var circleB = new IKRS.Circle( this.polygon.vertices[2].scaleTowards( this.polygon.vertices[3], 0.5 ), circleA.radius );
    
    // There is definitely an intersection
    var intersection = circleA.computeIntersectionPoints( circleB );
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    if( this.containsPoint(intersection.pointA) ) innerTile.addVertex(intersection.pointA);
    else                                          innerTile.addVertex(intersection.pointB);
    
    innerTile.addVertex( circleB.center );
    innerTile.addVertex( this.polygon.vertices[3].scaleTowards( this.polygon.vertices[0], 0.5 ) );
    
    // Move circles
    circleA.center = innerTile.vertices[4];
    circleB.center = innerTile.vertices[0];
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( this.containsPoint(intersection.pointA) ) innerTile.addVertex(intersection.pointA);
    else                                          innerTile.addVertex(intersection.pointB);

    this.innerTilePolygons.push( innerTile );

};

IKRS.Tile.Rhombus.prototype._buildOuterPolygons = function() {

    var indicesA = [ 0, 2 ];  // 4:2
    var indicesB = [ 0, 3 ];  // 6:2
    for( var i = 0; i < indicesA.length; i++ ) {

	var indexA     = indicesA[i];
	var indexB     = indicesB[i];
	// The triangle
	var outerTileX = new IKRS.Polygon();
	outerTileX.addVertex( this.getVertexAt(indexA+1).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	this.outerTilePolygons.push( outerTileX );
	
	// The first 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	this.outerTilePolygons.push( outerTileY );

	/*
	// The second 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+4).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+5).clone() );
	this.outerTilePolygons.push( outerTileY );
	*/
    }

};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Rhombus.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Rhombus.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Rhombus.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.Rhombus.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.Rhombus.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.Rhombus.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.Rhombus.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Rhombus.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Rhombus.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Rhombus.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Rhombus.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.Rhombus.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Rhombus.prototype.constructor           = IKRS.Tile.Rhombus;

