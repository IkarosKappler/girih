/**
 * @author Ikaros Kappler
 * @date 2018-12-16
 * @version 1.0.1
 **/


IKRS.Tile.Octagon = function( size, position, angle ) {

    console.log( 'Creating octagon ...' );
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_OCTAGON );
    
    // Init the actual octagon shape with the passed size
    /*
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var theta = Math.PI/2 * (135.0 / 360.0);
    for( var i = 1; i <= 7; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
	}*/

    // Create polygon with 8 sides of length 'size'
    // Thanks to
    //    https://www.mathopenref.com/polygonradius.html
    var sides  = IKRS.Tile.Octagon.POLYGON_SIDE_COUNT;
    var radius = size / (2 * Math.sin(Math.PI/sides));
    var centerAngle = Math.PI*2/sides;
    var center = new IKRS.Point2(0,0);
    var pointA = new IKRS.Point2(0,radius);
    pointA.rotate( center, centerAngle/2 );
    var pointB = null;
    for( var i = 0; i < sides; i++ ) {
	pointB = pointA.clone();
	this._addVertex( pointB );
	pointB.rotate( center, i*centerAngle);
    }
    
    // Move to center?
    /*
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( size/2.0, 
				  -bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {	
	this.polygon.vertices[i].add( move );
    }
    */
    
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

IKRS.Tile.Octagon.POLYGON_SIDE_COUNT = 8;

IKRS.Tile.Octagon.prototype._buildInnerPolygons = function( edgeLength ) {
    var centralStar = new IKRS.Polygon();
    for( var i = 0; i < IKRS.Tile.Octagon.POLYGON_SIDE_COUNT; i++ ) {
	var innerTile = new IKRS.Polygon();;
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


IKRS.Tile.Octagon.prototype._buildOuterPolygons = function( edgeLength ) {
    /*
    // DON'T include the inner star here!
    for( var i = 0; i < 10; i++ ) {
	var outerTile = new IKRS.Polygon();
	outerTile.addVertex( this.getVertexAt(i).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(3).clone() );
	outerTile.addVertex( this.getInnerTilePolygonAt( i==0 ? 9 : i-1 ).getVertexAt(0).clone() );
	this.outerTilePolygons.push( outerTile );
    }
*/
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Octagon.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Octagon.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Octagon.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.Octagon.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.Octagon.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.Octagon.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.Octagon.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Octagon.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Octagon.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Octagon.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Octagon.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.Octagon.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Octagon.prototype.constructor           = IKRS.Tile.Octagon;

