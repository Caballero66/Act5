const baseDeDatosPreguntas = 
{
    rock: [
        { 
            id: 1, 
            opciones: ["Despacito", "Sweet child o' mine", "Risk", "Iron Man"], 
            correcta: "Iron Man", 
            audioUrl: "../../Recursos/cancionesQuizMusical/Ironman.flac",
            tituloCancion: "Iron Man",
            imagenAlbum: "../../Recursos/portadaParanoid.jfif"
        },
        { 
            id: 2, 
            opciones: ["Paranoid", "Its my life", "Highway to Hell", "Darte Remix"], 
            correcta: "Paranoid",
            audioUrl: "../../Recursos/cancionesQuizMusical/Paranoid.flac",
            tituloCancion: "Paranoid",
            imagenAlbum: "../../Recursos/portadaParanoid.jfif"
        },
        {
            id: 3,
            opciones: ["Heaven's Door", "Its my life", "Highway to Hell", "Darte Remix"],
            correcta: "Its my life",
            audioUrl: "../../Recursos/cancionesQuizMusical/ItsMyLife.flac",
            tituloCancion: "Its my life",
            imagenAlbum: "../../Recursos/portadaCrush.jfif"
        }
    ],
    metal:[
        {
            id: 4,
            opciones: ["Break Stuff", "Given up", "Till I colapse", "El Garrobero"],
            correcta: "Break Stuff",
            audioUrl: "../../Recursos/cancionesQuizMusical/BreakStuff.flac",
            tituloCancion: "Break Stuff",
            imagenAlbum: "../../Recursos/portadaSignificantOther.jfif",
        },
        {
            id: 5,
            opciones: ["Enter Sandman", "My generation", "Freak on a Leash", "Mil horas"],
            correcta: "Freak on a Leash",
            audioUrl: "../../Recursos/cancionesQuizMusical/FreakOnALeash.flac",
            tituloCancion: "Freak on a Leash",
            imagenAlbum: "../../recursos/portadaKorn.jfif"
        },
        {
            id: 6,
            opciones: ["Chop Suey", "Numb", "In the End", "La Flaca"],
            correcta: "In the End",
            audioUrl: "../../Recursos/cancionesQuizMusical/InTheEnd.flac",
            tituloCancion: "In the End",
            imagenAlbum: "../../recursos/portadadHybridTheory.jpg"
        }
    ],
    hiphop: [
        {
            id: 7,
            opciones: ["Lose Yourself", "Juicy", "Ambitionz az a Ridah", "La Gasolina"],
            correcta: "Ambitionz az a Ridah",
            audioUrl: "../../Recursos/cancionesQuizMusical/Ambitionz.flac",
            tituloCancion: "Ambitionz az a Ridah",
            imagenAlbum: "../../recursos/portadaAllEyesOnMe.jpg"
        },
        {
            id: 8,
            opciones: ["California Love", "Gin and Juice", "Big Pimpin'", "Keep their Heads Ringin'"],
            correcta: "Keep their Heads Ringin'",
            audioUrl: "../../Recursos/cancionesQuizMusical/KeepTheirHeads.flac",
            tituloCancion: "Keep their Heads Ringin'",
            imagenAlbum: "../../recursos/portadaDrDre.jpg"
        },
        {
            id: 9,
            opciones: ["C.R.E.A.M.", "Nuthin' but a 'G' Thang", "In Da Club", "Window Shopper"],
            correcta: "Window Shopper",
            audioUrl: "../../Recursos/cancionesQuizMusical/WindowShopper.flac",
            tituloCancion: "Window Shopper",
            imagenAlbum: "../../recursos/portadaWindowShopper.jfif"
        }
    ]
}


let categoriaSeleccionada = "";
let preguntasActuales = [];
let indicePregunta = 0;
let puntaje = 0;
let temporizadorAudio = null;
let temporizadorRespuesta = null;
let temporizadorRevelacion = null;
let tiempoRestante = 0;
let reproductorAudio = new Audio();

$(document).ready(inicializarEventos);

function inicializarEventos() {
    $(".tarjetaCategoria").on("click", manejarSeleccionCategoria);
    $("#botonInstrucciones").on("click", alternarInstrucciones);
    $("#botonIniciar").on("click", iniciarPartida);
    $("#botonReiniciar").on("click", reiniciarAplicacion);
    $("#contenedorOpciones").on("click", ".botonOpcion", evaluarRespuesta);
}

function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
    $(pantallaOcultar).fadeOut(300, function() {$(pantallaMostrar).fadeIn(300);
    });
}

function alternarInstrucciones() {
    $("#panelInstrucciones").slideToggle(300);
}

function manejarSeleccionCategoria() {
    categoriaSeleccionada = $(this).data("categoria");
    cambiarPantalla("#pantallaCategorias", "#pantallaInstrucciones");
}

function desordenarAleatoriamente(arreglo) {
    return arreglo.sort(() => Math.random() - 0.5);
}

function prepararPreguntas() {
    const preguntasOriginales = baseDeDatosPreguntas[categoriaSeleccionada] || [];
    preguntasActuales = desordenarAleatoriamente([...preguntasOriginales]);
}

function iniciarPartida() {
    puntaje = 0;
    indicePregunta = 0;
    actualizarMarcadorPuntos();
    prepararPreguntas();

    reproductorAudio.play().then(() => {
        reproductorAudio.pause();
    }).catch(() => {
    });

    cambiarPantalla("#pantallaInstrucciones", "#pantallaPregunta");
    cargarPreguntaVisual();
}

