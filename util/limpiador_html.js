import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const ARCHIVO_HTML_ENTRADA = 'tasteatlas_recetas.html';
const COMIDAS_ARCHIVO_SALIDA = 'comidas_locales_filtradas.json';
const LETRAS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

// Tu selector preciso verificado
const SELECTOR_TITULO_RECETA = 'h3.recipe-name.ng-binding.recipe-name__one-row-heading';

function normalizarPalabras(palabra) {
    if (!palabra) return '';
    return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                   .replace(/[^a-zA-Z\s]/g, '')
                   .trim().toUpperCase();
}

async function procesarHTMLLocal() {
    console.info(`1. Leyendo archivo HTML local: ${ARCHIVO_HTML_ENTRADA}`);
    let contenidoHtml;

    try {
        // Lee el contenido completo del archivo
        contenidoHtml = await fs.readFile(path.resolve(ARCHIVO_HTML_ENTRADA), 'utf-8');
    } catch (error) {
        console.error(`❌ Error al leer el archivo. Asegúrate de que existe y se llama ${ARCHIVO_HTML_ENTRADA}:`, error.message);
        return new Set();
    }

    // Carga el HTML en Cheerio
    const $ = cheerio.load(contenidoHtml);
    const comidasAcumuladas = new Set();
    let recetasEncontradas = 0;

    console.info(`2. Buscando recetas con el selector: "${SELECTOR_TITULO_RECETA}"`);

    // Usa tu selector para encontrar y extraer el texto
    $(SELECTOR_TITULO_RECETA).each((index, element) => {
        const nombreBruto = $(element).text();
        if (nombreBruto && nombreBruto.trim().length > 3) {
            comidasAcumuladas.add(normalizarPalabras(nombreBruto));
            recetasEncontradas++;
        }
    });

    console.info(`3. Total de platos extraídos: ${recetasEncontradas}`);

    return comidasAcumuladas;
}

async function generarBaseDeDatos() {
    const comidasAcumuladas = await procesarHTMLLocal();

    if (comidasAcumuladas.size === 0) {
        console.warn("No se extrajo ninguna comida. Vuelve a verificar que copiaste el HTML correctamente.");
        return;
    }

    const comidasArray = Array.from(comidasAcumuladas).sort();
    const resultadosXLetra = {};

    for (const letra of LETRAS) {
        // Inicializa la lista de esa letra
        resultadosXLetra[letra] = comidasArray.filter(comida => comida.startsWith(letra));
    }

    console.info(`\nTotal de platos únicos listos para guardar: ${comidasAcumuladas.size}`);

    try {
        const contenidoJson = JSON.stringify(resultadosXLetra, null, 4);
        await fs.writeFile(COMIDAS_ARCHIVO_SALIDA, contenidoJson, 'utf-8');
        console.info(`✅ Archivo ${COMIDAS_ARCHIVO_SALIDA} guardado exitosamente.`);
    } catch (err) {
        console.error(`❌ Error al guardar el archivo ${COMIDAS_ARCHIVO_SALIDA}:`, err.message);
    }
}

generarBaseDeDatos();
