
// Traigo los elementos desde el HTML
let letraRuleta = document.getElementById("letra-ruleta");
let btnBasta = document.getElementById("btn-basta");
let ruletaActiva = false;
let letraActual = "";
const contenedorGeneral = document.getElementById("contenedor-general");
const presionaA = document.getElementById("presiona-tecla");
const pantalla = document.getElementById("pantalla");
const btnRuleta = document.getElementById("btn-ruleta");

// Revisará en sessionStorage y en un array, las letras que ya tocaron.
let letrasUsadas = JSON.parse(sessionStorage.getItem('letrasUsadas')) || [];

btnRuleta.onclick = () => {
  contenedorGeneral.classList.remove("oculto")
  presionaA.classList.remove("oculto");
  btnRuleta.classList.add("oculto");

// Manifestacion visual de la ruleta
const letra = document.createElement('div');
  letra.innerHTML = '<p id="letra-display">A</p>'
  letraRuleta.appendChild(letra);

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
      } else if (currentIndex === inputs.length - 2){
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

  const mensaje = document.getElementById("presiona-tecla");
  mensaje.textContent = "Presiona la tecla A para comenzar";

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
      const mensaje = document.getElementById("presiona-tecla");
      mensaje.innerHTML = `
      <h4>La letra ${letraActual} ya fue usada.</h4>
      <p> Presiona <strong>"A"</strong> nuevamente.</p>
      `;

      //alert(`La letra ${letraActual} ya fue usada. Presiona "A" nuevamente.`);
      btnBasta.classList.add("oculto")
      ruletaActiva = false;


      // Para que el jugador presione A de nuevo.
      const listener = (e) => {
        if(e.key.toUpperCase() === "A" && !ruletaActiva){
          document.removeEventListener("keyup", listener);

          mensaje.textContent = "Presiona la tecla A para comenzar";

          btnBasta.classList.remove("oculto");
          iniciarRuleta();
        };
      };
      document.addEventListener("keyup", listener);
      return;
    }
      // Si no toco letra repetida, seguimos con el flujo
      const aDarle = document.createElement('button');
      aDarle.innerHTML = 'A darle!';
      aDarle.classList.add("btn-aDarle");
      contenedorGeneral.appendChild(aDarle);

      aDarle.onclick = () => {
        contenedorGeneral.classList.add("oculto");
        cuentaRegresiva(() => {
          const filas = document.querySelectorAll("#cuerpo-tabla tr");
          const ultimaFila = filas[filas.length - 1];
          const primerInput = ultimaFila.querySelector("input");
          primerInput.focus();
        });
      };


    // Guardamos la letra usada
    letrasUsadas.push(letraActual);
    sessionStorage.setItem("letrasUsadas", JSON.stringify(letrasUsadas));
  };
};

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
  btnContinuar.addEventListener("click", () => {
    const resultados = procesarRespuestas(letraActual);
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
  console.log("nombre jugador ejecutada");
};


// =================================
//       Procesar respuestas - Tiene que consultar una API - la de wiki?
// =================================

// Promedio entre tiempo y puntos (se mostrara en la tabla de puntajes y se ordenaran de mayor a menor)

function procesarRespuestas(letraActual){

  letraActual = letraActual.toUpperCase();
  const inputs = document.querySelectorAll("#tabla-categorias tbody tr:last-child input");
  const resultados = [];
  let totalPuntos = 0;

console.log("+++++++++++++++++");
console.log("Detalles de ronda");
console.log("vvvvvvvvvvvvvvvvv");
let puntos = 0;

  for (const input of inputs){
    const valor = input.value.trim();
    const categoria = input.getAttribute("campo");

    if(valor.length <= 1){
    puntos = 0;
    resultados.push({categoria,
      respuesta: valor || "(vacio)", puntos: 0});
      console.log(`X ${categoria}: "${valor}" - ${puntos} puntos (vacio o incompleto)`);
    continue;
  } else {

    const primeraLetra = valor[0].toUpperCase();

    if(primeraLetra === letraActual){
      puntos = 10;
      console.log(`✓ ${categoria}: "${valor}" - +${puntos} puntos (correcto)`);
    } else {
      puntos = -10;
      console.log(`X ${categoria}: "${valor}" - -${puntos} puntos (incorrecto)`);
    };

    totalPuntos += puntos;
    resultados.push({categoria, respuesta: valor, puntos});
  };
};
console.table(resultados);

console.log("^^^^^^^^^^^^^^^^^^^^^");
console.log(`Total: ${totalPuntos}`);
console.log("+++++++++++++++++++++");
const inputTotal = document.querySelector("#tabla-categorias tbody tr:last-child input[campo='Total']");
inputTotal.value = totalPuntos;
return {
  letra: letraActual,
  totalPuntos,
  resultados,
  };
};


// =================================
//          Tabla de Puntajes
// =================================

// Ordenar de mayor a menor
let puntajes = JSON.parse(sessionStorage.getItem("puntajes")) || [];
function tablaPuntajes() {
console.log("Ejecutando tablaPuntajes...");
console.log("Contenido de puntajes:", puntajes);

const puntajesOrdenados = [...puntajes].sort((a, b) => {
  if (a.tiempo !== b.tiempo) {
    return a.tiempo - b.tiempo;
} else {
  return a.totalPuntos >= 0 && a.totalPuntos - b.totalPuntos;
};
});

console.log("Puntajes ordenados:", puntajesOrdenados);

  contenedorGeneral.classList.remove("oculto");
  contenedorGeneral.innerHTML = `
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
  ${puntajesOrdenados.map((dato, indice) => `
  <tr>
  <td>${indice + 1}</td>
  <td>${dato.jugador}</td>
  <td>${dato.letra}</td>
  <td>${dato.tiempo}</td>
  <td>${dato.totalPuntos}</td>
  </tr>
  `).join("")}
</tbody>
</table>
<button id="btn-nueva-ronda">Nueva Ronda</button>`;

console.log("Contenido de contenedorGeneral:", contenedorGeneral.innerHTML);
console.log("tabla puntajes ejecutada");

  const btnNuevaRonda = contenedorGeneral.querySelector("#btn-nueva-ronda");
  btnNuevaRonda.addEventListener("click", () => {
    crearFilaRespuestas();
    reiniciarRuleta();
    contenedorGeneral.classList.remove("oculto");
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

// =================================
//        Reiniciar ruleta
// =================================

// no aparece completo
function reiniciarRuleta(){
  ruletaActiva = false;
  letraActual = "";

  // Restauro el contenido original
  contenedorGeneral.innerHTML =
  `<h3 id="presiona-tecla">Presiona la tecla A para comenzar</h3>
    <div id="letra-ruleta">
    <p id="letra-display">A</p>
    </div>
    <button id="btn-basta" class="oculto">Basta!</button>`;

  // recapturamos los elementos
  letraRuleta = document.getElementById("letra-ruleta");
  btnBasta = document.getElementById("btn-basta");
  btnBasta.classList.remove("oculto");

  console.log("reiniciar ruleta ejecutada", contenedorGeneral);
}

// Cuestiones:

// 3 - Que podemos reutilizar? Un contenedor. DONE
// 4 - En la tabla de posisiones, deberan ir ordenandose por mejor puntaje. TO DO
// (una relacion entre el tiempo que se tarda y los puntos que suman)
// 5 - Verificacion con API. Habra preparado un archivo que simule una BBDD con la data completa.
// Pero quizas comience utilizando las APIs en tiempo real.
// 6 - Librerias
// 7 - Estilos CSS

