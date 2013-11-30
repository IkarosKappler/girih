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

IKRS.Point2.prototype.add = function( amount ) {
    this.x += amount.x;
    this.y += amount.y;
    return this;  // For operator concatenation
}


IKRS.Point2.prototype.sub = function( amount ) {
    this.x -= amount.x;
    this.y -= amount.y;
    return this;  // For operator concatenation
}

IKRS.Point2.prototype.set = function( position ) {
    this.x = position.x;
    this.y = position.y;
    return this;  // For operator concatenation
}

/*
IKRS.Point2.prototype.setX = function( x ) {
    return this.x = x;
}

IKRS.Point2.prototype.setX = function( y ) {
    return this.y = y;
}
*/

IKRS.Point2.prototype.distanceTo = function( point ) {

    return Math.sqrt( Math.pow(point.x-this.x,2) + Math.pow(point.y-this.y,2) );

}

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