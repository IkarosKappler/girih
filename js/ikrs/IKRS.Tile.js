/**
 * This is a general Tile superclass.
 *
 * All other tile classes extends this one.
 *
 *
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


/**
 * @param size     number  The edge size (usually IKRS.Girih.DEFAULT_EDGE_LENGTH).
 * @param position Point2  The position of the tile.
 * @param angle    number  The rotation angle.
 * @param tileType integer One of IKRS.Girih.TILE_TYPE_*.
 **/
IKRS.Tile = function( size, 
		      position, 
		      angle, 
		      tileType
		    ) {
    
    IKRS.Object.call( this );

    if( typeof angle == "undefined" )
	angle = 0.0;
    if( typeof tileType == "unknown" )
	tileType = IKRS.Girih.TILE_TYPE_UNKNOWN;
    
    this.size                 = size;
    this.position             = position;
    this.angle                = angle;
    //this.vertices            = [];
    this.polygon              = new IKRS.Polygon(); // Empty vertice array

    // An array of polygons.
    // The inner tile polygons are those that do not share edges with the outer
    // tile bounds (vertices are OK).
    this.innerTilePolygons    = []; 

    // A second array of polygons.
    // The outer tile polygons are those that make up the whole tile area
    // _together with the inner tile polygons (!)_; the union of the
    // inner tile polygons and the outer tile polygons covers exactly
    // the whole tile polygon.
    // The intersection of both sets is empty.
    // Outer tile polygon share at least one (partial) edge with the complete
    // tile polygon (length > 0).
    this.outerTilePolygons    = [];  
    this.imageProperties      = null;

    this.tileType             = tileType;

};

/**
 * This function applies MOD to the index.
 **/
IKRS.Tile.prototype.getInnerTilePolygonAt = function( index ) {
    if( index < 0 ) 
	return this.innerTilePolygons[ this.innerTilePolygons.length - (Math.abs(index)%this.innerTilePolygons.length) ];
    else
	return this.innerTilePolygons[ index % this.innerTilePolygons.length ];
};

/**
 * This function applies MOD to the index.
 **/
IKRS.Tile.prototype.getOuterTilePolygonAt = function( index ) {
    if( index < 0 ) 
	return this.outerTilePolygons[ this.outerTilePolygons.length - (Math.abs(index)%this.outerTilePolygons.length) ];
    else
	return this.outerTilePolygons[ index % this.outerTilePolygons.length ];
};


IKRS.Tile.prototype.getTranslatedVertex = function( index ) {

    //return this.vertices[index].clone().rotate( this.position, this.angle ).add( this.position );
    // Rotate around the absolut center!
    // (the position is applied later)
    //var vertex = this.polygon.getVertexAt( index ); // this.getVertexAt( index );
    //return vertex.clone().rotate( IKRS.Point2.ZERO_POINT, this.angle ).add( this.position );    
    return this._translateVertex( this.polygon.getVertexAt(index) );
};

/**
 * This is a special get* function that modulates the index and also
 * allows negative values.
 * 
 * For k >= 0:
 *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
 *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
 *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
 *
 * So this function always returns a point for any index.
 **/
IKRS.Tile.prototype.getVertexAt = function( index ) {
    /*
    if( index < 0 ) 
	return this.vertices[ this.vertices.length - (Math.abs(index)%this.vertices.length) ];
    else
	return this.vertices[ index % this.vertices.length ];
    */
    return this.polygon.getVertexAt( index );
}

/**
 * This function checks if the passed point is within this tile's polygon.
 *
 * @param point The point to be checked.
 * @retrn true|false
 **/
IKRS.Tile.prototype.containsPoint = function( point ) {

    // window.alert( this._getTranslatedPoint );
    
    // Thanks to
    // http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    var i, j = 0;
    var c = false;
    for (i = 0, j = this.polygon.vertices.length-1; i < this.polygon.vertices.length; j = i++) {
	vertI = this.getTranslatedVertex( i ); 
	vertJ = this.getTranslatedVertex( j ); 
    	if ( ((vertI.y>point.y) != (vertJ.y>point.y)) &&
    	     (point.x < (vertJ.x-vertI.x) * (point.y-vertI.y) / (vertJ.y-vertI.y) + vertI.x) )
    	    c = !c;
    }
    return c;

}

/**
 * This function locates the closest tile edge (polygon edge)
 * to the passed point.
 *
 * Currently the edge distance to a point is measured by the
 * euclidian distance from the edge's middle point.
 *
 * @param point     The point to detect the closest edge for.
 * @param tolerance The tolerance (=max distance) the detected edge
 *                  must be inside.
 * @return the edge index (index of the start vertice) or -1 if not
 *         found.
 **/
