/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.GirihCanvasHandler = function( imageObject ) {
    
    IKRS.Object.call( this );
    
    this.imageObject               = imageObject;

    this.canvasWidth               = 1024;
    this.canvasHeight              = 768;
    
    this.canvas                    = document.getElementById("girih_canvas");
    // Make a back-reference for event handling
    this.canvas.girihCanvasHandler = this; 
    this.context                   = this.canvas.getContext( "2d" );    
    
    this.drawOffset                = new IKRS.Point2( 512, 384 );
    this.zoomFactor                = 1.0;
    
    this.tiles                     = [];  

    this.drawProperties            = { drawBoxes:    false,
				       drawOutlines: true,
				       drawTexture:  true
				     };
    
    this.adjacentTileOptionPointer = 0;
    
    this.canvas.onmousedown        = this.mouseDownHandler;
    this.canvas.onmouseup          = this.mouseUpHandler;
    this.canvas.onmousemove        = this.mouseMoveHandler; 
    

    // Install a mouse wheel listener
    if( this.canvas.addEventListener ) { 
	// For Mozilla 
	this.canvas.addEventListener( 'DOMMouseScroll', this.mouseWheelHandler, false );
    } else {
	// IE
	this.canvas.onmousewheel = document.onmousewheel = mouseWheelHandler;
    }
   
    window.addEventListener( "keydown",   this.keyDownHandler,   false );
};

IKRS.GirihCanvasHandler.prototype._translateMouseEventToRelativePosition = function( parent,
										     e ) {
    var rect = parent.getBoundingClientRect();
    var left = e.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = e.clientY - rect.top  - parent.clientTop  + parent.scrollTop;

    // Add draw offset :)
    var relX = (left - this.drawOffset.x) / this.zoomFactor;
    var relY = (top  - this.drawOffset.y) / this.zoomFactor;

    return new IKRS.Point2( relX, relY );
}




IKRS.GirihCanvasHandler.prototype.mouseWheelHandler = function( e ) {

    var delta = 0;
    if (!e)                 // For IE.
	e = window.event;
    if (e.wheelDelta) {     // IE/Opera.
	delta = e.wheelDelta/120;
    } else if (e.detail) {  // Mozilla case. 
	// In Mozilla, sign of delta is different than in IE.
	// Also, delta is multiple of 3.
	delta = -e.detail/3;
    }
    // If delta is nonzero, handle it.
    // Basically, delta is now positive if wheel was scrolled up,
    // and negative, if wheel was scrolled down.
    if (delta) {
	
	if( delta < 0 )
	    ; // this.bezierCanvasHandler.decreaseZoomFactor( true ); // redraw
	else
	    ; // this.bezierCanvasHandler.increaseZoomFactor( true ); // redraw
	
    }
    // Prevent default actions caused by mouse wheel.
    // That might be ugly, but we handle scrolls somehow
    // anyway, so don't bother here..
    if( e.preventDefault )
	e.preventDefault();
    e.returnValue = false;
}

IKRS.GirihCanvasHandler.prototype.mouseDownHandler = function( e ) {

    var point     = this.girihCanvasHandler._translateMouseEventToRelativePosition( this, e );
    // window.alert( "point=(" + point.x + ", " + point.y + ")" );

    var tileIndex = this.girihCanvasHandler._locateTileAtPoint( point );
    //window.alert( "tileIndex=" + tileIndex  );
    if( tileIndex == -1 )
	return; // Not found

    // Clear all selection
    this.girihCanvasHandler._clearSelection();

    // Set the tile's 'selected' state
    this.girihCanvasHandler.tiles[tileIndex]._props.selected = true; 
    // DEBUG( "[mouseDown] tileIndex=" + tileIndex + ", selected=" + his.girihCanvasHandler.tiles[tileIndex]._props.selected );
    this.girihCanvasHandler.redraw();
}

IKRS.GirihCanvasHandler.prototype.mouseUpHandler = function( e ) {
    
}

