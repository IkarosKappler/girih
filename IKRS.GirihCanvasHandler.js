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
    
    //this.tiles                     = [];  
    this.girih                     = new IKRS.Girih();

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

    var tileIndex = this.girihCanvasHandler._locateTileAtPoint( point );
    if( tileIndex == -1 )
	return; // Not found

    // Clear all selection
    this.girihCanvasHandler._clearSelection();

    // Set the tile's 'selected' state
    this.girihCanvasHandler.girih.tiles[tileIndex]._props.selected = true; 
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
	oldHoverTile = this.girihCanvasHandler.girih.tiles[ oldHoverTileIndex ];  // May be null!
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
    var hoverTile      = this.girihCanvasHandler.girih.tiles[ hoverTileIndex ];
 
    hoverTile._props.hovered = true;  // may be the same object

    // Try to find the point from the center of the edge, with
    // a radius of half the edge's length
    var highlightedEdgeIndex = hoverTile.locateEdgeAtPoint( point, 
							    hoverTile.size/2.0 * this.girihCanvasHandler.zoomFactor
							  );
    
    DEBUG( "[mouseMoved] hoverTileIndex=" + hoverTileIndex + ", highlightedEdgeIndex=" + highlightedEdgeIndex + ", hoverTile.position=" + hoverTile.position.toString() + ", hoverTile.angle=" + hoverTile.angle );
    
    // Redraw really required?
    if( oldHoverTileIndex == hoverTileIndex && 
	highlightedEdgeIndex == oldHighlightedEdgeIndex ) {
	return;
    }

    
    
    hoverTile._props.highlightedEdgeIndex = highlightedEdgeIndex;
    this.girihCanvasHandler.redraw();
}

IKRS.GirihCanvasHandler.prototype.keyDownHandler = function( e ) {

    // right=39
    // left=37
    // enter=13
    // delete=46
    // space=32

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
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	if( this.girih.tiles[i]._props.selected )
	    return i;
    }
    // Not found
    return -1; 
}

IKRS.GirihCanvasHandler.prototype._locateHoveredTile = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	if( this.girih.tiles[i]._props.hovered )
	    return i;
    }
    return -1;
}

IKRS.GirihCanvasHandler.prototype._clearSelection = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	this.girih.tiles[i]._props.selected             = false;
    }
}

IKRS.GirihCanvasHandler.prototype._clearHovered = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	this.girih.tiles[i]._props.hovered = false;
	this.girih.tiles[i]._props.highlightedEdgeIndex = -1;
    }
}

IKRS.GirihCanvasHandler.prototype._performAddCurrentAdjacentPresetTile = function() {
    
    var hoveredTileIndex = this._locateHoveredTile();
    if( hoveredTileIndex == -1 ) 
	return;
    
    var tile         = this.girih.tiles[ hoveredTileIndex ]; 
    var tileBounds   = tile.computeBounds();

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
							     );
    if( !adjacentTile )
	return;

    // Finally: the adjacent tile position might not be acurate.
    //          Make some fine tuning.
    var currentEdgePointA = tile.getTranslatedVertex( tile._props.highlightedEdgeIndex );
    var currentEdgePointB = tile.getTranslatedVertex( tile._props.highlightedEdgeIndex+1 );
    var tolerance         = 5.0;
    var adjacentEdgeIndex = adjacentTile.locateAdjacentEdge( currentEdgePointA, 
							     currentEdgePointB, 
							     tolerance 
							   );
    var adjacentEdgePointA;
    var adjacentEdgePointB;
    var pointDifferences;
    // Swap edge points?
    if( adjacentEdgeIndex != -1 ) {

	//window.alert( "even" );
	adjacentEdgePointA = adjacentTile.getTranslatedVertex( adjacentEdgeIndex ); // getVertexAt( adjacentEdgeIndex );
	adjacentEdgePointB = adjacentTile.getTranslatedVertex( adjacentEdgeIndex+1 ); // getVertexAt( adjacentEdgeIndex+1 );

    } else if( (adjacentEdgeIndex = adjacentTile.locateAdjacentEdge(currentEdgePointB,currentEdgePointA,tolerance)) != -1 ) {
	// Swapped points (reverse edge)
	//window.alert( "odd; adjacentEdgeIndex=" +  adjacentEdgeIndex );
	adjacentEdgePointA = adjacentTile.getTranslatedVertex( adjacentEdgeIndex+1 ); // getVertexAt( adjacentEdgeIndex+1 );
	adjacentEdgePointB = adjacentTile.getTranslatedVertex( adjacentEdgeIndex ); // getVertexAt( adjacentEdgeIndex );
    } 

    if( adjacentEdgeIndex != -1 ) {

	pointDifferences = [ adjacentEdgePointA.clone().sub( currentEdgePointA ),
			     adjacentEdgePointB.clone().sub( currentEdgePointB ) 
			   ];
	/*
	window.alert( "adjacentEdgePointA=" + adjacentEdgePointA.toString() + ",\n" +
		      "adjacentEdgePointB=" + adjacentEdgePointB.toString() + ",\n" +
		      "currentEdgePointA=" + currentEdgePointA.toString() + ",\n" +
		      "currentEdgePointB=" + currentEdgePointB.toString() + ",\n" +
		      "highlightedEdgeIndex=" + tile._props.highlightedEdgeIndex + ",\n" +
		      "adjacentEdgeIndex=" + adjacentEdgeIndex + ",\n" +
		      "adjacentTile.angle=" + adjacentTile.angle
		    );		      
		    */

	// Calculate average difference
	var avgDifference = IKRS.Point2.ZERO_POINT.clone();
	for( var i = 0; i < pointDifferences.length; i++ ) {
	    avgDifference.add( pointDifferences[i] );
	}
	avgDifference.x /= pointDifferences.length;
	avgDifference.y /= pointDifferences.length;
	
	//window.alert( "avgDifference=" + avgDifference.toString() );

	adjacentTile.position.sub( avgDifference );
    }

    this.addTile( adjacentTile );
    this.redraw();
}

