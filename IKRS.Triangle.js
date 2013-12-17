/**
 * Some algorithms require triangles.
 *
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

IKRS.Triangle = function( a, b, c ) {

    IKRS.Object.call( this );

    this.a = a;
    this.b = b;
    this.c = c;

}

IKRS.Triangle.prototype.computeCircumCircle = function( epsilon ) {
    
    if( typeof epsilon == "undefined" )
	epsilon = 1.0;

    // From: http://www.exaflop.org/docs/cgafaq/cga1.html

    var A = this.b.x - this.a.x; 
    var B = this.b.y - this.a.y; 
    var C = this.c.x - this.a.x; 
    var D = this.c.y - this.a.y; 

    var E = A*(this.a.x + this.b.x) + B*(this.a.y + this.b.y); 
    var F = C*(this.a.x + this.c.x) + D*(this.a.y + this.c.y); 

    var G = 2.0*(A*(this.c.y - this.b.y)-B*(this.c.x - this.b.x)); 
    
    var center;
    var dx, dy;
    
    if( Math.abs(G) < epsilon ) {
	// Collinear - find extremes and use the midpoint

	function max3( a, b, c ) { return ( a >= b && a >= c ) ? a : ( b >= a && b >= c ) ? b : c; }
	function min3( a, b, c ) { return ( a <= b && a <= c ) ? a : ( b <= a && b <= c ) ? b : c; }

	var minx = min3( this.a.x, this.b.x, this.c.x );
	var miny = min3( this.a.y, this.b.y, this.c.y );
	var maxx = max3( this.a.x, this.b.x, this.c.x );
	var maxy = max3( this.a.y, this.b.y, this.c.y );

	center = new IKRS.Point2( ( minx + maxx ) / 2, ( miny + maxy ) / 2 );

	dx = center.x - minx;
	dy = center.y - miny;
    } else {
	var cx = (D*E - B*F) / G; 
	var cy = (A*F - C*E) / G;

	center = new IKRS.Point2( cx, cy );

	dx = center.x - this.a.x;
	dy = center.y - this.a.y;
    }

    //this.radius_squared = dx * dx + dy * dy;
    //this.radius = Math.sqrt( this.radius_squared );

    return new IKRS.Circle( center, Math.sqrt( dx*dx + dy*dy ) );
}


IKRS.Triangle.prototype.constructor = IKRS.Triangle;