IKRS.GirihCanvasHandler.prototype.mouseMoveHandler = function( e ) {

    // Find old hovered tile  
    var oldHoverTileIndex       = this.girihCanvasHandler._locateHoveredTile();
    var oldHoverTile            = null; 
    var oldHighlightedEdgeIndex = -1;
    if( oldHoverTileIndex != -1 ) {
	oldHoverTile = this.girihCanvasHandler.tiles[ oldHoverTileIndex ];  // May be null!
	oldHighlightedEdgeIndex = oldHoverTile.highlightedEdgeIndex;
    }

    // Locate the edge the mouse hovers over
    var point     = this.girihCanvasHandler._translateMouseEventToRelativePosition( this, e );
    //window.alert( "[mouseMoved] translated point: " + point.toString() );
    
    this.girihCanvasHandler._clearHovered();

    // THIS MUST BE THOUGHT ABOUT ONCE MORE
    var hoverTileIndex = this.girihCanvasHandler._locateTileAtPoint( point );
    if( hoverTileIndex == -1 ) {
	DEBUG( "[mouseMoved] CLEARED hoverTileIndex=" + hoverTileIndex );
	this.girihCanvasHandler.redraw();
	return;
    }
    var hoverTile      = this.girihCanvasHandler.tiles[ hoverTileIndex ];
 
    hoverTile._props.hovered = true;  // may be the same object

    // Try to find the point from the center of the edge, with
    // a radius of half the edge's length
    var highlightedEdgeIndex = hoverTile.locateEdgeAtPoint( point, 
							    hoverTile.size/2.0 * this.girihCanvasHandler.zoomFactor
							  );
    
    DEBUG( "[mouseMoved] hoverTileIndex=" + hoverTileIndex + ", highlightedEdgeIndex=" + highlightedEdgeIndex );
    
    // Redraw really required?
    if( oldHoverTileIndex == hoverTileIndex && 
	highlightedEdgeIndex == oldHighlightedEdgeIndex ) {
	return;
    }

    
    
    hoverTile._props.highlightedEdgeIndex = highlightedEdgeIndex;
    this.girihCanvasHandler.redraw();
}

IKRS.GirihCanvasHandler.prototype.keyDownHandler = function( e ) {

    // window.alert( e.keyCode );

    // The key code for 'delete' is 46
    //if( e.keyCode != 46 ) 
    //	return;

    // right=39
    // left=37
    // enter=13
    // delete=46
    // space=32
    //if( e.keyCode != 39 && e.keyCode != 37 & e.keyCode != 13 && e.keyCode != 46)
//	return;

    if( e.keyCode == 39 ) {
	this.girihCanvasHandler.adjacentTileOptionPointer++;
	this.girihCanvasHandler.redraw();
    } else if( e.keyCode == 37 ) {
	this.girihCanvasHandler.adjacentTileOptionPointer--;
	this.girihCanvasHandler.redraw();
    } else if( e.keyCode == 13 || e.keyCode == 32 ) {
	this.girihCanvasHandler._performAddCurrentAdjacentPresetTile();
    } else if( e.keyCode == 46 ) {
	this.girihCanvasHandler._performDeleteSelectedTile();
    }
  
}

IKRS.GirihCanvasHandler.prototype._locateSelectedTile = function() {
    for( var i = 0; i < this.tiles.length; i++ ) {
	if( this.tiles[i]._props.selected )
	    return i;
    }
    // Not found
    return -1; 
}

IKRS.GirihCanvasHandler.prototype._locateHoveredTile = function() {
    for( var i = 0; i < this.tiles.length; i++ ) {
	if( this.tiles[i]._props.hovered )
	    return i;
    }
    return -1;
}

IKRS.GirihCanvasHandler.prototype._clearSelection = function() {
    for( var i = 0; i < this.tiles.length; i++ ) {
	this.tiles[i]._props.selected             = false;
    }
}