function actualizarMarcadorPuntos() {
    $("#contadorPuntos").text(`Puntos: ${puntaje}`);
}

function cargarPreguntaVisual() {
    detenerTemporizadores();
    const preguntaActual = preguntasActuales[indicePregunta];
    const opcionesMezcladas = desordenarAleatoriamente([...preguntaActual.opciones]);
    
    $("#contenedorOpciones").empty().addClass("opcionesDeshabilitadas");
    $(".ondaMusical").show();
    
    opcionesMezcladas.forEach(opcion => {
        const botonHtml = `<button class="botonOpcion">${opcion}</button>`;
        $("#contenedorOpciones").append(botonHtml);
    });

    ejecutarFaseAudio(preguntaActual.audioUrl)
    $("#indicadorTiempo").text("Escucha la pista...");
    reproductorAudio.src = preguntaActual.audioUrl;
    
    reproductorAudio.play().catch(error => {
        console.warn("El navegador bloqueó la reproducción automática:", error);
    });
    
    temporizadorAudio = setTimeout(() => {
        finalizarFaseAudio();
    }, 10000);
}

function ejecutarFaseAudio(rutaAudio) {
    detenerTemporizadores();
    $("#indicadorTiempo").text("Escucha la pista...");
    reproductorAudio.src = rutaAudio;
    
    temporizadorAudio = setTimeout(() => {
        finalizarFaseAudio();
    }, 10000);
}

function finalizarFaseAudio() {
    reproductorAudio.pause();
    $(".ondaMusical").hide();
    $("#contenedorOpciones").removeClass("opcionesDeshabilitadas");
    iniciarConteoRespuesta();
}

function iniciarConteoRespuesta() {
    if (temporizadorRespuesta) {
        clearInterval(temporizadorRespuesta);
    }
    
    tiempoRestante = 10;
    actualizarTextoReloj();
    
    temporizadorRespuesta = setInterval(() => {
        tiempoRestante--;
        actualizarTextoReloj();
        
        if (tiempoRestante <= 0) {
            procesarFinDeTiempo();
        }
    }, 1000);
}

function actualizarTextoReloj() {
    $("#indicadorTiempo").text(`Tiempo: ${tiempoRestante}s`);
}

function detenerTemporizadores() {
    if (temporizadorAudio) {
        clearTimeout(temporizadorAudio);
        temporizadorAudio = null;
    }
    if (temporizadorRespuesta) {
        clearInterval(temporizadorRespuesta);
        temporizadorRespuesta = null;
    }
    if (temporizadorRevelacion) {
        clearTimeout(temporizadorRevelacion);
        temporizadorRevelacion = null;
    }

    reproductorAudio.pause();
    reproductorAudio.currentTime = 0;
}

function procesarFinDeTiempo() {
    detenerTemporizadores();
    $("#contenedorOpciones").addClass("opcionesDeshabilitadas");
    marcarRespuestaCorrectaGlobal();
    programarSiguientePregunta();
}

function evaluarRespuesta(evento) {
    detenerTemporizadores();
    $("#contenedorOpciones").addClass("opcionesDeshabilitadas");
    
    const botonSeleccionado = $(evento.currentTarget);
    const textoSeleccionado = botonSeleccionado.text();
    const preguntaActual = preguntasActuales[indicePregunta];

    if (textoSeleccionado === preguntaActual.correcta) {
        botonSeleccionado.addClass("respuestaCorrecta");
        puntaje++;
        actualizarMarcadorPuntos();
    } else {
        botonSeleccionado.addClass("respuestaIncorrecta");
        marcarRespuestaCorrectaGlobal();
    }

    programarSiguientePregunta();
}

function marcarRespuestaCorrectaGlobal() {
    const preguntaActual = preguntasActuales[indicePregunta];
    $(".botonOpcion").each(function() {
        if ($(this).text() === preguntaActual.correcta) {
            $(this).addClass("respuestaCorrecta");
        }
    });
}

function programarSiguientePregunta() {
    detenerTemporizadores();
    temporizadorRevelacion = setTimeout(() => {
        ejecutarEscenaRevelacion();
    }, 1500);
}

function ejecutarEscenaRevelacion() {
    detenerTemporizadores();
    
    const preguntaActual = preguntasActuales[indicePregunta];
    
    $("#imagenAlbum").attr("src", preguntaActual.imagenAlbum);
    $("#textoTituloCancion").text(preguntaActual.correcta);
    
    cambiarPantalla("#pantallaPregunta", "#pantallaRevelacion");
    
    temporizadorRevelacion = setTimeout(() => {
        avanzarSiguientePregunta();
    }, 5000);
}

function avanzarSiguientePregunta() {
    indicePregunta++;
    
    if (indicePregunta < preguntasActuales.length) {
        cambiarPantalla("#pantallaRevelacion", "#pantallaPregunta");
        cargarPreguntaVisual();
    } else {
        mostrarResultados();
    }
}

function mostrarResultados() {
    $("#puntajeFinal").text(puntaje);
    cambiarPantalla("#pantallaRevelacion", "#pantallaResultados");
}

function reiniciarAplicacion() {
    detenerTemporizadores();
    cambiarPantalla("#pantallaResultados", "#pantallaCategorias");
}