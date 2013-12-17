/**
 * As there are some polygon intersecion functions required and I don't
 * want to handle polygons as simple point arrays, so here is a
 * polygon class.
 *
 * Note: as polygons are generally 2-dimensional, this class is not named
 *       Polygon2.
 *
 * @author Ikaros Kappler
 * @date 2013-12-13
 * @version 1.0.0
 **/

IKRS.Polygon = function( vertices ) {

    IKRS.Object.call( this );
    
    if( !vertices || typeof vertices == "undefined" )
	vertices = [];

    this.vertices = vertices;
}


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
IKRS.Polygon.prototype.getVertexAt = function( index ) {
    if( index < 0 ) 
	return this.vertices[ this.vertices.length - (Math.abs(index)%this.vertices.length) ];
    else
	return this.vertices[ index % this.vertices.length ];
};


/**
 * This function checks if the passed point is within this tile's polygon.
 *
 * @param point The point to be checked.
 * @retrn true|false
 **/
IKRS.Polygon.prototype.containsPoint = function( point ) {

    // window.alert( this._getTranslatedPoint );
    
    // Thanks to
    // http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    var i, j = 0;
    var c = false;
    for (i = 0, j = this.vertices.length-1; i < this.vertices.length; j = i++) {
	vertI = this.getTranslatedVertex( i ); 
	vertJ = this.getTranslatedVertex( j ); 
    	if ( ((vertI.y>point.y) != (vertJ.y>point.y)) &&
    	     (point.x < (vertJ.x-vertI.x) * (point.y-vertI.y) / (vertJ.y-vertI.y) + vertI.x) )
    	    c = !c;
    }
    return c;

};

IKRS.Polygon.prototype.locateContainedPolygonPoints = function( poly ) {

    var resultIndices = [];
    for( var i = 0; i < poly.vertices.length; i++ ) {

	if( this.containsPoint( poly.vertices[i] ) )
	    resultIndices.push( i );

    }
    
    return resultIndices;

}

/**
 * This function computes the intersecting edges of both polygons.
 *
 * The returned object has four components:
 *  - extendedA          former this
 *  - extendedB          former param
 *  - intersectionGraph  A three dimensional n*m*k[i] matrix indicating which
 *                       edges intersect;
 *                         n is the edge count of this.
 *                         m is the edge count of poly.
 *                         k[i] are the entry length of the matrix; each entry is
 *                              a list of pairs, containg edge index pairs.
 *  - intersectionList   The matrix in form of a list of tuples (indices in A and B).
 **/
IKRS.Polygon.prototype.computeIntersectingEdgePolygons = function( poly ) {
    
    var extendedA         = new IKRS.Polygon();
    var extendedB         = new IKRS.Polygon();
    var graph             = [];
    var list              = [];

    
    for( var a = 0; a < this.vertices.length; a++ ) {

	graph[a] = [];
	for( var b = 0; b < poly.vertices.length; b++ ) {
	   	    
	    // Build the extended polygons besides
	    extendedA.addVertex( this.vertices[a] );
	    extendedB.addVertex( poly.vertices[b] );

	    // Compute intersection
	    var edgeA             = new IKRS.Line2( this.vertices[a], this.getVertexAt(a+1) );
	    var edgeB             = new IKRS.Line2( poly.vertices[b], poly.getVertexAt(b+1) );
	    var intersectionPoint = edgeA.computeEdgeIntersection( edgeB );
	    
	    // Intersection exists?
	    if( intersectionPoint ) {
		graph[a][b] = new IKRS.Pair( extendedA.vertices.length, extendedB.vertices.length ); // next vertex indices
		list.push( graph[a][b].clone() );
		extendedA.addVertex( intersectionPoint );
		extendedB.addVertex( intersectionPoint.clone() ); // Don't use the same instance
	    } else {
		graph[a][b] = false;
	    }
	    

	}

    }


    return { extendedA: extendedA,
	     extendedB: extendedB,
	     intersectionGraph: graph,
	     intersectionList: list
	   };

}

// @return double
IKRS.Polygon._crossProduct = function( pointA, pointB, pointC ) {
    return (pointB.x - pointA.x)*(pointC.y - pointA.y) - (pointB.y - pointA.y)*(pointC.x - pointA.x);
}


IKRS.Polygon.prototype.computePolygonIntersection = function( clipPolygon ) {

    var outputList = this.vertices;
    for( var e = 0; e < clipPolygon.vertices.lengh; e++ ) {
	
	var edge = new IKRS2.Line2( this.getVertexAt(e), this.getVertexAt(e+1) );
	for( var s = 0; s < this.vertices.length; s++ ) {

	    var point = this.getVertexAt(s);
	    // Make a dummy point in ... ???
	    var crossProduct = IKRS.Polygon2._crossProduct( edge.pointA, edge.pointB, point );
	    if( crossProduct < 0 ) {
		// Inside the edge		
		// ...
	    } else {
		// Outside the edge
		// ...
	    }
	}

    }
    
    
    return result;

    // http://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
    /*
    List outputList = subjectPolygon;
  for (Edge clipEdge in clipPolygon) do
     List inputList = outputList;
     outputList.clear();
     Point S = inputList.last;
     for (Point E in inputList) do
        if (E inside clipEdge) then
           if (S not inside clipEdge) then
              outputList.add(ComputeIntersection(S,E,clipEdge));
           end if
           outputList.add(E);
        else if (S inside clipEdge) then
           outputList.add(ComputeIntersection(S,E,clipEdge));
        end if
        S = E;
     done
  done
  */

}

IKRS.Polygon.prototype.computeBoundingBox = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.vertices );
}

IKRS.Polygon.prototype.addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

IKRS.Polygon.prototype.constructor = IKRS.Polygon;
