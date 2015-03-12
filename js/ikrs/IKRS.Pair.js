/**
 * A pair is just a tuple with two anonymous elements a and b.
 *
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

IKRS.Pair = function( a, b ) {

    this.a = a;
    this.b = b;

}


IKRS.Pair.prototype.clone = function() {
    return new IKRS.Pair( this.a, this.b );
}
