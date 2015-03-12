/**
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

var canvasWidth               = 1024;
var canvasHeight              = 768;
var canvas                    = null;
var context                   = null;

var polyA                     = null;
var polyB                     = null;


var mouseDownPoint            = null;
var mouseMovePoint            = null;

var EPSILON                   = 1.0e-6;

function onLoad() {
    
    canvas                    = document.getElementById("polygon_canvas");
    context                   = canvas.getContext( "2d" );

    canvas.onmousedown        = mouseDownHandler;

    canvas.addEventListener( "mousemove", this.mouseMoveHandler, false );
    canvas.addEventListener( "mouseup",   this.mouseUpHandler, false );
    //canvas.mousemove          = mouseMoveHandler;
    //canvas.mouseup            = mouseUpHandler;

    polyA = new IKRS.Polygon();
    polyA.addVertex( new IKRS.Point2( 100, 100 ) );
     polyA.addVertex( new IKRS.Point2( 200, 0 ) );
     polyA.addVertex( new IKRS.Point2( 250, 200 ) );
     polyA.addVertex( new IKRS.Point2( 260, 200 ) );
    polyA.addVertex( new IKRS.Point2( 500, 100 ) );
    polyA.addVertex( new IKRS.Point2( 500, 400 ) );
    polyA.addVertex( new IKRS.Point2( 150, 500 ) );
    polyA.addVertex( new IKRS.Point2(  50, 300 ) );
    polyA.multiplyScalar( 0.5 ).translateXY( 200, 300 );  // The polys got a bit too large
    //var boundsA = polyA.computeBoundingBox();

    
    polyB = new IKRS.Polygon();
    polyB.addVertex( new IKRS.Point2( 300, 140 ) );
    polyB.addVertex( new IKRS.Point2( 600,  30 ) );
    polyB.addVertex( new IKRS.Point2( 900, 160 ) );
    polyB.addVertex( new IKRS.Point2( 650, 650 ) );
    polyB.addVertex( new IKRS.Point2( 300, 300 ) );
    polyB.addVertex( new IKRS.Point2( 600, 200 ) );
    polyB.multiplyScalar( 0.5 ).translateXY( 200+200, 300 );  // The polys got a bit too large
    //var boundsB = polyB.computeBoundingBox();
    

    redraw();
}

function getRelativeClickPoint( parent, event ) {
    var rect = parent.getBoundingClientRect();
    var left = event.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = event.clientY - rect.top  - parent.clientTop  + parent.scrollTop;
    var point = new IKRS.Point2( left, top );
    return point;
}

var mouseDownHandler = function(e) { 

    //mouseDownPoint =

    /*
    var parent = this;
    var rect = parent.getBoundingClientRect();
    var left = e.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = e.clientY - rect.top  - parent.clientTop  + parent.scrollTop;
    var point = new IKRS.Point2( left, top );
    */
    var point = getRelativeClickPoint( this, e );
    mouseDownPoint = point;
    mouseMovePoint = point; //.clone();

    
    window.alert( "relativePoint=" + point + "\n" +
		  "polyA.containsPoint()=" + polyA.containsPoint(point) + "\n" +
		  "polyB.containsPoint()=" + polyB.containsPoint(point) + "\n" 
		); 
  
};

var mouseMoveHandler = function(e) { 

    //window.alert( "mouseMoved. mouseDownPoint=" + mouseDownPoint );

    if( !mouseDownPoint )
	return;
    
    //window.alert( this );
    var point = getRelativeClickPoint( this, e );


    var difference = mouseMovePoint.getDifference( point );
    //window.alert( difference );
    //window.alert( polyA );
    //for( var i = 0; i < polyA.vertices.length; i++ )    
    //for( var i in polyA.vertices )
	//window.alert( "[" + i + "] " + polyA.vertices[i] );
    polyA.translate( difference );
    

    mouseMovePoint = point;
    
    redraw();

    /*
    var parent = this;

    var rect = parent.getBoundingClientRect();
    var left = e.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = e.clientY - rect.top  - parent.clientTop  + parent.scrollTop;

    var point = new IKRS.Point2( left, top );

    window.alert( "relativePoint=" + point + "\n" +
		  "polyA.containsPoint()=" + polyA.containsPoint(point) + "\n" +
		  "polyB.containsPoint()=" + polyB.containsPoint(point) + "\n" 
		); 
  */
};


var mouseUpHandler = function(e) { 

    mouseDownPoint = null;
    mouseMovePoint = null;

    /*
    var parent = this;

    var rect = parent.getBoundingClientRect();
    var left = e.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = e.clientY - rect.top  - parent.clientTop  + parent.scrollTop;

    var point = new IKRS.Point2( left, top );

    window.alert( "relativePoint=" + point + "\n" +
		  "polyA.containsPoint()=" + polyA.containsPoint(point) + "\n" +
		  "polyB.containsPoint()=" + polyB.containsPoint(point) + "\n" 
		); 
  */
};


