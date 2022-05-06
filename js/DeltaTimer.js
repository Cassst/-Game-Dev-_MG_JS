class Time{

    constructor(){

        this.time = Date.now();
        this.mDeltaTime = 0;
        this.updateTime();

    }

    updateTime(){

        this.mDeltaTime = ( Date.now() - this.time ) * 0.001;
        this.time = Date.now();
        requestAnimationFrame( this.updateTime.bind( this ) );
    
    }

    deltaTime(){

        return this.mDeltaTime;

    }

};

let Timer = {

    now: "",
    day: 0,
    month: 0,
    year: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    miliSeconds: 0,

};

function InitTimer(){

    while( true ) {

        Timer.now = new Date();
        Timer.hours = Timer.now.getHours();
        Timer.minutes = Timer.now.getMinutes();
        Timer.seconds = Timer.now.getSeconds();
        Timer.miliSeconds = Timer.now.getMiliseconds();
        Timer.day = Timer.now.getDate();
        Timer.month = Timer.now.getMonth();
        Timer.year = Timer.now.getFullYear();
        
    }
};

const typeCrono = {

    Forward: 0,
    Backward: 1,

}

class Crono{

    constructor( id, type ){

        this.id = id;
        this.emp; //fecha inicial ( al momento de comenzar )
        this.elcrono; // control de setTimeout
        this.view = "00:00:00";
        this.precision = 10; //velocidad del setTimeout ( milisegundos )

        this.end; //controlar el reloj marcha atras
        this.time = 0; //duracion en segundos de la cuenta atras

        //variables para el control del tiempo en la cuneta atras

        this._seconds = 1000;
        this._minute  = this._seconds * 60;
        this._hours   = this._minute * 60;
        this._day     = this._hours * 24;

        if( type === undefined ){

            this.typeCrono = typeCrono.Forward;

        }else{

            this.typeCrono = type;

        }

        //Variables
        this.day; this.hour; this.minute; this.second

        this.eventCronoTerminated = new CustomEvent( "onCronoTerminated", { detail: { id: this.id }} )

    };

    run(){

        this.emp = new Date(); //fecha inicial ( al pulsar )

        if( this.typeCrono == typeCrono.Forward ){

            this.day = 0;
            this.elcrono = setTimeout( this.relojForward.bind( this ), this.precision ); //funcion del temporizador

        };

        if( this.typeCrono == typeCrono.Backward ){

            this.end = new Date();
            this.end.setSeconds( this.time + this.end.getSeconds() );
            this.elcrono = setTimeout( this.relojBackward.bind( this ), this.precision ); //funcion del temporizador
        };

    };

    relojForward(){

        this.actual = new Date(); //fecha a cada instante

        //timepo del crono ( cro ) = fecha instante ( actual ) - fecha inicial ( emp )

        let cro = this.actual - this.emp; //milisegundos transcurridos
        let cr = new Date(); //pasamos el numero de milisegundos a objeto fecha
        cr.setTime( cro );

        ///Obtener los distintos formatos de fecha

        let cs = cr.getMilliseconds(); 
        cs = cs / 10; //centesimas de segundo
        cs = Math.round( cs ); //redondear las centesimas
        let sg = cr.getSeconds();
        let mn = cr.getMinutes();
        let ho = cr.getHours()-1;

        //actualizar si es mas de 24 horas

        if( ho > 23 ){
            
            this.day++;
            ho = 0;
        }

        ho = ho < 10 ? '0' + ho : ho;
        cs = cs < 10 ? '0' + cs : cs;
        sg = sg < 10 ? '0' + sg : sg;
        mn = mn < 10 ? '0' + mn : mn;

        //Mostrar resultados

        this.view        = ho + ":" + mn + ":" + sg + ":" + cs;
        this.hour        = ho;
        this.minute      = mn;
        this.second      = sg;
        this.miliSeconds = cs;
        this.elcrono = setTimeout( this.relojForward.bind( this ), this.precision );
    };

    relojBackward(){

        let now      = new Date();
        let distance = this.end - now;

        if( distance < 0 ){

            miliSeconds = 0;
            
            document.dispatchEvent( this.eventCronoTerminated );
            clearInterval( this.elcrono );
            return;

        }

        let days        = Math.floor( distance / this._day );
        let hours       = Math.floor( ( distance % this._day) / this._hour);
        let minutes     = Math.floor( ( distance % this._hour) / this._minute);
        let seconds     = Math.floor( ( distance % this._minute) / this._second);
        let miliSeconds = Math.floor( ( distance % this._second));

        hours       = hours       < 10  ? '0' + hours : hours;
        minutes     = minutes     < 10  ? '0' + minutes : minutes;
        seconds     = seconds     < 10  ? '0' + seconds : seconds;
        miliSeconds = miliSeconds < 100 ? '0' + miliSeconds : miliSeconds;
        miliSeconds = miliSeconds < 10  ? '00' + miliSeconds : miliSeconds;

        this.view    = days + " " + hours + ":" + minutes + ":" + seconds + ":" + miliSeconds;
        this.elcrono = setTimeout( this.relojBackward.bind( this ), this.precision );

    };

    //Funcion que detiene el timpo

    stop(){

        clearInterval( this.elcrono );

    };

};
