/**
 * @author Ikaros Kappler
 * @date 2013-12-20
 * @version 1.0.0
 **/


IKRS.TriangleSet = function( triangles ) {

    IKRS.Object.call( this );

    if( !triangles )
	triangles = [];
    
    this.triangles = triangles;
};

IKRS.TriangleSet.prototype.addUnique = function( elem ) {

    for( var i in this.triangles ) {
	//window.alert( "triangles equal=" + this.triangles[i].equalVertices(elem) + ", this=" + this.toString() + ", elem=" + elem.toString() );
	if( this.triangles[i].equalVertices(elem) ) {	   
	    return false;
	}
    }

    this.triangles.push( elem );
    return true;
};

/**
 * This function returns an object with the members
 *  - adjacencyMatrix (a two-dimensional array with Pair-entries indicating the edge IDs 0 to 2).
 *  - outerEdgeList   (a linear array with pairs (i,e), where i is the triangle index, e is the edge ID 0 to 2).
 **/
IKRS.TriangleSet.prototype.computeAdjacencies = function() {

    // A two-dimensional matrix indicating the triangle adjacency.
    // If triangles i and j are adjacent the entry [i][j] contain an Pair(a,b),
    // where a and b indicate the edge number (0=A, 1=B or 3=C).
    // If i and j are not adjacent the matrix contains null.
    var adjacencyMatrix = [];



    // First find an edge on the outer hull. An outer edge has no adjacent edge
    // from a different triangle.
    //var outerEdgePair = -1;
    var outerEdgeList   = [];

    for( var i in this.triangles ) {
    // for( var i = 0; i < this.triangles.length; i++ ) { 

	//if( !this.triangles[i] )
	//    continue;

	//if( !this.triangles[i] )
	 //   window.alert( "triangle at index " + i + " is null!" );

	adjacencyMatrix[ i ] = [];
	var adjacentEdgeA = false;
	var adjacentEdgeB = false;
	var adjacentEdgeC = false;
	var outerEdgeID           = -1;
	var adjacentTriangleCount = 0;
	for( var j in this.triangles ) {
	    //for( var j = 0; j < this.triangles.length; j++ ) {
	    
	    if( adjacencyMatrix[i][j] == undefined ) // j == 0 )
		adjacencyMatrix[i][j] = []; // 0, 1 or 2
	    
	    if( i == j )
		continue;
	    
	    var triA = this.triangles[ i ];
	    var triB = this.triangles[ j ];
	    
	    
	    // The triangulation may contain duplicates
	    if( triA.equalVertices(triB) )
		continue;
	    
	    //if( triA.hasEdge(triB.getEdgeA()) ) adjacencyMatrix[i][j] = new
	         if( triA.getEdgeA().equalEdgePoints(triB.getEdgeA()) ) adjacencyMatrix[i][j][0] = new IKRS.Pair(0,0);
	    else if( triA.getEdgeA().equalEdgePoints(triB.getEdgeB()) ) adjacencyMatrix[i][j][0] = new IKRS.Pair(0,1);
	    else if( triA.getEdgeA().equalEdgePoints(triB.getEdgeC()) ) adjacencyMatrix[i][j][0] = new IKRS.Pair(0,2);
	    else {                                                      
		outerEdgeID = 0; 
		adjacentEdgeA  = true;
	    }
	    //else                                                        outerEdgeList.push( new IKRS.Pair(i,0) );

	         if( triA.getEdgeB().equalEdgePoints(triB.getEdgeA()) ) adjacencyMatrix[i][j][1] = new IKRS.Pair(1,0);
	    else if( triA.getEdgeB().equalEdgePoints(triB.getEdgeB()) ) adjacencyMatrix[i][j][1] = new IKRS.Pair(1,1);
	    else if( triA.getEdgeB().equalEdgePoints(triB.getEdgeC()) ) adjacencyMatrix[i][j][1] = new IKRS.Pair(1,2);
	    else {
             	outerEdgeID = 1;
		adjacentEdgeB  = true;
	    }
	    //else                                                        outerEdgeList.push( new IKRS.Pair(i,1) );

	         if( triA.getEdgeC().equalEdgePoints(triB.getEdgeA()) ) adjacencyMatrix[i][j][2] = new IKRS.Pair(2,0);
	    else if( triA.getEdgeC().equalEdgePoints(triB.getEdgeB()) ) adjacencyMatrix[i][j][2] = new IKRS.Pair(2,1);
	    else if( triA.getEdgeC().equalEdgePoints(triB.getEdgeC()) ) adjacencyMatrix[i][j][2] = new IKRS.Pair(2,2);
	    else {
                outerEdgeID = 2;
		adjacentEdgeC  = true;
	    }
	    //else                                                        outerEdgeList.push( new IKRS.Pair(i,2) );
	
								      
	    
	} // END for [j]
	
	// window.alert( "Triangle " + i + " has " );

	if( !adjacentEdgeA )
	    outerEdgeList.push( new IKRS.Pair(i, 0) );
	if( !adjacentEdgeA )
	    outerEdgeList.push( new IKRS.Pair(i, 1) );
	if( !adjacentEdgeC ) 
	    outerEdgeList.push( new IKRS.Pair(i, 2) );
	
	if( !adjacentEdgeA && !adjacentEdgeB && !adjacentEdgeC )
	    ; //window.alert( "Triangle " + i + " has no adjacent edges." );
    } // END for [i]
	
	// If the ... Outer edge found?
    //if( adjacentTriangleCount == 0 ) 
    //	window.alert( "Triangle " + i + " has " + adjacentTriangleCount + " adjacent triangles." );
 


    return { adjacencyMatrix: adjacencyMatrix,
	     outerEdgeList:   outerEdgeList
	   };

};


IKRS.TriangleSet.prototype.toString = function() {
    return "[TriangleSet]={ " + JSON.stringify( this.triangles ) + " }";
};

IKRS.TriangleSet.prototype.constructor = IKRS.TriangleSet;