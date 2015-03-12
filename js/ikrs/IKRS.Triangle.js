/**
 * Some algorithms require triangles.
 *
 *
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

IKRS.Triangle = function( a, b, c ) {

    IKRS.Object.call( this );

    this.a = a;
    this.b = b;
    this.c = c;

}

/**
 * This function scales the triangle by the given scalar number.
 **/  
IKRS.Triangle.prototype.multiplyScalar = function( s ) {
    this.a.multiplyScalar( s );
    this.b.multiplyScalar( s );
    this.c.multiplyScalar( s );
    return this;  // Allow operator concatenation
}

/**
 * This function translates the triangle by the given (amount.x, amount.y).
 **/  
IKRS.Triangle.prototype.translate = function( amount ) {
    this.a.add( amount );
    this.b.add( amount );
    this.c.add( amount );
    return this;  // Allow operator concatenation
}

IKRS.Triangle.prototype.hasVertex = function( vertex ) {
    return ( ( this.a == vertex || this.b == vertex || this.c == vertex ) );
	     //||
	     // include value equality (epsilon=0?)
	     //( this.a.equals(vertex,0) || this.b.equals(vertex,0) || this.c.equals(vertex,0) 
	     //) );
};

IKRS.Triangle.prototype.equalVertices = function( triangle ) {
    /*
    return ( triangle.a == this.a || triangle.a == this.b || triangle.a == this.c ||
	     triangle.b == this.a || triangle.b == this.b || triangle.b == this.c ||
	     triangle.c == this.a || triangle.c == this.b || triangle.c == this.c );
    */

    /*var edgeA = triangle.getEdgeA();
    var edgeB = triangle.getEdgeB();
    var edgeC = triangle.getEdgeC();
    */

    return ( this.hasVertex(triangle.a) && this.hasVertex(triangle.b) && this.hasVertex(triangle.c) );
};

/*
IKRS.Triangle.prototype.hasEdge = function( edge ) {
    return (this.hasVertex(edge.pointA) && this.hasVertex(edge.pointB));
};
*/

IKRS.Triangle.prototype.computeBoundingBox = function() {
    //window.alert( "a=" + this.a + ", b=" + this.b + ", c=" + this.c );
    return IKRS.BoundingBox2.computeFromPoints( [ this.a, this.b, this.c ] );
};

IKRS.Triangle.prototype.getCentroid = function() {
    
    // The centroid is the point where the three medians (the lines 
    // connecting the edges' middle point with the opposite vertices)
    // intersect.
    
    return new IKRS.Point2( (this.a.x + this.b.x + this.c.x) / 3,
			    (this.a.y + this.b.y + this.c.y) / 3
			  );
}

IKRS.Triangle.prototype.computeCircumCircle = function( epsilon ) {
    
    if( typeof epsilon == "undefined" )
	epsilon = EPSILON; // 0.000001; // 1.0;

    // From: http://www.exaflop.org/docs/cgafaq/cga1.html

    var A = this.b.x - this.a.x; 
    var B = this.b.y - this.a.y; 
    var C = this.c.x - this.a.x; 
    var D = this.c.y - this.a.y; 

    var E = A*(this.a.x + this.b.x) + B*(this.a.y + this.b.y); 
    var F = C*(this.a.x + this.c.x) + D*(this.a.y + this.c.y); 

    var G = 2.0*(A*(this.c.y - this.b.y)-B*(this.c.x - this.b.x)); 
    
    var center;
    var dx, dy;
    
    if( Math.abs(G) < epsilon ) {
	// Collinear - find extremes and use the midpoint

	function max3( a, b, c ) { return ( a >= b && a >= c ) ? a : ( b >= a && b >= c ) ? b : c; }
	function min3( a, b, c ) { return ( a <= b && a <= c ) ? a : ( b <= a && b <= c ) ? b : c; }

	var minx = min3( this.a.x, this.b.x, this.c.x );
	var miny = min3( this.a.y, this.b.y, this.c.y );
	var maxx = max3( this.a.x, this.b.x, this.c.x );
	var maxy = max3( this.a.y, this.b.y, this.c.y );

	center = new IKRS.Point2( ( minx + maxx ) / 2, ( miny + maxy ) / 2 );

	dx = center.x - minx;
	dy = center.y - miny;
    } else {
	var cx = (D*E - B*F) / G; 
	var cy = (A*F - C*E) / G;

	center = new IKRS.Point2( cx, cy );

	dx = center.x - this.a.x;
	dy = center.y - this.a.y;
    }

    //this.radius_squared = dx * dx + dy * dy;
    //this.radius = Math.sqrt( this.radius_squared );

    return new IKRS.Circle( center, Math.sqrt( dx*dx + dy*dy ) );
};