IKRS.Tile.prototype.locateEdgeAtPoint = function( point,
						  tolerance
						) {
    if( this.polygon.vertices.length == 0 )
	return -1;


    var middle         = new IKRS.Point2( 0, 0 );
    var tmpDistance    = 0;
    var resultDistance = tolerance*2;   // definitely outside the tolerance :)
    var resultIndex    = -1;
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	var vertI = this.getTranslatedVertex( i ); 
	var vertJ = this.getTranslatedVertex( i+1 ); // (i+1 < this.vertices.length ? i+1 : 0) ); 

	// Create a point in the middle of the edge	
	middle.x = vertI.x + (vertJ.x - vertI.x)/2.0;
	middle.y = vertI.y + (vertJ.y - vertI.y)/2.0;
	tmpDistance = middle.distanceTo(point);
	if( tmpDistance <= tolerance && (resultIndex == -1 || tmpDistance < resultDistance) ) {
	    resultDistance = tmpDistance;
	    resultIndex    = i;
	}

    }

    return resultIndex;

}

/**
 * Find the adjacent edge from this tile's polygon.
 *
 * This function will check all egdges and return the one with
 * the minimal distance (its index).
 *
 * Only forward edges (i -> i+1) are detected. If you wish backward
 * edges to be detected too, swap the point parameters pointA and 
 * pointB.
 *
 * @param pointA    The first point of the desired edge.
 * @param pointB    The second point the desired edge.
 * @param tolerance The tolerance of the detection (radius).
 * @return The index of the edge's first vertex (if detected) or
 *         -1 if not edge inside the tolerance was found.
 * 
 * @pre tolerance >= 0
 **/  
IKRS.Tile.prototype.locateAdjacentEdge = function( pointA,
						   pointB,
						   tolerance
						 ) {
    
    if( this.polygon.vertices.length == 0 )
	return -1;

    var result = -1;
    var resultDistance = 2*tolerance+1;   // Definitely larger than the tolerance :)
    //var tmpDistance;
    for( var i = 0; i <= this.polygon.vertices.length; i++ ) {

	var vertCur = this.getTranslatedVertex( i );   // this.getVertexAt( i );
	var vertSuc = this.getTranslatedVertex( i+1 ); // this.getVertexAt( i+1 );

	// Current edge matches?	
	var avgDistanceFwd = (vertCur.distanceTo(pointA) + vertSuc.distanceTo(pointB))/2.0;
	//var avgDistanceBwd = (vertSuc.distanceTo(pointA) + vertCur.distanceTo(pointB))/2.0;

	// Measure only in one direction. Otherwise the return value would be ambigous.
	if( avgDistanceFwd < tolerance &&
	    (result == -1 || (result != -1 && avgDistanceFwd < resultDistance)) 
	  ) {	    
	    // Check ALL edges to find the minimum
	    result = i;
	    resultDistance = avgDistanceFwd;
	}
    }
    

    return result;

};

IKRS.Tile.prototype.toSVG = function( options,
				      polygonStyle,
				      buffer
				    ) {
    
    var returnBuffer = false;
    if( typeof buffer == "undefined" || !buffer ) {
	buffer = [];
	returnBuffer = true;
    }

    // Export outer shape?
    /*
    this._polygonToSVG( this.polygon,
			options,
			polygonStyle,
			buffer );
    */
    for( var i = 0; i < this.innerTilePolygons.length; i++ ) {
	this._polygonToSVG( this.innerTilePolygons[i],
			    options,
			    polygonStyle,
			    buffer );
    }
    
    // Export outer tile polygons?
    /*
    for( var i = 0; i < this.outerTilePolygons.length; i++ ) {
	this._polygonToSVG( this.outerTilePolygons[i],
			    options,
			    polygonStyle,
			    buffer );
    }
    */
    
    
    if( returnBuffer )
	return buffer;
    else
	return buffer.join( "" );
};

IKRS.Tile.prototype._polygonToSVG = function( polygon,
					      options,
					      polygonStyle,
					      buffer 
					      ) {
    if( typeof options != "undefined" && typeof options.indent != "undefined" )
	buffer.push( options.indent );
    
    buffer.push( "<polygon points=\"" );
    var vert;
    for( var i = 0; i < polygon.vertices.length; i++ ) {
	vert = this._translateVertex( polygon.getVertexAt(i) ); // getTranslatedVertex(i);
	if( i > 0 )
	    buffer.push( " " );
	buffer.push( vert.x );
	buffer.push( "," );
	buffer.push( vert.y );
    }    
    buffer.push( "\"" );
    
    if( typeof polygonStyle != "undefined" ) {
	buffer.push( " style=\"" );
	buffer.push( polygonStyle );
	buffer.push( "\"" );
    }
    
    buffer.push( " />\n" );
};

IKRS.Tile.prototype.computeBounds = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
};

IKRS.Tile.prototype._translateVertex = function( vertex ) {
    return vertex.clone().rotate( IKRS.Point2.ZERO_POINT, this.angle ).add( this.position );   
};

IKRS.Tile.prototype._addVertex = function( vertex ) {
    this.polygon.vertices.push( vertex );
};

IKRS.Tile.prototype.constructor = IKRS.Tile;

