
// Traigo los elementos desde el HTML
let letraRuleta = document.getElementById("letra-ruleta");
const btnBasta = document.getElementById("btn-basta");
let ruletaActiva = false;
let letraActual = "";
const ruleta = document.getElementById("ruleta");
const presionaA = document.getElementById("presiona-tecla");
const pantalla = document.getElementById("pantalla");

// Array de letras que ya tocaron.
let letrasUsadas = JSON.parse(sessionStorage.getItem('letrasUsadas')) || [];

// Boton para ingresara a la ruleta
const btnRuleta = document.getElementById("btn-ruleta");
btnRuleta.onclick = () => {
  ruleta.classList.remove("oculto")
  presionaA.classList.remove("oculto");
  btnRuleta.classList.add("oculto");

  // Manifestacion visual de la ruleta
  const letra = document.createElement('div');
  letra.innerHTML = '<p id="letra-display">A</p>'
  letraRuleta.appendChild(letra);
  //const letraDisplay = letra.querySelector("p");

  // Detonante para iniciar la ruleta
  document.addEventListener("keyup", (e) => {
    if (e.key.toUpperCase() === "A" && !ruletaActiva){
  iniciarRuleta();
    }
  })
}

// =======================================
//              Categorias
// =======================================

const tablaCategorias = [
  "Letra",
   "Nombre",
    "Ciudades/\nPaises",
    "Animales",
     "Flores",
      "Comida",
       "Frutas y\n verduras",
        "Colores",
         "Marcas",
          "TV y Cine",
           "Total"];


// =======================================
//            Encabezados
// =======================================
function crearEncabezados(){
  const encabezado = document.getElementById("encabezado");
  encabezado.innerHTML = "";


  const filaCategorias = document.createElement("tr");
  filaCategorias.id = "categorias";

  for (const categoria of tablaCategorias){
    const cat = document.createElement("th");
    cat.innerHTML = categoria;
    filaCategorias.appendChild(cat)
  }
  encabezado.appendChild(filaCategorias);
}
 crearEncabezados(tablaCategorias);


// ===================================
// Crear nuevas filas para cada ronda
// ===================================

function crearFilaRespuestas(){
  const cuerpo = document.getElementById("cuerpo-tabla");
const fila = document.createElement("tr");
fila.classList.add("fila-ronda");

// para poder saltar de input en input con tecla Enter
const inputs = [];

for (const categoria of tablaCategorias){
  const dato = document.createElement("td");
  const input = document.createElement("input");

  input.type = "text";
  input.classList.add("campo");
  input.autocomplete = "off";

// Asigno categorias a cada campo, espectivamente
input.setAttribute("campo", categoria);

  dato.appendChild(input);
  fila.appendChild(dato)
  inputs.push(input);
}
const totalInput = inputs[inputs.length - 1];
totalInput.disabled = true;
totalInput.classList.add("campo-oculto");

// De input en input al presionar Enter
let index = 0;
for(const inp of inputs) {

  const currentIndex = index;

  inp.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
      e.preventDefault();

      const siguiente = inputs[currentIndex + 1];


      if(currentIndex < inputs.length - 2){
        siguiente.focus();
      } else {
        // terminar la ronda y mostrar un mensaje de "Basta para mi, Basta para todos!"
        bastaParaMi();

      }
    }
  });
  index++;
}
inputs[0].focus();

cuerpo.appendChild(fila);
 }
crearFilaRespuestas();

// ================================
//              Ruleta
// ================================

function iniciarRuleta(){
  ruletaActiva = true;
  const abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split("");
  let index = 0;
  btnBasta.classList.remove("oculto");


  // Bucle visual
   let intervalo = setInterval(() => {
    letraActual = abecedario[index];
    letraRuleta.innerText = letraActual;
    index = (index + 1) % abecedario.length;
  }, 50)

  btnBasta.onclick = () => {
    clearInterval(intervalo);
    intervalo = null;

    // la letra ya fue usada?
    if(letrasUsadas.includes(letraActual)){
      const advertenciaRuleta = document.createElement("div");
      advertenciaRuleta.innerHTML = `
      <h4>La letra ${letraActual} ya fue usada. Presiona "A" nuevamente.</h4>`;
      //alert(`La letra ${letraActual} ya fue usada. Presiona "A" nuevamente.`);
      btnBasta.classList.add("oculto")
      iniciarRuleta();
      return;
    }else{

      // Si no toco letra repetida, seguimos con el flujo
      const aDarle = document.createElement('button');
      aDarle.innerHTML = 'A darle!';
      aDarle.classList.add("btn-aDarle");
      ruleta.appendChild(aDarle)

      aDarle.onclick = () => {
        ruleta.classList.add("oculto");
        cuentaRegresiva(() => {
          const primerInput = document.querySelector("#cuerpo-tabla input");
          primerInput.focus();
        })
      }
    }

    // Guardamos la letra usada
    letrasUsadas.push(letraActual);
    sessionStorage.setItem("letrasUsadas", JSON.stringify(letrasUsadas));

  }


}


