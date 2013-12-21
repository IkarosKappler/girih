/**
 * This is a simple Set implementation that uses an array as storage.
 *
 * Additionally it uses a comparator function that makes it configurable
 * for the Itentity operator.
 *
 * Note that the passed array (if not null) will _not_ be copied. This
 * allows In-Place operations for better runtime/peformance.
 *
 *
 * The comparator (if not null) must have and 'equal' function with two 
 * parameters, returning a boolean value indicating the parameters 
 * identity.
 * If null is passed the default '==' identity will be used.
 *
 * @author Ikaros Kappler
 * @date 2013-12-19
 * @version 1.0.0
 **/


IKRS.ArraySet = function( elements,
			  comparator
			) {

    IKRS.Object.call( this );

    if( elements == undefined )
	elements = [];
    if( comparator == undefined )
	comparator = { equal: function( a, b ) { return a==b; } };


    this.elements   = elements;
    this.comparator = comparator;
};


IKRS.ArraySet.prototype.add = function( e ) {
    this.elements.push( e );
};

IKRS.ArraySet.prototype.addUnique = function( e ) {
    for( var i in this.elements ) {
	if( this.comparator.equal(e, this.elements[i]) )
	    return;
    }
    this.elements.push( e );
};

IKRS.ArraySet.prototype.removeElementAt = function( index ) {
    delete this.elements[ index ];
};

/*
IKRS.ArraySet.prototype.buildCleanupArray = function() {

    var result = [];
    for( var

};
*/

/**
 * Locate the index of the passed element. If the element
 * cannot be found then -1 is returned.
 *
 * Note that if there are multiple copies if the passed
 * element inside this set then a random index of the
 * matching items is returned (not necesarily the first).
 **/
IKRS.ArraySet.prototype.indexOf = function( e ) {
    for( var i in this.elements ) {
	if( this.comparator.equal(e, this.elements[i]) )
	    return i;
    }
    return -1;
};


IKRS.ArraySet.prototype.constructor = IKRS.ArraySet;