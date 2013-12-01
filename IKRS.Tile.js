/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Tile = function( size, 
		      position, 
		      angle ) {
    
    IKRS.Object.call( this );

    if( typeof angle == "undefined" )
	angle = 0.0;
    
    this.size            = size;
    this.position        = position;
    this.angle           = angle;
    this.vertices        = [];
    this.imageProperties = null;

};

IKRS.Tile.prototype._getTranslatedPoint = function( index ) {

    return this.vertices[index].clone().rotate( this.position, this.angle ).add( this.position );

}

IKRS.Tile.prototype.containsPoint = function( point ) {

    // window.alert( this._getTranslatedPoint );
    
    // Thanks to
    // http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    var i, j = 0;
    var c = false;
    for (i = 0, j = this.vertices.length-1; i < this.vertices.length; j = i++) {
	vertI = this._getTranslatedPoint( i ); // this.vertices[i].clone().add( this.position );
	vertJ = this._getTranslatedPoint( j ); // this.vertices[j].clone().add( this.position );
    	if ( ((vertI.y>point.y) != (vertJ.y>point.y)) &&
    	     (point.x < (vertJ.x-vertI.x) * (point.y-vertI.y) / (vertJ.y-vertI.y) + vertI.x) )
    	    c = !c;
    }
    return c;

}

/**
 *
 **/
IKRS.Tile.prototype.locateEdgeAtPoint = function( point,
						  tolerance
						) {
    if( this.vertices.length == 0 )
	return -1;


    var middle         = new IKRS.Point2( 0, 0 );
    var tmpDistance    = 0;
    var resultDistance = tolerance*2;   // definitely outside the tolerance :)
    var resultIndex    = -1;
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	var vertI = this._getTranslatedPoint( i ); 
	var vertJ = this._getTranslatedPoint( (i+1 < this.vertices.length ? i+1 : 0) ); 

	// Create a point in the middle of the edge	
	middle.x = vertI.x + (vertJ.x - vertI.x)/2.0;
	middle.y = vertI.y + (vertJ.y - vertI.y)/2.0;
	/*
	window.alert( "vertI=" + vertI.toString() + "\n" +
		      "middle=" + middle.toString() + "\n" +
		      "vertJ=" + vertJ.toString() + "\n" +
		      "point=" + point.toString() + "\n" +
		      "m.x=" + (vertI.x + (vertJ.x - vertI.x)/2.0) );
	*/
	tmpDistance = middle.distanceTo(point);
	// console.log( "tmpDistance=" + tmpDistance );
	if( tmpDistance <= tolerance && (resultIndex == -1 || tmpDistance < resultDistance) ) {
	    resultDistance = tmpDistance;
	    resultIndex    = i;
	}

    }

    return resultIndex;

}

IKRS.Tile.prototype.computeBounds = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.vertices );
}

IKRS.Tile.prototype._addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

IKRS.Tile.prototype.constructor = IKRS.Tile;