// ============================
//      Cuenta regresiva .
// Agregar "YA!" despues del 1.
// ============================
let relojOn;

function cuentaRegresiva(callback){
  const overlay = document.getElementById("cuenta-regresiva");
  overlay.classList.remove("oculto");

  let contador = 3;
  overlay.textContent = contador

  const intervalo = setInterval(() => {
    contador--;
    if(contador > 0){
      overlay.textContent = contador;
    } else {
      clearInterval(intervalo);
      overlay.classList.add("oculto");
      relojOn = Date.now();
      callback();
    }
  }, 1000);
}



// =====================================
//       Basta para mi. Fin de la Ronda
// =====================================

let marcaTiempo = 0;
function bastaParaMi(){
  // Tomamos el tiempo
  const relojOff = Date.now();
  marcaTiempo = Math.floor((relojOff - relojOn) / 1000);

  const mensaje = document.createElement("div");
  mensaje.innerHTML = `<h3>Basta para mi, basta para todos!</h3><button id="btn-continuar">Continuar</button>`;
  mensaje.classList.add("mensaje-basta");

  pantalla.appendChild(mensaje);

  const btnContinuar = document.querySelector("#btn-continuar");

  btnContinuar.addEventListener("click", () => {
    mensaje.remove();
    const resultados = procesarRespuestas(letraActual);
    nombreJugador(resultados, marcaTiempo);
  });
};


// =================================
//        Nombre del Jugador
// =================================

function nombreJugador(resultados, marcaTiempo){
  const contenedorJugador = document.createElement("div");
  contenedorJugador.id = ("nombre-jugador");

  contenedorJugador.innerHTML = `<h3>Ingresa tu nombre:</h3>
  <input type="text" id="input-nombre-jugador" placeholder="Tu nombre..." autocomplete="off">
  <button id="btn-guardar-nombre">Guardar</button>
  <p id="error-nombre" class="mensaje-error oculto">Por favor, escriba su nombre para continuar.</p>`;

  pantalla.appendChild(contenedorJugador);

  const inputNombre = contenedorJugador.querySelector("#input-nombre-jugador");
  const btnGuardar = contenedorJugador.querySelector("#btn-guardar-nombre");
  const error = contenedorJugador.querySelector("#error-nombre");

  inputNombre.focus();

  btnGuardar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    if (!nombre){
      error.classList.remove("oculto");
      return;
    } else {
      contenedorJugador.remove();
      mostrarResultados(resultados, nombre, marcaTiempo);
    };
  });
};


// =================================
//       Procesar respuestas
// =================================

function procesarRespuestas(letraActual){

  letraActual = letraActual.toUpperCase();
  const inputs = document.querySelectorAll("#tabla-categorias tbody input");
  const resultados = [];
  let totalPuntos = 0;

  //const letra = letraActual.toUpperCase();

  for (const input of inputs){
    const valor = input.value.trim();
    const categoria = input.getAttribute("campo");

  if(valor.length <= 1){
    resultados.push({categoria,
      respuesta: valor || "(vacio)", puntos: 0});
    continue;
  } else {

    const primeraLetra = valor[0].toUpperCase();
    let puntos = 0;

    if(primeraLetra === letraActual){
      puntos = 10;
    } else {
      puntos = -10;
    };

    totalPuntos += puntos;
    resultados.push({categoria, respuesta: valor, puntos});
  };
};
return {
  letra: letraActual,
  totalPuntos,
  resultados
  };
};


// =================================
//          Tabla de Puntajes
// =================================
let puntajes = JSON.parse(sessionStorage.getItem("puntajes")) || [];

