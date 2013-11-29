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

IKRS.Girih.deg2rad = function( deg ) {
    return deg * (Math.PI/180.0);
}

IKRS.Girih.rad2deg = function( rad ) {
    return (rad * 180.0) / Math.PI
}


IKRS.Girih.MINIMAL_ANGLE = IKRS.Girih.deg2rad(18.0); // 18.0 * (Math.PI/180.0);



IKRS.Girih.prototype.constructor = IKRS.Girih;

