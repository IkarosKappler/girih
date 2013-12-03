/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @version 1.0.0
 **/


IKRS.Tile.Rhombus = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_RHOMBUS  );
    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   108.0
		   // 72.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

    }

    
    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0 - (bounds.getWidth()-size), 
				  bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( move );
		
    }


    this.imageProperties = {
	source: { x:      32,
		  y:      188,
		  width:  127, // 127,
		  height: 92
		},
	destination: { xOffset: 0,
		       yOffset: 0
		     }
    };
    
};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Rhombus.prototype.computeBounds       = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Rhombus.prototype._addVertex          = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Rhombus.prototype._getTranslatedPoint = IKRS.Tile.prototype._getTranslatedPoint;
IKRS.Tile.Rhombus.prototype.containsPoint       = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Rhombus.prototype.locateEdgeAtPoint   = IKRS.Tile.prototype.locateEdgeAtPoint;

IKRS.Tile.Rhombus.prototype.constructor         = IKRS.Tile.Rhombus;

