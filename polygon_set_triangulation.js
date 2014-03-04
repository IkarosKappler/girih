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
    polyB.multiplyScalar( 0.5 ).translateXY( 200, 300 );  // The polys got a bit too large
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

    /*
    window.alert( "relativePoint=" + point + "\n" +
		  "polyA.containsPoint()=" + polyA.containsPoint(point) + "\n" +
		  "polyB.containsPoint()=" + polyB.containsPoint(point) + "\n" 
		); 
  */
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
 

    // For testing (not used later)
    // Then compute the extended polygons
    //  - extendedA
    //  - extendedB
    //  - intersectionGraph
    //  - intersectionList
    //  - allPoints
    var edgeIntersection = polyA._computeIntersectingEdgePolygons( polyB );
    //window.alert( "edgeIntersection.allPoints.elements.length=" + edgeIntersection.allPoints.elements.length );
    drawCrosshairsFromPointList( edgeIntersection.allPoints.elements, "#FF0000" );
    //for( var i in edgeIntersection.intersectionGraph.vertices ) {
	
    //}


    // A triangle set
    //var superTriangulation = polyA._computeIntersectionTriangulation( polyB );
    //window.alert( superTriangulation );
    


    //if( document.forms["poly_form"].elements["draw_extended_triangulation"].checked ) {
//	drawTriangulation( superTriangulation.triangles, "#ffff00" );
    //}


    // Finally join the intersecting triangles into new polygons (the intertection
    // parts are not nececarily connected!)
    //var adjacencies = superTriangulation.computeAdjacencies();

    // Compute intersection
    /*
    var intersectionSet = new IKRS.TriangleSet();
    for( var i in superTriangulation.triangles ) {

	var triangle = superTriangulation.triangles[i];
	// Find any point _inside_ the triangle
	var centroid = triangle.getCentroid();
	
	// Draw centroid?
	//drawCrosshairAt( centroid, "#FF00FF" );	    

	// Draw triangle vertices?
	//drawCrosshairAt( triangle.getPointA(), "#FF00FF" );
	//drawCrosshairAt( triangle.getPointB(), "#FF00FF" );
	//drawCrosshairAt( triangle.getPointC(), "#FF00FF" );

	// Compute intersection with the AND (&&) operator :)  
	if( polyA.containsPoint(centroid) && polyB.containsPoint(centroid) ) {

	    intersectionSet.addUnique( triangle );

	    if( document.forms["poly_form"].elements["fill_intersection"].checked ) 
		fillTriangle(triangle, "#ff0000");
	    // window.alert( "Triangle " + i + " is now red." );
	    if( document.forms["poly_form"].elements["fill_intersection"].checked ) 
		fillTriangle(triangle, "#c8c8c8");
	}
	
    }
    */

    //var adjacencies = intersectionSet.computeAdjacencies();    
    
    /*
    window.alert( "intersectionSet.triangles.length=" + intersectionSet.triangles.length + ",\n" +
		  "adjacencies.outerEdgeList.length=" + adjacencies.outerEdgeList.length + ",\n" +
		  JSON.stringify( intersectionSet.triangles )
		  );
		  */
