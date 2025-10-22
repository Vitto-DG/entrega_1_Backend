
/*
TTTTTTTTTT U        U TTTTTTTTTT TTTTTTTTTT Y        y
     T     U        U      T          T     Y        Y
     T     U        U      T          T      Y      Y
     T     U        U      T          T        Y  Y
     T     U        U      T          T          Y
     T     U        U      T          T          Y
     T      U      U       T          T          Y
     T       UUUUUU        T          T          Y

 FFFFFFFFF RRRRRRR    U        U TTTTTTTTTT Y        Y
 F         R      R   U        U      T     Y        Y
 F         R     R    U        U      T      Y      Y
 FFFFF     RRRRRR     U        U      T        Y  Y
 F         R     R    U        U      T          Y
 F         R      R   U        U      T          Y
 F         R      R    U      U       T          Y
 F         R      R     UUUUUU        T          Y
*/

// Letra. con una funcion Random y un boton para que caiga la letra.


// funcion para iniciar el juego.
function jugar(){

// Saludo
  alert("Hola. Esto es Tutti Fruty!");

// Pedimos el inicio al usuario
  const iniciar = prompt("Escribe 'a' para empezar!\n(puedes usar minúsculas)");

  // procesamos y evaluamos el input
if(iniciar?.toUpperCase() === "A"){

// Trae la letra que tocó
  const letraSeleccionada = ruleta();

// entra por param, la letra
  jugarRonda(letraSeleccionada);
  console.log("Letra seleccionada: " + letraSeleccionada);
}else{
  alert("No empezamos hasta que escribas la letra 'A'.")
}
}

// Array de letras que ya tocaron.
const letrasUsadas = [];

console.log("Letras usadas: " + letrasUsadas)
// La funcion para seleccion de letras. los alerts, prompts y confirm, detienen la ejecucion del codigo. Y por esto es que no va a funcionar la idea principal que tenia.

function ruleta(){
  const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

  // Averiguamos si hay letras disponibles
 if(letrasUsadas.length >= abecedario.length){
  alert("No hay mas letras disponibles. Game Over!");
  return null; // finaliza la funcion y el juego
 }

 let letraSeleccionada;
 do {
  letraSeleccionada = abecedario[Math.floor(Math.random() * abecedario.length)];
} while (letrasUsadas.includes(letraSeleccionada));

// Guardamos la letra
letrasUsadas.push(letraSeleccionada);

 return letraSeleccionada;
}

// Columnas de Nombre, "Ciudades o Paises", "Animal", "Comidas", "Colores", "Marcas", "TV y Cine".

function jugarRonda(letra){
  // Necesitamos las categorias
  const categorias = ["Nombre", "Ciudades o Paises", "Animales", "Flores", "Comida", "Frutas y verduras", "Colores", "Marcas", "TV y Cine"];

  // un lugar donde guardar las respuestas
  const palabrasRonda = [];

  alert("Tocó la letra: " + letra);

// tiempo de inicio para cronometrar
const inicio = Date.now();

// procesamiento de categorias y respuestas
for(const categoria of categorias){

    const respuesta = prompt(categoria + " con: " + letra);

    if(!respuesta){
      // si dejamos el campo vacio
      palabrasRonda.push(categoria + ": nada .. 0 puntos");
      continue;
    }

    const primeraLetra = respuesta[0].toUpperCase();

    if(primeraLetra === letra){
      palabrasRonda.push(categoria + ": " + respuesta + " ... +10 puntos");
      totalPuntos += 10;
    } else {
      palabrasRonda.push(categoria + ": " + respuesta + " ... -5 puntos" );
      totalPuntos -= 5;
    }
}


  // Tiempo final
  const fin = Date.now();
  const duracion = ((fin - inicio) / 1000).toFixed(2) // se mostrara en segundos
  console.log(duracion)


  rondas.push(palabrasRonda);
  alert("Fin de la ronda.\n" + palabrasRonda.join("\n"));
  puntaje(duracion);
}

// Puntajes y tabla de posiciones
let totalPuntos = 0;
const rondas = [];
const tablaPuntajes = [];


function guardarPuntaje(jugador, puntaje, tiempo){
  // Vamos a guardar el puntaje como string
  tablaPuntajes.push(jugador + " - " + puntaje + " - " + tiempo + " segs");

  // Para ordenar por mayor a menor
  tablaPuntajes.sort(function(a, b) {
    // traemos los numeros de cada string para comparar
    const puntajeA = parseInt(a.split(" - ")[1], 10);
    const puntajeB = parseInt(b.split(" - ")[1], 10);
    return puntajeB - puntajeA;
  })

  // Tabla en el alert
  let mensaje = "🏆 Puntajes 🏆\n";
  for (const fila of tablaPuntajes){
    mensaje += fila + "\n";
  }

  alert(mensaje);
  console.log(tablaPuntajes)

}

// pedimos el nombre del usario y mostramos puntaje
function puntaje(tiempoTotal) {
  const jugador = prompt("Escribe tu nombre para guardar el puntaje:");

  alert("Puntaje de " + jugador + ": " + totalPuntos + " puntos.")

  guardarPuntaje(jugador, totalPuntos, tiempoTotal);

/*   confirm(tablaPuntajes)
  console.log(tablaPuntajes); */

  // reiniciamos puntaje para la proxima ronda
  totalPuntos = 0;

  const jugarOtra = confirm("Jugamos otra?");
  if(jugarOtra){
    jugar(); //tablas y letras usadas de mantienen
  }else{
    alert("Ojala lo hayas pasado super!")
  }
}

jugar();


// Funcionalidades pendientes

// API diccionario para verificacion

//
