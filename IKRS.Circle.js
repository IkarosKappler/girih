/**
 * Some mathematical/geometrical functions use circle algorighms, so I decided
 * to implement a general circle class.
 *
 * @author Ikaros Kappler
 * @date 2013-12-10
 * @version 1.0.0
 **/


IKRS.Circle = function( center,  // (x,y)
			radius   // float
		      ) {
    
    IKRS.Object.call( this );
    
    this.center = center;
    this.radius = radius;
}

IKRS.Circle.prototype.computeIntersectionPoints = function( circle ) {

    return IKRS.Circle.computeIntersectionPoints( this, circle );

}

IKRS.Circle.prototype.containsPoint = function( point ) {
    return this.center.distanceTo( point ) <= this.radius;
}

IKRS.Circle.computeIntersectionPoints = function( A, B ) {

    // Circles intersect at all?
    var distance = A.center.distanceTo( B.center );
    if( distance > A.radius+B.radius || A.radius+distance < B.radius || B.radius+distance < A.radius )
	return null;

    // Thanks to
    // http://2000clicks.com/mathhelp/GeometryConicSectionCircleIntersection.aspx

    // The distance between the two circle centers
    var d      = A.center.distanceTo( B.center );

    // The area size of the inner triangle ABE
    var K      = 0.25 * Math.sqrt( ( Math.pow(A.radius + B.radius, 2) - Math.pow(d,2) ) * 
				   (Math.pow(d,2) - Math.pow( A.radius - B.radius, 2 ) ) 
				 );
    
    var x_partA = 0.5 * (B.center.x + A.center.x) + 
	0.5 * (B.center.x - A.center.x) * (Math.pow(A.radius,2) - Math.pow(B.radius,2)) / Math.pow(d,2);
    var x_partB = 2 * (B.center.y - A.center.y) * K / Math.pow(d,2);

    var y_partA = 0.5 * (B.center.y + A.center.y) + 
	0.5 * (B.center.y - A.center.y) * (Math.pow(A.radius,2) - Math.pow(B.radius,2)) / Math.pow(d,2);
    var y_partB = -2 * (B.center.x - A.center.x) * K / Math.pow(d,2);
	
    var x1 = x_partA + x_partB;
    var x2 = x_partA - x_partB;
    var y1 = y_partA + y_partB;
    var y2 = y_partA - y_partB;

    var pointA = new IKRS.Point2( x1, y1 );
    var pointB = new IKRS.Point2( x2, y2 ); 

    return { pointA: pointA,
	     pointB: pointB
	   };
}

IKRS.Circle.prototype.toString = function() {
    return "[IKRS.Circle]={ center=" + (this.center ? this.center.toString() : "null" ) + ", radius=" + this.radius + "}";
}

IKRS.Circle.prototype.constructor = IKRS.Circle;
