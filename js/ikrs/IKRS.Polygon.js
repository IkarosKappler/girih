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
    
    if( vertices == undefined || !vertices || typeof vertices == "undefined" )
	vertices = [];

    this.vertices = vertices;
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
IKRS.Polygon.prototype.getVertexAt = function( index ) {
    if( index < 0 ) 
	return this.vertices[ this.vertices.length - (Math.abs(index)%this.vertices.length) ];
    else
	return this.vertices[ index % this.vertices.length ];
};

/*
IKRS.Polygon.prototype.hasVertex = function( vertex ) {
    for( var i = 0; i < this.vertices.length; i++ ) {
	if( this.vertices[i] == vertex )
	    return true;
    }
    return false;
}
*/

IKRS.Polygon.prototype.getEdgeAt = function( index ) {
    return new IKRS.Line2( this.getVertexAt(index), this.getVertexAt(index+1) );
};

IKRS.Polygon.prototype.hasEdge = function( edge ) {
    for( var i = 0; i < this.vertices.length; i++ ) {

	var polyEdge = new IKRS.Line2( this.vertices[i], this.getVertexAt(i+1) );
	if( polyEdge.equalEdgePoints(edge) )
	    return true;
    }
    return false;
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
	vertI = this.getVertexAt( i ); 
	vertJ = this.getVertexAt( j ); 
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

};

/**
 * This function computes the intersection of this polygon and the
 * parameter polygon.
 **/
IKRS.Polygon.prototype.computeIntersection = function( poly ) {

    // First compute the intersection triangulation
    var triangulation = polyA._computeIntersectionTriangulation( poly );

    // The intersection is empty if the intersectionList is empty (no intersecting edges)
    if( triangulation.length == 0 )
	return [];
    

    
    
    
    return outerEdgePair;
};


/**
 * This function computes a triangle set from the intersecting-edge graph of
 * this polygon and the passed parameter polygon.
 *
 * An intersecting-edge graph is the combination of two graphs (polygons are
 * graphs too) but with additional vertices/edges where the two original
 * graphs intersect.
 *
 * The returned value is an array containing triangles.
 **/
IKRS.Polygon.prototype._computeIntersectionTriangulation = function( poly ) {

    // Then compute the extended polygons
    //  - extendedA
    //  - extendedB
    //  - intersectionGraph
    //  - intersectionList
    //  - allPoints
    var edgeIntersection = this._computeIntersectingEdgePolygons( poly );

        
    // Triangulate each extended polygon by itself
    var extendedGraphA = new IKRS.Graph2( edgeIntersection.extendedA.vertices );
    var extendedGraphB = new IKRS.Graph2( edgeIntersection.extendedB.vertices );

    var trianglesA = extendedGraphA.triangulate();
    var trianglesB = extendedGraphB.triangulate();

    
    // Now there might be _real_ polygon edges, that do not occur in the respective
    // triangulation. But these edges MUST be inserted. So detect all edges from the
    // extended polygon, that really intersect the triangulation. Add these intersection
    // points (from the triangulation) to the extended polygon.
    var superExtendedGraphA = _computeExtendedGraphFromTriangleIntersection( this, // edgeIntersection.extendedA,
									     trianglesA );
    var superExtendedGraphB = _computeExtendedGraphFromTriangleIntersection( poly, // edgeIntersection.extendedB,
									     trianglesB );
    

    // The super graph contains all relevant vertices (maybe more in the current implementation)
    // Triangulate it. For each triangle from the triangulation is true:
    //  - it is fully contained in polygonA
    //    OR
    //  - it is fully contained in polygonB
    //    OR
    //  - it has no intersection with polygonA nor with polygonB
    //    (completely outside, only if at least one polygon is not convex)
    // This leads to the fact: 
    //    Each triangle's center point tells if the whole triangle is contained
    //    in polygon{A,B} or nor ^^    
    
    /*
    var superExtendedVertices = new IKRS.ArraySet();         
    for( var i in superExtendedGraphA.vertices ) 
	superExtendedVertices.addUnique( superExtendedGraphA.vertices[i] );
    for( var i in superExtendedGraphB.vertices ) 
	superExtendedVertices.addUnique( superExtendedGraphB.vertices[i] );   
    */
    
    var superExtendedVertices = this._computeInnerIntersectionPointsFromTriangulation( trianglesA, trianglesB );
    //window.alert( "superExtendeVertices.elements.length=" + superExtendedVertices.elements.length + "\n, superExtendeVertices.elements=" + superExtendedVertices.elements );


    // Triangulate super point set
    var superExtendedGraph = new IKRS.Graph2( superExtendedVertices.elements ); // superExtendedVertices.elements );   
    var superTriangulation = superExtendedGraph.triangulate();  // An array of triangles

    //window.alert( "superTriangulation.length=" + superTriangulation.length );

    
    return new IKRS.TriangleSet( superTriangulation );
};

IKRS.Polygon.prototype._computeInnerIntersectionPointsFromTriangulation = function( trianglesA, 
										    trianglesB 
										  ) {
    
    var result = new IKRS.ArraySet();

    //window.alert( trianglesA.length );
    for( var a in trianglesA ) {

	var triA = trianglesA[a];

	// Also add triangle vertices
	result.addUnique( triA.getPointA() );
	result.addUnique( triA.getPointB() );
	result.addUnique( triA.getPointC() );
	
	for( var b in trianglesB ) {

	    var triB = trianglesB[b];	    
	    // Each Triangle has three edges
	    triA.computeTriangleIntersectionPoints( triB, result );

	}

    }

    // Also add vertices from b
    for( var b in trianglesB ) {
	var triB = trianglesB[b];
	result.addUnique( triB.getPointA() );
	result.addUnique( triB.getPointB() );
	result.addUnique( triB.getPointC() );
    }

    return result;
};

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
 *  - allPoints          An ArrayList containing all points.
 **/
