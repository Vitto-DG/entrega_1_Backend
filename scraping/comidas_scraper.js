import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises'; // Para guardar el resultado en un archivo (opcional)

// --- Configuración Global ---
const URL_BASE = 'https://semequemalacomida.blogspot.com/p/recetas-por-orden-alfabetico.html';
const LETRAS_ALFABETO = 'abcdefghijklmnñopqrstuvwxyz'.split('');
const FILE_OUTPUT = 'recetas_database.json';

// --- Función Principal de Scraping por Letra ---

/**
 * Scrapea todas las recetas de una letra específica.
 * @param {string} letra - La letra inicial de la categoría (ej. 's').
 * @returns {Promise<Array<{nombre: string, url: string}>>} - Lista de recetas encontradas.
 */
async function scrapearComidasXLetra(letra) {
    const letraMayuscula = letra.toUpperCase();
    console.log(`\n🔎 Scrapeando recetas para la letra: ${letraMayuscula}`);

    try {
        // 1. Petición a la URL base (CORRECTA)
        const response = await axios.get(URL_BASE, {
            // Se recomienda usar un User-Agent para simular un navegador real
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000 // Tiempo de espera de 5 segundos
        });

        const $ = cheerio.load(response.data);
        const nombresRecetas = [];

        // 2. Localizar el elemento de la categoría: <b> que contiene la letra
        // Selector: buscamos un <b> que contenga el texto exacto de la letra (ej. 'S')
        const inicioDeCategoria = $(`a:contains(${letraMayuscula})`);

        if (inicioDeCategoria.length === 0) {
            console.log(`⚠️ Advertencia: No se encontró el inicio de la categoría (<b>) para la letra ${letraMayuscula}.`);
            return nombresRecetas;
        }

        // 3. Iterar sobre los elementos que siguen a la categoría, buscando las recetas <span><a>
        // Se buscan todos los elementos hermanos que sigan a la etiqueta <b> que contiene la letra.
        let listadoRecetas = inicioDeCategoria.nextAll();

        // La lista termina cuando se encuentra el <b> de la siguiente letra (o el final del DOM).
        for (let i = 0; i < listadoRecetas.length; i++) {
            const elementoActual = listadoRecetas.eq(i);

            // Si encontramos la siguiente letra, paramos el bucle.
            if (elementoActual.is('b')) {
                break;
            }

            // Si el elemento es un <span> y contiene un <a>, es una receta.
            const esReceta = elementoActual.is('span') && elementoActual.find('a').length > 0;

            if (esReceta) {
                const enlace = elementoActual.find('a');
                const nombre = enlace.text().trim();
                const url = enlace.attr('href');

                // Filtro simple para asegurar datos válidos
                if (nombre && url) {
                    nombresRecetas.push({ nombre, url });
                }
            }
        }

        console.log(`✅ Éxito: Encontradas ${nombresRecetas.length} recetas para la letra ${letraMayuscula}.`);
        return nombresRecetas;

    } catch (error) {
        // Manejo de errores de red o HTTP (ej. 404, timeouts)
        const status = error.response ? error.response.status : 'N/A';
        console.error(`❌ Error al scrapear la letra ${letraMayuscula}. Estado: ${status}. Mensaje: ${error.message}`);
        return [];
    }
}

// --- Función para Generar la Base de Datos Completa ---

async function genBBDDComidas() {
    console.log('--- Iniciando proceso de Scraping ---');

    // Generar un array de promesas para scrapear todas las letras en paralelo
    const promesas = LETRAS_ALFABETO.map(letra => scrapearComidasXLetra(letra));

    // Esperar a que todas las promesas se resuelvan
    const resultadosPorLetra = await Promise.all(promesas);

    // Unir todos los resultados en un único array de recetas
    const todasLasRecetas = resultadosPorLetra.flat();

    const soloNombres = todasLasRecetas.map(receta => receta.nombre);
    // Crear la estructura de datos final (opcionalmente puedes agrupar por letra)
    const baseDeDatosFinal = {
        soloNombres
    };

    // Guardar el resultado en un archivo JSON
    try {
        await fs.writeFile(FILE_OUTPUT, JSON.stringify(baseDeDatosFinal, null, 2));
        console.log(`\n🎉 Scraping finalizado con éxito.`);
        console.log(`Base de datos guardada en ${FILE_OUTPUT}`);
        console.log(`Total de recetas encontradas: ${baseDeDatosFinal.totalRecetas}`);
    } catch (err) {
        console.error('Error al guardar el archivo JSON:', err);
    }

    return baseDeDatosFinal;
}

// --- Ejecución del Script ---
genBBDDComidas();
