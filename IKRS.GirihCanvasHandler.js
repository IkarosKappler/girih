/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.GirihCanvasHandler = function( imageObject ) {
    
    IKRS.Object.call( this );
    
    this.imageObject           = imageObject;

    this.canvasWidth           = 800;
    this.canvasHeight          = 600;
    
    this.canvas                = document.getElementById("girih_canvas");
    this.context               = this.canvas.getContext( "2d" );
    
    this.drawOffset            = new IKRS.Point2( 400, 300 );
    this.zoomFactor            = 1.0;

    if( imageObject ) {

	// Init sub images
	// this.hexagonImage

    }
    
    this.tiles                 = [];

    // this.redraw();

};

IKRS.GirihCanvasHandler.prototype._drawTile = function( tile ) {  

    var tileBounds = tile.computeBounds();
    this._drawBoundingBox( tile.position,
			   tileBounds,
			   tile.angle 
			 );
    this.context.strokeStyle = "#000000";
    //window.alert( JSON.stringify(tile.imageProperties) );
    this._drawPolygonFromPoints( tile.vertices, 
				 tile.position, 
				 tile.angle,
				 tileBounds,
				 tile.imageProperties,
				 this.imageObject
			       );
    this._drawCrosshairAt( tile.position );

}

IKRS.GirihCanvasHandler.prototype._drawPolygonFromPoints = function( points,
								     position, 
								     angle,
								     originalBounds,
								     imgProperties,
								     imageObject
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
    
    if( imgProperties && imageObject ) { // typeof imgProperties != "undefined" ) {

	//this.context.clip();
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
    

    this.context.stroke(); 
    this.context.restore();

}

IKRS.GirihCanvasHandler.prototype._drawCrosshairAt = function( position ) {  

    this.context.strokeStyle = "#000000";
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
				 bounds
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
}


IKRS.GirihCanvasHandler.prototype.redraw = function() {  

    this.context.fillStyle = "#F0F0F0";
    this.context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );
    
    this._drawCoordinateSystem();
    
    this._drawTiles();
    
    /*
    var tileSize = 50;
    // Make a test decagon
    var deca = new IKRS.Tile.Decagon( tileSize, 
				      new IKRS.Point2(-50,-60)  // position				      
				    );
    this._drawTile( deca );

    // Make a test pentagon
    var penta = new IKRS.Tile.Pentagon( tileSize,
					new IKRS.Point2(-166, -18),  // position
					0 // -4.0 * IKRS.Girih.MINIMAL_ANGLE
				      );
    this._drawTile( penta );

    // Make a test irregular hexagon
    var irHex = new IKRS.Tile.IrregularHexagon( tileSize,
						new IKRS.Point2(-120, -160),  // position
						0.0 // -2.0 * IKRS.Girih.MINIMAL_ANGLE
					      );
    this._drawTile( irHex );

    // Make a test rhombus
    var rhomb = new IKRS.Tile.Rhombus( tileSize,
				       new IKRS.Point2(-160, -88)  // position
				     );
    this._drawTile( rhomb );

    // Make a test bow-tie
    var tie = new IKRS.Tile.BowTie( tileSize,
				    new IKRS.Point2(-16, -160),  // position
				    -IKRS.Girih.MINIMAL_ANGLE     // 18.0 * (Math.PI/180.0)
				   );
    this._drawTile( tie );
    */
   
}



IKRS.GirihCanvasHandler.prototype.constructor = IKRS.GirihCanvasHandler;

