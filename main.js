/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/

var girih = new IKRS.Girih();
var girihCanvasHandler = null;

//var tile = new IKRS.Tile();



function onLoad() {
    
    // Load girih teplate image
    var imageObj = new Image();
    
    imageObj.onload = function() {
	girihCanvasHandler = new IKRS.GirihCanvasHandler( imageObj );
	var tileSize = 50;
	// Make a test decagon
	var deca = new IKRS.Tile.Decagon( tileSize, 
					  new IKRS.Point2(-50,-60),  // position
					  0.0
					);
	//this._drawTile( deca );

	// Make a test pentagon
	var penta = new IKRS.Tile.Pentagon( tileSize,
					    new IKRS.Point2(-166, -18),  // position
					    0.0
					  );
	//this._drawTile( penta );

	// Make a test irregular hexagon
	var irHex = new IKRS.Tile.IrregularHexagon( tileSize,
						    new IKRS.Point2(-120, -160),  // position
						    0.0 
						  );
	//this._drawTile( irHex );

	// Make a test rhombus
	var rhomb = new IKRS.Tile.Rhombus( tileSize,
					   new IKRS.Point2(-160, -88),  // position
					   0.0
					 );
	//this._drawTile( rhomb );

	// Make a test bow-tie
	var tie = new IKRS.Tile.BowTie( tileSize,
					new IKRS.Point2(-16, -160),  // position
					0.0
				      );
	//this._drawTile( tie );

	
	girihCanvasHandler.tiles.push( deca );
	girihCanvasHandler.tiles.push( penta );
	girihCanvasHandler.tiles.push( irHex );
	girihCanvasHandler.tiles.push( rhomb );
	girihCanvasHandler.tiles.push( tie );
	
	girihCanvasHandler.redraw();
    };
    imageObj.src = "500px-Girih_tiles.svg.png";

    //this.girihCanvasHandler = new IKRS.GirihCanvasHandler();

}

function increaseZoom() {
    girihCanvasHandler.zoomFactor *= 1.2;
    girihCanvasHandler.redraw();
}

function decreaseZoom() {
    girihCanvasHandler.zoomFactor /= 1.2;
    girihCanvasHandler.redraw();
}

function rotateLeft() {
    girihCanvasHandler.tiles[4].angle += (IKRS.Girih.MINIMAL_ANGLE/4);
    document.getElementById("debug").innerHTML = "" + IKRS.Girih.rad2deg(girihCanvasHandler.tiles[4].angle) + "&deg;";
    girihCanvasHandler.redraw();
}

function rotateRight() {
    girihCanvasHandler.tiles[4].angle -= (IKRS.Girih.MINIMAL_ANGLE/4);
    document.getElementById("debug").innerHTML = "" + IKRS.Girih.rad2deg(girihCanvasHandler.tiles[4].angle) + "&deg;";
    girihCanvasHandler.redraw();
}


window.addEventListener( "load", onLoad );