IKRS.GirihCanvasHandler.prototype._clearHovered = function() {
    for( var i = 0; i < this.tiles.length; i++ ) {
	this.tiles[i]._props.hovered = false;
	this.tiles[i]._props.highlightedEdgeIndex = -1;
    }
}

IKRS.GirihCanvasHandler.prototype._performAddCurrentAdjacentPresetTile = function() {
    
    var hoveredTileIndex = this._locateHoveredTile();
    if( hoveredTileIndex == -1 ) 
	return;
    
    var tile = this.tiles[ hoveredTileIndex ]; 
    var tileBounds       = tile.computeBounds();
    /*
    this._drawPreviewTileAtHighlightedPolygonEdge( tile.tileType,
						   tile.vertices, 
						   tile.position, 
						   tile.angle,
						   tileBounds, // tile.computeBounds(),  // tileBounds,
						   { unselectedEdgeColor: "#000000",
						     selectedEdgeColor:   "#FF0000"
						   },
						   tile.imageProperties,
						   this.imageObject,
						   tile._props.highlightedEdgeIndex,
						   this.drawProperties.drawOutlines
						 );
    */

    var adjacentTile = this._resolveCurrentAdjacentTilePreset(   tile.tileType,
								 tile.vertices, 
								 tile.position, 
								 tile.angle,
								 tileBounds, // tile.computeBounds(),  // tileBounds,
								 { unselectedEdgeColor: "#000000",
								   selectedEdgeColor:   "#FF0000"
								 },
								 tile.imageProperties,
								 this.imageObject,
								 tile._props.highlightedEdgeIndex,
								 this.drawProperties.drawOutlines
								 
								 /*tileType,
								   points,
								   position, 
								   angle,
								   originalBounds,
								   colors,
								   imgProperties,
								   imageObject,
								   highlightedEdgeIndex,
								   drawOutlines
								 */
							     );
    if( !adjacentTile )
	return;

    this.addTile( adjacentTile );
    this.redraw();
}

IKRS.GirihCanvasHandler.prototype._performDeleteSelectedTile = function() {

    var selectedTileIndex = this._locateSelectedTile();
    if( selectedTileIndex == -1 )
	return;

    this.tiles.splice( selectedTileIndex, 1 );
    this.redraw();
}

IKRS.GirihCanvasHandler.prototype.addTile = function( tile ) {

    // Add internal properties to the tile
    tile._props = { selected:              false,
		    hovered:               false,
		    highlightedEdgeIndex:  -1,
		  };
    this.tiles.push( tile );
}

IKRS.GirihCanvasHandler.prototype._locateTileAtPoint = function( point ) {

    for( var i = 0; i < this.tiles.length; i++ ) {

	// window.alert( "[_locateTileAtPoint] tile[" + i + "].containsPoint(...)=" + this.tiles[i].containsPoint(point) );
	if( this.tiles[i].containsPoint(point) )
	    return i;
	
    }
    
    // Not found
    return -1;

}

IKRS.GirihCanvasHandler.prototype._drawTile = function( tile ) {  

    var tileBounds = tile.computeBounds();
    if( this.drawProperties.drawBoxes ) {
	this._drawBoundingBox( tile.position,
			       tileBounds,
			       tile.angle 
			     );
    }
    this._drawPolygonFromPoints( tile.vertices, 
				 tile.position, 
				 tile.angle,
				 tileBounds,
				 { unselectedEdgeColor: "#000000",
				   selectedEdgeColor:   "#FF0000"
				 },
				 tile.imageProperties,
				 this.imageObject,
				 tile._props.highlightedEdgeIndex,
				 this.drawProperties.drawOutlines
			       );
    if( this.drawProperties.drawOutlines )
	this._drawCrosshairAt( tile.position, tile._props.selected );

}

