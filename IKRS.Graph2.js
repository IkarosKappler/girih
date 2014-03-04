/**
 * A Graph2 is a set of 2D points in the euclidean plane.
 *
 * The points are arranged in an array, and two points may be connected
 * to an edge.
 *
 *
 * @author Ikaros Kappler
 * @date 2013-12-18
 * @version 1.0.0
 **/


IKRS.Graph2 = function( vertices ) {

    IKRS.Object.call( this );

    if( vertices === undefined )
	vertices = [];


    this.vertices = vertices;
    this.edges    = [];

}

IKRS.Graph2.prototype.addEdge = function( a, b ) {
    this.edges.push( new IKRS.Line2(a,b) );
};

IKRS.Graph2.prototype.containsEdge = function( a, b ) {
    for( var i in this.edges ) {
	var edge = this.edges[i];
	if( edge.a == a && edge.b == b )
	    return true;
	if( edge.a == b && edge.b == a )
	    return true;
    }
};

/**
 * Add all points from the passed array to this point set.
 **/
IKRS.Graph2.prototype.addVertices = function( vertices ) {
    this.vertices = this.vertices.concat( vertices );
}

IKRS.Graph2.prototype.addVertex = function( vertex ) {
    this.vertices.push( vertex );
}

IKRS.Graph2.prototype.addUnique = function( vertex, pointComparator ) {

    this.addUniqueVertex( vertex, pointComparator );
}

IKRS.Graph2.prototype.addUniqueVertex = function( vertex, pointComparator ) {

    //for( var i = 0; i < this.vertices.length; i++ ) { 
    for( var i in this.vertices ) {
	if( pointComparator && pointComparator.equal(this.vertices[i],vertex) )
	    return;
	if( this.vertices[i] == vertex ) // || this.vertices[i].equals(vertex) )
	    return;
    }
    this.vertices.push( vertex );
}


IKRS.Graph2.prototype.computeBoundingBox = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.vertices );
}

IKRS.Graph2.prototype.triangulate = function( keepOriginalEdges ) {
    
    //var triangles = [];
    var triangleSet = new IKRS.ArraySet( [], IKRS.Triangle.permutationComparator );  // Use default identity comparator?
					 

    //
    // First, create a "supertriangle" that bounds all vertices
    //
    //var st = CreateBoundingTriangle( vertices );
    var bounds = this.computeBoundingBox();
    var st = bounds.computeBoundingTriangle();
    // Scale the triangle a bit bigger to avoid points lying on the triangle edges.
    // Warning: scale from the CENTER OF THE BOUNDING BOX!
    st.translate( bounds.getCenterPoint().invert() ) 
	.multiplyScalar( 1.2 )
	.translate( bounds.getCenterPoint() ); 

    //triangles.push( st );
    triangleSet.addUnique( st );

    //
    // Next, begin the triangulation one vertex at a time
    //
    var i;
    for( i in this.vertices ) { 
	// NOTE: This is O(n^2) - can be optimized by sorting vertices
	// along the x-axis and only considering triangles that have 
	// potentially overlapping circumcircles

	var vertex = this.vertices[i];
	// Modify the array IN PLACE
	IKRS.Graph2._addVertex( vertex, 
				triangleSet  // triangles
			      );
    }

    //
    // Remove triangles that shared edges with "supertriangle"
    //
    //for( i in triangles ) {
    for( i in triangleSet.elements ) {
	var triangle = triangleSet.elements[i]; //triangles[i];
	//if( !triangle )
	//   continue;

	//if( triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
	//    triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
	//    triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2 )
	if( triangle.a == st.a || triangle.a == st.b || triangle.a == st.c ||
	    triangle.b == st.a || triangle.b == st.b || triangle.b == st.c ||
	    triangle.c == st.a || triangle.c == st.b || triangle.c == st.c ) {
	    //delete triangles[i];
	    triangleSet.removeElementAt( i );
	    
	}
    }

    return triangleSet.elements; // triangles;
	
}; // Triangulate

// Internal: update triangulation with a vertex 
IKRS.Graph2._addVertex = function( vertex, triangleSet ) {
    var edges = [];
    
    // Remove triangles with circumcircles containing the vertex
    var i;
    //for( i in triangles ) {
    for( i in triangleSet.elements ) {
	var triangle = triangleSet.elements[i]; // triangleSet.removeElementAt( i ); // triangles[i];

	//if( triangle.InCircumcircle( vertex ) ) {
	//window.alert( triangle.toString() );
	/*
	var edgeFixed = 
	    lambda_isFixedEdge(triangle.a, triangle.b) || 
	    lambda_isFixedEdge(triangle.b, triangle.c) ||
	    lambda_isFixedEdge(triangle.c, triangle.a);
	    */
	if( triangle.computeCircumCircle(EPSILON).containsPoint(vertex) ) {
	    edges.push( new IKRS.Line2( triangle.a, triangle.b ) );
	    edges.push( new IKRS.Line2( triangle.b, triangle.c ) );
	    edges.push( new IKRS.Line2( triangle.c, triangle.a ) );

	    //delete triangles[i];
	    triangleSet.removeElementAt( i );
	}
    }

    //edges = UniqueEdges( edges );
    edges = IKRS.Graph2._removeDuplicateEdgesFromArray( edges );

    // Create new triangles from the unique edges and new vertex
    for( i in edges ) {
	var edge = edges[i];

	//triangles.push( new IKRS.Triangle( edge.pointA, edge.pointB, vertex ) );
	/*
	IKRS.Graph2._addUniqueTriangle( triangles, 
					new IKRS.Triangle( edge.pointA, edge.pointB, vertex ) 
				      );
	*/
	triangleSet.addUnique( new IKRS.Triangle(edge.pointA, edge.pointB, vertex)  );
    }	
}; // END function

/*
IKRS.Graph2._addUniqueTriangle = function( triangles, t ) {

    for( var i in triangles ) {
	var tri = triangles[i];
	if( tri.equalVertices(t) ) {
	    return;
	}
    }
    triangles.push( t );
}
*/

// Internal: remove duplicate edges from an array
IKRS.Graph2._removeDuplicateEdgesFromArray = function( edges ) {
    // TODO: This is O(n^2), make it O(n) with a hash or some such
    var uniqueEdges = [];
    for( var i in edges )
    {
	var edge1 = edges[i];
	var unique = true;

	for( var j in edges )
	{
	    if( i != j )
	    {
		var edge2 = edges[j];
		/*
		if( (edge1.pointA == edge2.pointA && edge1.pointB == edge2.pointB ) ||
		    (edge1.pointA == edge2.pointB && edge1.pointB == edge2.pointA ) 
		  ) {
		*/
		//window.alert("edge1=" + edge1.toString() + ",\nedge2=" + edge2.toString() + ",\nequal=" + edge1.equalEdgePoints(edge2) );
		if( edge1.equalEdgePoints(edge2) ) {
		    unique = false;
		    break;
		}
	    }
	}
	
	if( unique ) {
	    uniqueEdges.push( edge1 );
	}
    }

    return uniqueEdges;
    
} // END function


IKRS.Graph2.prototype.constructor = IKRS.Graph2;