/**
 * The LineOrderedPointSet is an ordered set of points.
 *
 * Imagine a given line with the endpoints A and B. The inserted
 * points are then order along the line (A,B), where A is the lower
 * bound and B is the upper bound.
 * 
 * The first point from the set is the one that is closest to A, the 
 * last point is the one that is closest to B. All other points are 
 * located in-between.
 *
 * Note that the points are not required to be located on the line.
 * The only ordering criteria is the distance to A and to B:
 *   prio(point) := point.distanceTo(B) - point.distanceTo(A)
 *
 *
 * @author Ikaros Kappler
 * @date 2013-12-20
 * @version 1.0.0
 **/


IKRS.LineOrderedPointSet2 = function( line ) {

    IKRS.Object.call( this );

    this.line     = line;

    this.elements = [];
    this.prios    = [];

};

IKRS.LineOrderedPointSet2.prototype.add = function( point ) {

    // Calculate the prio
    var prio  = point.distanceTo(this.line.pointA) - point.distanceTo(this.line.pointA);

    // Locate the prio index
    var index = this._locatePrioIndex( prio );

    // Insert the point at the computed position
    this.elements.splice( index,  // The insert-index
			  0,      // Overwrite 0 elements (none)
			  point   // The point to be inserted
			);
    // Also store the point's prio (at the same index );
    this.prios.splice( index,
		       0,
		       prio 
		     );
    // Return the insert-index to caller
    return index;
};

IKRS.LineOrderedPointSet2.prototype._locatePrioIndex = function( prio ) {

    for( var i = 0; i < this.prios.length; i++ ) {
	if( prio <= this.prios[i] )
	    return i;
    }

    return this.prios.length; // Insert index at the end
};