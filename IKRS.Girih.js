/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Girih = function() {
    
    IKRS.Object.call( this );
    
    // Add tiles
    this.tiles = [];
    //this.tiles.push( new IKRS.Tile() );

};

IKRS.Girih.prototype.addTile = function( tile ) {
    this.tiles.push( tile );
}

//IKRS.Girih.protoype.x = function() {
//    
//}

IKRS.Girih.deg2rad = function( deg ) {
    return deg * (Math.PI/180.0);
}

IKRS.Girih.rad2deg = function( rad ) {
    return (rad * 180.0) / Math.PI
}


IKRS.Girih.MINIMAL_ANGLE = IKRS.Girih.deg2rad(18.0); // 18.0 * (Math.PI/180.0);


IKRS.Girih.TILE_TYPE_UNKNOWN            = -1;
IKRS.Girih.TILE_TYPE_DECAGON            = 0;
IKRS.Girih.TILE_TYPE_PENTAGON           = 1;
IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON  = 2;
IKRS.Girih.TILE_TYPE_RHOMBUS            = 3;
IKRS.Girih.TILE_TYPE_BOW_TIE            = 4;

/*
IKRS.Girih.EDGE_COUNT_DECAGON           = 10;
IKRS.Girih.EDGE_COUNT_PENTAGON          = 5;
IKRS.Girih.EDGE_COUNT_IRREGULAR_HEXAGON = 6;
IKRS.Girih.EDGE_COUNT_RHOMBUS           = 4;
IKRS.Girih.EDGE_COUNT_BOW_TIE           = 6;

IKRS.Girih.EDGE_COUNT = [
    IKRS.Girih.EDGE_COUNT_DECAGON,
    IKRS.Girih.EDGE_COUNT_PENTAGON, 
    IKRS.Girih.EDGE_COUNT_IRREGULAR_HEXAGON,
    IKRS.Girih.EDGE_COUNT_RHOMBUS, 
    IKRS.Girih.EDGE_COUNT_BOW_TIE
];
*/


// Prepare the tile alignment matrix:
// [ actual_tile ] x [ edge_index ] x [ successor_index ] = tile_align
IKRS.Girih.TILE_ALIGN                  = Array();

IKRS.Girih.DEFAULT_EDGE_LENGTH         = 58;

// The decagon has 10 edges
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ] = Array(10);
// Define adjacent tiles allowed on edge 0 of the decagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0] = [    
    // The decagon has only one possible alignment on the edge (10 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, -144), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -104), 0 ),   
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, -89), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 71, -99), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52, -127), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -89), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 61, -99), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -99), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -61), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -116), 6*IKRS.Girih.MINIMAL_ANGLE )        
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



IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ] = Array(5);
// Define adjacent tiles allowed on edge 0 of the pentagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 122, -39.5), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -24), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 88.5, 4.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 70, -22.5), 6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 70, -56), 8*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 66.5, -12.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 61, -29), 8*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 38, -45.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 57.5, 15), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 89.5, -28.5), 8*IKRS.Girih.MINIMAL_ANGLE )
];
// Note that the pentagon has a 5-axis symmetry. All other 4 edges behave the same.
for( var i = 1; i < 5; i++ ) {
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][ i ] = [];
    for( var e = 0; e < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][0].length; e++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][0][e].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, i*4*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += i*4*IKRS.Girih.MINIMAL_ANGLE;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][ i ].push( tileAlign );

    }
}


IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ] = Array(6);
// Define adjacent tiles allowed on edge 0 of the pentagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -133.5), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -84), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 64, -88.5), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -78), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0.5, -88.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23.5, -72.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 41.5, -72.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 65, -55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32.5, -99), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0.5, -55), 8*IKRS.Girih.MINIMAL_ANGLE )
    
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][1] = [ 
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 136, 10.5), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 90, -4.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, -33.5), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -5.5), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84.5, 27.5), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 81.5, -17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 76, 0), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 71.5, -43.5), -6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52.5, 17), -4*IKRS.Girih.MINIMAL_ANGLE )
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][2] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 72, 99), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 43, 60), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 20, 82), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 40, 54.5), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 71, 43.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 29.5, 55), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 43, 44.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52.5, 17), -4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52.5, 71.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0.5, 55), 8*IKRS.Girih.MINIMAL_ANGLE ),
];
// Note that the hexagon has a 3|6-axis symmetry. All other 3 edges behave the same.
for( var e = 3; e < 6; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e-3 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][e-3][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	if( e == 4 )  // It's a bit unprecise
	    tileAlign.position.x += 2.0;
	else
	    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e ].push( tileAlign );
	
    }
}


IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ] = Array(4);
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 116.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 67), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -41, 72), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -8.5, 61), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23, 71.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -18, 55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0, 55), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -41.5, 38.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 82.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23, 38.5), 8*IKRS.Girih.MINIMAL_ANGLE )
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][1] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -113.5, -27.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -66.5, -12.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81, 17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -61.5, -10.5), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -61, -44.5), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -57.5, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -52.5, -17), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81, -17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -49, 27.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -29, -34), 6*IKRS.Girih.MINIMAL_ANGLE )
];
// Note that the rhombus has a 2-axis symmetry. All other 2 edges behave the same.
for( var e = 2; e < 4; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][ e-2 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][e-2][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	//if( e == 4 )  // It's a bit unprecise
	//    tileAlign.position.x += 2.0;
	//else
	//    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][ e ].push( tileAlign );
	
    }
}


IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ] = Array(6);
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -99.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -50.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 64, -55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -45), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0, -55), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 41, -38), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23, -38), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 64, -21), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -65.5), 4*IKRS.Girih.MINIMAL_ANGLE )
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][1] = [
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 136, 44.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 90, 29), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84.5, 27.5), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84.5, 61.5), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 81, 17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75.5, 34), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, 34), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 72, -10.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52, 51), -4*IKRS.Girih.MINIMAL_ANGLE )
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][2] = [
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -32, 99.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -3.5, 59), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 20, 82), 6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0, 55), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -32, 44.25), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -3.5, 44.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 11, 55), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 39.5, 55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -12, 72), 6*IKRS.Girih.MINIMAL_ANGLE )
];

// Note that the bow tie has a 3|6-axis symmetry. All other 3 edges behave the same.
for( var e = 3; e < 6; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][ e-3 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][e-3][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	//if( e == 4 )  // It's a bit unprecise
	//    tileAlign.position.x += 2.0;
	//else
	//    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][ e ].push( tileAlign );
	
    }
}


// Note that the bow tie has a 3|6-axis symmetry. All other 3 edges behave the same.
/*
for( var t = 3; t < 6; t++ ) {
    for( var e = 1; e < 6; e++ ) {
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ t-3 ] = [];
	for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][t].length; i++ ) {

	    var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][0][e].clone();
	    tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, e*4*IKRS.Girih.MINIMAL_ANGLE );
	    tileAlign.angle += e*4*IKRS.Girih.MINIMAL_ANGLE;
	    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e ].push( tileAlign );

	}
    }
}
*/

/*
// Note that the decagon has a 5|10-axis symmetry. All other 9 edges behave the same.
for( var t = 0; t < IKRS.Girih.TILE_ALIGN.length; t++ ) {
    for( var e = 1; e < IKRS.Girih.EDGE_COUNT[t]; e++ ) {
	IKRS.Girih.TILE_ALIGN[ t ][ i ] = [];
	for( var j = 0; j < IKRS.Girih.TILE_ALIGN[ t ][0].length; j++ ) {
	    
	    var tileAlign = IKRS.Girih.TILE_ALIGN[ t ][0][j].clone();
	    tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, e*2*IKRS.Girih.MINIMAL_ANGLE );
	    tileAlign.angle += e*2*IKRS.Girih.MINIMAL_ANGLE;
	    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][ e ].push( tileAlign );
	    
	}
    }
}
*/



IKRS.Girih.prototype.constructor = IKRS.Girih;