/*
    for( i in adjacencies.outerEdgeList ) {

	var pair = adjacencies.outerEdgeList[ i ];
	
	if( pair.b == 0 ) drawEdge( superTriangulation.triangles[ pair.a ].getEdgeA(), "#ff0000" );
	if( pair.b == 1 ) drawEdge( superTriangulation.triangles[ pair.a ].getEdgeB(), "#ff0000" );
	if( pair.b == 2 ) drawEdge( superTriangulation.triangles[ pair.a ].getEdgeC(), "#ff0000" );
    }
*/


    // Irgendwas    
    var edgeIntersection = polyA._computeIntersectingEdgePolygons( polyB );

        
    // Triangulate each extended polygon by itself
    var extendedGraphA = new IKRS.Graph2( edgeIntersection.extendedA.vertices );
    var extendedGraphB = new IKRS.Graph2( edgeIntersection.extendedB.vertices );

    
    for( var i in extendedGraphA.vertices ) {
	this.drawCrosshairAt( extendedGraphA.vertices[i], "#008800" );	
    }
    for( var i in extendedGraphB.vertices ) {
	this.drawCrosshairAt( extendedGraphB.vertices[i], "#000088" );	
    }

    var intersectingVertexGraph   = new IKRS.Graph2( edgeIntersection.allPoints.elements );
    //window.alert( "edgeIntersection.allPoints=" + JSON.stringify(edgeIntersection.allPoints.elements) );
    var intersectingTriangulation = intersectingVertexGraph.triangulate();    
    for( var i in intersectingTriangulation ) {
	drawTriangulation( intersectingTriangulation, "#a8a800" );
    }


    // Compute intersecion between triangles and real polygon edges                 
    _computeExtendedGraphFromTriangleIntersection( polyA, intersectingTriangulation, intersectingVertexGraph );
    _computeExtendedGraphFromTriangleIntersection( polyB, intersectingTriangulation, intersectingVertexGraph );
    var pointComparator = new IKRS.PythagoreanPointComparator(1.0); // 1 pixel/unit
    /* 
    for( var t in intersectingTriangulation ) {
	var tri = intersectingTriangulation[t];
	var edgeA    = tri.getEdgeA();
	var edgeB    = tri.getEdgeA();
	var edgeC    = tri.getEdgeA();
	for( var a = 0; a <= polyA.vertices.length; a++ ) {
	    var polyEdge = polyA.getEdgeAt(a);	    
	    var intersectionPoint;
	    if( !polyEdge.equalEdgePoints(edgeA) && !polyEdge.isColinearWith(edgeA,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeA)) ) 
		intersectingVertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	    if( !polyEdge.equalEdgePoints(edgeB) && !polyEdge.isColinearWith(edgeB,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeB)) ) 
		intersectingVertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	    if( !polyEdge.equalEdgePoints(edgeC) && !polyEdge.isColinearWith(edgeC,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeC)) ) 
		intersectingVertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	}

	for( var b = 0; b <= polyB.vertices.length; b++ ) {
	    var polyEdge = polyB.getEdgeAt(b);
	    var intersectionPoint;
	    if( !polyEdge.equalEdgePoints(edgeA) && !polyEdge.isColinearWith(edgeA,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeA)) ) 
		intersectingVertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	    if( !polyEdge.equalEdgePoints(edgeB) && !polyEdge.isColinearWith(edgeB,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeB)) ) 
		intersectingVertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	    if( !polyEdge.equalEdgePoints(edgeC) && !polyEdge.isColinearWith(edgeC,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeC)) ) 
		intersectingVertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	}
    }
    */

    //window.alert( "superExtendedVertices.length=" + intersectingVertexGraph.vertices.length );
    for( var i in intersectingVertexGraph.vertices ) {
	drawCrosshairAt( intersectingVertexGraph.vertices[i], "#888800" );
    }


    // Now make a new triangulation from the extended set
    // Note: it's the same graph instance (point set was modified)
    var tempTriangulation = intersectingVertexGraph.triangulate();
    if( document.forms["poly_form"].elements["draw_extended_triangulation"].checked )
	; //drawTriangulation( tempTriangulation, "#a8a8a8" );
    

    
    // Now extend the graph a second time (the last time)
    var before = intersectingVertexGraph.vertices.length;
    //_computeExtendedGraphFromTriangleIntersection( polyA, tempTriangulation, intersectingVertexGraph );
    //_computeExtendedGraphFromTriangleIntersection( polyB, tempTriangulation, intersectingVertexGraph );
    _computeExtendedGraphFromInnerTriangleIntersection( intersectingTriangulation, tempTriangulation, intersectingVertexGraph, pointComparator );
    // And again add the intersection points with the polygons
    _computeExtendedGraphFromTriangleIntersection( polyA, tempTriangulation, intersectingVertexGraph );
    _computeExtendedGraphFromTriangleIntersection( polyB, tempTriangulation, intersectingVertexGraph );
    //window.alert( "before=" + before + ", after=" + intersectingVertexGraph.vertices.length );
    var superTriangulation = intersectingVertexGraph.triangulate();
    

    // Draw points that were newly added
    for( var i = before; i < intersectingVertexGraph.vertices.length; i++ ) {
	//window.alert( i );
	drawCrosshairAt( intersectingVertexGraph.vertices[i], "#FF0000" );
    }
    
    var finalTriangulation = intersectingVertexGraph.triangulate();
    
    if( document.forms["poly_form"].elements["draw_extended_triangulation"].checked )
	drawTriangulation( finalTriangulation, "#a8a8a8" );

    // Draw intersection
    if( document.forms["poly_form"].elements["fill_intersection"].checked ) {
	for( var t in finalTriangulation ) {
	    var tri      = finalTriangulation[t];
	    var centroid = tri.getCentroid();
	    if( polyA.containsPoint(centroid) && polyB.containsPoint(centroid) )
		fillTriangle( tri, "#ffa8a8" );
	}
    }

