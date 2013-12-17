/**
 * Some algorithms require the edge datatype.
 *
 * An edge is a pair of two points.
 *
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

IKRS.Edge = function( a , b ) {

    IKRS.Object.call( this );
    
    this.a = a;
    this.b = b;

}

