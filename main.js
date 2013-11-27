/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/

var girih = new IKRS.Girih();

//var tile = new IKRS.Tile();



function onLoad() {
    
    this.girihCanvasHandler = new IKRS.GirihCanvasHandler();
    //window.alert( "LOADED" );

    /*
    this.canvasWidth           = canvas_width;
    this.canvasHeight          = canvas_height;
    
    this.canvas                = document.getElementById("gireh_canvas");
    this.context               = this.canvas.getContext( "2d" );

    
    redraw();
    */
}


window.addEventListener( "load", onLoad );