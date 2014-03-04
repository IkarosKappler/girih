/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Point2 = function( x, y ) {
    
    IKRS.Object.call( this );
    
    this.x = x;
    this.y = y;

};

/**
 * Many objects that use points and have a 'translate' function instead
 * of 'add'.
 **/
/*
IKRS.Point2.prototype.translate = function( amount ) {
    return this.add( amount );
};
*/

IKRS.Point2.prototype.add = function( amount ) {
    this.x += amount.x;
    this.y += amount.y;
    return this;  // For operator concatenation
};

IKRS.Point2.prototype.addXY = function( x, y ) {
    this.x += x;
    this.y += y;
    return this;
};

IKRS.Point2.prototype.sub = function( amount ) {
    this.x -= amount.x;
    this.y -= amount.y;
    return this;  // For operator concatenation
};

IKRS.Point2.prototype.set = function( position ) {
    this.x = position.x;
    this.y = position.y;
    return this;  // For operator concatenation
};

IKRS.Point2.prototype.setXY = function( x, y ) {
    this.x = x;
    this.y = y;
};

IKRS.Point2.prototype.invert = function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
};

IKRS.Point2.prototype.getDifference = function( p ) {
    return new IKRS.Point2( p.x - this.x, p.y - this.y );
}

// Is this correct?
IKRS.Point2.prototype.dotProduct = function( point ) {
    return (this.x * point.x + this.y * point.y);
};


IKRS.Point2.prototype.inRange = function( point,
					  tolerance
					) {
    return this.distanceTo(point) <= tolerance;
};

IKRS.Point2.prototype.equals = function( point, epsilon ) {
    if( epsilon === undefined )
	epsilon = EPSILON;
    return this.distanceTo(point) <= epsilon;
};

IKRS.Point2.prototype.length = function() {
    return Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) );
};

IKRS.Point2.prototype.distanceTo = function( point ) {
    return Math.sqrt( Math.pow(this.x-point.x,2) + Math.pow(this.y-point.y,2) );
};

IKRS.Point2.prototype.multiplyScalar = function( s ) {
    this.x *= s;
    this.y *= s;
    return this;  // For operator concatenation
}

/**
 * The scaling destination must be any point and the scaling amount
 * any floating number, usually in [0 ... 1].
 *
 * Imagine a line between this and the destination point.
 * Then the returned point is located at sclaingAmount*100 per cent
 * along this line.
 **/
IKRS.Point2.prototype.scaleTowards = function( scalingDestination,
					       scalingAmount
					     ) {
    return this.computeDifference( scalingDestination ).multiplyScalar( scalingAmount ).add( this );
}

IKRS.Point2.prototype.computeDifference = function( point ) {
    return new IKRS.Point2( point.x - this.x,
			    point.y - this.y
			  );
}

/*
IKRS.Point2.prototype.setX = function( x ) {
    return this.x = x;
}

IKRS.Point2.prototype.setX = function( y ) {
    return this.y = y;
}
*/

/*
IKRS.Point2.prototype.distanceTo = function( point ) {

    return Math.sqrt( Math.pow(point.x-this.x,2) + Math.pow(point.y-this.y,2) );

}
*/

IKRS.Point2.prototype.clone = function() {
    return new IKRS.Point2( this.x, this.y );
}

IKRS.Point2.prototype.rotate = function( origin,
					 theta
				       ) {
    
    // Thanks to
    // http://stackoverflow.com/questions/786472/rotate-a-point-by-an-angle
    //  p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
    //  p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy    
    var cosT = Math.cos(theta);
    var sinT = Math.sin(theta);
    var dX   = this.x - origin.x;
    var dY   = this.y - origin.y;

    this.x = cosT * dX - sinT * dY + origin.x;
    this.y = sinT * dX + cosT * dY + origin.y;
    
    return this;  // For operator concatenation
}

IKRS.Point2.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

IKRS.Point2.prototype.constructor = IKRS.Point2;

IKRS.Point2.ZERO_POINT            = new IKRS.Point2( 0, 0 );