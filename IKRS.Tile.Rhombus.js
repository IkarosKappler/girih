/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @version 1.0.0
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
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0 - (bounds.getWidth()-size), 
				  bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( move );
		
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
};

IKRS.Tile.Rhombus.prototype._buildInnerPolygons = function() {

       // Connect all edges half-the-way
    var innerTile = [];
    innerTile.push( this.vertices[0].scaleTowards( this.vertices[1], 0.5 ) );
    innerTile.push( this.vertices[1].scaleTowards( this.vertices[2], 0.5 ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new IKRS.Circle( innerTile[1], innerTile[0].distanceTo(innerTile[1])*0.73 );
    var circleB = new IKRS.Circle( this.vertices[2].scaleTowards( this.vertices[3], 0.5 ), circleA.radius );
    
    // There is definitely an intersection
    var intersection = circleA.computeIntersectionPoints( circleB );
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    if( this.containsPoint(intersection.pointA) ) innerTile.push(interSection.pointA);
    else                                          innerTile.push(intersection.pointB);
    
    innerTile.push( circleB.center );
    innerTile.push( this.vertices[3].scaleTowards( this.vertices[0], 0.5 ) );
    
    // Move circles
    circleA.center = innerTile[4];
    circleB.center = innerTile[0];
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( this.containsPoint(intersection.pointA) ) innerTile.push(interSection.pointA);
    else                                          innerTile.push(intersection.pointB);

    this.innerTilePolygons.push( innerTile );

}


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Rhombus.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Rhombus.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Rhombus.prototype.getTranslatedVertex = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Rhombus.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Rhombus.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Rhombus.prototype.locateAdjacentEdge  = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Rhombus.prototype.getVertexAt         = IKRS.Tile.prototype.getVertexAt;

IKRS.Tile.Rhombus.prototype.constructor         = IKRS.Tile.Rhombus;

