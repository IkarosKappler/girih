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


IKRS.GirihCanvasHandler.prototype.redraw = function() {  

    this.context.fillStyle = "#F0F0F0";
    this.context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );
    
    // Make a test decagon
    var deca = new IKRS.Tile.Decagon( 50 );

    this.context.strokeStyle = "#000000";
    this.context.beginPath();
    var point = deca.vertices[0];
    this.context.moveTo( point.x * this.zoomFactor + this.drawOffset.x, 
			 point.y * this.zoomFactor + this.drawOffset.y
		       );
    for( var i = 1; i < deca.vertices.length; i++ ) {
	
	point = deca.vertices[i];
	//window.alert( "point=(" + point.x + ", "+ point.y + ")" );
	this.context.lineTo( point.x * this.zoomFactor + this.drawOffset.x, 
			     point.y * this.zoomFactor + this.drawOffset.y
			   );

    }
    this.context.stroke(); 
    this.context.closePath();


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
    
}



IKRS.GirihCanvasHandler.prototype.constructor = IKRS.GirihCanvasHandler;

