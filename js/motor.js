

let loop = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,
    fps: 0,

    iterar: function(registroTemporal){
        loop.idEjecucion = window.requestAnimationFrame( loop.iterar );
        loop.update( registroTemporal );
        loop.play();

        if( registroTemporal - loop.ultimoRegistro > 999 ){
            loop.ultimoRegistro = registroTemporal;
            console.log(loop.fps);
            loop.aps = 0;
            loop.fps = 0;
        };
    },

    update: function(){
        loop.aps++;
    },

    //Imprimir en pantalla
    play: function(){
        loop.fps++;
        borrarCanvas();

        ctx.beginPath();
        ctx.font = "20px verdana";
        ctx.fillStyle = "yellow";
        ctx.fillText( Timer.now, 15,20 );
        ctx.stroke();

        ctx.beginPath();
        ctx.font = "20px verdana";
        ctx.fillStyle = "yellow";
        ctx.fillText( myReloj.view, 15,60 );
        ctx.stroke();


    },

};

//Ventana de renderización
let canvas = document.getElementById( "canvas" );
let ctx = canvas.getContext('2d');
let margen = 10;
let canvasTop = (  margen / 2 );
let canvasLeft = ( margen  / 2 );
let canvasWidth = window.innerWidth-margen;
let canvasHeight = window.innerHeight-margen;

function borrarCanvas(){
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

//Canvas Responsive
function ResizeWindow(){
    canvas.style.top = canvasTop + "px";
    canvas.style.left = canvasLeft + "px";
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";
};

//Concurrent Thread
Concurrent.Thread.create(InitTimer);

window.addEventListener( "load", function ( e ){
    ResizeWindow();
    loop.iterar();
})

window.addEventListener( "resize", function( e ) {
    ResizeWindow();
});

//Prueba reloj
let myReloj = new Crono( "Crono 1", typeCrono.Backward);
myReloj.time = 5;
myReloj.run();