IKRS.GirihCanvasHandler.prototype._drawPolygonFromPoints = function( points,
								     position, 
								     angle,
								     originalBounds,
								     colors,
								     imgProperties,
								     imageObject,
								     highlightedEdgeIndex,
								     drawOutlines
								   ) {  
    
    if( !points )
	return;

    this.context.save();
    
    this.context.beginPath();
    var point      = points[0].clone();
    point.rotate( IKRS.Point2.ZERO_POINT, angle );
    var startPoint = point.clone();
    this.context.moveTo( point.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 point.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    

    var bounds = new IKRS.BoundingBox2( point.x, point.y, point.x, point.y );

    for( var i = 1; i < points.length; i++ ) {

	point.set( points[i] );
	point.rotate( IKRS.Point2.ZERO_POINT, angle );
	//window.alert( "point=(" + point.x + ", "+ point.y + ")" );
	this.context.lineTo( point.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			     point.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
			   );

	bounds.xMin = Math.min( point.x, bounds.xMin );
	bounds.xMax = Math.max( point.x, bounds.xMax );
	bounds.yMin = Math.min( point.y, bounds.yMin );
	bounds.yMax = Math.max( point.y, bounds.yMax );
    }
    // Close path
    this.context.lineTo( startPoint.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 startPoint.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.closePath();
    
    //window.alert( bounds.toString() );
    
    if( this.drawProperties.drawTextures && 
	imgProperties && 
	imageObject ) { 

	this.context.clip();
	var imageX = this.drawOffset.x + position.x * this.zoomFactor + originalBounds.xMin * this.zoomFactor;
	var imageY = this.drawOffset.y + position.y * this.zoomFactor + originalBounds.yMin * this.zoomFactor;	
	var imageW = originalBounds.getWidth() * this.zoomFactor; 
	var imageH = originalBounds.getHeight() * this.zoomFactor; 

	
	this.context.translate( imageX + imageW/2.0, 
				imageY + imageH/2.0 //+ imgProperties.destination.yOffset
			      );
	
	this.context.rotate( angle ); 
	
	var drawStartX = (-originalBounds.getWidth()/2.0) * this.zoomFactor; 
	var drawStartY = (-originalBounds.getHeight()/2.0) * this.zoomFactor; 
	this.context.drawImage( imageObject,
				imgProperties.source.x, // 0,             // source x
				imgProperties.source.y, // 0,             // source y
				imgProperties.source.width,  // 500,           // source width
				imgProperties.source.height, // +imgProperties.destination.yOffset, // 460,           // source height
				drawStartX, // -imageX,        // destination x
				drawStartY, // +imgProperties.destination.yOffset, // -imageY,        // destination y
				imageW,        // destination width
				imageH // +imgProperties.destination.yOffset         // destination height
			      );
	this.context.rect( drawStartX,
			   drawStartY,
			   imageW,
			   imageH
			     );
    }
    

    // Draw outlines?
    if( drawOutlines ) {
	this.context.lineWidth   = 1.0;
	this.context.strokeStyle = colors.unselectedEdgeColor;
	this.context.stroke(); 
    }

    this.context.restore();

}

IKRS.GirihCanvasHandler.prototype._drawHighlightedPolygonEdge = function( points,
									  position, 
									  angle,
									  originalBounds,
									  colors,
									  imgProperties,
									  imageObject,
									  highlightedEdgeIndex,
									  drawOutlines
								   ) {  
    
    if( !points || highlightedEdgeIndex == -1 )
	return;

    this.context.save();
    
    var pointA = points[ highlightedEdgeIndex ].clone();
    var pointB = points[ highlightedEdgeIndex+1 < points.length ? highlightedEdgeIndex+1 : 0 ].clone();

    pointA.rotate( IKRS.Point2.ZERO_POINT, angle );
    pointB.rotate( IKRS.Point2.ZERO_POINT, angle );


    this.context.beginPath();
    this.context.lineTo( pointA.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 pointA.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.lineTo( pointB.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 pointB.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.closePath();
    this.context.strokeStyle = colors.selectedEdgeColor;
    this.context.lineWidth   = 4.0;
    this.context.stroke(); 

    this.context.restore();

}

IKRS.GirihCanvasHandler.prototype._resolveCurrentAdjacentTilePreset = function( tileType,
										points,
										position, 
										angle,
										originalBounds,
										colors,
										imgProperties,
										imageObject,
										highlightedEdgeIndex,
										drawOutlines
									      ) {  
    
    if( !points || highlightedEdgeIndex == -1 )
	return;

    // Choose first option by default
    // in [0...4] (number of implemented tile types: 5)
    //var optionIndex = adjacentTileOptionPointer; 
    //var presetTileType = IKRS.Girih.TILE_TYPE_BOW_TIE;

    // Adjacent tile presets available for this tile/edge/option?
    //window.alert( "tileType=" + tileType + ", highlightedEdgeIndex=" + highlightedEdgeIndex );
    if( !IKRS.Girih.TILE_ALIGN[tileType] )
	return;

    //window.alert( "IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex]=" + IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex] );
    if( !IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex] )
	return;

    //window.alert( JSON.stringify(IKRS.Girih.TILE_ALIGN) );

    //window.alert( "IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex][presetTileType]=" + IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex][presetTileType] + ", highlightedEdgeIndex=" + highlightedEdgeIndex + ", length=" + IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex][presetTileType].length );
    //if( !IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex][presetTileType] )
	//return;
    
    
    var presets = IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex]; //[presetTileType];
 
    
    var optionIndex    = this.adjacentTileOptionPointer % presets.length;
    //window.alert( "optionIndex=" + optionIndex );

    var tileAlign      = presets[optionIndex]; // IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex][presetTileType][optionIndex];
    
    var tile = tileAlign.createTile();
    // Make position relative to the hovered tile
    tile.position.add( position ); // tileAlign.position );
    tile.angle += angle;

    //window.alert( "X" );

    return tile;
}

IKRS.GirihCanvasHandler.prototype._drawPreviewTileAtHighlightedPolygonEdge = function( tileType,
										       points,
										       position, 
										       angle,
										       originalBounds,
										       colors,
										       imgProperties,
										       imageObject,
										       highlightedEdgeIndex,
										       drawOutlines
										     ) { 
    
    var tile = this._resolveCurrentAdjacentTilePreset(  tileType,
							points,
							position, 
							angle,
							originalBounds,
							colors,
							imgProperties,
							imageObject,
							highlightedEdgeIndex,
							drawOutlines
						     );
    if( !tile )
	return;

    // Draw adjacent tile
    this.context.globalAlpha = 0.5;  // 50% transparency
    this._drawPolygonFromPoints( tile.vertices, 
				 tile.position, 
				 tile.angle,
				 tile.computeBounds(), // originalBounds,
				 { unselectedEdgeColor: "#000000",
				   selectedEdgeColor:   "#FF0000"
				 },
				 tile.imageProperties,
				 this.imageObject,
				 -1,  // tile._props.highlightedEdgeIndex,
				 this.drawProperties.drawOutlines
			       );
    this.context.globalAlpha = 1.0;  // opaque
    
}

IKRS.GirihCanvasHandler.prototype._drawCrosshairAt = function( position,
							       isSelected
							     ) {  

    if( isSelected ) this.context.strokeStyle = "#FF0000";
    else             this.context.strokeStyle = "#000000";

    this.context.beginPath();

    this.context.moveTo( position.x * this.zoomFactor + this.drawOffset.x,
			 position.y * this.zoomFactor + this.drawOffset.y - 5
		       );
    this.context.lineTo( position.x * this.zoomFactor + this.drawOffset.x,
			 position.y * this.zoomFactor + this.drawOffset.y + 5
		       );

    this.context.moveTo( position.x * this.zoomFactor + this.drawOffset.x - 5,
			 position.y * this.zoomFactor + this.drawOffset.y
		       );
    this.context.lineTo( position.x * this.zoomFactor + this.drawOffset.x + 5,
			 position.y * this.zoomFactor + this.drawOffset.y
		       );
    
    this.context.arc( position.x * this.zoomFactor + this.drawOffset.x,
		      position.y * this.zoomFactor + this.drawOffset.y,
		      5.0,
		      0.0, 
		      Math.PI*2.0,
		      false 
		    );

    this.context.stroke(); 
    this.context.closePath();
}

IKRS.GirihCanvasHandler.prototype._drawBoundingBox = function( position,
							       bounds,
							       angle ) {  


    var points = [ bounds.getLeftUpperPoint(),
		   bounds.getRightUpperPoint(),
		   bounds.getRightLowerPoint(),
		   bounds.getLeftLowerPoint()
		 ];
    
    this.context.strokeStyle = "#c8c8ff";
    this._drawPolygonFromPoints( points, 
				 position, 
				 angle,
				 bounds,
				 { unselectedEdgeColor: "#c8c8ff",
				   selectedEdgeColor:   "#c8c8ff"
				 },
				 null,   // imgProperties,
				 null,   // imageObject,
				 -1,     // hightlightedEdgeIndex
				 true    // drawOutlines
			       );
      
    this.context.stroke(); 
}


IKRS.GirihCanvasHandler.prototype._drawCoordinateSystem = function() {  

    this.context.strokeStyle = "#c8c8c8";
    this.context.beginPath();

    this.context.moveTo( this.drawOffset.x,
			 0
		       );
    this.context.lineTo( this.drawOffset.x,
			 this.canvasHeight
		       );

    this.context.moveTo( 0,
			 this.drawOffset.y
		       );
    this.context.lineTo( this.canvasWidth,
			 this.drawOffset.y
		       );

    this.context.stroke(); 
    this.context.closePath();
}

IKRS.GirihCanvasHandler.prototype._drawTiles = function() { 
    
    for( var i = 0; i < this.tiles.length; i++ ) {	
	this._drawTile( this.tiles[i] );
    }

    // Finally draw the selected tile's hovering edge
    var hoveredTileIndex = this._locateHoveredTile();;
    if( hoveredTileIndex != -1 ) {
	var tile = this.tiles[ hoveredTileIndex ]; 
	var tileBounds       = tile.computeBounds()
	this._drawHighlightedPolygonEdge( tile.vertices, 
					  tile.position, 
					  tile.angle,
					  tileBounds, // tile.computeBounds(),  // tileBounds,
					  { unselectedEdgeColor: "#000000",
					    selectedEdgeColor:   "#FF0000"
					  },
					  tile.imageProperties,
					  this.imageObject,
					  tile._props.highlightedEdgeIndex,
					  this.drawProperties.drawOutlines
					);
	this._drawPreviewTileAtHighlightedPolygonEdge( tile.tileType,
						       tile.vertices, 
						       tile.position, 
						       tile.angle,
						       tileBounds, // tile.computeBounds(),  // tileBounds,
						       { unselectedEdgeColor: "#000000",
							 selectedEdgeColor:   "#FF0000"
						       },
						       tile.imageProperties,
						       this.imageObject,
						       tile._props.highlightedEdgeIndex,
						       this.drawProperties.drawOutlines
						     );
    }
}

/**
 * The drawProps object may contain following members:
 *  - drawBoxes (boolean)
 **/  
IKRS.GirihCanvasHandler.prototype.getDrawProperties = function() {
    return this.drawProperties;
}

IKRS.GirihCanvasHandler.prototype.redraw = function() {  

    //window.alert( "Redraw" );

    this.context.fillStyle = "#F0F0F0";
    this.context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );
    
    this._drawCoordinateSystem();
    
    this._drawTiles();
 
}



IKRS.GirihCanvasHandler.prototype.constructor = IKRS.GirihCanvasHandler;

