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
    var move   = new IKRS.Point2( size/2.0, // bounds.getWidth()/2.0 - size, // *1.1,   // ???
				  -bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( move );
		
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
  
};

IKRS.Tile.Decagon.prototype._buildInnerPolygons = function( edgeLength ) {

    
    for( var i = 0; i < 10; i++ ) {
	var innerTile = [];
	// Make polygon
	var topPoint    = this.getVertexAt( i ).clone().scaleTowards( this.getVertexAt(i+1), 0.5 );
	var bottomPoint = topPoint.clone().multiplyScalar( 0.615 );
	var leftPoint   = this.getVertexAt( i ).clone().multiplyScalar( 0.69 );
	var rightPoint  = this.getVertexAt( i+1 ).clone().multiplyScalar( 0.69 );
	
	innerTile.push( topPoint );
	innerTile.push( rightPoint );
	innerTile.push( bottomPoint );
	innerTile.push( leftPoint );

	this.innerTilePolygons.push( innerTile );
    }
}


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Decagon.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Decagon.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Decagon.prototype.getTranslatedVertex = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Decagon.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Decagon.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Decagon.prototype.locateAdjacentEdge  = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Decagon.prototype.getVertexAt         = IKRS.Tile.prototype.getVertexAt;


IKRS.Tile.Decagon.prototype.constructor         = IKRS.Tile.Decagon;