// TODO: THE EXTENDED POLYON VERTEX ORDER IS NOT CORRECT!
//       FORTUNATELY THE ORDER IS NOT CONSIDERED IN THE MAIN TRIANGULATION ALGORITHM,
//       BUT THIS IS A BIT UGLY THOUGH.
//       (Check the LineOrderedPointSet for bugs)
IKRS.Polygon.prototype._computeIntersectingEdgePolygons = function( poly ) {
    
    //var extendedA         = new IKRS.Polygon();
    //var extendedB         = new IKRS.Polygon();
    var extendedSetA        = new IKRS.ArraySet();
    var extendedSetB        = new IKRS.ArraySet();
    var graph               = [];
    var list                = [];
    var allPoints           = new IKRS.ArraySet(); // [];

    var segmentPointSetsA   = []; // new IKRS.LineOrderedPointSet2(...) 
    var segmentPointSetsB   = [];

    
    for( var a = 0; a < this.vertices.length; a++ ) {

	var edgeA              = new IKRS.Line2( this.vertices[a], this.getVertexAt(a+1) );
	graph[a] = [];	
	//allPoints.push( this.vertices[a] );
	allPoints.add( this.vertices[a] );
	//extendedSetA.addUnique( this.vertices[a] );
	segmentPointSetsA[ a ] = new IKRS.LineOrderedPointSet2( edgeA ); 
	segmentPointSetsA[ a ].add( this.vertices[a] );

	for( var b = 0; b < poly.vertices.length; b++ ) {

	    if( a == 0 )
		allPoints.add( poly.vertices[b] );
 
	    // Compute intersection
	    var edgeB             = new IKRS.Line2( poly.vertices[b], poly.getVertexAt(b+1) );
	    var intersectionPoint = edgeA.computeEdgeIntersection( edgeB );

	    // Build the extended polygons besides
	    //extendedSetA.addUnique( this.vertices[a] );
	    if( a == 0 ) {
		segmentPointSetsB[ b ] = new IKRS.LineOrderedPointSet2( edgeB ); 
		segmentPointSetsB[ b ].add( poly.vertices[b] );
		//extendedSetB.addUnique( poly.vertices[b] );
	    }
	    
	    // Intersection exists?
	    if( intersectionPoint ) {
		graph[a][b] = new IKRS.Pair( extendedSetA.elements.length, extendedSetB.elements.length ); // next vertex indices
		list.push( graph[a][b] ); //.clone() );
	
		//extendedSetA.addUnique( intersectionPoint );
		//extendedSetB.addUnique( intersectionPoint );
		segmentPointSetsA[ a ].add( intersectionPoint );
		segmentPointSetsB[ b ].add( intersectionPoint );
		
		allPoints.add( intersectionPoint );

	    } else {
		graph[a][b] = false;
	    }
	    

	}

    }

    // Finally join together the segment buffers
    var extendedPolygonA = new IKRS.Polygon();
    for( var i = 0; i < this.vertices.length; i++ ) {
	for( var j = 0; j < segmentPointSetsA[i].elements.length; j++ )
	    extendedPolygonA.vertices.push( segmentPointSetsA[i].elements[j] );
    }
    var extendedPolygonB = new IKRS.Polygon();
    for( var i = 0; i < poly.vertices.length; i++ ) { 
	//extendedPolygonB.vertices.push( poly.vertices[i] );
	for( var j = 0; j < segmentPointSetsB[i].elements.length; j++ )
	    extendedPolygonB.vertices.push( segmentPointSetsB[i].elements[j] );
    }

    return { extendedA: extendedPolygonA, //new IKRS.Polygon( extendedSetA.elements ),
	     extendedB: extendedPolygonB, //new IKRS.Polygon( extendedSetB.elements ),
	     intersectionGraph: graph,
	     intersectionList: list,
	     allPoints: allPoints
	   };

};

/**
 * This function scales all polygon vertices by the given scalar number.
 **/
IKRS.Polygon.prototype.multiplyScalar = function( s ) {
    for( var i = 0; i < this.vertices.length; i++ ) {
	this.vertices[i].multiplyScalar( s );
    }
    return this; // Allow operator concatenation
};

/**
 * This function translates all polygon vertices by the given (amount.x, amount.y).
 **/
IKRS.Polygon.prototype.translate = function( amount ) {
    //for( var i = 0; i < this.vertices.length; i++ ) {
    for( var i in this.vertices ) {
	//if( !this.vertices[i].translate )
	//    window.alert( "vertice " + i + " has NOT translate entity: " + this.vertices[i] + ", value=" + this.vertices[i] + ", type=" + (typeof this.vertices[i])  );
	this.vertices[i].add( amount );
    }
    return this; // Allow operator concatenation
};

/**
 * This function translates all polygon vertices by the given amount (x,y).
 **/
IKRS.Polygon.prototype.translateXY = function( x, y ) {
    for( var i = 0; i < this.vertices.length; i++ ) {
	this.vertices[i].addXY( x, y );
    }
    return this; // Allow operator concatenation
};

// @return double
IKRS.Polygon._crossProduct = function( pointA, pointB, pointC ) {
    return (pointB.x - pointA.x)*(pointC.y - pointA.y) - (pointB.y - pointA.y)*(pointC.x - pointA.x);
};


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

};

IKRS.Polygon.prototype.computeBoundingBox = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.vertices );
};

IKRS.Polygon.prototype.addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

IKRS.Polygon.prototype.constructor = IKRS.Polygon;
