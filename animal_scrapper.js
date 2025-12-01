import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const ANIMALES_ARCHIVO_SALIDA = 'animales_raspados.json';
const URL_BASE_SCRAPING = 'https://es.wikipedia.org/wiki/Wikiproyecto:Animales/Lista#';
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function normalizarPalabras(palabra){
  if(!palabra) return '';

  return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
};

async function scrapearAnimalesXLetra(letra){
  const url = `${URL_BASE_SCRAPING}${letra.toLowerCase()}`;
  const listaAnimales = [];

  try {
    const response = await axios.get(url, {
       headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
});

  const $ = cheerio.load(response.data);

  $('#mw-content-text ul li a').each((index, element) => {
    const animalesBruto = $(element).text();
    if (animalesBruto){
      listaAnimales.push(normalizarPalabras(animalesBruto));
    }
  });

  console.info(`Animales extraidos para la letra ${letra}: ${listaAnimales.length}`);

  } catch (err){
    console.error(`Error al scrapear animales para la letra ${letra}:`, err);
  }

  return listaAnimales;
};

async function genBBDDAnimales(){
  const animalesAcumulados = new Set();
  const resultadorPorLetra = {};

  console.info("Iniciando scraping de nombres...");

  const promesas = [];
  for (const letra of LETRAS){
    promesas.push(scrapearAnimalesXLetra(letra));
  }

  const resultados = await Promise.all(promesas);

  let indiceLetra = 0;
for (const lista of resultados){
  const letraActual = LETRAS[indiceLetra];
  resultadorPorLetra[letraActual] = lista;

  lista.forEach(animal => animalesAcumulados.add(animal));
  indiceLetra++;
  }

  console.info(`Total de animales unicos extraidos: ${animalesAcumulados.size}`);

  try {
    const contenidoJson = JSON.stringify(resultadorPorLetra, null, 4);
    await fs.writeFile(ANIMALES_ARCHIVO_SALIDA, contenidoJson, 'utf-8');
    console.log(`Archivo ${ANIMALES_ARCHIVO_SALIDA} guardado exitosamente.`);
  } catch (err){
  console.log(`Error al guardar el archivo: ${err.messager}`);
}
}

genBBDDAnimales();
