/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/

var girih = new IKRS.Girih();
var girihCanvasHandler = null;



function onLoad() {
    
    // Load girih teplate image
    var imageObj = new Image();
    
    imageObj.onload = function() {
	girihCanvasHandler = new IKRS.GirihCanvasHandler( imageObj );
	var tileSize = IKRS.Girih.DEFAULT_EDGE_LENGTH;
	// Make a test decagon
	var deca = new IKRS.Tile.Decagon( tileSize, 
					  new IKRS.Point2(-50,-60),  // position
					  0.0
					);
	
	// Make a test pentagon
	var penta = new IKRS.Tile.Pentagon( tileSize,
					    new IKRS.Point2(-172, -20), // new IKRS.Point2(-171, -20),  // position
					    0.0
					  );

	// Make a test irregular hexagon
	var irHex = new IKRS.Tile.IrregularHexagon( tileSize,
						    new IKRS.Point2(-123, -159),  // position
						    0.0 
						  );

	// Make a test rhombus
	var rhomb = new IKRS.Tile.Rhombus( tileSize,
					   new IKRS.Point2(-164, -87),  // position
					   0.0
					 );

	// Make a test bow-tie
	var tie = new IKRS.Tile.BowTie( tileSize,
					new IKRS.Point2(-18, -159),  // position
					0.0
				      );
	
	
	girihCanvasHandler.addTile( deca );
	girihCanvasHandler.addTile( penta );
	girihCanvasHandler.addTile( irHex );
	girihCanvasHandler.addTile( rhomb );
	girihCanvasHandler.addTile( tie );
	

	_makeTest_Decagon_BowTie( tileSize );
	_makeTest_Pentagon( tileSize );
	_makeTest_IrregularHexagon( tileSize );
	_makeTest_Rhombus( tileSize );
			
	girihCanvasHandler.drawOffset.setXY( 250, 250 );
	redrawGirih();
    };
    imageObj.src = "500px-Girih_tiles.svg.png";

}

function _displayTileAlign( centerTile,
			    referenceTile
			  ) {

    var differencePoint = new IKRS.Point2( referenceTile.position.x - centerTile.position.x,
					   referenceTile.position.y - centerTile.position.y
					 );
    var totalAngle      = centerTile.angle + referenceTile.angle;
    DEBUG( "[tileAlign] new IKRS.TileAlign( IKRS.Girih.DEFAULT_EDGE_LENGTH,\n" + // " + centerTile.size + ",\n" +
	   "                                new IKRS.Point2( " + differencePoint.x + ", " + differencePoint.y + "),\n" +
	   "                                " + _angle2constant(totalAngle) + " );\n"
	 );
}

function _angle2constant( angle ) {

    var factor = Math.floor( angle/IKRS.Girih.MINIMAL_ANGLE );
    var remainder = angle % IKRS.Girih.MINIMAL_ANGLE;
    
    var result = "";
    if( factor == 0 ) result = "0";
    else              result = factor + "*IKRS.Girih.MINIMAL_ANGLE";

    if( remainder != 0 ) {
	if( factor == 0 )        result = "" + remainder;
	else if( remaindex > 0 ) result += " + " + remainder;
	else                     result += " - " + Math.abs(remainder);
    }	

    return result;
}

function _makeTest_Decagon_BowTie( tileSize ) {
    // Make a test decagon
    var deca = new IKRS.Tile.Decagon( tileSize, 
				      new IKRS.Point2(300,300),  // position
				      0.0
				    );
    // Make a test bow-tie
    var tieA = new IKRS.Tile.BowTie( tileSize,
				     new IKRS.Point2(333, 200),  // position
				     0.0
				  );
    var tieB = new IKRS.Tile.BowTie( tileSize,
				     new IKRS.Point2(386, 238),  // position
				     IKRS.Girih.MINIMAL_ANGLE*2
				   );
    var tieC = new IKRS.Tile.BowTie( tileSize,
				     new IKRS.Point2(386, 238),  // position
				     IKRS.Girih.MINIMAL_ANGLE*2
				   );
    var tie = new IKRS.Tile.BowTie( tileSize,
				    new IKRS.Point2(385, 184),  // position
				    0 // IKRS.Girih.MINIMAL_ANGLE*6
				  );
    tie.position.add( new IKRS.Point2(200, 200) );
    girihCanvasHandler.addTile( deca );
    girihCanvasHandler.addTile( tie );
    
    _displayTileAlign( deca, tie );
}

function _makeTest_Pentagon( tileSize ) {
    // Make a test pentagon
    var penta = new IKRS.Tile.Pentagon( tileSize,
					new IKRS.Point2(479, 52),   // position
					0.0
				      );
    girihCanvasHandler.addTile( penta );
}

function _makeTest_IrregularHexagon( tileSize ) {
    // Make a test pentagon
    var hexa = new IKRS.Tile.IrregularHexagon( tileSize,
						new IKRS.Point2(161.1, -32.2),   // position
						0.0
					      );
    girihCanvasHandler.addTile( hexa );
}

function _makeTest_Rhombus( tileSize ) {
    // Make a test pentagon
    var rhomb = new IKRS.Tile.Rhombus( tileSize,
					new IKRS.Point2(18.2, 328),   // position
					0.0
				      );
    girihCanvasHandler.addTile( rhomb );
}

function increaseZoom() {
    girihCanvasHandler.zoomFactor *= 1.2;
    redrawGirih();
}

function decreaseZoom() {
    girihCanvasHandler.zoomFactor /= 1.2;
    redrawGirih();
}

function rotateLeft() {
    var first = true;
    for( var i = 0; i < girihCanvasHandler.tiles.length; i++ ) {
	if( girihCanvasHandler.tiles[i]._props.selected ) {
	    girihCanvasHandler.tiles[i].angle += (IKRS.Girih.MINIMAL_ANGLE);	    
	    if( first )
		document.getElementById("debug").innerHTML = "" + IKRS.Girih.rad2deg(girihCanvasHandler.tiles[i].angle) + "&deg;";
	    first = false;
	}
    }
    redrawGirih();
}

function rotateRight() {
    var first = true;
    for( var i = 0; i < girihCanvasHandler.tiles.length; i++ ) {
	if( girihCanvasHandler.tiles[i]._props.selected ) {
	    girihCanvasHandler.tiles[i].angle -= (IKRS.Girih.MINIMAL_ANGLE);	    
	    if( first )
		document.getElementById("debug").innerHTML = "" + IKRS.Girih.rad2deg(girihCanvasHandler.tiles[i].angle) + "&deg;";
	    first = false;
	}
    }
    redrawGirih();
}

function redrawGirih() {
    
    // Fetch the form settings and apply them to the handler's draw options
    girihCanvasHandler.getDrawProperties().drawBoxes    = document.forms["girih_form"].elements["draw_boxes"].checked;
    girihCanvasHandler.getDrawProperties().drawOutlines = document.forms["girih_form"].elements["draw_outlines"].checked;
    girihCanvasHandler.getDrawProperties().drawTextures = document.forms["girih_form"].elements["draw_textures"].checked;

    // Then trigger redraw
    girihCanvasHandler.redraw();
}

function DEBUG( msg ) {
    this.document.getElementById("debug").innerHTML = msg;
}

window.addEventListener( "load", onLoad );