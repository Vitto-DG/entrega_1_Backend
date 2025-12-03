import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const COMIDAS_ARCHIVO_SALIDA = 'base_texto_gastronomico.json';
const URL_BASE_SCRAPING = 'https://cookpad.com/ar/buscar/comidas%20tipicas';
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX_PAGINAS = 50; // Limite de 50 páginas (cientos de recetas)

function normalizarPalabras(palabra){
  if(!palabra) return '';
  // Normalizamos y eliminamos caracteres no alfabéticos (puntuación, números)
  return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                 .replace(/[^A-Z\s]/g, '') // Mantenemos solo letras y espacios
                 .trim().toUpperCase();
};

async function rasparPaginaTextoCompleto(pageNum){
  const url = `${URL_BASE_SCRAPING}?page=${pageNum}`;
  let palabrasUnicas = new Set();
  let recetasEnPagina = 0; // Usaremos esto como indicador de que la página tiene contenido

  try {
    const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const $ = cheerio.load(response.data);

    // 🎯 Estrategia Fuerza Bruta: Extraer todo el texto del cuerpo principal.
    // Excluir elementos de navegación, scripts, etc.
    const textoBruto = $('#main-container').text() || $('body').text();

    // Dividir el texto en palabras
    const palabras = textoBruto.split(/\s+/).filter(p => p.length > 2); // Filtra palabras muy cortas

    palabras.forEach(palabra => {
        const palabraLimpia = normalizarPalabras(palabra);
        if (palabraLimpia) {
            palabrasUnicas.add(palabraLimpia);
        }
    });

    // Asumimos que si hay palabras únicas, hay contenido.
    recetasEnPagina = palabrasUnicas.size > 0 ? 1 : 0;

    console.log(`- Palabras únicas extraídas de Pág ${pageNum}: ${palabrasUnicas.size}`);

    const tieneSiguiente = pageNum < MAX_PAGINAS && recetasEnPagina > 0;

    return { palabras: palabrasUnicas, tieneSiguiente: tieneSiguiente}

  } catch (err){
    console.error(`Error al raspar Pág ${pageNum}:`, err.message);
    return { palabras: palabrasUnicas, tieneSiguiente: false };
  }
};

async function genBBDDTextoGastronomico(){
  const comidasAcumuladas = new Set();

  console.info("Iniciando extracción masiva de texto...");
  let paginaActual = 1;
  let continuarRaspado = true;

  while (continuarRaspado && paginaActual <= MAX_PAGINAS){
    const resultadoPagina = await rasparPaginaTextoCompleto(paginaActual);
    resultadoPagina.palabras.forEach(palabra => comidasAcumuladas.add(palabra));

    // Usamos el resultado de la extracción como indicador de continuación
    continuarRaspado = resultadoPagina.tieneSiguiente;
    paginaActual++;
  }

  const palabrasArray = Array.from(comidasAcumuladas).sort();
  const resultadosXLetra = {};

  for (const letra of LETRAS){
    resultadosXLetra[letra] = palabrasArray.filter(palabra => palabra.startsWith(letra));
  }

  console.info(`\nTotal de palabras únicas gastronómicas extraídas: ${comidasAcumuladas.size}`);

  try {
    const contenidoJson = JSON.stringify(resultadosXLetra, null, 4);
    await fs.writeFile(COMIDAS_ARCHIVO_SALIDA, contenidoJson, 'utf-8');
    console.info(`✅ Archivo ${COMIDAS_ARCHIVO_SALIDA} guardado exitosamente.`);
  } catch (err){
    console.error(`❌ Error al guardar el archivo ${COMIDAS_ARCHIVO_SALIDA}:`, err.message);
  }
}

genBBDDTextoGastronomico();
