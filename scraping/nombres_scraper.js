import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const NOMBRE_ARCHIVO_SALIDA = 'nombres_raspados.json';
const URL_BASE_SCRAPING = 'https://www.tuparada.com/nombres/';
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function normalizarPalabras(palabra){
  if(!palabra) return '';

  return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
};

async function scrapearNombresXLetra(letra){
  const url = `${URL_BASE_SCRAPING}${letra.toLowerCase()}`;
  const listaNombres = [];

  try {
    const response = await axios.get(url, {
       headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
});

  const $ = cheerio.load(response.data);

  $('.list-orange a big').each((index, element) => {
    const nombreBruto = $(element).text();
    if (nombreBruto){
      listaNombres.push(normalizarPalabras(nombreBruto));
    }
  });

  console.log(`Nombres extraidos para la letra ${letra}: ${listaNombres.length}`);

  } catch (err){
    console.error(`Error al scrapear nombres para la letra ${letra}:`, err);
  }

  return listaNombres;
};

async function genBBDDNombres(){
  const nombresAcumulados = new Set();
  const resultadorPorLetra = {};

  console.log("Iniciando scraping de nombres...");

  const promesas = [];
  for (const letra of LETRAS){
    promesas.push(scrapearNombresXLetra(letra));
  }

  const resultados = await Promise.all(promesas);

  let indiceLetra = 0;
for (const lista of resultados){
  const letraActual = LETRAS[indiceLetra];
  resultadorPorLetra[letraActual] = lista;

  lista.forEach(nombre => nombresAcumulados.add(nombre));
  indiceLetra++;
  }

  console.log(`Total de nombres unicos extraidos: ${nombresAcumulados.size}`);

  try {
    const contenidoJson = JSON.stringify(resultadorPorLetra, null, 4);
    await fs.writeFile(NOMBRE_ARCHIVO_SALIDA, contenidoJson, 'utf-8');
    console.log(`Archivo ${NOMBRE_ARCHIVO_SALIDA} guardado exitosamente.`);
  } catch (err){
  console.log(`Error al guardar el archivo: ${err.messager}`);
}
}

genBBDDNombres();
