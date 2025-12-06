
// Traigo los elementos desde el HTML
let letraRuleta = document.getElementById("letra-ruleta");
let btnBasta = document.getElementById("btn-basta");
let ruletaActiva = false;
let letraActual = "";
const contenedorGeneral = document.getElementById("contenedor-general");
const presionaA = document.getElementById("presiona-tecla");
const pantalla = document.getElementById("pantalla");

const btnRuleta = document.createElement("button");
btnRuleta.id = 'btn-ruleta';
btnRuleta.innerHTML = 'Ruleta';
pantalla.appendChild(btnRuleta);

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
function iniciarRuleta(){
  ruletaActiva = true;
  const abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split("");
  let index = 0;
  btnBasta.classList.remove("oculto");

  const mensaje = document.getElementById("presiona-tecla");
  mensaje.textContent = "Presiona la tecla A para comenzar";

  btnBasta.classList.remove("oculto");

   let intervalo = setInterval(() => {
    letraActual = abecedario[index];
    letraRuleta.innerText = letraActual;
    index = (index + 1) % abecedario.length;
  }, 50)

  btnBasta.onclick = () => {
    clearInterval(intervalo);
    intervalo = null;

    if(letrasUsadas.includes(letraActual)){
      const mensaje = document.getElementById("presiona-tecla");
      mensaje.innerHTML = `
      <h4>La letra ${letraActual} ya fue usada.</h4>
      <p> Presiona <strong>"A"</strong> nuevamente.</p>
      `;

      btnBasta.classList.add("oculto")
      ruletaActiva = false;


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
      const aDarle = document.createElement('button');
      aDarle.innerHTML = 'A darle!';
      aDarle.id = "btn-aDarle";
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
//      Listas para verificaion (Corregida la Ruta y el Swal)
// =================================

/**
 * Elimina acentos y diacríticos (ej: Á -> A, Ñ -> Ñ)
 */
function removerTildes(texto) {
    // Normaliza a NFD (forma de descomposición canónica)
    // y luego remueve todos los caracteres diacríticos.
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

let listasValidasCache = null;
async function cargarListas(){
  if(listasValidasCache){
    return listasValidasCache;
  }

  const BBDD_ENDPOINTS = {
    "Nombres": '../../ddbb/nombres_validacion.json',
    "Ciudades/Paises": ['../../ddbb/ciudades_validacion.json', '../../ddbb/paises_validacion.json'],
    "Animales": '../../ddbb/animales_validacion.json',
    "Flores": '../../ddbb/flores_validacion.json',
    "Comida": '../../ddbb/comidas_validacion.json',
    "Frutas y verduras": '../../ddbb/frutasYverduras_validacion.json',
    "Colores": '../../ddbb/colores_validacion.json',
    "Marcas": '../../ddbb/marcas_validacion.json',
    "TV y Cine": '../../ddbb/tv_cine_validacion.json',
  };

  const promesas = Object.entries(BBDD_ENDPOINTS).map(async ([categoria, endpoint]) => {
    const urls = Array.isArray(endpoint) ? endpoint : [endpoint];

    const traerPromesas = urls.map(async (url) => {
      try {
        const respuesta = await fetch(url);
        if(!respuesta.ok) {
          throw new Error(`Error al cargar! estado: ${respuesta.status} en ${url}`);
        }
        return await respuesta.json();
      } catch (err) {
        // 🚨 CORRECCIÓN DEL SWAL: No se pasa 'err' como segundo argumento, solo se usa en el footer/console
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al intentar validar los datos. Revisa la consola para más detalles.",
          footer: err.message
        });
        return [];
      }
    });

    const arraysPalabras = await Promise.all(traerPromesas);
    const palabrasFusionadas = arraysPalabras.flat();

    // Almacenamos la palabra completa en mayúsculas (incluyendo paréntesis y frases)
    const setPalabras = new Set(palabrasFusionadas.map(palabra => palabra.toUpperCase()));
    return [categoria, setPalabras];
  });

  const resultados = await Promise.all(promesas);

  listasValidasCache = Object.fromEntries(resultados.filter(([_, set]) => set !== null));
  return listasValidasCache;
}

// =================================
// Cotejar Respuesta (Regex para Palabra Completa)
// =================================
/**
 * Coteja si la respuesta del jugador es una palabra completa
 * al inicio de una frase en la lista o como una entrada exacta.
 * * @param {string} categoria - La categoría de la respuesta.
 * @param {string} valorNormalizado - La respuesta del jugador en MAYÚSCULAS (Ej: "PASTA").
 * @param {Object} listasValidas - El caché con todos los Sets de palabras cargados.
 * @returns {boolean} True si la palabra se encuentra como palabra clave.
 */
function cotejarRespuesta(categoria, valorNormalizado, listasValidas) {
    const setDePalabras = listasValidas[categoria];

    if (!setDePalabras) {
        return true;
    }

    const palabraEscapada = valorNormalizado.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 🚨 CAMBIO CLAVE: Usamos (?=\W|$)
    // ^: El inicio de la cadena.
    // ${palabraEscapada}: La palabra del jugador (Ej: PASTA).
    // (?=\W|$): Un "lookahead" que asegura que después de "PASTA" solo haya:
    //   \W: Cualquier carácter que NO sea una letra o número (un espacio, un guion, un paréntesis, etc.).
    //   |: O
    //   $: El final de la cadena (para entradas exactas como "PASTA").
    const regex = new RegExp(`^${palabraEscapada}(?=\\W|$)`, 'i');

    for (const palabraCompleta of setDePalabras) {

        // 1. Coincidencia EXACTA
        if (palabraCompleta === valorNormalizado) {
            return true;
        }

        // 2. Coincidencia al INICIO de una frase con límite de palabra flexible
        if (regex.test(palabraCompleta)) {
            return true;
        }
    }

    return false; // No hay coincidencia válida
}
// =================================
//       Procesar respuestas (Sin Letra, Puntuación Corregida)
// =================================
async function procesarRespuestas(letraActual){

  // 🚨 SOLUCIÓN AL REFERENCE ERROR: Asegúrate de que esta línea esté presente
  // Aunque no la tenías en el archivo completo, la declaramos aquí para seguridad.
  let puntos = 0;

  const listasValidas = await cargarListas();

  // 🚨 La letra actual no se usa para validar, pero la necesitamos para el return.
  letraActual = letraActual.toUpperCase();
  const inputs = document.querySelectorAll("#tabla-categorias tbody tr:last-child input");
  const resultados = [];
  let totalPuntos = 0;

  console.log("+++++++++++++++++");
  console.log("Detalles de ronda");
  console.log("vvvvvvvvvvvvvvvvv");

  for (const input of inputs){
    const valor = input.value.trim();
    const categoria = input.getAttribute("campo");
    const valorNormalizado = valor.toUpperCase();

    // 🚨 Ignorar el campo 'Total' que no es una respuesta
    if (categoria === 'Total') {
        continue;
    }

    // A. Filtro Inicial: Vacío o Incompleto (0 puntos)
    if(valor.length <= 1){
        puntos = 0;
        resultados.push({categoria,
            respuesta: valor || "(vacio)", puntos: 0});
        console.log(`X ${categoria}: "${valor || "(vacio)"}" - ${puntos} puntos (vacio o incompleto)`);
        continue; // Pasa al siguiente input
    }

    // 🚨 ELIMINAMOS TODA LA VERIFICACIÓN DE LA PRIMERA LETRA

    // B. Puntuación basada ÚNICAMENTE en la Lista de Validación
    if(cotejarRespuesta(categoria, valorNormalizado, listasValidas)){
        puntos = 10;
        console.log(`✓ ${categoria}: "${valor}" - +${puntos} puntos (correcto)`);
    } else {
        puntos = -10;
        // console.log(`X ${categoria}: "${valor}" - -${puntos} puntos (incorrecto)`); // Tu código original tenía un doble guion
        console.log(`X ${categoria}: "${valor}" - ${puntos} puntos (incorrecto)`);
    }


    // 🚨 SOLUCIÓN AL BUG CRÍTICO: Mover la adición de puntos fuera de la cláusula 'else'
    totalPuntos += puntos;
    resultados.push({categoria, respuesta: valor, puntos});

    // 🚨 NOTA: Tu código original tenía esta línea de cierre aquí, lo cual era un error de flujo.
    // Esta estructura asegura que la penalización de -10 se registre siempre.
  };

  console.table(resultados);
  // ... (código final de reporte y DOM) ...

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

