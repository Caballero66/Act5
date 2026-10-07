 const preguntas = [

            {
                pregunta: "¿En que continente se encuentra la cordillera de los Andes?",
                imagen: "https://e.rpp-noticias.io/xlarge/2023/04/16/431443_1415772.jpg",
                opciones: [
                    "Asia",
                    "America del Sur",
                    "Europa"
                ],
                correcta: 1
            },

            {
                pregunta: "¿En que cordillera se encuentra el Monte Everest?",
                imagen: "https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg",
                opciones: [
                    "El Himalaya",
                    "El Atlas",
                    "Los Alpes"
                ],
                correcta: 0
            },

            {
                pregunta: "¿De que país es este Escudo?",
                imagen: "https://album.mediaset.es/eimg/10000/2021/10/18/clipping_AGlD4t_18bc.jpg",
                opciones: [
                    "Rumania",
                    "España",
                    "Andorra"
                ],
                correcta: 1
            },

            {
                pregunta: "¿Cuál es la capital de Canadá?",
                imagen: "https://static.vecteezy.com/system/resources/previews/009/767/160/non_2x/canada-flag-flag-of-canada-illustration-free-vector.jpg",
                opciones: [
                    "Toronto",
                    "Vancouver",
                    "Ottawa"
                ],
                correcta: 2
            },

            {
                pregunta: "¿Qué país sudamericano tiene más selva Amazónica?",
                imagen: "https://img.freepik.com/fotos-premium/arboles-selva-tropical-rio-amazonas-avobe-the-sky_702665-149.jpg?w=2000",
                opciones: [
                    "Brasil",
                    "Perú",
                    "Colombia"
                ],
                correcta: 0
            },

            {
                pregunta: "¿Cuál es por definición, el desierto más grande del mundo?",
                imagen: "https://www.buscador.com/wp-content/uploads/2020/10/el-desierto.jpg",
                opciones: [
                    "Sahara",
                    "Antártida",
                    "Arizona"
                ],
                correcta: 1
            },

            {
                pregunta: "¿De qué país es el canal que divide el océano Pacífico del Atlántico?",
                imagen: "https://oc.tutiempo.net/noticia/2025/10/separacion-atlantico-pacifico_1200.jpg",
                opciones: [
                    "Honduras",
                    "Costa Rica",
                    "Panamá"
                ],
                correcta: 2
            },

            {
                pregunta: "¿Aproximadamente qué porcentaje del planeta Tierra está cubierto por agua?",
                imagen: "https://img.olhardigital.com.br/wp-content/uploads/2021/11/agua-do-planeta-Terra.jpg",
                opciones: [
                    "70%",
                    "90%",
                    "100%"
                ],
                correcta: 0
            },

            {
                pregunta: "¿De qué país es esta bandera?",
                imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bandera_de_Ecuador.svg/1920px-Bandera_de_Ecuador.svg.png",
                opciones: [
                    "Colombia",
                    "Ecuador",
                    "Venezuela"
                ],
                correcta: 1
            },

            {
                pregunta: "¿De qué país es esta bandera?",
                imagen: "https://www.banderas-mundo.es/data/flags/w1600/id.png",
                opciones: [
                    "Polonia",
                    "Filipinas",
                    "Indonesia"
                ],
                correcta: 2
            }

        ];

        let preguntaActual = 0;
        let puntos = 0;
        let tiempo = 10;
        let temporizador;

        $('#botonInstrucciones').click(function () {

            $('#panelInstrucciones').slideToggle(300);

            const $boton = $(this);

            if ($boton.text() === 'Ver instrucciones') {

                $boton.text('Ocultar instrucciones');

            } else {

                $boton.text('Ver instrucciones');

            }

        });

        $('#botonIniciar').click(function () {

            $('#infoquiz').fadeOut(500);

            $('#pantallaInicio').hide();

            $('#pantallaPreguntas').slideDown(500);

            preguntaActual = 0;
            puntos = 0;

            $('#textoPuntos').text(puntos);

            mostrarPregunta();

        });

        preguntas.sort(() => Math.random() - 0.5);
        
        function mostrarPregunta() {

            $('#pantallaPreguntas').fadeIn(400);

            clearInterval(temporizador);

            tiempo = 10;

            $('#temporizador')
                .text(tiempo)
                .removeClass('urgente');

            const pregunta = preguntas[preguntaActual];

            $('#textoPregunta').text(
                (preguntaActual + 1) +
                ". " +
                pregunta.pregunta
            );

            $('#imagenPregunta').attr(
                'src',
                pregunta.imagen
            );

            $('.opciones').each(function (indice) {

                $(this)
                    .removeClass('correcta incorrecta bloqueada');

                $(this)
                    .find('.textoOpcion')
                    .text(pregunta.opciones[indice]);

            });

            $('#mensajeRespuesta')
                .text('')
                .removeClass('mensajeCorrecto mensajeIncorrecto');

            let progreso =
                ((preguntaActual) / preguntas.length) * 100;

            $('#barraRelleno').css(
                'width',
                progreso + '%'
            );

            iniciarTemporizador();

        }

        function iniciarTemporizador() {

            temporizador = setInterval(function () {

                tiempo--;

                $('#temporizador').text(tiempo);

                if (tiempo <= 3) {

                    $('#temporizador')
                        .addClass('urgente');

                }

                if (tiempo <= 0) {

                    clearInterval(temporizador);

                    tiempoAgotado();

                }

            }, 1000);

        }

        function tiempoAgotado() {

            $('.opciones')
                .addClass('bloqueada');

            $('#mensajeRespuesta')
                .text('⏰ ¡Se acabó el tiempo!')
                .addClass('mensajeIncorrecto');

            pasarSiguiente();

        }

        $('.opciones').click(function () {

            if ($(this).hasClass('bloqueada')) {

                return;

            }

            clearInterval(temporizador);


            const opcionElegida =
                Number($(this).attr('data-opcion'));

            const respuestaCorrecta =
                preguntas[preguntaActual].correcta;

            $('.opciones')
                .addClass('bloqueada');

            if (opcionElegida === respuestaCorrecta) {

                puntos++;

                $('#textoPuntos').text(puntos);

                $(this).addClass('correcta');

                $('#mensajeRespuesta')
                    .text('✅ ¡Correcto!')
                    .addClass('mensajeCorrecto');

            } else {

                $(this).addClass('incorrecta');

                $('.opciones')
                    .eq(respuestaCorrecta)
                    .addClass('correcta');

                $('#mensajeRespuesta')
                    .text('❌ Respuesta incorrecta')
                    .addClass('mensajeIncorrecto');

            }


            pasarSiguiente();

        });

        function pasarSiguiente() {

            setTimeout(function () {

                $('#pantallaPreguntas').fadeOut(400, function () {

                preguntaActual++;

                if (preguntaActual < preguntas.length) {

                    mostrarPregunta();

                } else {

                    mostrarResultado();

                }

                });

            }, 1200);

        }

        function mostrarResultado() {

            clearInterval(temporizador);

            $('#pantallaPreguntas').hide();

            $('#pantallaFinal').show();


            $('#puntajeFinal').text(
                puntos + "/10"
            );


            if (puntos >= 8) {

                $('#mensajeFinal').text(
                    '🥇 ¡Excelente! Tienes muy buenos conocimientos de geografía.'
                );

            } else if (puntos >= 5) {

                $('#mensajeFinal').text(
                    '🥈 ¡Buen trabajo! Intenta mejorar tu puntuación de nuevo.'
                );

            } else {

                $('#mensajeFinal').text(
                    '🥉 ¡Intentalo de nuevo! Siempre se puede mejorar.'
                );

            }

        }

        $('#botonReiniciar').click(function () {

            preguntaActual = 0;
            puntos = 0;

            $('#textoPuntos').text(0);

            $('#pantallaFinal').hide();

            $('#pantallaPreguntas').show();

            mostrarPregunta();

        });
