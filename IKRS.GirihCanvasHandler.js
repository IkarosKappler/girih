/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.GirihCanvasHandler = function( imageObject ) {
    
    IKRS.Object.call( this );
    
    this.imageObject               = imageObject;

    this.canvasWidth               = 800;
    this.canvasHeight              = 600;
    
    this.canvas                    = document.getElementById("girih_canvas");
    // Make a back-reference for event handling
    this.canvas.girihCanvasHandler = this; 
    this.context                   = this.canvas.getContext( "2d" );    
    
    this.drawOffset                = new IKRS.Point2( 400, 300 );
    this.zoomFactor                = 1.0;
    
    this.tiles                     = [];  

    this.drawProperties            = { drawBoxes:    false,
				       drawOutlines: true,
				       drawTexture:  true
				     };
    
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
    /*
    window.addEventListener( "mousedown", this.mouseDownHandler, false );
    window.addEventListener( "mouseup",   this.mouseUpHandler,   false );
    window.addEventListener( "mousemove", this.mouseMoveHandler, false );
    */
};

/*
IKRS.GirihCanvasHandler.prototype._translateClickPoint = function( point ) {

    point.x = point.x/this.zoomFactor - this.drawOffset.x;
    point.y = point.y/this.zoomFactor - this.drawOffset.y;

    return point;
}
*/

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

    // window.alert( "X" );

    var delta = 0;
    if (!e) // For IE.
	e = window.event;
    if (e.wheelDelta) { // IE/Opera.
	delta = e.wheelDelta/120;
    } else if (e.detail) { // Mozilla case. 
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
    this.girihCanvasHandler.clearSelection();

    // Set the tile's 'selected' state
    this.girihCanvasHandler.tiles[tileIndex]._props.selected = true; // !this.girihCanvasHandler.tiles[tileIndex]._props.selected;
    this.girihCanvasHandler.redraw();
}

IKRS.GirihCanvasHandler.prototype.mouseUpHandler = function( e ) {
    
}

IKRS.GirihCanvasHandler.prototype.mouseMoveHandler = function( e ) {

    // Find selected tile
    var selectedTileIndex = this.girihCanvasHandler._locateSelectedTile();
    if( selectedTileIndex == -1 )
	return;

    var tile      = this.girihCanvasHandler.tiles[ selectedTileIndex ];
    
    // Locate the edge the mouse hovers over
    var point     = this.girihCanvasHandler._translateMouseEventToRelativePosition( this, e );

    // Only continue if the mouse is over the currently selected tile?
    if( !tile.containsPoint(point) ) {
	DEBUG( "[mouseMoved] mouse not over any tile." );
	return;
    }

    // Try to find the point from the center of the edge, with
    // a radius of half the edge's length
    var highlightedEdgeIndex = tile.locateEdgeAtPoint( point, 
						       tile.size/2.0 * this.girihCanvasHandler.zoomFactor
						     );
    /*
    window.alert( tile.vertices.length );
    if( highlightedEdgeIndex >= tile.vertices.length )
    	window.alert( "Mhmm ... ");
    */
    
    DEBUG( "[mouseMoved] selectedTileIndex=" + selectedTileIndex + ", highlightedEdgeIndex=" + highlightedEdgeIndex );
    
    if( highlightedEdgeIndex == tile._props.highlightedEdgeIndex ) 
    	return;

    tile._props.highlightedEdgeIndex = highlightedEdgeIndex;
    //DEBUG( "[mouseMoved] _props=" + JSON.stringify(tile._props) );
    this.girihCanvasHandler.redraw();
}

IKRS.GirihCanvasHandler.prototype._locateSelectedTile = function() {
    for( var i = 0; i < this.tiles.length; i++ ) {
	if( this.tiles[i]._props.selected )
	    return i;
    }
    // Not found
    return -1; 
}

IKRS.GirihCanvasHandler.prototype.clearSelection = function() {
    for( var i = 0; i < this.tiles.length; i++ ) {
	this.tiles[i]._props.selected = false;
    }
}

IKRS.GirihCanvasHandler.prototype.addTile = function( tile ) {

    // Add internal properties to the tile
    tile._props = { selected:              false,
		    highlightedEdgeIndex:  -1
		  };
    this.tiles.push( tile );
}

