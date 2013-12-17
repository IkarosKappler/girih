/**
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

var canvasWidth               = 1024;
var canvasHeight              = 768;
var canvas                    = null;
var context                   = null;


function onLoad() {
    
    canvas                    = document.getElementById("polygon_canvas");
    context                   = canvas.getContext( "2d" );

    redraw();
}

function redraw() {
    
    // Clear screen
    context.fillStyle = "#ffffff";
    context.fillRect( 0, 0, canvasWidth, canvasHeight );
    //context.fill();

    // First: create two polygons
    var polyA = new IKRS.Polygon();
    polyA.addVertex( new IKRS.Point2( 100, 100 ) );
    polyA.addVertex( new IKRS.Point2( 500, 100 ) );
    polyA.addVertex( new IKRS.Point2( 500, 400 ) );
    polyA.addVertex( new IKRS.Point2( 150, 500 ) );
    polyA.addVertex( new IKRS.Point2(  50, 300 ) );
    var boundsA = polyA.computeBoundingBox();

    var polyB = new IKRS.Polygon();
    polyB.addVertex( new IKRS.Point2( 300, 140 ) );
    polyB.addVertex( new IKRS.Point2( 600,  30 ) );
    polyB.addVertex( new IKRS.Point2( 900, 160 ) );
    polyB.addVertex( new IKRS.Point2( 650, 650 ) );
    polyB.addVertex( new IKRS.Point2( 300, 300 ) );
    polyB.addVertex( new IKRS.Point2( 600, 200 ) );
    var boundsB = polyB.computeBoundingBox();
    
    var superBounds = boundsA.computeUnion( boundsB );
    drawBoundingBox( superBounds, "#888888" );
    


    // Draw them
    if( document.forms["poly_form"].elements["draw_polygon_edges"].checked ) {
	drawPolygon( polyA, "#00a800" );
	drawPolygon( polyB, "#0000a8" );
    }
    drawCrosshairsFromPointList( polyA.vertices, "#00a800" );    
    drawCrosshairsFromPointList( polyB.vertices, "#0000a8" );
    
    //drawCrosshairAt( new IKRS.Point2( 200, 200 ) );
    
    // Then compute the extended polygons
    //  - extendedA
    //  - extendedB
    //  - intersectionGraph
    var edgeIntersection = polyA.computeIntersectingEdgePolygons( polyB );
    
    for( var i = 0; i < edgeIntersection.intersectionList.length; i++ ) {

	var pair = edgeIntersection.intersectionList[i];
	drawCrosshairAt( edgeIntersection.extendedA.vertices[ pair.a ], "#a80000" );

    }


    // Make triangle anywhere (just for circum-circle testing)
    var triangleA     = new IKRS.Triangle( polyA.vertices[1],
					   polyB.vertices[5],
					   edgeIntersection.extendedA.vertices[ edgeIntersection.intersectionList[2].a ]
					 );
    var circumCircleA = triangleA.computeCircumCircle( 1.0 ); // epsilon: 1 pixel
    drawCircle( circumCircleA, "#ff8800" );
    

}

function drawPolygon( poly, color ) {

    if( !poly || poly.vertices.length <= 1 )
	return;

    context.beginPath();
    context.moveTo( poly.vertices[0].x, 
		    poly.vertices[0].y
		  );
    
    for( var i = 0; i <= poly.vertices.length; i++ ) {
	var v = poly.getVertexAt(i);
	context.lineTo( v.x, v.y );
    }
    
    context.strokeStyle = color; //"#000000";
    context.stroke();

}

function drawCircle( circle, color ) {
    context.beginPath();
    context.arc( circle.center.x ,
		 circle.center.y,
		 circle.radius,   // 5.0,
		 0.0, 
		 Math.PI*2.0,
		 false 
	       );
    context.strokeStyle = color;
    context.stroke();
}

function drawCrosshairsFromPointList( points, color ) {
    
    for( var i = 0; i < points.length; i++ ) {	
	drawCrosshairAt( points[i], color );
    }

}


function drawCrosshairAt( position, color ) {

    //if( isSelected ) this.context.strokeStyle = "#FF0000";
    //else             this.context.strokeStyle = "#000000";
    context.strokeStyle = color;

    context.beginPath();

    context.moveTo( position.x,
			 position.y - 5
		       );
    context.lineTo( position.x,
			 position.y + 5
		       );

    context.moveTo( position.x - 5,
			 position.y 
		       );
    context.lineTo( position.x + 5,
			 position.y 
		       );
    
    context.arc( position.x ,
		      position.y,
		      5.0,
		      0.0, 
		      Math.PI*2.0,
		      false 
		    );

    context.stroke(); 
    //context.closePath();
}

function drawBoundingBox( box, color ) {

    //window.alert( JSON.stringify(box) );

    context.beginPath();
    context.rect( box.xMin,
		  box.yMin,
		  box.getWidth(),
		  box.getHeight()
		);
    context.strokeStyle = color;
    context.stroke();

}

window.addEventListener( "load", onLoad );
