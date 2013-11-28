/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.GirihCanvasHandler = function() {
    
    IKRS.Object.call( this );

    this.canvasWidth           = 800;
    this.canvasHeight          = 600;
    
    this.canvas                = document.getElementById("girih_canvas");
    this.context               = this.canvas.getContext( "2d" );
    
    this.drawOffset            = new IKRS.Point2( 400, 300 );
    this.zoomFactor            = 1.0;

    this.redraw();

};

IKRS.GirihCanvasHandler.prototype._drawTile = function( tile ) {  

    this._drawCrosshairAt( tile.position );
    this._drawBoundingBox( tile.position,
			   tile.computeBounds(),
			   tile.angle 
			 );
    this.context.strokeStyle = "#000000";
    this._drawPolygonFromPoints( tile.vertices, tile.position, tile.angle );

    /*
    this.context.strokeStyle = "#000000";
    this.context.beginPath();
    var point      = tile.vertices[0].clone();
    point.rotate( IKRS.Point2.ZERO_POINT, tile.angle );
    var startPoint = point.clone();
    this.context.moveTo( point.x * this.zoomFactor + this.drawOffset.x + tile.position.x, 
			 point.y * this.zoomFactor + this.drawOffset.y + tile.position.y
		       );
    for( var i = 1; i < tile.vertices.length; i++ ) {
	
	point.set( tile.vertices[i] );
	point.rotate( IKRS.Point2.ZERO_POINT, tile.angle );
	//window.alert( "point=(" + point.x + ", "+ point.y + ")" );
	this.context.lineTo( point.x * this.zoomFactor + this.drawOffset.x + tile.position.x, 
			     point.y * this.zoomFactor + this.drawOffset.y + tile.position.y
			   );

    }
    // Close path
    this.context.lineTo( startPoint.x * this.zoomFactor + this.drawOffset.x + tile.position.x, 
			 startPoint.y * this.zoomFactor + this.drawOffset.y + tile.position.y
		       );
    this.context.stroke(); 
    this.context.closePath();
    */

}

IKRS.GirihCanvasHandler.prototype._drawPolygonFromPoints = function( points,
								     position, 
								     angle 
								   ) {  

    this.context.beginPath();
    var point      = points[0].clone();
    point.rotate( IKRS.Point2.ZERO_POINT, angle );
    var startPoint = point.clone();
    this.context.moveTo( point.x * this.zoomFactor + this.drawOffset.x + position.x, 
			 point.y * this.zoomFactor + this.drawOffset.y + position.y
		       );
    for( var i = 1; i < points.length; i++ ) {
	
	point.set( points[i] );
	point.rotate( IKRS.Point2.ZERO_POINT, angle );
	//window.alert( "point=(" + point.x + ", "+ point.y + ")" );
	this.context.lineTo( point.x * this.zoomFactor + this.drawOffset.x + position.x, 
			     point.y * this.zoomFactor + this.drawOffset.y + position.y
			   );

    }
    // Close path
    this.context.lineTo( startPoint.x * this.zoomFactor + this.drawOffset.x + position.x, 
			 startPoint.y * this.zoomFactor + this.drawOffset.y + position.y
		       );
    this.context.stroke(); 
    this.context.closePath();

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
				 angle 
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

IKRS.GirihCanvasHandler.prototype.redraw = function() {  

    this.context.fillStyle = "#F0F0F0";
    this.context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );
    
    this._drawCoordinateSystem();
    
    var tileSize = 50;
    // Make a test decagon
    var deca = new IKRS.Tile.Decagon( tileSize, 
				      new IKRS.Point2(-50,-60)  // position				      
				    );
    this._drawTile( deca );

    // Make a test pentagon
    var penta = new IKRS.Tile.Pentagon( tileSize,
					new IKRS.Point2(-166, -18),  // position
					-4.0 * IKRS.Girih.MINIMAL_ANGLE
				      );
    this._drawTile( penta );

    // Make a test irregular hexagon
    var irHex = new IKRS.Tile.IrregularHexagon( tileSize,
						new IKRS.Point2(-120, -160),  // position
						-2.0 * IKRS.Girih.MINIMAL_ANGLE
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
				    IKRS.Girih.MINIMAL_ANGLE     // 18.0 * (Math.PI/180.0)
				   );
    this._drawTile( tie );
   


    /*
    // Make a test circle
    this.context.beginPath();
    var steps = 20;
    var origin = new IKRS.Point2( 100, 100 );
    point = origin.clone();
    point.x += 75;
    this.context.moveTo( point.x * this.zoomFactor + this.drawOffset.x, 
			 point.y * this.zoomFactor + this.drawOffset.y
		       );
    for( var i = 0; i < steps; i++ ) {
	
	point = origin.clone();
	point.x += 75;
	point.rotate( origin, 
		      (i+1) * (Math.PI/steps) 
		    );
	this.context.lineTo( point.x * this.zoomFactor + this.drawOffset.x, 
			     point.y * this.zoomFactor + this.drawOffset.y
			   );

    }
    this.context.stroke(); 
    this.context.closePath();
    */
    
}



IKRS.GirihCanvasHandler.prototype.constructor = IKRS.GirihCanvasHandler;

