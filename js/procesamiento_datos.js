// Aqui ira la funcion de procesar resupuestas.
// Y tabla de posiciones.


// =================================
//      Listas para verificaion (Corregida la Ruta y el Swal)
// =================================

function removerTildes(texto) {
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

    const regex = new RegExp(`^${palabraEscapada}(?=\\W|$)`, 'i');

    for (const palabraCompleta of setDePalabras) {

        if (palabraCompleta === valorNormalizado) {
            return true;
        }

        if (regex.test(palabraCompleta)) {
            return true;
        }
    }

    return false;
}
// =================================
//       Procesar respuestas
// =================================
async function procesarRespuestas(letraActual){

  let puntos = 0;

  const listasValidas = await cargarListas();

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

    if (categoria === 'Total') {
        continue;
    }

    if(valor.length <= 1){
        puntos = 0;
        resultados.push({categoria,
            respuesta: valor || "(vacio)", puntos: 0});
        console.log(`X ${categoria}: "${valor || "(vacio)"}" - ${puntos} puntos (vacio o incompleto)`);
        continue;
    }

    if(cotejarRespuesta(categoria, valorNormalizado, listasValidas)){
        puntos = 10;
        console.log(`✓ ${categoria}: "${valor}" - +${puntos} puntos (correcto)`);
    } else {
        puntos = -10;
        console.log(`X ${categoria}: "${valor}" - ${puntos} puntos (incorrecto)`);
    }

    totalPuntos += puntos;
    resultados.push({categoria, respuesta: valor, puntos});

  };

  console.table(resultados);

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
