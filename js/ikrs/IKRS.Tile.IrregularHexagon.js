/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.IrregularHexagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON );

    //window.alert( "[IrregularHexagon.init()] size=" + size + ", position=" + position.toString() + ", angle=" + angle );
    
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
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( (oppositePoint.x - startPoint.x)/2.0, 
				  (oppositePoint.y - startPoint.y)/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].sub( move );
		
    }

    this.imageProperties = {
	source: { x:      77/500.0, // 75,
		  y:      11/460.0,
		  width:  205/500.0, // 207,
		  height: 150/460.0  // 150
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };

    this._buildInnerPolygons();
    this._buildOuterPolygons();   // Only call AFTER the inner polygons were created!
};


IKRS.Tile.IrregularHexagon.prototype._buildInnerPolygons = function() {

    
    // Connect all edges half-the-way
    var innerTile = new IKRS.Polygon(); // []
    innerTile.addVertex( this.polygon.vertices[0].scaleTowards( this.polygon.vertices[1], 0.5 ) );
    innerTile.addVertex( this.polygon.vertices[1].scaleTowards( this.polygon.vertices[2], 0.5 ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new IKRS.Circle( innerTile.vertices[1], innerTile.vertices[0].distanceTo(innerTile.vertices[1]) );
    var circleB = new IKRS.Circle( this.polygon.vertices[2].clone().scaleTowards( this.polygon.vertices[3], 0.5 ), circleA.radius );
    
    // There is definitely an intersection
    var intersection = circleA.computeIntersectionPoints( circleB );
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    if( intersection && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
	//if( this.containsPoint(intersection.pointA) ) innerTile.push(intersection.pointA);
	//else                                          innerTile.push(intersection.pointB);
	//intersection = null;
    } else {
	console.log( "intersection is null!" );
    }
    
    innerTile.addVertex( circleB.center );
    
    //innerTile.push( this.vertices[3].scaleTowards( this.vertices[0], 0.5 ) );
    
    
    var i = 3;
    // Move circles
    circleA.center = circleB.center; // innerTile[4];
    circleB.center = this.polygon.vertices[3].clone().scaleTowards( this.polygon.vertices[4], 0.5 ); // innerTile[0];
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( intersection && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
	//if( this.containsPoint(intersection.pointA) ) innerTile.push(intersection.pointA);
	//else                                          innerTile.push(intersection.pointB);
	//intersection = null;
    } else {
	console.log( "intersection is null!" );
    }
    innerTile.addVertex( circleB.center );

    innerTile.addVertex( this.polygon.vertices[4].clone().scaleTowards( this.polygon.vertices[5], 0.5 ) );


    
    // Move circles  
    circleA.center = innerTile.vertices[ innerTile.vertices.length-1 ];  
    circleB.center = this.polygon.vertices[5].clone().scaleTowards( this.polygon.vertices[0], 0.5 );  
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( intersection && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
	//if( this.containsPoint(intersection.pointA) ) innerTile.push(intersection.pointA);
	//else                                          innerTile.push(intersection.pointB);
	//intersection = null;
    } else {
	console.log( "intersection is null!" );
    }
    innerTile.addVertex( circleB.center );
  


    
    // Move circles  
    circleA.center = innerTile.vertices[ innerTile.vertices.length-1 ];  
    circleB.center = innerTile.vertices[ 0 ]; 
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( intersection ) { //  && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
    } else {
	console.log( "intersection is null!" );
    }
    innerTile.addVertex( circleB.center );
    

    //window.alert( innerTile.length );

    this.innerTilePolygons.push( innerTile );	
};


IKRS.Tile.IrregularHexagon.prototype._buildOuterPolygons = function() {

    // First add the two triangles at the 'ends' of the shape.
    var indicesA = [ 0, 3 ];  //  6:2
    var indicesB = [ 0, 5 ];  // 10:2
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

	// The second 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+4).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+5).clone() );
	this.outerTilePolygons.push( outerTileY );
    }

};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.IrregularHexagon.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.IrregularHexagon.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.IrregularHexagon.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.IrregularHexagon.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.IrregularHexagon.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.IrregularHexagon.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.IrregularHexagon.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.IrregularHexagon.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.IrregularHexagon.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.IrregularHexagon.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.IrregularHexagon.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.IrregularHexagon.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.IrregularHexagon.prototype.constructor           = IKRS.Tile.IrregularHexagon;

