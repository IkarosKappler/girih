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


function onLoad() {
    
    canvas                    = document.getElementById("polygon_canvas");
    context                   = canvas.getContext( "2d" );

    canvas.onmousedown        = mouseDownHandler;

    redraw();
}


var mouseDownHandler = function(e) { 

    var parent = this;

    var rect = parent.getBoundingClientRect();
    var left = e.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = e.clientY - rect.top  - parent.clientTop  + parent.scrollTop;

    var point = new IKRS.Point2( left, top );

    window.alert( "relativePoint=" + point + "\n" +
		  "polyA.containsPoint()=" + polyA.containsPoint(point) + "\n" +
		  "polyB.containsPoint()=" + polyB.containsPoint(point) + "\n" 
		); 
  
};


function redraw() {
    
    //var lineA = new IKRS.Line2( new IKRS.Point2(100,200), new IKRS.Point2(200,300) );
    //var lineB = lineA.clone();
    //window.alert( "lineA.isColinearWith(lineB)=" + lineA.isColinearWith(lineB, 0.001) );

    
    // Clear screen
    context.fillStyle = "#ffffff";
    context.fillRect( 0, 0, canvasWidth, canvasHeight );
    //context.fill();

    // First: create two polygons
    polyA = new IKRS.Polygon();
    polyA.addVertex( new IKRS.Point2( 100, 100 ) );
    polyA.addVertex( new IKRS.Point2( 500, 100 ) );
    polyA.addVertex( new IKRS.Point2( 500, 400 ) );
    polyA.addVertex( new IKRS.Point2( 150, 500 ) );
    polyA.addVertex( new IKRS.Point2(  50, 300 ) );
    polyA.multiplyScalar( 0.5 ).translateXY( 200, 300 );  // The polys got a bit too large
    var boundsA = polyA.computeBoundingBox();

    polyB = new IKRS.Polygon();
    polyB.addVertex( new IKRS.Point2( 300, 140 ) );
    polyB.addVertex( new IKRS.Point2( 600,  30 ) );
    polyB.addVertex( new IKRS.Point2( 900, 160 ) );
    polyB.addVertex( new IKRS.Point2( 650, 650 ) );
    polyB.addVertex( new IKRS.Point2( 300, 300 ) );
    polyB.addVertex( new IKRS.Point2( 600, 200 ) );
    polyB.multiplyScalar( 0.5 ).translateXY( 200, 300 );  // The polys got a bit too large
    var boundsB = polyB.computeBoundingBox();
    
    //window.alert( polyB.vertices[0] );
    
    //var superBounds = boundsA.computeUnion( boundsB );
    //drawBoundingBox( superBounds, "#888888" );
    


    // Draw them
    if( document.forms["poly_form"].elements["draw_polygon_edges"].checked ) {
	drawPolygon( polyA, "#00a800" );
	drawPolygon( polyB, "#0000a8" );
    }
    drawCrosshairsFromPointList( polyA.vertices, "#00a800" );    
    drawCrosshairsFromPointList( polyB.vertices, "#0000a8" );
    
    
    // Then compute the extended polygons
    //  - extendedA
    //  - extendedB
    //  - intersectionGraph
    //  - intersectionList
    var edgeIntersection = polyA.computeIntersectingEdgePolygons( polyB );
    
    for( var i = 0; i < edgeIntersection.intersectionList.length; i++ ) {

	var indexPair = edgeIntersection.intersectionList[i];
	//drawCrosshairAt( edgeIntersection.extendedA.vertices[ indexPair.a ], "#a80000" );

    }


    // Make triangle anywhere (just for circum-circle testing)
    /*
    var triangleA     = new IKRS.Triangle( polyA.vertices[1],
					   polyB.vertices[5],
					   edgeIntersection.extendedA.vertices[ edgeIntersection.intersectionList[2].a ]
					 );
    */
    var triangleA     = new IKRS.Triangle( polyB.vertices[0],
					   polyA.vertices[1],
					   edgeIntersection.extendedA.vertices[ 5 ]
					 );
    var circumCircleA = triangleA.computeCircumCircle( 1.0e-6 ); // epsilon: better 1 pixel?
    drawCircle( circumCircleA, "#ff8800" );


    /*
    // Collect all points ...
    var pointGraph = new IKRS.Graph2(); 
    // ... first from polygon A ...
    pointGraph.addVertices( polyA.vertices );
    // ... then from polygon B ...
    pointGraph.addVertices( polyB.vertices );
    // ... collect points from the intersecting edges ...
    for( var i = 0; i < edgeIntersection.intersectionList.length; i++ ) {
	var indexPair = edgeIntersection.intersectionList[i];
	// Note that the points at indexPair.a and indexPair.b are equal!
	// (the indexPair list describes the intersection points of both polygons)
	pointGraph.addVertex( edgeIntersection.extendedA.vertices[ indexPair.a ] ); // clone?	
    }

    // Print point set?
    for( var i = 0; i < pointGraph.vertices.length; i++ ) {
	drawCrosshairAt( pointGraph.vertices[i], "#000000" );
    }


    // Add fixed edges to the graph
    for( var i = 0; i <= polyA.vertices; i++ ) {
	pointGraph.addEdge( polyA.vertices[i], polyA.getVertexAt(i+1) );
    }
    for( var i = 0; i <= polyB.vertices; i++ ) {
	pointGraph.addEdge( polyB.vertices[i], polyB.getVertexAt(i+1) );
    }


    // Calculate bounding triangle
    var superBounds = pointGraph.computeBoundingBox(); // boundsA.computeUnion( boundsB );
    drawBoundingBox( superBounds, "#888888" );
    var boundingTriangle = superBounds.computeBoundingTriangle();
    drawTriangle( boundingTriangle, "#a8a8a8" );
    //window.alert( "boundingTriangle=" + boundingTriangle.toString() );
    // Scale the triangle a bit bigger to avoid points lying on the triangle edges.
    // Warning: scale from the CENTER OF THE BOUNDING BOX!
    boundingTriangle
	.translate( superBounds.getCenterPoint().invert() ) 
	.multiplyScalar( 1.2 )
	.translate( superBounds.getCenterPoint() ); 
    drawTriangle( boundingTriangle, "#880000" );

    
    if( document.forms["poly_form"].elements["draw_triangulation"].checked ) {
	var triangles = pointGraph.triangulate();
	for( var i in triangles ) {
	    drawTriangle( triangles[i], "#00a8a8" );
	}
    }
    */

        
    // Triangulate each extended polygon by itself
    var extendedGraphA = new IKRS.Graph2( edgeIntersection.extendedA.vertices );
    //extendedGraphA.addVertices( edgeIntersection.extendedA.vertices );
    var extendedGraphB = new IKRS.Graph2( edgeIntersection.extendedB.vertices );
    //extendedGraphB.addVertices( edgeIntersection.extendedB.vertices );

    var trianglesA = extendedGraphA.triangulate();
    var trianglesB = extendedGraphB.triangulate();

    /*
    var countA = 0;
    for( var i in trianglesA )
	countA++;
    var countB = 0;
    for( var i in trianglesB )
	countB++;
    window.alert( "edgeIntersection.extendedA.vertices.length=" + edgeIntersection.extendedA.vertices.length + ",\n" +
		  "extendedGraphA.vertices.length=" + extendedGraphA.vertices.length + ",\n" +
		  "trianglesA.length=" + trianglesA.length + ",\n" +
		  "trianglesA{counted}=" + countA );		  
    // Non-null elements
    //window.alert( "countedA=" + countA + ", triangles=A" + trianglesA );   
    window.alert( "edgeIntersection.extendedB.vertices.length=" + edgeIntersection.extendedB.vertices.length + ",\n" +
		  "extendedGraphB.vertices.length=" + extendedGraphB.vertices.length + ",\n" +
		  "trianglesB.length=" + trianglesB.length + ",\n" +
		  "trianglesB{counted}=" + countB );
    */

    //window.alert( "countedB=" + countB + ", trianglesB=" + trianglesB );
    
    if( document.forms["poly_form"].elements["draw_single_triangulation"].checked ) {
	drawTriangulation( trianglesA, "#00a800" );
	drawTriangulation( trianglesB, "#0000a8" );
    }
    

    // Check for duplicate triangles
    /*
    for( var a in trianglesA ) {
	var tA = trianglesA[a];
	drawTriangle( tA, "#ffff00" );
	for( var b in trianglesB ) {
	    var tB = trianglesB[b];	    
	    if( tA.equalVertices(tB) )
		window.alert( "EQUAL a=" + b + ", b=" + b );
	}	
	window.alert( "Next iteration (a=" + a + ")" );
    }
    */
    
    // Now there might be _real_ polygon edges, that do not occur in the respective
    // triangulation. But these edges MUST be inserted. So detect all edges from the
    // extended polygon, that really intersect the triangulation. Add these intersection
    // points (from the triangulation) to the extended polygon.
    var superExtendedGraphA = _computeExtendedGraphFromTriangleIntersection( polyA, // edgeIntersection.extendedA,
									     trianglesA );
    var superExtendedGraphB = _computeExtendedGraphFromTriangleIntersection( polyB, // edgeIntersection.extendedB,
									     trianglesB );
    drawBoundingBox( superExtendedGraphA.computeBoundingBox(), "#00a8a8" );
    drawBoundingBox( superExtendedGraphB.computeBoundingBox(), "#00a8a8" );
    
    /*
    window.alert( "superExtendedGraphA.vertices.length=" + superExtendedGraphA.vertices.length + "\n" +
		  "superExtendedGraphB.vertices.length=" + superExtendedGraphB.vertices.length
		);
    */
    /*
    for( var i = 0; i < superExtendedGraphA.vertices.length; i++ ) {
	drawCrosshairAt( superExtendedGraphA.vertices[i], "#FF00FF" );
    }
    for( var i = 0; i < superExtendedGraphB.vertices.length; i++ ) {
	drawCrosshairAt( superExtendedGraphB.vertices[i], "#FF00FF" );
    }
    */
    
    /*
    // Check for duplicates
    for( var i in superExtendedGraphB.vertices ) {
	var tmpA = superExtendedGraphB.vertices[i];
	for( var e in superExtendedGraphB.vertices ) {
	    var tmpB = superExtendedGraphB.vertices[e];
	    if( tmpA == tmpB )
		; // window.alert( "["+i+"/" + superExtendedGraphB.vertices.length + "] equal" );
	}
    }
    */
    

    // The super graph contains all relevant vertices (maybe more in the current implementation)
    // Triangulate it. For each triangle from the triangulation is true:
    //  - it is fully contained in polygonA
    //    OR
    //  - it is fully contained in polygonB
    //    OR
    //  - it has no intersection with polygonA nor with polygonB
    //    (completely outside, only if at least one polygon is not convex)
    // This leads to the fact: 
    //    Each triangle's center point tells if the whole triangle is contained
    //    in polygon{A,B} or nor ^^
    
    var superExtendedVertices = new IKRS.ArraySet(); //superExtendedGraphA.vertices
    
    for( var i in superExtendedGraphA.vertices ) {
	superExtendedVertices.addUnique( superExtendedGraphA.vertices[i] );
	drawCrosshairAt( superExtendedGraphA.vertices[i], "#00a800" );
    }
    for( var i in superExtendedGraphB.vertices ) {
	superExtendedVertices.addUnique( superExtendedGraphB.vertices[i] );
	drawCrosshairAt( superExtendedGraphB.vertices[i], "#0000a8" );
    }


    // Triangulate super point set
    var superExtendedGraph = new IKRS.Graph2( superExtendedVertices.elements );
    // Detect null entries?    
    /*
    for( var i in superExtendedVertices.elements ) {
	if( !superExtendedVertices[i] || superExtendedVertices[i] == undefined )
	    window.alert( "[" + i +"] " + superExtendedVertices[i] );
    }
    */

    // Draw super bounds
    drawBoundingBox( superExtendedGraph.computeBoundingBox(), "#888888" );
    
    //window.alert( "superExtendedGraph.vertices.length=" + superExtendedGraph.vertices.length );
    
    for( var i in superExtendedGraph.vertices ) {
	//drawCrosshairAt( superExtendedGraph.vertices[i], "#FF0088" );
    }
    //drawEdge( edgeIntersection.extendedB.getEdgeAt(9), "#006600" );
    //drawPolygon( edgeIntersection.extendedB, "#006600" ); 
    
    
    var superTriangulation = superExtendedGraph.triangulate();

    
    // Detect all triangles that are inside both polygons.
    if( document.forms["poly_form"].elements["fill_intersection"].checked ) {
	for( var i in superTriangulation ) {

	    var triangle = superTriangulation[i];
	    // Find any point _inside_ the triangle
	    var centroid = triangle.getCentroid();
	    
	    //drawCrosshairAt( centroid, "#FF00FF" );	    

	    // Compute intersection with the AND (&&) operator :)  
	    if( polyA.containsPoint(centroid) && polyB.containsPoint(centroid) ) {
		fillTriangle(triangle, "#c8c8c8");
	    }
	    
	}
    } // END if

    if( document.forms["poly_form"].elements["draw_extended_triangulation"].checked ) {
	drawTriangulation( superTriangulation, "#ffff00" );
    }


    // Finally join the intersecting triangles into new polygons (the intertection
    // parts are not nececarily connected!)
    

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
