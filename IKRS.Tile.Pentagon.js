/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile.Pentagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle );
    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    //var theta = Math.PI*2 * (90.0 / 108.0);
    var theta = (Math.PI*2) / 5;
    for( var i = 1; i <= 4; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
    }


    // Move to center    
    // Calculate the diameter of the bounding circle
    var r_out  = (size/10) * Math.sqrt( 50 + 10*Math.sqrt(5) );
    // Calculate the diameter of the inner circle
    var r_in   = (size/10) * Math.sqrt( 25 + 10*Math.sqrt(5) );
    var move   = new IKRS.Point2( size/2.0, 
				  -r_out + (r_out-r_in)
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( move );
		
    }

    this.imageProperties = {
	x:      7,
	y:      303,
	width:  156,
	height: 150
    };

};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Pentagon.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Pentagon.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Pentagon.prototype._getTranslatedPoint = IKRS.Tile.prototype._getTranslatedPoint;
IKRS.Tile.Pentagon.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Pentagon.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;

IKRS.Tile.Pentagon.prototype.constructor         = IKRS.Tile.Pentagon;

