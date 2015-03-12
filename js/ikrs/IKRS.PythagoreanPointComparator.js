/**
 * @date 2014-01-17
 **/


IKRS.PythagoreanPointComparator = function( EPSILON ) {

    IKRS.Object.call( this );
    
    this.epsilon = EPSILON;

};

IKRS.PythagoreanPointComparator.prototype.equal = function( a, b ) {

    return this.compare(a,b) <= this.epsilon;

};

IKRS.PythagoreanPointComparator.prototype.compare = function( a, b ) {

    return a.distanceTo(b);

};

