
/**
 * @author Ikaros Kappler
 * @date 2013-08-22
 * @version 1.0.0
 **/

IKRS.BoundingBox2 = function( _xMin,
			      _xMax,
			      _yMin,
			      _yMax ) {
    
    IKRS.Object.call( this );
    
    this.xMin = _xMin;
    this.xMax = _xMax;
    this.yMin = _yMin;
    this.yMax = _yMax;
}

IKRS.BoundingBox2.prototype = new IKRS.Object();
IKRS.BoundingBox2.prototype.constructor = IKRS.BoundingBox2;

IKRS.BoundingBox2.prototype.toString = function() {
    return "IKRS.BoundingBox2={ xMin: " + this.xMin + ", xMax: " + this.xMax + ", yMin: " + this.yMin + ", yMax: " + this.yMax + ", width: " + this.getWidth() + ", height: " + this.getHeight() + " }";
}


IKRS.BoundingBox2.prototype.getXMax = function() {
    return this.xMax;
}

IKRS.BoundingBox2.prototype.getXMin = function() {
    return this.xMin;
}

IKRS.BoundingBox2.prototype.getYMax = function() {
    return this.yMax;
}

IKRS.BoundingBox2.prototype.getYMin = function() {
    return this.yMin;
}

IKRS.BoundingBox2.prototype.getWidth = function() {
    return this.xMax - this.xMin;
}

IKRS.BoundingBox2.prototype.getHeight = function() {
    return this.yMax - this.yMin;
}

IKRS.BoundingBox2.prototype.getLeftUpperPoint = function() {
    return new IKRS.Point2( this.xMin, this.yMin );
}

IKRS.BoundingBox2.prototype.getRightUpperPoint = function() {
    return new IKRS.Point2( this.xMax, this.yMin );
}

IKRS.BoundingBox2.prototype.getRightLowerPoint = function() {
    return new IKRS.Point2( this.xMax, this.yMax );
}

IKRS.BoundingBox2.prototype.getLeftLowerPoint = function() {
    return new IKRS.Point2( this.xMin, this.yMax );
}

IKRS.BoundingBox2.prototype.getCenterPoint = function() {
    return new IKRS.Point2( this.xMin + this.getWidth()/2.0,
			    this.yMin + this.getHeight()/2.0
			  );
}

IKRS.BoundingBox2.prototype.computeDiagonalLength = function() {
    return this.getLeftUpperPoint().distanceTo( this.getRightLowerPoint() );
}

IKRS.BoundingBox2.prototype.computeBoundingTriangle = function() {

    // Aim: construct a triangle that conains this box in an acceptable
    //      way.
    // 'Acceptable' means, the whole box MUST be contained, the
    // triangle might be larger, but it should _not_ be too large!

    // Idea: first compute the diagonal of this box; it gives us an impression
    //       of the average size.
    var diagonal    = this.computeDiagonalLength();
    
    // Use the bottom line of the box, but make it diagonal*2 long.
    var centerPoint = this.getCenterPoint();
    var leftPoint   = new IKRS.Point2( centerPoint.x - diagonal,
				       this.yMax 
				     );
    var rightPoint  = new IKRS.Point2( centerPoint.x + diagonal,
				       this.yMax
				     );

    // Now make two linear interpolation lines from these points (they are left
    // and right outside of the box) to the upper both left respecive right
    // box points.
    var leftLine    = new IKRS.Line2( leftPoint,  this.getLeftUpperPoint() );
    var rightLine   = new IKRS.Line2( rightPoint, this.getRightUpperPoint() );
    

    // Where these lines meet is the top point of the triangle ;)
    
    return new IKRS.Triangle( leftPoint,
			      leftLine.computeLineIntersection( rightLine ),  // the top point
			      rightPoint
			    );
}

/**
 * This function computes the 'super-boundingbox' of this box
 * and the passed box.
 **/
IKRS.BoundingBox2.prototype.computeUnion = function( bounds ) {
    return new IKRS.BoundingBox2( Math.min(this.xMin,bounds.xMin),
				  Math.max(this.xMax,bounds.xMax),
				  Math.min(this.yMin,bounds.yMin),
				  Math.max(this.yMax,bounds.yMax)
				  );
}

IKRS.BoundingBox2.prototype._toString = function() {
    return "[IKRS.BoundingBox2]={ xMin=" + this.xMin + ", xMax=" + this.xMax + ", yMin=" + this.yMin + ", yMax=" + this.yMax + ", width=" + this.getWidth() + ", height=" + this.getHeight() + " }";
}


// A static function
IKRS.BoundingBox2.computeFromPoints = function( points ) {

    if( !points )
	points = [];
    
    if( points.length == 0 )
	return new IKRS.BoundingBox2( 0, 0, 0, 0 );

    var xMin = points[0].x;
    var xMax = points[0].x;
    var yMin = points[0].y;
    var yMax = points[0].y;
    
    for( var i = 1; i < points.length; i++ ) {

	var point = points[ i ];
	xMin = Math.min( xMin, point.x );
	xMax = Math.max( xMax, point.x );
	yMin = Math.min( yMin, point.y );
	yMax = Math.max( yMax, point.y );

    }

    return new IKRS.BoundingBox2( xMin, xMax, yMin, yMax );

}





//IKRS.BoundingBox2.prototype = new IKRS.Object();
//IKRS.BoundingBox2.prototype.constructor = IKRS.BoundingBox2;