IKRS.Triangle.prototype.computeTriangleIntersectionPoints = function( triangle,
								      result,     // ArraySet (optional)
								      pointComparator // optional
								    ) {
    //var result = [];
    if( !result || typeof result == "undefined" )
	result = new IKRS.ArraySet();
	
    var edgeA_A = this.getEdgeA();
    var edgeA_B = this.getEdgeB();
    var edgeA_C = this.getEdgeC();

    var edgeB_A = triangle.getEdgeA();
    var edgeB_B = triangle.getEdgeB();
    var edgeB_C = triangle.getEdgeC();
   
    
    if( !edgeA_A.equalEdgePoints(edgeB_A) && !edgeA_A.isColinearWith(edgeB_A,EPSILON) && (intersectionPoint=edgeA_A.computeEdgeIntersection(edgeB_A)) )
	result.addUnique( intersectionPoint, pointComparator ); 
    if( !edgeA_A.equalEdgePoints(edgeB_B) && !edgeA_A.isColinearWith(edgeB_B,EPSILON) && (intersectionPoint=edgeA_A.computeEdgeIntersection(edgeB_B)) )
	result.addUnique( intersectionPoint, pointComparator );
    if( !edgeA_A.equalEdgePoints(edgeB_C) && !edgeA_A.isColinearWith(edgeB_C,EPSILON) && (intersectionPoint=edgeA_A.computeEdgeIntersection(edgeB_C)) )
	result.addUnique( intersectionPoint, pointComparator );

    if( !edgeA_B.equalEdgePoints(edgeB_A) && !edgeA_B.isColinearWith(edgeB_A,EPSILON) && (intersectionPoint=edgeA_B.computeEdgeIntersection(edgeB_A)) )
	result.addUnique( intersectionPoint, pointComparator ); 
    if( !edgeA_B.equalEdgePoints(edgeB_B) && !edgeA_B.isColinearWith(edgeB_B,EPSILON) && (intersectionPoint=edgeA_B.computeEdgeIntersection(edgeB_B)) )
	result.addUnique( intersectionPoint, pointComparator );
    if( !edgeA_B.equalEdgePoints(edgeB_C) && !edgeA_B.isColinearWith(edgeB_C,EPSILON) && (intersectionPoint=edgeA_B.computeEdgeIntersection(edgeB_C)) )
	result.addUnique( intersectionPoint, pointComparator );

    if( !edgeA_C.equalEdgePoints(edgeB_A) && !edgeA_C.isColinearWith(edgeB_A,EPSILON) && (intersectionPoint=edgeA_C.computeEdgeIntersection(edgeB_A)) )
	result.addUnique( intersectionPoint, pointComparator ); 
    if( !edgeA_C.equalEdgePoints(edgeB_B) && !edgeA_C.isColinearWith(edgeB_B,EPSILON) && (intersectionPoint=edgeA_C.computeEdgeIntersection(edgeB_B)) )
	result.addUnique( intersectionPoint, pointComparator );
    if( !edgeA_C.equalEdgePoints(edgeB_C) && !edgeA_C.isColinearWith(edgeB_C,EPSILON) && (intersectionPoint=edgeA_C.computeEdgeIntersection(edgeB_C)) )
	result.addUnique( intersectionPoint, pointComparator );
		
    
    return result;
};

IKRS.Triangle.prototype.getPointA = function() {
    return this.a;
};

IKRS.Triangle.prototype.getPointB = function() {
    return this.b;
};

IKRS.Triangle.prototype.getPointC = function() {
    return this.c;
};

IKRS.Triangle.prototype.getEdgeA = function() {
    return new IKRS.Line2( this.a, this.b );
};

IKRS.Triangle.prototype.getEdgeB = function() {
    return new IKRS.Line2( this.b, this.c );
};

IKRS.Triangle.prototype.getEdgeC = function() {
    return new IKRS.Line2( this.c, this.a );
};

IKRS.Triangle.prototype.toString = function() {
    return "[IKRS.Triangle]={ a=" + this.a.toString() + ", b=" + this.b.toString() + ", c=" + this.c.toString() + " }";
}

IKRS.Triangle.permutationComparator = {
    equal: function( tA, tB ) {
	// return (tA.hasVertex(tB.a) && tA.hasVertex(tB.b) && tA.hasVertex(tB.c));
	return (tA == tB || tA.equalVertices(tB));
    }    
};

IKRS.Triangle.prototype.constructor = IKRS.Triangle;