function tablaPuntajes(letraActual) {

  const contenedorPuntajes = document.createElement("div");
  contenedorPuntajes.id = "tabla-puntajes";

  contenedorPuntajes.innerHTML = `
  <h2>Tabla de puntajes</h2>
  <table id="tabla-puntajes">
    <thead>
    <tr>
    <th>#</th>
    <th>Jugador</th>
    <th>Letra</th>
    <th>Tiempo (segs)</th>
    <th>Puntos</th>
  </thead>
  <tbody>
  ${puntajes.map((r, i) => `
  <tr>
  <td>${i + 1}</td>
  <td>${r.jugador}</td>
  <td>${r.letra}</td>
  <td>${r.tiempo}</td>
  <td>${r.totalPuntos}</td>
  </tr>
  `).join(" - ")}
</tbody>
</table>
<button id="btn-nueva-ronda">Nueva Ronda</button>
  `;

  pantalla.appendChild(contenedorPuntajes);

  const btnNuevaRonda = contenedorPuntajes.querySelector("#btn-nueva-ronda");
  btnNuevaRonda.addEventListener("click", () => {
    contenedorPuntajes.remove();
    crearFilaRespuestas();
    ruleta.classList.remove("oculto");
    btnRuleta.classList.remove("oculto");
  })
}

// =================================
//          Mostrar Resultados
// =================================
function mostrarResultados(resultados, nombreJugador, marcaTiempo){

  const ronda = {
    jugador: nombreJugador,
    letra: resultados.letra,
    tiempo: marcaTiempo,
    totalPuntos: resultados.totalPuntos
  };

  puntajes.push(ronda);
  sessionStorage.setItem("puntajes", JSON.stringify(puntajes));

  const contenedorResultados = document.createElement("div");
  contenedorResultados.id = "resultados-ronda";

  contenedorResultados.innerHTML = `
  <h2>Resultado</h2>
  <p><strong>Jugador:</strong> ${nombreJugador}</p>
  <p><strong>Letra:</strong> ${resultados.letra}</p>
  <p><strong>Tiempo:</strong> ${marcaTiempo}</p>
  <button id="btn-nueva-ronda">Nueva Ronda</button>
  <button id="btn-tabla-puntajes">Ver tabla de puntajes</button>
  `

  pantalla.appendChild(contenedorResultados);

  // parar la colocar al final de la pantalla de Scores
  const btnNuevaRonda = contenedorResultados.querySelector("#btn-nueva-ronda");
  btnNuevaRonda.addEventListener("click", () => {
    contenedorResultados.remove();
    crearFilaRespuestas();
    ruleta.classList.remove("oculto");
    btnRuleta.classList.remove("oculto");
  })

  const btnTablaPuntajes = contenedorResultados.querySelector("#btn-tabla-puntajes");
    btnTablaPuntajes.addEventListener("click", () => {
    contenedorResultados.remove();
    tablaPuntajes();
    ruleta.classList.add("oculto");
    btnRuleta.classList.add("oculto");
    })
}

// =================================
//        Reiniciar ruleta
// =================================

function reiniciarRuleta(){
  ruletaActiva = false;
  letraActual = "";

  // Restauro el contenido original
  ruleta.innerHTML =
  `<h3 id="presiona-tecla">Presiona la tecla A para comenzar</h3>
    <div id="letra-ruleta"></div>
    <button id="btn-basta" class="oculto">Basta!</button>`;

  // recapturamos los elementos
  letraRuleta = document.getElementById("letra-ruleta");
  btnBasta = document.getElementById("btn-basta");
  presionaA = document.getElementById("presiona-tecla");

  ruleta.classList.add("oculto");
}


// Dos cuestiones:
// 1 - cuando crea el boton nueva ronda, quiero que trambien cree el ver tabla de puntajes.
// 2 - Al volver a clickear en el boton ruleta para comenzar una nueva ronda,
// aparece la letra anterior y la actuar con el boton A darle activado.
// se debe reiniciar la ventana de ruleta.
// 3 - Que podemos reutilizar? contenedores, botones, h2,


// =================================
//       funcion antigua
// =================================
function jugarRonda(letra){
  // Necesitamos las categorias
  //const categorias = ["Nombre", "Ciudades o Paises", "Animales", "Flores", "Comida", "Frutas y verduras", "Colores", "Marcas", "TV y Cine"];

  // un lugar donde guardar las respuestas
  const palabrasRonda = [];

  // alert("Tocó la letra: " + letra);

// tiempo de inicio para cronometrar
const inicio = Date.now();

// procesamiento de categorias y respuestas
/* for(const categoria of categorias){

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
} */


  // Tiempo final
  const fin = Date.now();
  const duracion = ((fin - inicio) / 1000).toFixed(2) // se mostrara en segundos
  console.log(duracion)


  rondas.push(palabrasRonda);
  alert("Fin de la ronda.\n" + palabrasRonda.join("\n"));
  puntaje(duracion);
}
