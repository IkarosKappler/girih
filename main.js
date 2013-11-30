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
	var tileSize = 58;
	// Make a test decagon
	var deca = new IKRS.Tile.Decagon( tileSize, 
					  new IKRS.Point2(-50,-60),  // position
					  0.0
					);
	
	// Make a test pentagon
	var penta = new IKRS.Tile.Pentagon( tileSize,
					    new IKRS.Point2(-171, -20),  // position
					    0.0
					  );

	// Make a test irregular hexagon
	var irHex = new IKRS.Tile.IrregularHexagon( tileSize,
						    new IKRS.Point2(-121, -159),  // position
						    0.0 
						  );

	// Make a test rhombus
	var rhomb = new IKRS.Tile.Rhombus( tileSize,
					   new IKRS.Point2(-162, -87),  // position
					   0.0
					 );

	// Make a test bow-tie
	var tie = new IKRS.Tile.BowTie( tileSize,
					new IKRS.Point2(-17, -159),  // position
					0.0
				      );
	
	
	girihCanvasHandler.addTile( deca );
	girihCanvasHandler.addTile( penta );
	girihCanvasHandler.addTile( irHex );
	girihCanvasHandler.addTile( rhomb );
	girihCanvasHandler.addTile( tie );	
	
	redrawGirih();
    };
    imageObj.src = "500px-Girih_tiles.svg.png";

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