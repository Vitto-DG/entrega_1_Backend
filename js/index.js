

/*
Entrega 1
Estructura del simulador
Objetivos generales
  Armar la estructura base del simulador

  Integrar las herramientas JS aprendidas hasta aquí

Objetivos específicos
  Declara variables, constantes y arrays

  Crea una o más funciones JS que generen interacción

  Agrega los ciclos de iteración y/o condicionales necesarios, para que tu proyecto funcione correctamente

  Integra el uso de la Consola JS y de los cuadros de diálogo Prompt, Confirm y Alert

Se debe entregar
  Documento HTML (al menos uno)

  Archivo JS referenciado en el HTML

Formato
  Archivo en formato .ZIP con la carpeta y los archivos del proyecto. Debe contener el nombre “Entregable1+Apellido”

  Si usas más de un archivo JS y más de un archivo CSS, guarda los mismos en subcarpetas

Sugerencias
  En esta etapa ocúpate de realizar la mejor lógica de JS. No te esmeres en el diseño web

  No debes integrar todos los condicionales ni todos ciclos de iteración aprendidos.
  Solo aquellos que le aporten valor a la lógica de tu aplicación

La interacción del simulador se hará íntegramente sobre la Consola JS

Describe en el documento HTML con uno o dos párrafos, la idea general de tu simulador

Crea al menos 3 funciones siguiendo el algoritmo básico de todo programa (entradas de datos, procesamiento de datos y mostrar los resultado de salida de los mismos.)

Realizar llamadas(invocar) a las funciones que utilizaste en tu simulador

Tu proyecto mutará cuando aprendas más características de JS. Lo que no puedas conseguir ahora, emúlalo de la mejor forma posible con variables, constantes y/o arrays

Define mensajes claros a mostrar en los cuadros de diálogo. Concatena textos con variables, y realiza saltos de línea en textos extensos. Esto facilitará su lectura <---------------> ## Criterios de evaluación

Estructura HTML y archivo JS
La estructura HTML está completa y ejecutada con buenas prácticas o utiliza el el starter template de Bootstrap u otro framework para el uso adecuado de HTML5 *. El archivo JS está correctamente referenciado en el HTML.

Algoritmos
Se utiliza algoritmo condicional y con ciclo (IF, bucles for) de manera óptima , reflejando lo aprendido en clase.

Funciones
Los nombres de las funciones son claros y dan a entender que acción realizan. Se emplea la estructura correcta para el armado de las mismas. Crea funciones dinámicas de manera correcta. Generan un resultado correcto cuando se ejecutan.

Aclaración
Pueden utilizar el starter template de Bootstrap para agilizar el armado de la esrtuctura HTML en caso de que lo deseen. O pueden optar por aplicar JS a sus HTML desarollados por los propios estudiantes (ya sea en otros cursos o para este proyecto).
*/


// tutti fruty

// Letra. con una funcion Random y un boton para que caiga la letra.


// funcion para iniciar el juego.
function jugar(){
  alert("Esto es Tutti Fruty!");

  const iniciar = prompt("Escribe 'a' para empezar!");
if(iniciar?.toUpperCase() === "A"){
  const letraSeleccionada = ruleta(); // Trae la letra que tocó
  //alert("Tocó: " + letraSeleccionada);

  jugarRonda(letraSeleccionada); // entra por param, la letra
}else{
  alert("No empezamos hasta que escribas la letra 'A'.")
}
}

// Array de letras que ya tocaron.
const letrasUsadas = [];


// La funcion para seleccion de letras

function ruleta(){
  const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  let indice = 0;
  let basta = false;
  let letraSeleccionada = "";

  while(!basta){
    const letraActual = abecedario[indice];
    const continuar = confirm("(Contando...)\nDale a 'Aceptar' para empezar o 'Cancelar' para seguir.");

    if(continuar) {
      letraSeleccionada = letraActual;
      basta = true;
    }else{
      indice = (indice + 1) % abecedario.length; // Reinicia el abecedario si llega al final
    }
  }

 // guardamos en el historial grobal
 letrasUsadas.push(letraSeleccionada);

 return letraSeleccionada;
}

// Columnas de Nombre, "Ciudades o Paises", "Animal", "Comidas", "Colores", "Marcas", "TV y Cine".

function jugarRonda(letra){
  const categorias = ["Nombre", "Ciudades o Paises", "Animales", "Flores", "Comida", "Colores", "Marcas", "TV y Cine"];
  const palabrasRonda = [];

  alert("Tocó la letra: " + letra);

  for(let categoria of categorias){
    const respuesta = prompt(categoria + " con: " + letra);
    if(respuesta && respuesta[0].toUpperCase() === letra){
      palabrasRonda.push(categoria + ": " + respuesta);
      totalPuntos += 10;
    }else{
      palabrasRonda.push(categoria + ": nada");
    }
  }

  rondas.push(palabrasRonda);
  alert("Fin de la ronda.\n" + palabrasRonda.join("\n"));
  puntaje();
}


// Puntajes y tabla de posiciones
let totalPuntos = 0;
const rondas = [];
const tablaPuntajes = [];

function puntaje() {
  const jugador = prompt("Escribe tu nombre para guardar el puntaje:");
  tablaPuntajes.push( jugador + "puntaje: " + totalPuntos );
  alert("Puntaje de " + jugador + ": " + totalPuntos + " puntos.")
  console.log(tablaPuntajes);

  // Jugar otra vez o salir
const jugarOtra = confirm("Jugamos otra?");
if(jugarOtra) {
  jugar();
}else{
  alert("Ojala lo hayas pasado super!")
}

}

jugar();