/*
    var trianglesA = extendedGraphA.triangulate();
    var trianglesB = extendedGraphB.triangulate();
    
    // An ArraySet
    var superExtendedVertices = polyA._computeInnerIntersectionPointsFromTriangulation( trianglesA, trianglesB );
    //window.alert( "superExtendedVertices.length=" + superExtendedVertices.length );
    for( var i in superExtendedVertices.elements ) {
	this.drawCrosshairAt( superExtendedVertices.elements[i], "#008800" );			      
    }
*/


    // Draw polygons again above all
    if( document.forms["poly_form"].elements["draw_polygon_edges"].checked ) {
	drawPolygon( polyA, "#00a800" );
	drawPolygon( polyB, "#0000a8" );
    }

};


function _computeExtendedGraphFromInnerTriangleIntersection( trianglesA, 
							     trianglesB, 
							     vertexGraph,
							     pointComparator
							   ) {
    
    //window.alert( vertexGraph );
    if( !vertexGraph )
	vertexGraph = new IKRS.Graph2();

    //var pointComparator = new IKRS.PythagoreanPointComparator(1.0); // 1 pixel/unit
    for( var a in trianglesA ) {
	var triA = trianglesA[a];
	for( var b in trianglesB ) {
	    var triB = trianglesB[b];
	    triA.computeTriangleIntersectionPoints(triB,vertexGraph,pointComparator);	    // Must just have an 'addUnique' function :)
	}
    }
    
    return vertexGraph;
};


function _computeExtendedGraphFromTriangleIntersection( poly, 
							triangles, 
							vertexGraph 
						      ) {
    
    //window.alert( vertexGraph );
    if( !vertexGraph )
	vertexGraph = new IKRS.Graph2();

    var pointComparator = new IKRS.PythagoreanPointComparator(1.0); // 1 pixel/unit
    for( var t in triangles ) {
	var tri = triangles[t];
	var edgeA    = tri.getEdgeA();
	var edgeB    = tri.getEdgeA();
	var edgeC    = tri.getEdgeA();
	for( var a = 0; a <= poly.vertices.length; a++ ) {
	    var polyEdge = poly.getEdgeAt(a);	    
	    var intersectionPoint;
	    if( !polyEdge.equalEdgePoints(edgeA) && !polyEdge.isColinearWith(edgeA,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeA)) ) 
		vertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	    if( !polyEdge.equalEdgePoints(edgeB) && !polyEdge.isColinearWith(edgeB,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeB)) ) 
		vertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	    if( !polyEdge.equalEdgePoints(edgeC) && !polyEdge.isColinearWith(edgeC,EPSILON) && (intersectionPoint = polyEdge.computeEdgeIntersection(edgeC)) ) 
		vertexGraph.addUniqueVertex(intersectionPoint,pointComparator);
	}

    }
    
    return vertexGraph;
};

/*
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
*/

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
