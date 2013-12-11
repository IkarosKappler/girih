/**
 * The Girih class defines the rules and contrains how girih tiles
 * are allowed the be arrange to each other.
 *
 * For this a small wrapper class containing the relative tile
 * position and relative tile rotation is required.
 *
 * @author Ikaros Kappler
 * @date 2013-12-01
 * @modified 2013-12-11 Ikaros Kappler (Added the Penrose-Rhombus).
 * @version 1.0.0
 **/


IKRS.TileAlign = function( tileType,
			   edgeLength,
			   position,
			   angle 
			 ) {

    IKRS.Object.call( this );

    this.tileType   = tileType;
    this.edgeLength = edgeLength;
    this.position   = position;
    this.angle      = angle;

}

IKRS.TileAlign.prototype.createTile = function() {

    switch( this.tileType ) {
    case IKRS.Girih.TILE_TYPE_DECAGON:
	return new IKRS.Tile.Decagon( this.edgeLength, this.position.clone(), this.angle );
    case IKRS.Girih.TILE_TYPE_PENTAGON:
	return new IKRS.Tile.Pentagon( this.edgeLength, this.position.clone(), this.angle );
    case IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON:
	return new IKRS.Tile.IrregularHexagon( this.edgeLength, this.position.clone(), this.angle );
    case IKRS.Girih.TILE_TYPE_RHOMBUS:
	return new IKRS.Tile.Rhombus( this.edgeLength, this.position.clone(), this.angle );	
    case IKRS.Girih.TILE_TYPE_BOW_TIE:
	return new IKRS.Tile.BowTie( this.edgeLength, this.position.clone(), this.angle );	

    case IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS:
	return new IKRS.Tile.PenroseRhombus( this.edgeLength, this.position.clone(), this.angle );	

    default:
	throw "Cannot create tiles from unknown tile types (" + this.tileType + ").";
    }
}

IKRS.TileAlign.prototype.clone = function() {

    return new IKRS.TileAlign( this.tileType,
			       this.edgeLength,
			       this.position.clone(),
			       this.angle
			     );

}

IKRS.TileAlign.prototype.toString = function() {
    return "[TileAlign]=tileType=" + this.tileType + ", edgeLength=" + this.edgeLength + ", position=" + this.position.toString() + ", angle=" + this.angle + "]";
}

IKRS.TileAlign.prototype.constructor = IKRS.TileAlign;