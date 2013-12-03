/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Girih = function() {
    
    IKRS.Object.call( this );
    
    // Add tiles
    //this.tiles = [];
    //this.tiles.push( new IKRS.Tile() );

};

IKRS.Girih.deg2rad = function( deg ) {
    return deg * (Math.PI/180.0);
}

IKRS.Girih.rad2deg = function( rad ) {
    return (rad * 180.0) / Math.PI
}


IKRS.Girih.MINIMAL_ANGLE = IKRS.Girih.deg2rad(18.0); // 18.0 * (Math.PI/180.0);


IKRS.Girih.TILE_TYPE_UNKNOWN           = -1;
IKRS.Girih.TILE_TYPE_DECAGON           = 0;
IKRS.Girih.TILE_TYPE_PENTAGON          = 1;
IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON = 2;
IKRS.Girih.TILE_TYPE_RHOMBUS           = 3;
IKRS.Girih.TILE_TYPE_BOW_TIE           = 4;


// Prepare the tile alignment matrix
IKRS.Girih.TILE_ALIGN                  = Array();

IKRS.Girih.DEFAULT_EDGE_LENGTH         = 58;

// The decagon has 10 edges
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ] = Array(10);
// Define adjacent tiles allowed on edge 0 of the decagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0] = [
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -104), 0 ),

    //new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 33, -100), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -99), 0 ),
    //new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 86, -62), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -61), 2*IKRS.Girih.MINIMAL_ANGLE ),
    //new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 86, -115), 6*IKRS.Girih.MINIMAL_ANGLE )
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -116), 6*IKRS.Girih.MINIMAL_ANGLE )    
    
    // Now the tile is rotated by 180°
];
// Note that the decagon has a 5|10-axis symmetry. All other 9 edges behave the same.
for( var i = 1; i < 10; i++ ) {
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][ i ] = [];
    for( var e = 0; e < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0].length; e++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0][e].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, i*2*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += i*2*IKRS.Girih.MINIMAL_ANGLE;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][ i ].push( tileAlign );

    }
}





IKRS.Girih.prototype.constructor = IKRS.Girih;

