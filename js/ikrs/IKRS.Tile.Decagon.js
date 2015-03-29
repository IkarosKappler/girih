/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
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
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( size/2.0, // bounds.getWidth()/2.0 - size, // *1.1,   // ???
				  -bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }
    
    this.imageProperties = {
	source: { x:      169/500.0,
		  y:      140/460.0,
		  width:  313/500.0,
		  height: 297/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };


    this._buildInnerPolygons( size );
    this._buildOuterPolygons();       // Important: call AFTER inner polygons were created!
  
};

IKRS.Tile.Decagon.prototype._buildInnerPolygons = function( edgeLength ) {
    
    var centralStar = new IKRS.Polygon();
    for( var i = 0; i < 10; i++ ) {
	var innerTile = new IKRS.Polygon(); // [];
	// Make polygon
	var topPoint    = this.getVertexAt( i ).clone().scaleTowards( this.getVertexAt(i+1), 0.5 );
	var bottomPoint = topPoint.clone().multiplyScalar( 0.615 );
	var leftPoint   = this.getVertexAt( i ).clone().multiplyScalar( 0.69 );
	var rightPoint  = this.getVertexAt( i+1 ).clone().multiplyScalar( 0.69 );
	
	innerTile.addVertex( topPoint );
	innerTile.addVertex( rightPoint );
	innerTile.addVertex( bottomPoint );
	innerTile.addVertex( leftPoint );

	this.innerTilePolygons.push( innerTile );


	centralStar.addVertex( leftPoint.clone() );
	centralStar.addVertex( bottomPoint.clone() );
    }
    
    this.innerTilePolygons.push( centralStar );
};


IKRS.Tile.Decagon.prototype._buildOuterPolygons = function( edgeLength ) {

    // DON'T include the inner star here!
    for( var i = 0; i < 10; i++ ) {

	//if( i > 0 )
	//    continue;
	
	//window.alert( this.getInnerTilePolygonAt );

	var outerTile = new IKRS.Polygon();
	outerTile.addVertex( this.getVertexAt(i).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(3).clone() );
	outerTile.addVertex( this.getInnerTilePolygonAt( i==0 ? 9 : i-1 ).getVertexAt(0).clone() );
	

	this.outerTilePolygons.push( outerTile );
    }
    
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Decagon.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Decagon.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Decagon.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.Decagon.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.Decagon.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.Decagon.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.Decagon.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Decagon.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Decagon.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Decagon.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Decagon.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.Decagon.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Decagon.prototype.constructor           = IKRS.Tile.Decagon;

