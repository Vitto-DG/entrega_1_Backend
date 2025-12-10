
// Traigo los elementos desde el HTML
let letraRuleta = document.getElementById("letra-ruleta");

const contenedorGeneral = document.getElementById("contenedor-general");
const pantalla = document.getElementById("pantalla");

const btnRuleta = document.createElement("button");
btnRuleta.id = 'btn-ruleta';
btnRuleta.innerHTML = 'Ruleta';
pantalla.appendChild(btnRuleta);

// Revisará en sessionStorage y en un array, las letras que ya tocaron.
let letrasUsadas = JSON.parse(sessionStorage.getItem('letrasUsadas')) || [];

btnRuleta.onclick = () => {
  contenedorGeneral.classList.remove("oculto")
  btnRuleta.classList.add("oculto");
}
// Detonante para iniciar la ruleta
document.addEventListener("keyup", (e) => {
    if (e.key.toUpperCase() === "A" && !ruletaActiva){
  iniciarRuleta();
  btnBasta.classList.remove("oculto");
    }
  })


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

const inputs = [];

for (const categoria of tablaCategorias){
  const dato = document.createElement("td");
  const input = document.createElement("input");

  input.type = "text";
  input.classList.add("campo");
  input.autocomplete = "off";

input.setAttribute("campo", categoria);

  dato.appendChild(input);
  fila.appendChild(dato)
  inputs.push(input);
}
const totalInput = inputs[inputs.length - 1];
totalInput.disabled = true;
totalInput.classList.add("campo-oculto");

let index = 0;
for(const inp of inputs) {

  const currentIndex = index;

  inp.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
      e.preventDefault();

      const siguiente = inputs[currentIndex + 1];


      if(currentIndex < inputs.length - 2){
        siguiente.focus();
      } else if (currentIndex === inputs.length - 2){
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



// ============================
//      Cuenta regresiva .
// Agregar "YA!" despues del 1.
// ============================
let relojOn;

function cuentaRegresiva(callback){
  contenedorGeneral.classList.remove("oculto");

  let contador = 3;
  contenedorGeneral.innerHTML = `
  <p>${contador}</p>`

  const intervalo = setInterval(() => {
    contador--;
    if(contador > 0){
      contenedorGeneral.innerHTML = `<p>${contador}</p>`
    } else {
      clearInterval(intervalo);
      contenedorGeneral.classList.add("oculto")
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

  contenedorGeneral.innerHTML = `
  <h3 class="mensaje-basta">Basta para mi, basta para todos!</h3>
  <button id="btn-continuar">Continuar</button>`
  contenedorGeneral.classList.remove("oculto");

  const btnContinuar = document.querySelector("#btn-continuar");
    console.log("basta para mi ejecutada")
    btnContinuar.addEventListener("click", async () => {
    const resultados = await procesarRespuestas(letraActual);
    nombreJugador(resultados, marcaTiempo);
  });
};

// =================================
//        Nombre del Jugador
// =================================
function nombreJugador(resultados, marcaTiempo){

  contenedorGeneral.innerHTML = `
  <form id="formulario-nombre">
  <h3>Ingresa tu nombre:</h3>
  <input type="text" id="input-nombre-jugador" placeholder="Tu nombre..." autocomplete="off">
  <button type="submit">Guardar</button>
  <p id="error-nombre" class="mensaje-error oculto">Por favor, escriba su nombre para continuar.</p>
  </form>`;

  contenedorGeneral.classList.remove("oculto");
  const formularioNombre = contenedorGeneral.querySelector("#formulario-nombre")
  const inputNombre = contenedorGeneral.querySelector("#input-nombre-jugador");
  const error = contenedorGeneral.querySelector("#error-nombre");

  inputNombre.focus();

  formularioNombre.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = inputNombre.value.trim();
    if (!nombre){
      error.classList.remove("oculto");
      return;
    } else {
      error.classList.add("oculto");
      contenedorGeneral.classList.add("oculto");
      mostrarResultados(resultados, nombre, marcaTiempo);
    };
  });
};




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

  contenedorGeneral.innerHTML = `
  <h2>Resultado</h2>
  <p><strong>Jugador:</strong> ${nombreJugador}</p>
  <p><strong>Letra:</strong> ${resultados.letra}</p>
  <p><strong>Tiempo:</strong> ${marcaTiempo}</p>
  <p><strong>Puntos Totales:</strong> ${resultados.totalPuntos}</p>
  <button id="btn-nueva-ronda">Nueva Ronda</button>
  <button id="btn-tabla-puntajes">Ver tabla de puntajes</button>
  `
  contenedorGeneral.classList.remove("oculto");

  const btnNuevaRonda = contenedorGeneral.querySelector("#btn-nueva-ronda");
  btnNuevaRonda.addEventListener("click", () => {
    crearFilaRespuestas();
    reiniciarRuleta();
    btnRuleta.classList.remove("oculto");
  })

  const btnTablaPuntajes = contenedorGeneral.querySelector("#btn-tabla-puntajes");
    btnTablaPuntajes.addEventListener("click", () => {
    tablaPuntajes();
    btnRuleta.classList.add("oculto");
    })
    console.log("mostrar resultados ejecutada");
}


// Cuestiones:

// 3 - Que podemos reutilizar? Un contenedor. DONE
// 4 - En la tabla de posisiones, deberan ir ordenandose por mejor puntaje. DONE
// (una relacion entre el tiempo que se tarda y los puntos que suman)
// 5 - Verificacion con API. Habra preparado un archivo que simule una BBDD con la data completa.
// Pero quizas comience utilizando las APIs en tiempo real. DONE
// 6 - Librerias
// 7 - Estilos CSS

