/**
 * The penrose rhombus (angles 36° and 144°) is NOT part of the actual girih tile set!
 *
 * But it fits perfect into the girih as the angles are the same. 
 * *
 * @author Ikaros Kappler
 * @date 2013-12-11
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.PenroseRhombus = function( size, position, angle, opt_addCenterPolygon ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS  );


    if( typeof opt_addCenterPolygon == "undefined" )
	opt_addCenterPolygon = true;  // Add by default

    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   36.0,  // 72.0,
		   144.0  // 108.0
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
	source: { x:      2/500.0,
		  y:      8/460.0,
		  width:  173/500.0, 
		  height: 56/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
				 
    
    this._buildInnerPolygons( opt_addCenterPolygon );
    this._buildOuterPolygons( opt_addCenterPolygon );
};

IKRS.Tile.PenroseRhombus.prototype._buildInnerPolygons = function( addCenterPolygon ) {

    var indices              = [ 0, 2 ];
    var innerPointIndexLeft  = -1;
    var innerPointIndexRight = -1;
    var centerTile           = new IKRS.Polygon();
    for( var i = 0; i < indices.length; i++ ) {

	var innerTile = new IKRS.Polygon();
	var index = indices[i];
	var left   = this.getVertexAt( index   ).clone().scaleTowards( this.getVertexAt(index+1), 0.5 );
	var right  = this.getVertexAt( index+1 ).clone().scaleTowards( this.getVertexAt(index+2), 0.5 );
	var innerA = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.28 );
	var innerB = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.55 );
	

	innerTile.addVertex( left );
	innerTile.addVertex( innerA );
	innerTile.addVertex( right );
	innerTile.addVertex( innerB );

	if( i == 0 ) {
	    centerTile.addVertex( this.getVertexAt( index ).clone().scaleTowards( this.getVertexAt(index+2), 0.1775 ) );
	    centerTile.addVertex( innerA );
	} else { // if( i == 1 ) {
	    centerTile.addVertex( this.getVertexAt( index ).clone().scaleTowards( this.getVertexAt(index+2), 0.1775 ) );
	    centerTile.addVertex( innerA );
	}

	this.innerTilePolygons.push( innerTile );
    }
    
    if( addCenterPolygon )
	this.innerTilePolygons.push( centerTile );

};

IKRS.Tile.PenroseRhombus.prototype._buildOuterPolygons = function( centerPolygonExists ) {

    // Add left and right 'spikes'.
    var indices = [ 0, 2 ];
    for( var i = 0; i < indices.length; i++ ) {

	var outerTile = new IKRS.Polygon();
	var index = indices[i];
	var left   = this.getVertexAt( index   ).clone().scaleTowards( this.getVertexAt(index+1), 0.5 );
	var right  = this.getVertexAt( index+1 ).clone().scaleTowards( this.getVertexAt(index+2), 0.5 );
	var innerA = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.28 );
	var innerB = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.55 );

	outerTile.addVertex( left.clone() );
	outerTile.addVertex( this.getVertexAt( index+1 ).clone() );
	outerTile.addVertex( right.clone() );
	outerTile.addVertex( innerB.clone() );
	
	this.outerTilePolygons.push( outerTile );
	   
    }
   
    // If the center polygon exists then the last outer polygon is split into two.
    if( centerPolygonExists ) {
	// Two polygons
	
	var indices = [ 0, 2 ];
	for( var i = 0; i < indices.length; i++ ) {
	    var outerTile = new IKRS.Polygon();
	    var index = indices[i];
	    outerTile.addVertex( this.getVertexAt(index).clone() );
	    outerTile.addVertex( this.getVertexAt(index).clone().scaleTowards(this.getVertexAt(index+1),0.5) );
	    outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(1).clone() );
	    outerTile.addVertex( this.getVertexAt(index).clone().scaleTowards( this.getVertexAt(index+2), 0.1775 ) );
	    outerTile.addVertex( this.innerTilePolygons[(i+1)%2].getVertexAt(1).clone() );
	    outerTile.addVertex( this.getVertexAt(index-1).clone().scaleTowards( this.getVertexAt(index), 0.5 ) );
	    
	    this.outerTilePolygons.push( outerTile );
	}

    } else {
	// One polygon
	
    }

};

/**
 * If you want the center polygon not to be drawn the canvas handler needs to
 * know the respective polygon index (inside the this.innerTilePolygons array).
 **/
IKRS.Tile.PenroseRhombus.prototype.getCenterPolygonIndex = function() {
    return 2;
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.PenroseRhombus.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.PenroseRhombus.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.PenroseRhombus.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.PenroseRhombus.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.PenroseRhombus.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.PenroseRhombus.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.PenroseRhombus.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.PenroseRhombus.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.PenroseRhombus.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.PenroseRhombus.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.PenroseRhombus.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.PenroseRhombus.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Rhombus.prototype.constructor                  = IKRS.Tile.Rhombus;

