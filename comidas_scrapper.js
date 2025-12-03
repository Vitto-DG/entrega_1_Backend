import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const COMIDAS_ARCHIVO_SALIDA = 'comidas_raspados.json';
//const URL_BASE_SCRAPING = 'https://cookpad.com/ar/buscar/tradicional%20de%20argentina';
const URL_BASE_SCRAPING = 'https://cookpad.com/ar/buscar/comidas%20tipicas';
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SELECTOR_TITULO_RECETA = '#search-recipes-list a.class-block_main';
const MAX_PAGINAS = 10;

function normalizarPalabras(palabra){
  if(!palabra) return '';
  return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
};

/**
 * Función que raspa una página de resultados de Cookpad y extrae los nombres de recetas.
 * Se usará la técnica de JSON-LD para mayor robustez.
 * @param {number} pageNum El número de página a raspar.
 * @returns {Array<string>} Una lista de nombres de comidas.
 */

async function rasparComidasXPagina(pageNum){
  const url = `${URL_BASE_SCRAPING}?page=${pageNum}`;
  const listaComidas = [];

  try {
    const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
  }
});

const $ = cheerio.load(response.data);
let recetasEnPagina = 0;

$(SELECTOR_TITULO_RECETA).each((index, element) => {
  //const tituloElemento = $(element).find('h2, h3');
c
  //if(tituloElemento > 0){
    //const nombreBruto = tituloElemento.text();
    const nombreBruto = $(element).text();
    if(nombreBruto && nombreBruto.trim().length > 0){
      listaComidas.push(normalizarPalabras(nombreBruto))
      recetasEnPagina++;
    }
  });

console.log(`Comidas extraidas para la página ${pageNum}: ${listaComidas.length}`);

const tieneSiguiente = recetasEnPagina > 0;

return { lista: listaComidas, tieneSiguiente: tieneSiguiente}
  } catch (err){
    console.error(`Error al raspar comidas para la página ${pageNum}:`, err);
    return { lista: listaComidas, tieneSiguiente: false };
  }
};

async function genBBDDComidas(){
  const comidasAcumuladas = new Set();

console.info("Iniciando scraping de comidas...");
  let paginaActual = 1;
  let continuarRaspado = true;

  while (continuarRaspado && paginaActual <= MAX_PAGINAS){
    const resultadoPagina = await rasparComidasXPagina(paginaActual);
    resultadoPagina.lista.forEach(comida => comidasAcumuladas.add(comida));

    continuarRaspado = resultadoPagina.tieneSiguiente;
    paginaActual++;
  }

  const comidasArray = Array.from(comidasAcumuladas).sort();
  const resultadosXLetra = {};

  for (const letra of LETRAS){
    resultadosXLetra[letra] = [];
  }

comidasArray.forEach(comida => {
  const letraInicial = comida[0];
  if(resultadosXLetra[letraInicial]){
    resultadosXLetra[letraInicial].push(comida);
  }
})

console.info(`\nTotal de comidas unicas extraidas: ${comidasAcumuladas.length}`);

  try {
    const contenidoJson = JSON.stringify(resultadosXLetra, null, 4);
    await fs.writeFile(COMIDAS_ARCHIVO_SALIDA, contenidoJson, 'utf-8');
    console.info(`Archivo ${COMIDAS_ARCHIVO_SALIDA} guardado exitosamente.`);
  } catch (err){
    console.error(`Error al guardar el archivo ${COMIDAS_ARCHIVO_SALIDA}:`, err);
  }
}

genBBDDComidas();
