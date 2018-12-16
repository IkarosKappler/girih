# Girih

@author   Ikaros Kappler
@date     2013-12
@modified 2015-03-19 Ikaros Kappler (SVG export added).
@version  0.1.2
@license  GPLv2.0


A Girih tesselation tool.


# Differences from the Lu-Steinhardt-Tilesets
* I added the narrow rhombus tile, which is part of the penrose set but 
  _not_ part of the original girih tile set!
* I added an octagon test but the angles do not match together.



Thanks to Cronholm144 for the gireh tile template image.
@url http://commons.wikimedia.org/wiki/File:Girih_tiles.svg


### Todo
* Implement proper object inheritance for tile subclassing.
* Use a proper drawing library (with zooming, panning, selecting, dragging, ...).


Changelog
=========
[2018-12-16]
 * Added the octagon tile just for testing.

[2015-10-26]
 * Added the 't' key handling for toggling textures on/off.

[2013-12-17]
 * Basic polygon- and circle-intersection, triangle datastructures for
   Point sets.

[2013-12-15]
 * Added narrow Penrose rhombus tile (not part of girihs).



Thanks to
=========
* [FileSaver.js] Eli Grey