function redraw() {
    
    // Clear screen
    context.fillStyle = "#ffffff";
    context.fillRect( 0, 0, canvasWidth, canvasHeight );

    
    var boundsA = polyA.computeBoundingBox();
    var boundsB = polyB.computeBoundingBox();

    // Check if the algorihm still works if the polygons don't interset at all?
    //polyB.translateXY( 400, 0 );

    // Draw them
    if( document.forms["poly_form"].elements["draw_polygon_edges"].checked ) {
	drawPolygon( polyA, "#00a800" );
	drawPolygon( polyB, "#0000a8" );
    }
    drawCrosshairsFromPointList( polyA.vertices, "#00a800" );    
    drawCrosshairsFromPointList( polyB.vertices, "#0000a8" );
 
    
    var graphA     = new IKRS.Graph2( polyA.vertices );
    var graphB     = new IKRS.Graph2( polyB.vertices );
    var trianglesA = graphA.triangulate( false );  // Keep original edges?
    var trianglesB = graphB.triangulate( false );  // Keep original edges?
  
    
    for( var t in trianglesA ) {

	var tri = trianglesA[t];
	if( !tri )
	    continue;

	drawTriangle( tri, "#888888" );

    }

    for( var t in trianglesB ) {

	var tri = trianglesB[t];
	if( !tri )
	    continue;

	drawTriangle( tri, "#444444" );

    }



    

};

function _computeExtendedGraphFromTriangleIntersection( poly, triangles ) {

    var resultGraph = new IKRS.Graph2();

    for( var i = 0; i < poly.vertices.length; i++ ) {
    //for( var i in poly.vertices ) {

	var polyEdge = new IKRS.Line2( poly.getVertexAt(i), poly.getVertexAt(i+1) );
	for( var t in triangles ) {
	//for( var t = 0; t < triangles.length; t++ ) {

	    var tri    = triangles[t];

	    var edgeA = tri.getEdgeA();
	    var edgeB = tri.getEdgeB();
	    var edgeC = tri.getEdgeC();

	    //drawEdge( edgeA, "#ff0000" );



	    if( poly.hasEdge(edgeA) ||
		poly.hasEdge(edgeB) || 
		poly.hasEdge(edgeC) )
		continue;

	    var added = false;
	    added = _addToGraphIfEdgesIntersectInside( resultGraph, polyEdge, edgeA ); // tri.getEdgeA() );
	    //_addToGraphIfEdgesIntersectInside( resultGraph, polyEdge, edgeB ); // tri.getEdgeB() );
	    //_addToGraphIfEdgesIntersectInside( resultGraph, polyEdge, edgeC ); // tri.getEdgeC() );

	    //if( i == 9 ) // Last edge of graphB
	//	window.alert( "i=" + i + ", t=" + t + ", added=" + added );
	}
	
	resultGraph.addUniqueVertex( poly.getVertexAt(i) );
	
    }

    return resultGraph;
}

function _addToGraphIfEdgesIntersectInside( graph, edgeA, edgeB ) {

    if( edgeA.equalEdgePoints(edgeB) )
	return false;

    // Ignore co-linear edges
    if( edgeA.isColinearWith(edgeB,0.0001) ) // || edgeB.isColinearWith(edgeA,0.0001) ) // epsilon?
	return false;

	
    var intersectionPoint = edgeA.computeEdgeIntersection(edgeB);
    if( !intersectionPoint )
	return false;

    /*
    window.alert( "edgeA=" + edgeA + ",\n" +
		  "edgeB=" + edgeB + ",\n" +
		  "intersectionPoint=" + intersectionPoint 
		);
    */
    
    //window.alert( "Adding intersection point=" + intersectionPoint );
    graph.addUniqueVertex( intersectionPoint );
    return true;
}

function _addToUniqueArray( arr, item ) {
    for( var i in arr ) {
	if( arr[i] == item )
	    return;
    }
    arrpush( item );
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

function fillTriangle( triangle, color ) {

    context.beginPath();
    context.moveTo( triangle.a.x, triangle.a.y );
    context.lineTo( triangle.b.x, triangle.b.y );
    context.lineTo( triangle.c.x, triangle.c.y );
    context.lineTo( triangle.a.x, triangle.a.y );
    context.fillStyle = color;
    context.fill();

}

function drawTriangle( triangle, color ) {

    /*
    context.beginPath();
    context.moveTo( triangle.a.x, triangle.a.y );
    context.lineTo( triangle.b.x, triangle.b.y );
    context.lineTo( triangle.c.x, triangle.c.y );
    context.lineTo( triangle.a.x, triangle.a.y );
    context.strokeStyle = color;
    context.stroke();
    */
    //window.alert( "drawing edgeA" );
    drawEdge( triangle.getEdgeA(), color );
    //window.alert( "drawing edgeB" );
    drawEdge( triangle.getEdgeB(), color );
    //window.alert( "drawing edgeC" );
    drawEdge( triangle.getEdgeC(), color );

}

function drawTriangulation( triangles, color ) {
    for( var i in triangles ) {
	drawTriangle( triangles[i], color );
    }
}

function drawEdge( edge, color ) {
    context.beginPath();
    context.moveTo( edge.pointA.x, edge.pointA.y );
    context.lineTo( edge.pointB.x, edge.pointB.y );
    context.strokeStyle = color;
    context.stroke();
}

window.addEventListener( "load", onLoad );
