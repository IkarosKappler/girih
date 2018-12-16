/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/

var girih = new IKRS.Girih();
var girihCanvasHandler = null;
var defaultTextureImage = null;


function onLoad() {
    // Load girih teplate image
    defaultTextureImage = new Image();
    
    defaultTextureImage.onload = function() {
	girihCanvasHandler = new IKRS.GirihCanvasHandler( defaultTextureImage );
	var tileSize = IKRS.Girih.DEFAULT_EDGE_LENGTH;


	// Make a test penrose-rhombus
	var penrose = new IKRS.Tile.PenroseRhombus( tileSize,
						    new IKRS.Point2(276.5385,49.2873), 
						    0.0
					  );
	girihCanvasHandler.addTile( penrose );
	_makeTest_Decagon_BowTie( tileSize );
	_makeTest_Pentagon( tileSize );
	_makeTest_IrregularHexagon( tileSize );
	_makeTest_Rhombus( tileSize );

	// THIS DOES NOT WORK OUT (just a test)
	// _makeTest_Octagon( tileSize );
			
	girihCanvasHandler.drawOffset.setXY( 200, 200 ); 
	redrawGirih();
    };
    defaultTextureImage.src = "img/500px-Girih_tiles.Penrose_compatible_extended.png";

}

function _displayTileAlign( centerTile,
			    referenceTile
			  ) {

    var differencePoint = new IKRS.Point2( referenceTile.position.x - centerTile.position.x,
					   referenceTile.position.y - centerTile.position.y
					 );
    var totalAngle      = centerTile.angle + referenceTile.angle;
    DEBUG( "[tileAlign] new IKRS.TileAlign( IKRS.Girih.DEFAULT_EDGE_LENGTH,\n" + 
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
	else if( remainder > 0 ) result += " + " + remainder;
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
    //tie.position.add( new IKRS.Point2(200, 200) );
    tie.position.setXY( 57.7319, 110.9594 ); // 100, 150 );
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
						new IKRS.Point2(151.577, -33.4546 ), //161.1, -32.2),   // position
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

// THIS IS NOT PART OF A PROPER GIRIH.
function _makeTest_Octagon( tileSize ) {
    // Make a test octagon
    var octa = new IKRS.Tile.Octagon( tileSize,
					new IKRS.Point2(18.2+600, 328-130),   // position
					0.0
				      );
    girihCanvasHandler.addTile( octa );
}

function increaseZoom() {
    girihCanvasHandler.zoomFactor *= 1.2;
    redrawGirih();
}

function decreaseZoom() {
    girihCanvasHandler.zoomFactor /= 1.2;
    redrawGirih();
}

function moveLeft() {
    girihCanvasHandler.drawOffset.x += 50; 
    redrawGirih();
}

function moveRight() {
    girihCanvasHandler.drawOffset.x -= 50;
    redrawGirih();
}

function moveUp() {
    girihCanvasHandler.drawOffset.y += 50; 
    redrawGirih();
}

function moveDown() {
    girihCanvasHandler.drawOffset.y -= 50;
    redrawGirih();
}

function rotateLeft() {
    rotateByAmount( -IKRS.Girih.MINIMAL_ANGLE );
}

function rotateRight() {
    rotateByAmount( IKRS.Girih.MINIMAL_ANGLE );
}

function rotateByAmount( amount ) {

    var index     = girihCanvasHandler._locateSelectedTile();
    if( index == -1 ) {
	DEBUG( "No tile selected." );
	return;
    }

    var tile      = girihCanvasHandler.girih.tiles[ index ];
    var rotateAll = document.forms[ "rotation_form" ].elements[ "rotate_all" ].checked; //true;

    if( rotateAll ) {
	for( var i = 0; i < girihCanvasHandler.girih.tiles.length; i++ ) {
	    var tmpTile = girihCanvasHandler.girih.tiles[i];
	    tmpTile.position.rotate( tile.position, amount ); 
	    tmpTile.angle += amount; 
	}
    } else {
	tile.angle += amount; 
    } 
    
    DEBUG( "" + IKRS.Girih.rad2deg(tile.angle) + "&deg;" );
	

    /*
    var first = true;
    for( var i = 0; i < girihCanvasHandler.girih.tiles.length; i++ ) {
	if( girihCanvasHandler.girih.tiles[i]._props.selected ) {
	    girihCanvasHandler.gitih.tiles[i].angle += (IKRS.Girih.MINIMAL_ANGLE);	    
	    if( first )
		document.getElementById("debug").innerHTML = "" + IKRS.Girih.rad2deg(girihCanvasHandler.girih.tiles[i].angle) + "&deg;";
	    first = false;
	}
    }
    */
    redrawGirih();
}

function redrawGirih() {
    
    // Fetch the form settings and apply them to the handler's draw options
    girihCanvasHandler.getDrawProperties().drawBoxes             = document.forms["girih_form"].elements["draw_boxes"].checked;
    girihCanvasHandler.getDrawProperties().drawOutlines          = document.forms["girih_form"].elements["draw_outlines"].checked;
    girihCanvasHandler.getDrawProperties().drawTextures          = document.forms["girih_form"].elements["draw_textures"].checked;
    girihCanvasHandler.getDrawProperties().drawInnerPolygons     = document.forms["girih_form"].elements["draw_inner_polygons"].checked;

    girihCanvasHandler.getDrawProperties().outerRandomColorFill      = document.forms["girih_form"].elements["outer_random_color_fill"].checked;
    girihCanvasHandler.getDrawProperties().innerRandomColorFill      = document.forms["girih_form"].elements["inner_random_color_fill"].checked;

    girihCanvasHandler.getProperties().allowPenroseTile          = document.forms["girih_form"].elements["allow_penrose_tile"].checked;    
    //girihCanvasHandler.getProperties().drawPenroseCenterPolygon  = document.forms["girih_form"].elements["draw_penrose_center_polygon"].checked;

  
    // Then trigger redraw
    girihCanvasHandler.redraw();
}

/*
function DEBUG( msg ) {
    this.document.getElementById("debug").innerHTML = msg;
}
*/

window.addEventListener( "load", onLoad );



function exportSVG() {

    var svg = girihCanvasHandler.getSVG( { indent: "" }, // options
					 null            // style
				       );
				      
    
    document.getElementById( "svg_preview" ).innerHTML = svg;

}
