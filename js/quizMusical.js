const baseDeDatosPreguntas = {
    rock: [
        { id: 1, opciones: ["Despacito", "Sweet child o' mine", "Risk", "Thunderstruck"], correcta: "Sweet child o' mine", audioUrl: "ruta-audio-1.mp3" },
        { id: 2, opciones: ["Paranoid", "Welcome to the Jungle", "Titi me Pregunto", "Ironman"], correcta: "Paranoid", audioUrl: "ruta-audio-2.mp3" },
        { id: 3, opciones: ["Heaven's Door", "Its my life", "Highway to Hell", "Darte Remix"], correcta: "Its my life", audioUrl: "ruta-audio-2.mp3" },
    ],
    metal: [
        { id: 3, opciones: ["Michael Jackson", "Madonna", "Prince", "Elton John"], correcta: "Michael Jackson", audioUrl: "ruta-audio-3.mp3" }
    ]
};

let categoriaSeleccionada = "";
let preguntasActuales = [];
let indicePregunta = 0;
let puntaje = 0;
let temporizadorAudio = null;
let temporizadorRespuesta = null;
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
    cambiarPantalla("#pantallaInstrucciones", "#pantallaPregunta");
    cargarPreguntaVisual();
}

function actualizarMarcadorPuntos() {
    $("#contadorPuntos").text(`Puntos: ${puntaje}`);
}

function cargarPreguntaVisual() {
    const preguntaActual = preguntasActuales[indicePregunta];
    const opcionesMezcladas = desordenarAleatoriamente([...preguntaActual.opciones]);
    
    $("#contenedorOpciones").empty().addClass("opcionesDeshabilitadas");
    $(".ondaMusical").show();
    
    opcionesMezcladas.forEach(opcion => {
        const botonHtml = `<button class="botonOpcion">${opcion}</button>`;
        $("#contenedorOpciones").append(botonHtml);
    });

    ejecutarFaseAudio(preguntaActual.audioUrl);
}

function ejecutarFaseAudio(rutaAudio) {
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
    clearTimeout(temporizadorAudio);
    clearInterval(temporizadorRespuesta);
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
        if ($(this).text() === preguntaActual.correcta) {$(this).addClass("respuestaCorrecta");
        }
    });
}

function programarSiguientePregunta() {
    setTimeout(() => {
        indicePregunta++;
        if (indicePregunta < preguntasActuales.length) {
            $("#contenedorOpciones").fadeOut(300, function() {
                cargarPreguntaVisual();
                $(this).fadeIn(300);
            });
        } else {
            mostrarResultados();
        }
    }, 8000);
}

function mostrarResultados() {
    $("#puntajeFinal").text(puntaje);
    cambiarPantalla("#pantallaPregunta", "#pantallaResultados");
}

function reiniciarAplicacion() {
    cambiarPantalla("#pantallaResultados", "#pantallaCategorias");
}