IKRS.GirihCanvasHandler.prototype._performDeleteSelectedTile = function() {

    var selectedTileIndex = this._locateSelectedTile();
    if( selectedTileIndex == -1 )
	return;

    this.girih.tiles.splice( selectedTileIndex, 1 );
    this.redraw();
}

IKRS.GirihCanvasHandler.prototype.addTile = function( tile ) {

    // Add internal properties to the tile
    tile._props = { selected:              false,
		    hovered:               false,
		    highlightedEdgeIndex:  -1,
		  };
    // this.tiles.push( tile );
    this.girih.addTile( tile );
}

IKRS.GirihCanvasHandler.prototype._locateTileAtPoint = function( point ) {

    for( var i = 0; i < this.girih.tiles.length; i++ ) {

	// window.alert( "[_locateTileAtPoint] tile[" + i + "].containsPoint(...)=" + this.tiles[i].containsPoint(point) );
	if( this.girih.tiles[i].containsPoint(point) )
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
    this._drawInnerTilePolygons( tile );
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

	/*
	var imgBounds = new IKRS.BoundingBox2( imgProperties.source.x,
					       imgProperties.source.x + imgProperties.source.width,
					       imgProperties.source.y,
					       imgProperties.source.y + imgProperties.source.height
					     );
					     */
	var imgBounds = new IKRS.BoundingBox2( imgProperties.source.x * imageObject.width,
					       (imgProperties.source.x + imgProperties.source.width) * imageObject.width,
					       imgProperties.source.y * imageObject.height,
					       (imgProperties.source.y + imgProperties.source.height) * imageObject.height
					     );
	var polyImageRatio = new IKRS.Point2( originalBounds.getWidth() / imgBounds.getWidth(),
					      originalBounds.getHeight() / imgBounds.getHeight()
					    );
	//window.alert( "polyImageRatio=" + polyImageRatio );

	this.context.clip();
	var imageX = this.drawOffset.x + position.x * this.zoomFactor + originalBounds.xMin * this.zoomFactor;
	var imageY = this.drawOffset.y + position.y * this.zoomFactor + originalBounds.yMin * this.zoomFactor;	
	var imageW = (originalBounds.getWidth() + imgProperties.destination.xOffset*imageObject.width*polyImageRatio.x) * this.zoomFactor; 
	var imageH = (originalBounds.getHeight() + imgProperties.destination.yOffset*imageObject.height*polyImageRatio.y) * this.zoomFactor; 

	
	this.context.translate( imageX + imageW/2.0, 
				imageY + imageH/2.0 //+ imgProperties.destination.yOffset*polyImageRatio.y //imageY + imageH/2.0 
			      );
	
	this.context.rotate( angle ); 
	
	var drawStartX = (-originalBounds.getWidth()/2.0) * this.zoomFactor; 
	var drawStartY = (-originalBounds.getHeight()/2.0) * this.zoomFactor; 
	this.context.drawImage( imageObject,
				imgProperties.source.x*imageObject.width,                    // source x
				imgProperties.source.y*imageObject.height,                   // source y
				imgProperties.source.width*imageObject.width,                // source width
				imgProperties.source.height*imageObject.height,              // source height
				drawStartX + imgProperties.destination.xOffset*imageObject.width*polyImageRatio.x*0.5,         // destination x
				drawStartY + imgProperties.destination.yOffset*imageObject.height*polyImageRatio.y*0.5,        // destination y
				(originalBounds.getWidth() - imgProperties.destination.xOffset*imageObject.width*polyImageRatio.x) * this.zoomFactor,       // destination width
				(originalBounds.getHeight() - imgProperties.destination.yOffset*imageObject.height*polyImageRatio.y) * this.zoomFactor      // destination height
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

    // Adjacent tile presets available for this tile/edge/option?
    //window.alert( "tileType=" + tileType + ", highlightedEdgeIndex=" + highlightedEdgeIndex );
    if( !IKRS.Girih.TILE_ALIGN[tileType] )
	return;

    //window.alert( "IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex]=" + IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex] );
    if( !IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex] )
	return;
    
    
    var presets = IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex]; //[presetTileType];

    // Has any adjacent tiles at all?
    // (should, but this prevents the script from raising unwanted exceptions)
    if( !presets || presets.length == 0 )
	return null;

    
    var optionIndex = this.adjacentTileOptionPointer % presets.length;
    if( optionIndex < 0 )
	optionIndex = presets.length + optionIndex;

    var tileAlign      = presets[optionIndex];
    
    //if( tileAlign.tileType == 2 ) 
//	window.alert( "A" + tileAlign.toString() );
    var tile = tileAlign.createTile();
    //if( tileAlign.tileType == 2 ) 
//	window.alert( "B" + tile.toString() );
    // Make position relative to the hovered tile
    tile.position.add( position ); 
    tile.position.rotate( position, angle );
    tile.angle += angle;

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
    
    var adjacentTile = this._resolveCurrentAdjacentTilePreset(  tileType,
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
    if( !adjacentTile )
	return;

    //var previewPosition = tileAlign.position.clone();
    //previewPosition.rotate( position,   // the original tile position
			    

    // Draw adjacent tile
    this.context.globalAlpha = 0.5;  // 50% transparency
    this._drawPolygonFromPoints( adjacentTile.vertices, 
				 adjacentTile.position, 
				 adjacentTile.angle,
				 adjacentTile.computeBounds(), // originalBounds,
				 { unselectedEdgeColor: "#000000",
				   selectedEdgeColor:   "#FF0000"
				 },
				 adjacentTile.imageProperties,
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

IKRS.GirihCanvasHandler.prototype._drawInnerTilePolygons = function( tile ) {

    for( var i = 0; i < tile.innerTilePolygons.length; i++ ) {

	this._drawInnerTile( tile, i );

    }

}

IKRS.GirihCanvasHandler.prototype._drawInnerTile = function( tile, index ) {

    var polygon = tile.innerTilePolygons[ index ];
    
    this._drawPolygonFromPoints( polygon,   // points,
				 tile.position, 
				 tile.angle,
				 IKRS.BoundingBox2.computeFromPoints(polygon), //originalBounds,
				 { unselectedEdgeColor: "#ff0000",
				   selectedEdgeColor:   "#f00000"
				 },    // colors,
				 null, // imgProperties,
				 null, // imageObject,
				 -1,   // highlightedEdgeIndex,
				 true  // drawOutlines
			       ); 
    

}

IKRS.GirihCanvasHandler.prototype._drawTiles = function() { 
    
    for( var i = 0; i < this.girih.tiles.length; i++ ) {	
	this._drawTile( this.girih.tiles[i] );
    }

    // Finally draw the selected tile's hovering edge
    var hoveredTileIndex = this._locateHoveredTile();;
    if( hoveredTileIndex != -1 ) {
	var tile = this.girih.tiles[ hoveredTileIndex ]; 
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
					);;
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

    //this._drawCircleTest();
 
}


IKRS.GirihCanvasHandler.prototype._drawCircleTest = function() {

    
    var circleA = new IKRS.Circle( IKRS.Point2.ZERO_POINT,
				   50
				 );
    var circleB = new IKRS.Circle( new IKRS.Point2( 50, 50 ),
				   75
				 );
				 
    /*
    var circleA = new IKRS.Circle( new IKRS.Point2(-32.422985673746936, 44.62641128904119), //  IKRS.Point2.ZERO_POINT,
				    29
				  );
    var circleB = new IKRS.Circle( new IKRS.Point2(-20.038507163126532, -27.58063897255945),
				   29
				 );
    */
    
    this._drawCircleIntersections( circleA, circleB );
}

IKRS.GirihCanvasHandler.prototype._drawCircleIntersections = function( circleA, circleB ) {

    var intersection = circleA.computeIntersectionPoints( circleB );
    if( intersection ) {

	this._drawCrosshairAt( intersection.pointA, false );
	this._drawCrosshairAt( intersection.pointB, false );

    }
    
    this._drawCircle( circleA );
    this._drawCircle( circleB );

}

IKRS.GirihCanvasHandler.prototype._drawCircle = function( circle ) {

    //window.alert( "circle=" + circle.toString() );
    
    this.context.strokeStyle = "#FF0000";
    //this.context.line
    this.context.beginPath();
    this.context.arc( circle.center.x * this.zoomFactor + this.drawOffset.x,
		      circle.center.y * this.zoomFactor + this.drawOffset.y,
		      circle.radius * this.zoomFactor,
		      0,
		      Math.PI*2
		    );
    //this.context.endPath();
    this.context.stroke();

}


IKRS.GirihCanvasHandler.prototype.constructor = IKRS.GirihCanvasHandler;