IKRS.GirihCanvasHandler.prototype._locateTileAtPoint = function( point ) {

    for( var i = 0; i < this.tiles.length; i++ ) {

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
    //this.context.strokeStyle = "#000000";
    //window.alert( JSON.stringify(tile._props) );
    //window.alert( "hightlightedEdgeIndex=" + tile._props.highlightedEdgeIndex );
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
    /*
    if( tile._props.selected ) {
	this._drawHighlightedPolygonEdge( tile.vertices, 
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
    }
    */
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

    //window.alert( "highlightedEdgeIndex=" + highlightedEdgeIndex );
    //DEBUG( "highlightedEdgeIndex=" + highlightedEdgeIndex );

    this.context.save();

    this.context.beginPath();
    //var lastPoint  = new IKRS.Point2(0,0);
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
				imageY + imageH/2.0 
			      );
	
	//this.context.translate( );
	this.context.rotate( angle ); //-imgProperties.angle );
	
	var drawStartX = (-originalBounds.getWidth()/2.0) * this.zoomFactor; // -bounds.getWidth()/2.0;  // -imageW/2.0;
	var drawStartY = (-originalBounds.getHeight()/2.0) * this.zoomFactor; // -bounds.getHeight()/2.0; // -imageH/2.0;
	this.context.drawImage( imageObject,
				imgProperties.x, // 0,             // source x
				imgProperties.y, // 0,             // source y
				imgProperties.width,  // 500,           // source width
				imgProperties.height, // 460,           // source height
				drawStartX, // -imageX,        // destination x
				drawStartY, // -imageY,        // destination y
				imageW,        // destination width
				imageH         // destination height
			      );
	this.context.strokeStyle = "#ff8888;";
	this.context.rect( drawStartX,
			       drawStartY,
			       imageW,
			       imageH
			     );
    }
    

    // Draw outlines?
    if( drawOutlines ) {
	//window.alert( "Drawing outline ..." );
	this.context.lineWidth   = 1.0;
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
    
    var pointA = points[ highlightedEdgeIndex ];
    var pointB = points[ highlightedEdgeIndex+1 < points.length ? highlightedEdgeIndex+1 : 0 ];


    this.context.beginPath();
    this.context.lineTo( pointA.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 pointA.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );

    //if( points.length-1 == highlightedEdgeIndex ) this.context.strokeStyle = colors.selectedEdgeColor;
    //else                                          this.context.strokeStyle = colors.unselectedEdgeColor;
    this.context.lineTo( pointB.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 pointB.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.closePath();
    this.context.strokeStyle = colors.selectedEdgeColor;
    this.context.lineWidth   = 4.0;
    this.context.stroke(); 

    this.context.restore();

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
      
    /*
    this.context.rect( position.x * this.zoomFactor + bounds.getXMin() * this.zoomFactor + this.drawOffset.x, 
		       position.y * this.zoomFactor + bounds.getYMin() * this.zoomFactor + this.drawOffset.y, 
		       bounds.getWidth() * this.zoomFactor, 
		       bounds.getHeight() * this.zoomFactor );
    */
    this.context.stroke(); 
}


IKRS.GirihCanvasHandler.prototype._drawCoordinateSystem = function() {  

    this.context.strokeStyle = "#c8c8c8";
    this.context.beginPath();

    this.context.moveTo( this.canvasWidth/2.0,
			 0
		       );
    this.context.lineTo( this.canvasWidth/2.0,
			 this.canvasHeight
		       );

    this.context.moveTo( 0,
			 this.canvasHeight/2.0
		       );
    this.context.lineTo( this.canvasWidth,
			 this.canvasHeight/2.0
		       );

    this.context.stroke(); 
    this.context.closePath();
}

IKRS.GirihCanvasHandler.prototype._drawTiles = function() { 
    
    for( var i = 0; i < this.tiles.length; i++ ) {	
	this._drawTile( this.tiles[i] );
    }

    // Finally draw the selected tile's hovering edge
    var selectedTileIndex = this._locateSelectedTile();
    if( selectedTileIndex == -1 )
	return;
    var tile = this.tiles[ selectedTileIndex ]; 
    this._drawHighlightedPolygonEdge( tile.vertices, 
				      tile.position, 
				      tile.angle,
				      tile.computeBounds(),  // tileBounds,
				      { unselectedEdgeColor: "#000000",
					selectedEdgeColor:   "#FF0000"
				      },
				      tile.imageProperties,
				      this.imageObject,
				      tile._props.highlightedEdgeIndex,
				      this.drawProperties.drawOutlines
				    );
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

