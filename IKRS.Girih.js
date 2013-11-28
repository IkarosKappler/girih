/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Girih = function() {
    
    IKRS.Object.call( this );
    
    // Add tiles
    this.tiles = [];
    this.tiles.push( new IKRS.Tile() );

};

IKRS.Girih.MINIMAL_ANGLE = 18.0 * (Math.PI/180.0);

IKRS.Girih.prototype.constructor = IKRS.Girih;

