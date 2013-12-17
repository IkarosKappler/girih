/**
 * There are times you need to compute the intersection of two lines.
 * I didn't want to do that with point lists, so here is the line class.
 *
 * Thanks to
 *  http://stackoverflow.com/questions/4543506/algorithm-for-intersection-of-2-lines
 *  and
 *  http://community.topcoder.com/tc?module=Static&d1=tutorials&d2=geometry2#line_line_intersection
 *
 *
 * @author Ikaros Kappler
 * @date 2013-12-13
 * @version 1.0.0
 **/

IKRS.Line2 = function( pointA,
		       pointB
		     ) {

    IKRS.Object.call( this );

    this.pointA = pointA;
    this.pointB = pointB;
}

IKRS.Line2.prototype.determinant = function() {
    //return this.pointA.x * this.pointB.y - this.pointA.y * this.pointB.x;
    return IKRS.Line2.determinant( this.pointA, this.pointB );
}

/**
 * This function computes the intersection of two edges (not lines).
 *
 * Edges have a limited length, so if an intersection exists, it is
 * located within the bounding box of both edges.
 *
 * Note that the line(!)-intersection may be located outside the
 * bounding boxes.
 *
 * If the edges intersected, this function returns the intersection point,
 * otherwise null.
 **/
IKRS.Line2.prototype.computeEdgeIntersection = function( edge ) {

    var det = IKRS.Line2.determinant( this.pointB.clone().sub( this.pointA ),
				      edge.pointA.clone().sub( edge.pointB )
				    );
    var t   = IKRS.Line2.determinant( edge.pointA.clone().sub( this.pointA ),
				      edge.pointA.clone().sub( edge.pointB )
				    ) / det;
    var u   = IKRS.Line2.determinant( this.pointB.clone().sub( this.pointA ),
				      edge.pointA.clone().sub( this.pointA )
				    ) / det;
    
    if( t < 0 || u < 0 || t > 1 || u > 1 ) {
	// No intersection inside the edge lengths
	return null;
    } else {
	//return a * (1 - t) + t * b;
	return this.pointA.clone().multiplyScalar( 1-t ).add( this.pointB.clone().multiplyScalar( t ) );
    }

// http://content.gpwiki.org/index.php/Polygon_Collision
/*
//one edge is a-b, the other is c-d
 Vector2D edgeIntersection(Vector2D a, Vector2D b, Vector2D c, Vector2D d){
     double det = determinant(b - a, c - d);
     double t   = determinant(c - a, c - d) / det;
     double u   = determinant(b - a, c - a) / det;
     if ((t < 0) || (u < 0) || (t > 1) || (u > 1)) {
         return NO_INTERSECTION;
     } else {
         return a * (1 - t) + t * b;
     }
 }
*/
}

IKRS.Line2.prototype.computeLineIntersection = function( line ) {
    
    /*
    var A = y2-y1
    B = x1-x2
    C = A*x1+B*y1
    Regardless of how the lines are specified, you should be able to generate two different points along the line, and then generate A, B and C. Now, lets say that you have lines, given by the equations:
    A1x + B1y = C1
    A2x + B2y = C2
    To find the point at which the two lines intersect, we simply need to solve the two equations for the two unknowns, x and y.

    double det = A1*B2 - A2*B1
    if(det == 0){
        //Lines are parallel
    }else{
        double x = (B2*C1 - B1*C2)/det
        double y = (A1*C2 - A2*C1)/det
    }
    */


    /*
    var a1 = this.pointB.y - this.pointA.y;
    var b1 = this.pointB.x - this.pointA.x;
    var c1 = a1 * this.pointA.x + b1 * this.pointA.y;

    var a2 = line.pointB.y - line.pointA.y;
    var b2 = line.pointB.x - line.pointA.x;
    var c2 = a2 * line.pointA.x + b2 * line.pointA.y;
    */
    var a1 = this.pointB.y - this.pointA.y;
    var b1 = this.pointA.x - this.pointB.x;
    var c1 = a1 * this.pointA.x + b1 * this.pointA.y;

    var a2 = line.pointB.y - line.pointA.y;
    var b2 = line.pointA.x - line.pointB.x;
    var c2 = a2 * line.pointA.x + b2 * line.pointA.y;

    
    var det = a1*b2 - a2*b1;
    // Parellel lines?
    if( det == 0 )
	return null;
    
    return new IKRS.Point2( (b2*c1 - b1*c2)/det,
			    (a1*c2 - a2*c1)/det
			  );
    

    /*
    float delta = A1*B2 - A2*B1;
    if(delta == 0) 
	throw new ArgumentException("Lines are parallel");

    float x = (B2*C1 - B1*C2)/delta;
    float y = (A1*C2 - A2*C1)/delta;
    */
}

IKRS.Line2.prototype.constructor = IKRS.Line2;

/*
 public static Vector3 Intersect(Vector3 line1V1, Vector3 line1V2, Vector3 line2V1, Vector3 line2V2)
    {
        //Line1
        float A1 = line1V2.Y - line1V1.Y;
        float B1 = line1V2.X - line1V1.X;
        float C1 = A1*line1V1.X + B1*line1V1.Y;

        //Line2
        float A2 = line2V2.Y - line2V1.Y;
        float B2 = line2V2.X - line2V1.X;
        float C2 = A2 * line2V1.X + B2 * line2V1.Y;

        float det = A1*B2 - A2*B1;
        if (det == 0)
        {
            return null;//parallel lines
        }
        else
        {
            float x = (B2*C1 - B1*C2)/det;
            float y = (A1 * C2 - A2 * C1) / det;
            return new Vector3(x,y,0);
        }
    }*/


IKRS.Line2.determinant = function( pointA, pointB ) {
    return pointA.x * pointB.y - pointA.y * pointB.x;
}
